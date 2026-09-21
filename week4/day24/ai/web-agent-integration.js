class WebAIAgentIntegration {
  constructor(apiBaseUrl) {
    this.apiBaseUrl = apiBaseUrl;
    this.conversationHistory = [];
    this.agentType = "langchain";
  }

  async chat(message, agentType = this.agentType) {
    const response = await fetch(`${this.apiBaseUrl}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        agent_type: agentType,
      }),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const result = await response.json();

    this.conversationHistory.push({
      user: message,
      agent: result.response,
      timestamp: new Date().toISOString(),
      agentType,
    });

    return result.response;
  }

  async getMemory(agentType = this.agentType) {
    const response = await fetch(
      `${this.apiBaseUrl}/memory?agent_type=${agentType}`
    );

    if (!response.ok) {
      throw new Error(`Memory request failed with status ${response.status}`);
    }

    const result = await response.json();
    return result.memory;
  }

  async clearMemory(agentType = this.agentType) {
    const response = await fetch(`${this.apiBaseUrl}/memory/clear`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agent_type: agentType,
      }),
    });

    if (!response.ok) {
      return false;
    }

    this.conversationHistory = [];
    return true;
  }

  async listTools(agentType = this.agentType) {
    const response = await fetch(
      `${this.apiBaseUrl}/tools?agent_type=${agentType}`
    );

    if (!response.ok) {
      throw new Error(`Tools request failed with status ${response.status}`);
    }

    const result = await response.json();
    return result.tools;
  }

  getConversationHistory() {
    return this.conversationHistory;
  }

  setAgentType(agentType) {
    if (!["langchain", "conversation"].includes(agentType)) {
      throw new Error("Invalid agent type");
    }

    this.agentType = agentType;
  }

  getAgentType() {
    return this.agentType;
  }
}

if (typeof module !== "undefined") {
  module.exports = WebAIAgentIntegration;
}