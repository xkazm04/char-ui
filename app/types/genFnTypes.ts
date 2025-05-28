import { AssetType } from "./asset";

export interface LeonardoImage {
    url: string;
    id: string;
    nsfw: boolean;
    motionMP4URL?: string;
}

// Update AssetSaveResponse to be the primary interface
export interface AssetSaveResponse {
    status: "success" | "error";
    preview_url?: string;  // Primary field for new flow
    generation_id?: string;
    message?: string;
    // Legacy fields for backward compatibility
    data?: Array<{
        url: string;
        id: string;
        nsfw: boolean;
        motionMP4URL?: string;
    }>;
    asset?: {
        id?: string;
        _id?: string;
        image_url?: string;
    };
    gen?: string;
}

// Legacy interfaces for backward compatibility
export interface LeonardoResponse {
    status: "success" | "error";
    data: Array<{
        url: string;
        id: string;
        nsfw: boolean;
        motionMP4URL?: string;
    }>;
    gen?: string;
}

export interface GenerationResponse {
    status: "success" | "error";
    asset: {
        id?: string;
        _id?: string;
        image_url?: string;
    };
    generation_id: string;
}

export interface AssetPreviewResponse {
    status: "success" | "error";
    preview_url?: string;
    generation_id?: string;
    message?: string;
}

export interface PropsAssetGen {
    asset: AssetType;
    prompt: string;
    generationId: string | null;
    setGenerationId: (id: string) => void;
    setGenError: (error: boolean) => void;
    setIsGenerating: (generating: boolean) => void;
    setGeneratedImage: (url: string) => void;
}

export interface PropsCharGen {
    prompt: string;
    element?: number;
    character_id?: string;
    used_assets?: AssetType[];
    weight?: number;
    preset?: string;
    generationId: string | null;
    setGenerationId: (id: string) => void;
    setIsGenerating: (generating: boolean) => void;
    setGenError: (error: boolean) => void;
    onSuccess?: () => void;
}

export interface AssetSaveProps {
    prompt: string;
    generationId: string | null;
    setGenerationId: (id: string) => void;
    setGenError: (error: boolean) => void;
    setIsGenerating: (generating: boolean) => void;
    setGeneratedImage: (url: string) => void;
    asset: AssetType;
    setSavedAssetId?: (id: string) => void;
}