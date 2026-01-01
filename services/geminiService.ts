
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMEVAnalysis = async (visualObservation: string, context: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `COMMAND INPUT:
      - STRATEGY_MODE: ${context.strategy} 
      - TIME_HORIZON: ${
        context.strategy === 'SCALP' ? 'Intraday (<24h) - Rapid momentum absorption.' : 
        context.strategy === 'SWING' ? 'Macro (48-72h) - Structural trend alignment.' : 'Degenerate (<1h) - Hyper-scalp on liquidity anomalies.'
      }
      - ASSET: ${context.token}
      - PRICE_USD: $${context.price}
      - RSI: ${context.technicals?.rsi.toFixed(2)}
      - MARKET_STRUCTURE: ${context.technicals?.marketStructure}
      - VOL_DELTA: $${context.technicals?.volDelta?.toLocaleString()}
      - OB_IMBALANCE: ${(context.technicals?.obImbalance * 100).toFixed(2)}%
      - VISUAL_INPUT: ${visualObservation}

      MISSION: Synthesize a Strategy-Aligned Fusion Report. 
      - For SCALP: Focus on orderbook pressure and 15m candle imbalances.
      - For SWING: Focus on support/resistance clusters and long-term liquidity pockets.
      - For DEGEN: Focus on gas spikes, sniper activity, and "dark forest" anomalies.

      OUTPUT_JSON_STRUCTURE:
      {
        "directive": "STRONG_BUY | BUY | HOLD | SELL | STRONG_SELL",
        "energy_rating": number, // 0-100
        "confidence_score": number, // 0-100
        "probability_success": number, // 0.0 to 1.0
        "action_title": "Operation Name",
        "retina_interpretation": "A professional analysis of what the vision spectrogram reveals about institutional intent.",
        "retail_reasoning": "Clear, concise strategy-specific alpha breakdown.",
        "entry_price": number,
        "target_exit": number,
        "stop_loss": number,
        "suggested_buy_range": { "min": number, "max": number }, // In USD
        "risk_level": "LOW | MEDIUM | HIGH | DEGEN"
      }`,
      config: {
        systemInstruction: "You are the DeFi-Scope Chief Quantitative Intelligence Officer. You provide high-fidelity, actionable trade directives based on computer vision patterns and L3 order book data. Your tone is professional, authoritative, and data-driven.",
        responseMimeType: "application/json",
        temperature: 0.1,
      }
    });
    
    return JSON.parse(response.text);
  } catch (err: any) {
    console.error("DeFi-Scope Signal Fusion Failure:", err);
    throw err;
  }
};
