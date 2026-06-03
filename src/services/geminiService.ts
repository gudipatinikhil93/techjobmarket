import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Production-ready Gemini Service for TechJobMarket.
 */
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private modelName: string = "gemini-flash-latest"; // Verified operational in 2026 environment

  constructor(apiKey: string) {
    if (!apiKey) {
      console.error('[GeminiService] API Initialization Failed: GEMINI_API_KEY is missing.');
      throw new Error('GEMINI_API_KEY is required for GeminiService');
    }
    
    console.log(`[GeminiService] Initializing Gemini with model: ${this.modelName}`);
    this.genAI = new GoogleGenerativeAI(apiKey);
    
    this.model = this.genAI.getGenerativeModel({ 
      model: this.modelName,
      generationConfig: {
        temperature: 0.2,
        topP: 0.8,
        topK: 40,
      }
    });
  }

  /**
   * Generates market intelligence based on provided analytics.
   * @param analytics Real analytics payload from the database.
   */
  async generateMarketIntelligence(analytics: any) {
    console.log('[GeminiService] Preparing market intelligence request...');
    
    const prompt = `
      You are a Senior Labor Market Economist at a firm like Bloomberg or Levels.fyi.
      Your task is to analyze the provided US Tech Job Market data and generate a professional intelligence briefing.

      REAL ANALYTICS DATA:
      ${JSON.stringify(analytics, null, 2)}

      OBJECTIVE:
      - Summarize the current state of the market.
      - Identify key trends in roles, cities, and compensation.
      - Provide a concise briefing for a homepage.

      CONSTRAINTS:
      - NEVER invent fake analytics.
      - ONLY use the provided data.
      - If data is sparse or weak, explicitly mention "Limited historical data available."
      - Style: Bloomberg, professional, concise, no hype, no fluff.
      - Tone: Professional labor market commentary.

      OUTPUT FORMAT (JSON):
      {
        "pulse_summary": "A 1-sentence high-level summary of the market pulse.",
        "intelligence_briefing": [
          "3 distinct, data-backed bullet points for the homepage.",
          "Point 2...",
          "Point 3..."
        ],
        "professional_analysis": "A concise 2-3 paragraph professional analysis of the market conditions.",
        "confidence_score": 0.0 to 1.0,
        "data_limitations": "Description of any data gaps or if 'Limited historical data available' was triggered."
      }

      Return ONLY the JSON.
    `;

    // Log the request payload (abbreviated analytics for logs)
    console.log('[GeminiService] Sending request to Gemini...');
    console.log(`[GeminiService] Payload sample (Growing Roles): ${JSON.stringify(analytics.growing_roles?.slice(0, 2))}`);

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('[GeminiService] Received response from Gemini.');
      
      // Extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('[GeminiService] Failed to extract JSON from response:', text);
        throw new Error('Failed to parse JSON from Gemini response');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      console.log('[GeminiService] Successfully parsed intelligence briefing.');
      return parsed;
    } catch (error: any) {
      console.error('[GeminiService] API Response Error:', error.message);
      if (error.status) console.error(`[GeminiService] Status Code: ${error.status}`);
      if (error.response) console.error('[GeminiService] Error Details:', JSON.stringify(error.response, null, 2));
      throw error;
    }
  }
}
