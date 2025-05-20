import { serverUrl } from "../constants/urls";
import { AssetType } from "../types/asset";
interface LeonardoImage {
    url: string;
    id: string;
    nsfw: boolean;
    motionMP4URL?: string;
}

interface LeonardoResponse {
    status: string;
    data: LeonardoImage[];
    gen: string;
}

interface AssetSaveResponse {
    status: string;
    asset: {
        _id: string;
        id?: string; 
        name: string;
        type: string;
        subcategory?: string;
        gen: string;
        description?: string;
        image_url?: string;
        image_embedding?: any[];
        metadata?: Record<string, any> | null;
        created_at: string;
        image_data_size?: number;
        status?: string;
        message?: string;
    };
    generation_id: string;
}

type BaseGenProps = {
    prompt: string;
    generationId?: string | null;
    setGenerationId: (id: string) => void;
    setGenError: (error: boolean) => void;
    setIsGenerating: (generating: boolean) => void;
    setGeneratedImage: (imageUrl: string | null) => void;
}

type PropsAssetGen = BaseGenProps & {
    asset: AssetType;
}

type AssetSaveProps = PropsAssetGen & {
    setSavedAssetId?: (id: string) => void;
}

// Base function for all API calls
async function makeApiRequest<T>({
    endpoint,
    requestBody,
    timeout = 30000,
    errorMessage = "API request failed"
}: {
    endpoint: string,
    requestBody: any,
    timeout?: number,
    errorMessage?: string
}): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(`${serverUrl}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API Error:", errorText);
            throw new Error(`${errorMessage}: ${response.status} - ${errorText}`);
        }

        return await response.json() as T;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

// Common function that handles state management and error handling
async function executeWithStateManagement<T>({
    apiCall,
    setGenError,
    setIsGenerating,
    successHandler
}: {
    apiCall: () => Promise<T>,
    setGenError: (error: boolean) => void,
    setIsGenerating: (generating: boolean) => void,
    successHandler: (data: T) => void
}) {
    setGenError(false);
    setIsGenerating(true);

    try {
        const data = await apiCall();
        successHandler(data);
    } catch (error) {
        console.error(`Error in API call`, error);
        setGenError(true);
    } finally {
        setIsGenerating(false);
    }
}

export const handleAssetGeneration = async ({ 
    asset, 
    prompt, 
    generationId, 
    setGenerationId, 
    setGenError, 
    setIsGenerating, 
    setGeneratedImage 
}: PropsAssetGen) => {
    await executeWithStateManagement({
        apiCall: async () => {
            const requestBody = {
                gen: prompt || "wooden sword",
                generation_id: generationId,
                asset: asset
            };
            
            return await makeApiRequest<LeonardoResponse>({
                endpoint: "/leo/asset",
                requestBody,
                errorMessage: "Failed to generate image"
            });
        },
        setGenError,
        setIsGenerating,
        successHandler: (data: any) => {
            console.log("Asset generation response:", data);
            if (data.status === "success" && data.data && data.data.length > 0) {
                setGenerationId(data.gen);
                setGeneratedImage(data.data[0].url);
                return;
            }
            
            if (data.status === "success" && data.asset && data.generation_id) {
                setGenerationId(data.generation_id);
                
                if (data.asset.image_url) {
                    setGeneratedImage(data.asset.image_url);
                    return;
                }
                
                const assetId = data.asset.id || data.asset._id;
                if (assetId) {
                    const imageUrl = `${serverUrl}/assets/image/${assetId}`;
                    setGeneratedImage(imageUrl);
                    return;
                }
            }
            throw new Error("Unrecognized response format from image generation API");
        }
    });
};

type PropsCharGen = BaseGenProps & {
    element?: number;
    generationId?: string | null;
}

export const handleCharacterSketch = async ({ 
    prompt, 
    element, 
    setGeneratedImage, 
    generationId,
    setGenerationId, 
    setIsGenerating, 
    setGenError 
}: PropsCharGen) => {
    await executeWithStateManagement({
        apiCall: async () => {
            const requestBody = {
                gen: prompt,
                element: element || 67297,
                generation_id: generationId,
            };
            
            return await makeApiRequest<LeonardoResponse>({
                endpoint: "/leo/generation",
                requestBody,
                errorMessage: "Failed to generate image"
            });
        },
        setGenError,
        setIsGenerating,
        successHandler: (data: LeonardoResponse) => {
            if (data.status === "success" && data.data && data.data.length > 0) {
                setGenerationId(data.gen);
                setGeneratedImage(data.data[0].url);
            } else {
                throw new Error("No images returned from generation API");
            }
        }
    });
};

export const handleAssetGenerationAndSave = async ({
    prompt,
    generationId,
    setGenerationId,
    setGenError,
    setIsGenerating,
    setGeneratedImage,
    asset,
    setSavedAssetId
}: AssetSaveProps) => {
    await executeWithStateManagement({
        apiCall: async () => {
            // Validation check - make sure asset object exists
            if (!asset || typeof asset !== 'object') {
                throw new Error("Missing or invalid asset object");
            }

            if (!asset.type || !asset.name || !asset.gen) {
                throw new Error("Asset is missing required fields (type, name, or gen)");
            }

            const requestBody = {
                gen: prompt || "wooden sword",
                generation_id: generationId,
                asset: asset,
                name: asset.name || "Unnamed Asset",
                type: asset.type || "Uncategorized",
            };

            console.log("Sending request to save asset:", JSON.stringify(requestBody));
            
            return await makeApiRequest<AssetSaveResponse>({
                endpoint: "/leo/asset",
                requestBody,
                timeout: 60000,
                errorMessage: "Failed to generate and save image"
            });
        },
        setGenError,
        setIsGenerating,
        successHandler: (data: any) => {  // Use 'any' temporarily to inspect structure
            console.log("Asset save response:", JSON.stringify(data, null, 2));
            
            if (data.status === "success") {
                // If response has Leonardo-style 'data' array
                if (data.data && data.data.length > 0) {
                    if (data.gen) setGenerationId(data.gen);
                    else if (data.generation_id) setGenerationId(data.generation_id);
                    
                    setGeneratedImage(data.data[0].url);
                    return;
                }
                
                // If response has asset object with image URL
                if (data.asset) {
                    // Set generation ID if available
                    if (data.generation_id) {
                        setGenerationId(data.generation_id);
                    }
                    
                    const assetId = data.asset.id || data.asset._id;
                    
                    if (assetId) {
                        // First try to use direct image_url if available
                        if (data.asset.image_url) {
                            console.log("Using asset.image_url:", data.asset.image_url);
                            setGeneratedImage(data.asset.image_url);
                        } else {
                            // Fallback to constructing URL from asset ID
                            const imageUrl = `${serverUrl}/assets/image/${assetId}`;
                            console.log("Constructed imageUrl:", imageUrl);
                            setGeneratedImage(imageUrl);
                        }
                        
                        // Set saved asset ID if callback provided
                        if (setSavedAssetId) {
                            setSavedAssetId(assetId);
                        }
                        return;
                    }
                }
            }
            
            // If neither condition was met, we don't have a valid response
            console.error("Unrecognized response structure:", data);
            throw new Error("Failed to save asset or get image URL");
        }
    });
};