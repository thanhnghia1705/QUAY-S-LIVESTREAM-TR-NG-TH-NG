
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateWinnerCongratulation = async (pharmacyName: string, prizeName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Tạo một lời chúc mừng ngắn gọn, chuyên nghiệp và hào hứng dành cho nhà thuốc "${pharmacyName}" vừa trúng giải "${prizeName}". Hãy dùng ngôn ngữ trang trọng nhưng ấm áp trong tiếng Việt. Tối đa 2 câu.`,
    });
    return response.text || "Chúc mừng nhà thuốc đã may mắn trúng giải!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Chúc mừng quý nhà thuốc đã là người may mắn trong đợt quay số này!";
  }
};
