export const getCloudinaryConfig = () => {
  const cloudEnv = (import.meta as any).env || {};
  const cloudName = cloudEnv.VITE_CLOUDINARY_CLOUD_NAME || "";
  const uploadPreset = cloudEnv.VITE_CLOUDINARY_UPLOAD_PRESET || "";
  return { 
    cloudName, 
    uploadPreset, 
    isConfigured: !!(cloudName && uploadPreset) 
  };
};

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const { cloudName, uploadPreset, isConfigured } = getCloudinaryConfig();
  
  if (!isConfigured) {
    throw new Error("Cloudinary non configuré. Veuillez définir VITE_CLOUDINARY_CLOUD_NAME et VITE_CLOUDINARY_UPLOAD_PRESET.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errText = await response.text();
    let errMsg = "Erreur d'envoi vers Cloudinary.";
    try {
      const parsed = JSON.parse(errText);
      if (parsed.error && parsed.error.message) {
        errMsg = parsed.error.message;
      }
    } catch (e) {
      // Ignore
    }
    throw new Error(errMsg);
  }

  const data = await response.json();
  if (!data.secure_url) {
    throw new Error("L'envoi a réussi mais aucune URL sécurisée n'a été retournée.");
  }
  return data.secure_url;
};
