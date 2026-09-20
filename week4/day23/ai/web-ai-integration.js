class WebAIIntegration {
  constructor(apiBaseUrl) {
    this.apiBaseUrl = apiBaseUrl;
    this.conversationHistory = [];
  }

  async generateText(prompt, options = {}) {
    const response = await fetch(`${this.apiBaseUrl}/generate/text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        model: options.model || "gpt-4o-mini",
        max_tokens: options.maxTokens || 500,
        temperature: options.temperature ?? 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Text generation failed: ${response.status}`);
    }

    const result = await response.json();
    return result.result;
  }

  async generateSummary(text, maxLength = 150) {
    const response = await fetch(`${this.apiBaseUrl}/generate/summary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        max_length: maxLength,
      }),
    });

    if (!response.ok) {
      throw new Error(`Summarization failed: ${response.status}`);
    }

    const result = await response.json();
    return result.summary;
  }

  async generateCode(description, language = "python") {
    const response = await fetch(`${this.apiBaseUrl}/generate/code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description,
        language,
      }),
    });

    if (!response.ok) {
      throw new Error(`Code generation failed: ${response.status}`);
    }

    const result = await response.json();
    return result.code;
  }

  async chat(message, model = "gpt-4o-mini") {
    this.conversationHistory.push({
      role: "user",
      content: message,
    });

    const response = await fetch(`${this.apiBaseUrl}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: this.conversationHistory,
        model,
      }),
    });

    if (!response.ok) {
      throw new Error(`Chat failed: ${response.status}`);
    }

    const result = await response.json();

    this.conversationHistory.push({
      role: "assistant",
      content: result.response,
    });

    return result.response;
  }

  clearConversation() {
    this.conversationHistory = [];
  }

  getConversationHistory() {
    return [...this.conversationHistory];
  }
}

const aiIntegration = new WebAIIntegration("http://127.0.0.1:5000");

export default aiIntegration;