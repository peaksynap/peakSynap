import { hf } from "./ia";

export const translateIA = async (text: string, from: string, to: string) => {
  const transcription = await hf.translation({
    model: `Helsinki-NLP/opus-mt-${from}-${to}`,
    inputs: text,
    parameters: {
      max_length: 500,
    },
  });

  return transcription.translation_text;
};
