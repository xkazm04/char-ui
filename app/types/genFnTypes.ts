import { AssetBatchResponse } from "../functions/assetFns";
import { AssetType } from "./asset";
import { UsedAssets } from "./gen";

export interface LeonardoImage {
    url: string;
    id: string;
    nsfw: boolean;
    motionMP4URL?: string;
}

export interface LeonardoResponse {
    status: string;
    data: Array<{ url: string; id: string }>;
    gen?: string;
}

export interface GenerationResponse {
    status: string;
    asset: {
        id?: string;
        _id?: string;
        image_url?: string;
    };
    generation_id: string;
}

export interface AssetSaveResponse {
    status: string;
    data?: Array<{ url: string; id: string }>;
    asset?: {
        id?: string;
        _id?: string;
        image_url?: string;
    };
    generation_id?: string;
    gen?: string;
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