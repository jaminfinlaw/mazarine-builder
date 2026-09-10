export type ArtworkPreparation = {
  original: string;
  cleaned: string | null;
  requiresBackgroundRemoval: boolean;
};

export async function prepareArtwork(file: File): Promise<ArtworkPreparation> {
  const original = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  // This is the isolated hand-off point for a background-removal API or vector cleanup engine.
  return { original, cleaned: null, requiresBackgroundRemoval: true };
}
