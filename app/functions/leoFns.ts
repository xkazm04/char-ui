import { serverUrl } from "../constants/urls";
import { PropsAssetGen, PropsCharGen, AssetSaveProps 
, GenerationResponse, AssetSaveResponse, LeonardoResponse
} from "../types/genFnTypes";
import { AssetType } from "../types/asset";

async function makeApiRequest<T>({
    endpoint,
    requestBody,
    timeout = 50000,
    errorMessage = "API request failed"
}: {
    endpoint: string;
    requestBody: Record<string, unknown>;
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
            
            return await makeApiRequest<AssetSaveResponse>({
                endpoint: "/leo/asset",
                requestBody,
                errorMessage: "Failed to generate image"
            });
        },
        setGenError,
        setIsGenerating,
        successHandler: (data: AssetSaveResponse) => {
            console.log("Asset generation response:", data);
            
            // Handle new preview_url format (matches handleAssetGenerationAndSave)
            if (data.status === "success" && data.preview_url) {
                console.log("Using preview URL immediately:", data.preview_url);
                setGeneratedImage(data.preview_url);
                
                if (data.generation_id) {
                    setGenerationId(data.generation_id);
                }
                return;
            }
            
            // Fallback for backward compatibility
            if (data.status === "success" && data.data && data.data.length > 0) {
                const generationId = data.gen;
                if (generationId) {
                    setGenerationId(generationId);
                }
                setGeneratedImage(data.data[0].url);
                return;
            }
            
            if (data.status === "success" && data.asset) {
                if (data.generation_id) {
                    setGenerationId(data.generation_id);
                }
                
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
            
            console.error("No preview_url in response:", data);
            throw new Error("Failed to get preview URL from server");
        }
    });
};

export const handleCharacterSketch = async ({ 
    prompt, 
    element, 
    character_id,
    weight,
    preset,
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
                weight: weight || 0.9,
                preset: preset || "",
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
            }   else {
                console.error("Invalid prompt", data);
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
}: AssetSaveProps): Promise<void> => {
    setGenError(false);
    setIsGenerating(true);

    try {
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

        console.log("Sending request to save asset with preview:", JSON.stringify(requestBody));
        
        const response = await fetch(`${serverUrl}/leo/asset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json() as AssetSaveResponse;
        console.log("Asset save response:", JSON.stringify(data, null, 2));
        
        // NEW: Only handle preview_url response (no more fallback logic)
        if (data.status === "success" && data.preview_url) {
            console.log("Using preview URL immediately:", data.preview_url);
            setGeneratedImage(data.preview_url);
            
            if (data.generation_id) {
                setGenerationId(data.generation_id);
            }
            
            setIsGenerating(false);
            return;
        }
        
        // If no preview_url, something went wrong
        console.error("No preview_url in response:", data);
        throw new Error("Failed to get preview URL from server");
        
    } catch (error) {
        console.error(`Error in asset generation and save`, error);
        setGenError(true);
        setIsGenerating(false);
        throw error;
    }
};

// Add new function for preview-only generation (no saving)
export const handleAssetGenerationPreview = async ({ 
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
            
            // Use preview endpoint for faster response
            return await makeApiRequest<LeonardoResponse | GenerationResponse>({
                endpoint: "/leo/asset-preview",
                requestBody,
                errorMessage: "Failed to generate preview"
            });
        },
        setGenError,
        setIsGenerating,
        successHandler: (data: LeonardoResponse | GenerationResponse) => {
            console.log("Asset preview response:", data);
            
            if (data.status === "success" && 'preview_url' in data) {
                const previewData = data as any;
                setGeneratedImage(previewData.preview_url);
                if (previewData.generation_id) {
                    setGenerationId(previewData.generation_id);
                }
                return;
            }
            
            // Fallback to existing logic
            if (data.status === "success" && 'data' in data && data.data && data.data.length > 0) {
                const leonardoData = data as LeonardoResponse;
                const generationId = leonardoData.gen;
                if (generationId) {
                    setGenerationId(generationId);
                }
                setGeneratedImage(data.data[0].url);
                return;
            }
            
            throw new Error("Failed to generate preview");
        }
    });
};