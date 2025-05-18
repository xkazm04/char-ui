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
        id: string;
        _id: string;
        name: string;
        type: string;
    };
    generation_id: string;
}

type Props = {
    prompt: string;
    type: string;
    element?: number;
    generationId: string | null;
    setGenerationId: (id: string) => void;
    setGenError: (error: boolean) => void;
    setIsGenerating: (generating: boolean) => void;
    setGeneratedImage: (imageUrl: string | null) => void;
}

type AssetSaveProps = Props & {
    asset: AssetType; 
    setSavedAssetId?: (id: string) => void; // Optional callback to store the saved asset ID
}

// Original function for just generating images
export const handleAssetGeneration = async ({ prompt, type, element, generationId, setGenerationId, setGenError, setIsGenerating, setGeneratedImage }: Props) => {
    setGenError(false);
    setIsGenerating(true);

    try {
        const requestAssetBody = {
            gen: prompt || "wooden sword",
            generation_id: generationId
        };

        const requestBody = type === "asset" ? requestAssetBody : {
            gen: prompt,
            generation_id: generationId,
            type: type,
            element: element || 67297
        };
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        const response = await fetch(`${serverUrl}/leo/asset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Failed to generate image: ${response.status}`);
        }

        const data: LeonardoResponse = await response.json();

        if (data.status === "success" && data.data && data.data.length > 0) {
            setGenerationId(data.gen);
            setGeneratedImage(data.data[0].url);
        } else {
            throw new Error("No images returned from generation API");
        }
    } catch (error) {
        console.error(`Error generating asset`, error);
        setGenError(true);
    } finally {
        setIsGenerating(false);
    }
};

// New function for generating and saving asset images
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
    setGenError(false);
    setIsGenerating(true);

    try {
        // Validation check - make sure asset object exists
        if (!asset || typeof asset !== 'object') {
            throw new Error("Missing or invalid asset object");
        }
        
        // Make sure asset has required fields
        if (!asset.type || !asset.name || !asset.gen) {
            throw new Error("Asset is missing required fields (type, name, or gen)");
        }
        
        // Make sure asset is included in the request body
        const requestBody = {
            gen: prompt || "wooden sword",
            generation_id: generationId,
            asset: asset  // This must be present
        };

        console.log("Sending request to save asset:", JSON.stringify(requestBody));

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); 
        
        // Use the correct endpoint URL - notice "asset-save" instead of "asset"
        const response = await fetch(`${serverUrl}/leo/asset-save`, {
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
            throw new Error(`Failed to generate and save image: ${response.status} - ${errorText}`);
        }

        const data: AssetSaveResponse = await response.json();
        console.log("Asset save response:", data);

        if (data.status === "success" && data.asset && data.asset.id) {
            setGenerationId(data.generation_id);
            
            // Use the correct endpoint for image URL
            const imageUrl = `${serverUrl}/asset/image/${data.asset.id}`;
            console.log("Setting generated image URL:", imageUrl);
            setGeneratedImage(imageUrl);

            if (setSavedAssetId) {
                setSavedAssetId(data.asset.id);
            }
        } else {
            throw new Error("Failed to save asset or get image URL");
        }
    } catch (error) {
        console.error(`Error generating and saving asset`, error);
        setGenError(true);
    } finally {
        setIsGenerating(false);
    }
};