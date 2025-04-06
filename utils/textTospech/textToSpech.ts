import { hf } from "@/ia/ia";

export const textToSpeech = async (text: string) => {
  try {
    // Realiza la solicitud al modelo de TTS
    const response = await hf.textToSpeech({
      model: "facebook/tts-transformer-es-s", // Modelo de síntesis de voz en español
      inputs: text, // El texto que deseas convertir a voz
    });

    // Depura la respuesta
    console.log("Respuesta recibida:", response);
    console.log("Tipo de respuesta:", typeof response);

    // Verifica si la respuesta es un Blob
    if (response instanceof Blob) {
      // Crear una URL para el archivo Blob
      const audioUrl = URL.createObjectURL(response);
      return audioUrl; // Devuelve la URL del objeto de audio
    } else {
      throw new Error("La respuesta no es un archivo de audio (Blob).");
    }
  } catch (error) {
    console.error("Error en la solicitud de texto a audio:", error);
    throw new Error("Hubo un error al generar el audio.");
  }
};
