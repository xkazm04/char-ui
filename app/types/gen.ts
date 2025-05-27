export type UsedAssets = {
    _id: string;
    type: string;
    subcategory: string;
    name: string;
    url: string;
    description: string;
    image_data: string;
}

export interface GenType {
    _id: string;
    leo_id: string;
    character_id: string;
    image_url: string;
    description: string;
    used_assets?: UsedAssets[];
    created_at: string;
    meshy?: Meshy;
    is_3d_generating?: boolean;
    has_3d_model?: boolean;
} 

type Meshy = {
    meshy_id: string;
    glb_url?: string;
    fbx_url?: string;
    obj_url?: string;
    usdz_url?: string;
    thumbnail_url?: string;
    status?: string;
    task_error?: string;
    created_at?: string;
    progress?: number;
}