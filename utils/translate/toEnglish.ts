import { translateIA } from "@/ia/translateIA"

export const toEnglish = async(text: string) => {
 return await translateIA(text, 'es','en');
}
