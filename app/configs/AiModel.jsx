// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

// import {
//   GoogleGenAI,
// } from '@google/genai';

// async function main() {
//   const ai = new GoogleGenAI({
//     apiKey: process.env.GEMINI_API_KEY,
//   });
//   const config = {
//     thinkingConfig: {
//       thinkingBudget: -1,
//     },
//   };
//   const model = 'gemini-2.5-flash';
//   const contents = [
//     {
//       role: 'user',
//       parts: [
//         {
//           text: `INSERT_INPUT_HERE`,
//         },
//       ],
//     },
//   ];

//   const response = await ai.models.generateContentStream({
//     model,
//     config,
//     contents,
//   });
//   let fileIndex = 0;
//   for await (const chunk of response) {
//     console.log(chunk.text);
//   }
// }

// main();


import { GoogleGenerativeAI } from "@google/generative-ai";
// const {
//     GoogleGenerativeAI,
//     HarmCategory,
//     HarmBlockThreshold,
// } = require("google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
};

export const AIDesignIdea = model.startChat({
    generationConfig,
    history: [
        {
            role: "user",
            parts: [
                { text: "Based on Logo of type Modern Mascot Logos, generate a text prompt to create Logo for Logo title/Brand name: Indian Spice with description: Indian Restaurant and referring to prompt: A vibrant logo featuring a friendly, animated character with a playful expression. The character is dressed in a classic uniform, complete with a distinctive accessory that adds personality. In one hand, they hold a signature item that represents the brand, while the other elements of the design-such as small decorative touches or natural accents-enhance the overall look. The background consists of a bold, circular design with subtle accents to highlight the character. Below, the brand name is displayed in bold, stylized lettering, with a slight curve and complementary decorative lines. The overall style is fun, welcoming, and full of character. Give me 5 suggestions of logo idea (each idea with maximum 4-5 words), Result in JSON format with ideas field." }
            ],
        },
        {
            role: "model",
            parts: [
                {
                    text: `{  "ideas": [ "Chef Elephant with Spices", "Smiling Curry Mascot", "Spice Bowl Character", "Dancing Samosa Mascot", "Chili Pepper Chef" ] }`
                }
            ],
        },
    ],
});

export const AILogoPrompt = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Generate a text prompt to create Logo for Logo Title/Brand name: Indian Restaurant, with description: Indian Restro, with Color combination of Ocean Blues and include Modern Sharp Lined Logos design idea and Referring to this Logo Prompt:Design a creative and artistic logo with a retro-modern vibe that showcases the brand's identity. Use bold outlines, intricate patterns, and vibrant, contrasting colors to make the design pop. Incorporate thematic elements like food, nature, technology, or lifestyle symbols depending on the brand's niche. The typography should be playful yet clear, complementing the overall composition with a dynamic and balanced layout. Ensure the logo feels unique, versatile, and eye-catching Give me result in JSON portal with prompt field only"
        }
      ]
    },
    {
      role: "model",
      parts: [
        {
          text: `{"prompt": "Design a modern sharp-lined logo for 'Indian Restaurant' (or 'Indian Restro') that exudes a sophisticated, retro-modern vibe. The primary color palette should be elegant Ocean Blues. Incorporate bold, clean outlines and intricate, geometric patterns that subtly hint at Indian culinary or cultural motifs (e.g., stylized spices, abstract lotus, or modern traditional patterns). The typography for the brand name should be clear, playful yet modern, and harmoniously integrated. Introduce a vibrant, contrasting accent color (e.g., saffron orange, warm golden yellow, or a deep teal) to make the design pop while maintaining the dominance of the Ocean Blues. Ensure the overall composition is dynamic, balanced, unique, versatile, and eye-catching, perfectly blending tradition with contemporary design."}`
        }
      ]
    }
  ]
});
