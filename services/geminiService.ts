
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMEVAnalysis = async (userMode: string, context: any) => {
  const isInstitutional = userMode === 'INSTITUTIONAL';
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `COMMAND INPUT [USER_MODE: ${userMode}]:
      - ASSET: ${context.token}
      - PRICE: $${context.price}
      - MKT_CAP: $${context.marketCap?.toLocaleString() || '0'}
      - STRATEGY: ${context.strategy}
      - RSI: ${context.technicals?.rsi?.toFixed(2) || 'N/A'}
      - OB_IMBALANCE: ${(context.technicals?.obImbalance ? context.technicals.obImbalance * 100 : 0).toFixed(2)}%

      MISSION: 
      ${isInstitutional 
        ? "B2B INSTITUTIONAL: Focus on GFX/MTF/Wyckoff accumulation patterns. Provide LPE (Liquidity Provision Efficiency) and 24h market structure stability. Tone is cold, quantitative, and macro."
        : "RETAIL B2C: Focus on Alpha signals and ROI Moonshot potential. Provide specific profit tiers (3%, 100%, 500%) and 48h+ investment horizons. Tone is hype-aligned but professional."
      }

      OUTPUT_JSON_STRUCTURE:
      {
        "directive": "STRONG_BUY | BUY | HOLD | SELL",
        "action_title": "Operation Name",
        "confidence_score": number,
        "probability_success": number,
        "entry_price": number,
        "target_exit": number,
        "stop_loss": number,
        "lpe_rating": number,
        "roi_tier": "SCALP | RUNNER | MOONSHOT",
        "projected_gain": number,
        "retina_interpretation": "Expert analysis of the visual spectrogram patterns.",
        "retail_reasoning": "Simple, actionable directive for retail investors."
      }`,
      config: {
        systemInstruction: "You are the Lead Quantitative Architect of DeFi-Scope. You deliver monopolistic prediction market signals.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            directive: { type: Type.STRING, description: "One of: STRONG_BUY, BUY, HOLD, SELL" },
            action_title: { type: Type.STRING },
            confidence_score: { type: Type.NUMBER },
            probability_success: { type: Type.NUMBER },
            entry_price: { type: Type.NUMBER },
            target_exit: { type: Type.NUMBER },
            stop_loss: { type: Type.NUMBER },
            lpe_rating: { type: Type.NUMBER },
            roi_tier: { type: Type.STRING },
            projected_gain: { type: Type.NUMBER },
            retina_interpretation: { type: Type.STRING },
            retail_reasoning: { type: Type.STRING }
          },
          required: ["directive", "action_title", "confidence_score", "probability_success", "entry_price", "target_exit", "stop_loss", "retina_interpretation", "retail_reasoning"],
          propertyOrdering: ["directive", "action_title", "confidence_score", "probability_success", "entry_price", "target_exit", "stop_loss", "retina_interpretation", "retail_reasoning"]
        },
        temperature: 0.2,
      }
    });
    
    const jsonStr = response.text || "{}";
    return JSON.parse(jsonStr);
  } catch (err: any) {
    console.error("Signal Fusion Failure:", err);
    throw err;
  }
};
