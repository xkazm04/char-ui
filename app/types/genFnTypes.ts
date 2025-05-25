import { AssetType } from "./asset";

export interface LeonardoImage {
    url: string;
    id: string;
    nsfw: boolean;
    motionMP4URL?: string;
}

export interface LeonardoResponse {
    status: string;
    data: LeonardoImage[];
    gen: string;
}

export interface GenerationResponse {
    status: string;
    asset: {
        _id: string;
        id?: string;
        character_id?: string;
        image_url: string;
        description?: string | null;
        used_assets?: any;
        meshy?: any;
        created_at: string;
        status: string;
        message: string;
    };
    generation_id: string;
    data?: LeonardoImage[];
}

export interface AssetSaveResponse {
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
    data?: LeonardoImage[];
    gen?: string;
}

type BaseGenProps = {
    prompt: string;
    generationId?: string | null;
    setGenerationId: (id: string) => void;
    setGenError: (error: boolean) => void;
    setIsGenerating: (generating: boolean) => void;
    setGeneratedImage: (imageUrl: string | null) => void;
}

export type PropsAssetGen = BaseGenProps & {
    asset: AssetType;
}

export type AssetSaveProps = PropsAssetGen & {
    setSavedAssetId?: (id: string) => void;
}

export type PropsCharGen = BaseGenProps & {
    element?: number;
    character_id?: string;
    onSuccess?: () => void;
}