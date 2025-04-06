import { translateIA } from "@/ia/translateIA"

export const toSpanish = async(text: string) => {
 return await translateIA(text, 'en','es');
}
