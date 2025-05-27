import { serverUrl } from '../constants/urls';
import { GenType } from '../types/gen';

export const getBestModelUrl = (gen: GenType): string | null => {
  if (!gen.meshy?.meshy_id) return null;
  
  const taskId = gen.meshy.meshy_id;
  
  // Check for GLB first (best format)
  if (gen.meshy.glb_url) {
    return `${serverUrl}/meshy/proxy/${taskId}/glb`;
  }
  
  // Then FBX
  if (gen.meshy.fbx_url) {
    return `${serverUrl}/meshy/proxy/${taskId}/fbx`;
  }
  
  // Then OBJ
  if (gen.meshy.obj_url) {
    return `${serverUrl}/meshy/proxy/${taskId}/obj`;
  }
  
  // Then USDZ
  if (gen.meshy.usdz_url) {
    return `${serverUrl}/meshy/proxy/${taskId}/usdz`;
  }
  
  return null;
};

// Helper function to get proxied thumbnail
export const getProxiedThumbnail = (gen: GenType): string | null => {
  if (!gen.meshy?.meshy_id || !gen.meshy?.thumbnail_url) return null;
  return `${serverUrl}/meshy/proxy/${gen.meshy.meshy_id}/thumbnail`;
};
