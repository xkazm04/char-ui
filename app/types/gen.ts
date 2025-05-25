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
} 
