
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMEVAnalysis = async (userMode: string, tradingMode: 'SPOT' | 'FUTURES', context: any) => {
  const isInstitutional = userMode === 'INSTITUTIONAL';
  const isFutures = tradingMode === 'FUTURES';
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `COMMAND INPUT [USER_MODE: ${userMode}] [TRADING_MODE: ${tradingMode}]:
      - ASSET: ${context.token}
      - PRICE: $${context.price}
      - MKT_CAP: $${context.marketCap?.toLocaleString() || '0'}
      - SECTOR: ${context.sector}
      - VOLATILITY: ${context.volatility}
      - MKT_DOMINANCE: ${context.dominance ? context.dominance.toFixed(2) : 0}%
      - MM_ACTIVITY: ${context.mktMakerActivity}
      - STRATEGY: ${context.strategy}
      - RSI: ${context.technicals?.rsi?.toFixed(2) || 'N/A'}
      - OB_IMBALANCE: ${(context.technicals?.obImbalance ? context.technicals.obImbalance * 100 : 0).toFixed(2)}%

      MISSION: 
      ${isInstitutional 
        ? "B2B INSTITUTIONAL: Focus on GFX/MTF/Wyckoff accumulation patterns. Provide LPE (Liquidity Provision Efficiency) and 24h market structure stability. Tone is cold, quantitative, and macro."
        : isFutures 
            ? "RETAIL FUTURES (HIGH LEVERAGE): Generate a highly specific, catchy trading signal. The 'retail_reasoning' field MUST STRICTLY follow this vertical format:\n\n[DIRECTION e.g. LONG/SHORT] [EMOJI e.g. 🍏/🍎]\n\n[SYMBOL]/USDT\n\nMARKET PRICE: [Current Price]\n\nSL [Stop Loss]\n\nTP [Take Profit]\n\nUSE GOOD RISK MANAGEMENT\n\nNO GREEDY\n\nPATIENT IS THE KEY\n\nAdd a brief catchy motivation at the end. Use newlines."
            : "RETAIL SPOT (MOONSHOTS): Focus on Alpha signals and ROI Moonshot potential. Provide specific profit tiers (3%, 100%, 500%) and 48h+ investment horizons. Tone is hype-aligned but professional."
      }

      OUTPUT_JSON_STRUCTURE:
      {
        "directive": "STRONG_BUY | BUY | HOLD | SELL | LONG | SHORT",
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
        "retail_reasoning": "For FUTURES: The formatted signal text. For SPOT: Simple, actionable directive."
      }`,
      config: {
        systemInstruction: "You are the Lead Quantitative Architect of DeFi-Scope. You deliver monopolistic prediction market signals.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            directive: { type: Type.STRING, description: "One of: STRONG_BUY, BUY, HOLD, SELL, LONG, SHORT" },
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
        temperature: 0.3,
      }
    });
    
    const jsonStr = response.text || "{}";
    return JSON.parse(jsonStr);
  } catch (err: any) {
    console.error("Signal Fusion Failure:", err);
    throw err;
  }
};

export const generateAlphaFactor = async (prompt: string, assetContext: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `GENERATE ALPHA FACTOR LOGIC:
      - USER INPUT: "${prompt}"
      - ASSET CONTEXT: ${assetContext.token} ($${assetContext.price})
      
      MISSION:
      Translate the user's trading idea into a structured "White-box" alpha factor. 
      The logic should be quantitative and executable.
      Identify the model personality (AGGRESSIVE, BALANCED, CONSERVATIVE) based on the risk profile of the idea.
      Specify which market regimes this factor is best suited for.

      OUTPUT_JSON_STRUCTURE:
      {
        "name": "Alpha Factor Name",
        "logic": "Detailed pseudo-code or mathematical logic for the factor.",
        "personality": "AGGRESSIVE | BALANCED | CONSERVATIVE",
        "regimeSuitability": ["MEAN_REVERSION", "MOMENTUM", "VOLATILITY_CRUSH", "LIQUIDITY_DRAIN"],
        "expectedSharpe": number
      }`,
      config: {
        systemInstruction: "You are a Senior Quantitative Researcher. You specialize in translating qualitative trading intuition into rigorous alpha factors.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            logic: { type: Type.STRING },
            personality: { type: Type.STRING },
            regimeSuitability: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            expectedSharpe: { type: Type.NUMBER }
          },
          required: ["name", "logic", "personality", "regimeSuitability", "expectedSharpe"]
        },
        temperature: 0.7,
      }
    });
    
    const jsonStr = response.text || "{}";
    return JSON.parse(jsonStr);
  } catch (err: any) {
    console.error("Alpha Forge Failure:", err);
    throw err;
  }
};
