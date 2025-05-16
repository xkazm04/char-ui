import { serverUrl } from "../constants/urls";

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