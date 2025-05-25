export interface ImageStyle {
  id: string;
  name: string;
  prompt: string;
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
    id: 'unreal5',
    name: 'Unreal Engine 5',
    prompt: ', rendered in Unreal Engine 5, ultra-realistic lighting, high-quality 3D rendering, cinematic quality, ray tracing',
    description: 'Photorealistic 3D rendering',
    icon: '🎮'
  },
  {
    id: 'photorealistic',
    name: 'Photorealistic',
    prompt: ', photorealistic, professional photography, studio lighting, high resolution, DSLR quality, detailed textures',
    description: 'Like a real photograph',
    icon: '📷'
  },
  {
    id: 'anime',
    name: 'Anime',
    prompt: ', anime style, manga illustration, cel-shaded, vibrant colors, clean lineart, Japanese animation style',
    description: 'Japanese anime aesthetic',
    icon: '🌸'
  },
  {
    id: 'cartoon',
    name: 'Cartoon',
    prompt: ', cartoon style, animated, colorful, exaggerated features, Disney-like animation, friendly and approachable',
    description: 'Animated cartoon look',
    icon: '🎪'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    prompt: ', cyberpunk style, neon lighting, futuristic, dark atmosphere, chrome details, sci-fi aesthetic, blade runner inspired',
    description: 'Futuristic cyberpunk vibe',
    icon: '🤖'
  },
  {
    id: 'fantasy',
    name: 'Fantasy Art',
    prompt: ', fantasy art style, magical atmosphere, ethereal lighting, mystical elements, detailed fantasy illustration',
    description: 'Magical fantasy artwork',
    icon: '🧙'
  },
  {
    id: 'oil_painting',
    name: 'Oil Painting',
    prompt: ', oil painting style, classical art, painterly brushstrokes, rich textures, museum quality, renaissance inspired',
    description: 'Traditional oil painting',
    icon: '🖼️'
  },
  {
    id: 'watercolor',
    name: 'Watercolor',
    prompt: ', watercolor painting, soft edges, flowing colors, artistic brushstrokes, delicate and dreamy',
    description: 'Soft watercolor art',
    icon: '🎭'
  },
  {
    id: 'pixel_art',
    name: 'Pixel Art',
    prompt: ', pixel art style, 16-bit graphics, retro gaming aesthetic, sharp pixels, nostalgic video game look',
    description: 'Retro pixel graphics',
    icon: '👾'
  }
];