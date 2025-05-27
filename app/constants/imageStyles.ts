export interface ImageStyle {
  id: string;
  name: string;
  prompt: string;
  preset?: string; 
  description: string;
  icon: string;
}

export const IMAGE_STYLES: ImageStyle[] = [
  {
    id: 'none',
    name: 'Default',
    prompt: '',
    description: 'No specific style applied',
    icon: '🎨'
  },
  {
    id: '3d_render',
    name: '3D Render',
    preset: '3D_RENDER',
    prompt: ', rendered in Unreal Engine 5, ultra-realistic lighting, high-quality 3D rendering, cinematic quality, ray tracing',
    description: 'Photorealistic 3D rendering',
    icon: '🎮'
  },
  {
    id: 'photorealistic',
    name: 'Photography',
    preset: 'PHOTOGRAPHY',
    prompt: ', photorealistic, professional photography, studio lighting, high resolution, DSLR quality, detailed textures',
    description: 'Like a real photograph',
    icon: '📷'
  },
  {
    id: 'anime',
    name: 'Anime',
    preset: 'ANIME',
    prompt: ', anime style, manga illustration, cel-shaded, vibrant colors, clean lineart, Japanese animation style',
    description: 'Japanese anime aesthetic',
    icon: '🌸'
  },
  {
    id: 'sketch_bw',
    name: 'Sketch',
    preset: 'SKETCH_BW',
    prompt: ', black and white sketch, pencil drawing, detailed linework, shading, artistic sketch style',
    description: 'Black and white sketch style',
    icon: '✏️'
  },
];