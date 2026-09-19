import AsyncStorage from "@react-native-async-storage/async-storage";

export interface AIPrediction {
  success: boolean;
  prediction: number | null;
  confidence: number | null;
  error?: string;
}

export interface AIModelInfo {
  name: string;
  version: string;
  accuracy?: number;
}

class AIMobileIntegration {
  private readonly apiBaseUrl: string;

  constructor(apiBaseUrl: string) {
    this.apiBaseUrl = apiBaseUrl;
  }

  private createCacheKey(data: object): string {
    return `ai_prediction_${JSON.stringify(data)}`;
  }

  async predict(data: object): Promise<AIPrediction> {
    const cacheKey = this.createCacheKey(data);

    try {
      const response = await fetch(`${this.apiBaseUrl}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Prediction failed: ${response.status}`);
      }

      const result: AIPrediction = await response.json();

      await AsyncStorage.setItem(
        cacheKey,
        JSON.stringify({
          ...result,
          savedAt: Date.now(),
        }),
      );

      return result;
    } catch (error) {
      const cachedResult = await AsyncStorage.getItem(cacheKey);

      if (cachedResult) {
        const parsedResult = JSON.parse(cachedResult);

        return {
          success: parsedResult.success,
          prediction: parsedResult.prediction,
          confidence: parsedResult.confidence,
        };
      }

      return {
        success: false,
        prediction: null,
        confidence: null,
        error:
          error instanceof Error
            ? error.message
            : "Unknown prediction error",
      };
    }
  }

  async clearCache(): Promise<void> {
    const keys = await AsyncStorage.getAllKeys();

    const aiKeys = keys.filter((key) =>
      key.startsWith("ai_prediction_"),
    );

    await AsyncStorage.multiRemove(aiKeys);
  }
}

export default AIMobileIntegration;