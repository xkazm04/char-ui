import { serverUrl } from "../constants/urls";
import { PropsAssetGen, PropsCharGen, AssetSaveProps 
, GenerationResponse, AssetSaveResponse, LeonardoResponse
} from "../types/genFnTypes";
import { AssetType } from "../types/asset";

// Base function for all API calls
async function makeApiRequest<T>({
    endpoint,
    requestBody,
    timeout = 30000,
    errorMessage = "API request failed"
}: {
    endpoint: string;
    requestBody: any;
    timeout?: number;
    errorMessage?: string;
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
    apiCall: () => Promise<T>;
    setGenError: (error: boolean) => void;
    setIsGenerating: (generating: boolean) => void;
    successHandler: (data: T) => void;
}): Promise<void> {
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

// Helper function to transform frontend assets to backend format
function transformAssetsForBackend(assets: AssetType[]) {
    return assets.map(asset => ({
        id: asset._id,
        name: asset.name,
        type: asset.type.toLowerCase(), // Convert to lowercase for consistency
        subcategory: asset.subcategory || asset.type.toLowerCase(),
        description: asset.description || "",
        image_data: asset.image_data_base64 || ""
    }));
}

export const handleAssetGeneration = async ({ 
    asset, 
    prompt, 
    generationId, 
    setGenerationId, 
    setGenError, 
    setIsGenerating, 
    setGeneratedImage 
}: PropsAssetGen): Promise<void> => {
    await executeWithStateManagement({
        apiCall: async () => {
            const requestBody = {
                gen: prompt || "wooden sword",
                generation_id: generationId,
                asset: asset
            };
            
            return await makeApiRequest<LeonardoResponse | GenerationResponse>({
                endpoint: "/leo/asset",
                requestBody,
                errorMessage: "Failed to generate image"
            });
        },
        setGenError,
        setIsGenerating,
        successHandler: (data: LeonardoResponse | GenerationResponse) => {
            console.log("Asset generation response:", data);
            if (data.status === "success" && 'data' in data && data.data && data.data.length > 0) {
                setGenerationId('gen' in data ? data.gen : (data as GenerationResponse).generation_id);
                setGeneratedImage(data.data[0].url);
                return;
            }
            
            if (data.status === "success" && 'asset' in data && data.asset && 'generation_id' in data) {
                const genResponse = data as GenerationResponse;
                setGenerationId(genResponse.generation_id);
                
                if (genResponse.asset.image_url) {
                    setGeneratedImage(genResponse.asset.image_url);
                    return;
                }
                
                const assetId = genResponse.asset.id || genResponse.asset._id;
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

export const handleCharacterSketch = async ({ 
    prompt, 
    element, 
    character_id,
    used_assets = [],
    generationId,
    setGenerationId, 
    setIsGenerating, 
    setGenError,
    onSuccess
}: PropsCharGen): Promise<void> => {
    await executeWithStateManagement({
        apiCall: async () => {
            const requestBody = {
                gen: prompt,
                element: element || 67297,
                generation_id: generationId,
                character_id: character_id || null,
                used_assets: transformAssetsForBackend(used_assets)
            };
            
            console.log("Sending character generation request with assets:", requestBody.used_assets);
            
            return await makeApiRequest<GenerationResponse>({
                endpoint: "/leo/generation",
                requestBody,
                errorMessage: "Failed to generate character sketch"
            });
        },
        setGenError,
        setIsGenerating,
        successHandler: (data: GenerationResponse) => {
            console.log("Character generation response:", data);
            
            if (data.status === "success") {
                if (onSuccess) {
                    onSuccess();
                }
                if (data.generation_id) {
                    setGenerationId(data.generation_id);
                }

            }
            
            throw new Error("No valid image URL returned from generation API");
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
}: AssetSaveProps): Promise<void> => {
    await executeWithStateManagement({
        apiCall: async () => {
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
        successHandler: (data: AssetSaveResponse) => {
            console.log("Asset save response:", JSON.stringify(data, null, 2));
            
            if (data.status === "success") {
                if (data.data && data.data.length > 0) {
                    if (data.gen) setGenerationId(data.gen);
                    else if (data.generation_id) setGenerationId(data.generation_id);
                    
                    setGeneratedImage(data.data[0].url);
                    return;
                }
                
                if (data.asset) {
                    if (data.generation_id) {
                        setGenerationId(data.generation_id);
                    }
                    
                    const assetId = data.asset.id || data.asset._id;
                    
                    if (assetId) {
                        if (data.asset.image_url) {
                            console.log("Using asset.image_url:", data.asset.image_url);
                            setGeneratedImage(data.asset.image_url);
                        } else {
                            const imageUrl = `${serverUrl}/assets/image/${assetId}`;
                            console.log("Constructed imageUrl:", imageUrl);
                            setGeneratedImage(imageUrl);
                        }
                        
                        if (setSavedAssetId) {
                            setSavedAssetId(assetId);
                        }
                        return;
                    }
                }
            }
            
            console.error("Unrecognized response structure:", data);
            throw new Error("Failed to save asset or get image URL");
        }
    });
};