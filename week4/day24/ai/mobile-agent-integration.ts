import AsyncStorage from "@react-native-async-storage/async-storage";

interface AgentMessage {
  user: string;
  agent: string;
  timestamp: string;
  agentType: string;
}

class MobileAIAgentIntegration {
  private apiBaseUrl: string;
  private conversationHistory: AgentMessage[] = [];
  private agentType: string = "langchain";

  constructor(apiBaseUrl: string) {
    this.apiBaseUrl = apiBaseUrl;
  }

  async loadConversationHistory(): Promise<void> {
    try {
      const history = await AsyncStorage.getItem(
        "agent_conversation_history"
      );

      if (history) {
        this.conversationHistory = JSON.parse(history);
      }
    } catch (error) {
      console.error("Failed to load conversation history:", error);
    }
  }

  private async saveConversationHistory(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        "agent_conversation_history",
        JSON.stringify(this.conversationHistory)
      );
    } catch (error) {
      console.error("Failed to save conversation history:", error);
    }
  }

  async chat(
    message: string,
    agentType: string = this.agentType
  ): Promise<string> {
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

    const newMessage: AgentMessage = {
      user: message,
      agent: result.response,
      timestamp: new Date().toISOString(),
      agentType,
    };

    this.conversationHistory.push(newMessage);
    await this.saveConversationHistory();

    return result.response;
  }

  async getMemory(agentType: string = this.agentType): Promise<unknown> {
    const response = await fetch(
      `${this.apiBaseUrl}/memory?agent_type=${agentType}`
    );

    if (!response.ok) {
      throw new Error(`Memory request failed with status ${response.status}`);
    }

    const result = await response.json();
    return result.memory;
  }

  async clearMemory(agentType: string = this.agentType): Promise<boolean> {
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
    await this.saveConversationHistory();

    return true;
  }

  async listTools(agentType: string = this.agentType): Promise<string[]> {
    const response = await fetch(
      `${this.apiBaseUrl}/tools?agent_type=${agentType}`
    );

    if (!response.ok) {
      throw new Error(`Tools request failed with status ${response.status}`);
    }

    const result = await response.json();
    return result.tools;
  }

  getConversationHistory(): AgentMessage[] {
    return [...this.conversationHistory];
  }

  setAgentType(agentType: string): void {
    if (!["langchain", "conversation"].includes(agentType)) {
      throw new Error("Invalid agent type");
    }

    this.agentType = agentType;
  }

  getAgentType(): string {
    return this.agentType;
  }

  async clearCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const agentKeys = keys.filter((key) => key.startsWith("agent_"));

      await Promise.all(
        agentKeys.map((key) => AsyncStorage.removeItem(key))
      );
    } catch (error) {
      console.error("Failed to clear agent cache:", error);
    }
  }
}

export default MobileAIAgentIntegration;