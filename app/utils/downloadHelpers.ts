export const downloadImage = async (imageUrl: string, filename?: string): Promise<void> => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename || imageUrl.split('/').pop() || 'character-sketch.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Failed to download image:', error);
    throw error;
  }
};

export const downloadMultipleImages = async (
  imageUrls: Array<{ url: string; filename?: string }>,
  onProgress?: (downloaded: number, total: number) => void
): Promise<void> => {
  const total = imageUrls.length;
  let downloaded = 0;

  for (const { url, filename } of imageUrls) {
    try {
      await downloadImage(url, filename);
      downloaded++;
      onProgress?.(downloaded, total);
      
      // Small delay to prevent overwhelming the browser
      if (downloaded < total) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error(`Failed to download image ${filename || url}:`, error);
    }
  }
};