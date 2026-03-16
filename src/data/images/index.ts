export const uploadImage = async (
  base64: string
): Promise<{ url?: string; error?: string }> => {
  const base_url = import.meta.env.VITE_IMGBB_URL;
  const key = import.meta.env.VITE_IMGBB_KEY;
  const cleanBase64 = base64.replace(/^data:image\/\w+;base64,/, "");

  try {
    const formData = new FormData();
    formData.append("image", cleanBase64);
    formData.append("key", key);

    const response = await fetch(base_url, {
      method: "POST",
      body: formData
    });

    // Errore HTTP (es. 400, 500)
    if (!response.ok) {
      return { error: `HTTP error: ${response.status}` };
    }

    const data = await response.json();

    // Errore API ImgBB (success: false)
    if (!data.success) {
      return { error: data.error?.message || "Errore sconosciuto da ImgBB" };
    }

    // Successo
    return { url: data.data.url };

  } catch (err) {
    // Errore di rete o eccezione JS
    return {
      error: err instanceof Error ? err.message : String(err)
    };
  }
};