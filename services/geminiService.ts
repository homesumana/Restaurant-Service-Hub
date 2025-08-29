
import { GoogleGenAI, Type } from "@google/genai";
import { MenuItem } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateMenu = async (): Promise<MenuItem[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a list of 10 popular and creative Thai dishes for a modern restaurant menu. Include a name, a brief, enticing description (max 20 words), and a realistic price in USD.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: {
                type: Type.STRING,
                description: "The name of the Thai dish."
              },
              description: {
                type: Type.STRING,
                description: "A short, enticing description of the dish."
              },
              price: {
                type: Type.NUMBER,
                description: "The price of the dish in USD."
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
        throw new Error("API did not return a valid array for the menu.");
    }

    return menuData as MenuItem[];
  } catch (error) {
    console.error("Error generating menu with Gemini API:", error);
    // Return a fallback menu in case of an API error
    return [
      { name: 'Pad Thai', description: 'Classic stir-fried rice noodles with shrimp, tofu, and peanuts.', price: 15.99 },
      { name: 'Green Curry', description: 'Spicy and aromatic curry with chicken, bamboo shoots, and basil.', price: 16.50 },
      { name: 'Tom Yum Soup', description: 'Hot and sour soup with shrimp, mushrooms, lemongrass, and lime.', price: 8.99 },
      { name: 'Massaman Curry', description: 'Rich, mild curry with beef, potatoes, onions, and peanuts.', price: 17.99 },
      { name: 'Mango Sticky Rice', description: 'Sweet sticky rice with fresh mango slices and coconut milk.', price: 9.50 },
    ];
  }
};
