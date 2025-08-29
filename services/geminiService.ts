
import { GoogleGenAI, Type } from "@google/genai";
import { MenuItem } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateMenu = async (): Promise<MenuItem[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "สร้างรายการอาหารไทยยอดนิยมและสร้างสรรค์ 10 รายการสำหรับเมนูร้านอาหารสมัยใหม่ ประกอบด้วยชื่อ คำอธิบายสั้นๆ ที่น่าดึงดูด (สูงสุด 20 คำ) และราคาที่สมจริงเป็นบาทไทย",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: {
                type: Type.STRING,
                description: "ชื่ออาหารไทย"
              },
              description: {
                type: Type.STRING,
                description: "คำอธิบายสั้นๆ ที่น่าดึงดูดของอาหาร"
              },
              price: {
                type: Type.NUMBER,
                description: "ราคาอาหารเป็นบาทไทย"
              }
            },
            required: ["name", "description", "price"]
          }
        }
      }
    });

    const jsonString = response.text.trim();
    const menuData = JSON.parse(jsonString);
    
    if (!Array.isArray(menuData)) {
        throw new Error("API ไม่ได้ส่งคืนข้อมูลเมนูที่ถูกต้อง");
    }

    return menuData as MenuItem[];
  } catch (error) {
    console.error("Error generating menu with Gemini API:", error);
    // Return a fallback menu in case of an API error
    return [
      { name: 'ผัดไทย', description: 'ก๋วยเตี๋ยวผัดคลาสสิกใส่กุ้ง เต้าหู้ และถั่ว', price: 120 },
      { name: 'แกงเขียวหวาน', description: 'แกงรสเผ็ดหอมใส่ไก่ หน่อไม้ และโหระพา', price: 150 },
      { name: 'ต้มยำกุ้ง', description: 'ซุปรสจัดจ้านใส่กุ้ง เห็ด ตะไคร้ และมะนาว', price: 180 },
      { name: 'แกงมัสมั่น', description: 'แกงรสเข้มข้นกลมกล่อมใส่เนื้อวัว มันฝรั่ง และถั่ว', price: 160 },
      { name: 'ข้าวเหนียวมะม่วง', description: 'ข้าวเหนียวมูนหวานทานคู่กับมะม่วงสุกและกะทิ', price: 90 },
    ];
  }
};