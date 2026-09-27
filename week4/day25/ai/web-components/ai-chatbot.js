class AIChatbot {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);

    this.options = {
      apiUrl: options.apiUrl || "/api/ai/chat",
      theme: options.theme || "light",
      position: options.position || "bottom-right",
      ...options
    };

    this.isOpen = false;
    this.conversationHistory = [];
    this.isTyping = false;

    this.init();
  }

  init() {
    this.createChatbotUI();
    this.bindEvents();
    this.loadConversationHistory();
  }

  createChatbotUI() {
    this.chatbotContainer = document.createElement("div");

    this.chatbotContainer.className =
      `ai-chatbot ${this.options.theme}`;

    this.chatbotContainer.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 350px;
      height: 500px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      display: none;
      flex-direction: column;
      overflow: hidden;
    `;

    this.createHeader();
    this.createMessagesContainer();
    this.createInputArea();
    this.createToggleButton();

    this.container.appendChild(
      this.chatbotContainer
    );
  }

  createHeader() {
    const header = document.createElement("div");

    header.style.cssText = `
      padding: 16px;
      background: #3b82f6;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;

    const title = document.createElement("h3");

    title.textContent = "AI Assistant";
    title.style.margin = "0";
    title.style.fontSize = "16px";

    const closeBtn = document.createElement("button");

    closeBtn.innerHTML = "×";

    closeBtn.style.cssText = `
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
    `;

    closeBtn.onclick = () => this.toggle();

    header.appendChild(title);
    header.appendChild(closeBtn);

    this.chatbotContainer.appendChild(header);
  }

  createMessagesContainer() {
    this.messagesContainer =
      document.createElement("div");

    this.messagesContainer.style.cssText = `
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    `;

    this.addMessage(
      "Hello! How can I help you today?",
      "bot"
    );

    this.chatbotContainer.appendChild(
      this.messagesContainer
    );
  }

  createInputArea() {
    const inputArea = document.createElement("div");

    inputArea.style.cssText = `
      padding: 16px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      gap: 8px;
    `;

    this.messageInput =
      document.createElement("input");

    this.messageInput.type = "text";
    this.messageInput.placeholder =
      "Type your message...";

    this.messageInput.style.cssText = `
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      outline: none;
    `;

    this.sendButton =
      document.createElement("button");

    this.sendButton.textContent = "Send";

    this.sendButton.style.cssText = `
      padding: 8px 16px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    `;

    inputArea.appendChild(this.messageInput);
    inputArea.appendChild(this.sendButton);

    this.chatbotContainer.appendChild(inputArea);
  }

  createToggleButton() {
    this.toggleButton =
      document.createElement("button");

    this.toggleButton.innerHTML = "💬";

    this.toggleButton.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #3b82f6;
      color: white;
      border: none;
      font-size: 24px;
      cursor: pointer;
      z-index: 1001;
    `;

    this.toggleButton.onclick = () =>
      this.toggle();

    this.container.appendChild(
      this.toggleButton
    );
  }

  bindEvents() {
    this.sendButton.onclick = () =>
      this.sendMessage();

    this.messageInput.onkeypress = (event) => {
      if (event.key === "Enter") {
        this.sendMessage();
      }
    };
  }

  toggle() {
    this.isOpen = !this.isOpen;

    this.chatbotContainer.style.display =
      this.isOpen ? "flex" : "none";

    this.toggleButton.style.display =
      this.isOpen ? "none" : "block";

    if (this.isOpen) {
      this.messageInput.focus();
    }
  }

  async sendMessage() {
    const message =
      this.messageInput.value.trim();

    if (!message || this.isTyping) {
      return;
    }

    this.messageInput.value = "";

    this.addMessage(
      message,
      "user"
    );

    this.showTypingIndicator();

    try {
      const response =
        await this.callAIAPI(message);

      this.hideTypingIndicator();

      this.addMessage(
        response,
        "bot"
      );
    } catch (error) {
      this.hideTypingIndicator();

      this.addMessage(
        "Sorry, I encountered an error. Please try again.",
        "bot"
      );

      console.error(
        "AI API error:",
        error
      );
    }
  }

  async callAIAPI(message) {
    const response = await fetch(
      this.options.apiUrl,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message,
          conversation_history:
            this.conversationHistory
        })
      }
    );

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status}`
      );
    }

    const result =
      await response.json();

    return result.response;
  }

  addMessage(content, sender) {
    const messageDiv =
      document.createElement("div");

    messageDiv.className =
      `message ${sender}`;

    messageDiv.style.cssText = `
      max-width: 80%;
      padding: 8px 12px;
      border-radius: 12px;
      word-wrap: break-word;
      ${
        sender === "user"
          ? "background: #3b82f6; color: white; align-self: flex-end;"
          : "background: #f3f4f6; color: #374151; align-self: flex-start;"
      }
    `;

    messageDiv.textContent = content;

    this.messagesContainer.appendChild(
      messageDiv
    );

    this.messagesContainer.scrollTop =
      this.messagesContainer.scrollHeight;

    this.conversationHistory.push({
      role:
        sender === "user"
          ? "user"
          : "assistant",
      content,
      timestamp:
        new Date().toISOString()
    });

    this.saveConversationHistory();
  }

  showTypingIndicator() {
    this.isTyping = true;

    const typingDiv =
      document.createElement("div");

    typingDiv.className =
      "typing-indicator";

    typingDiv.textContent =
      "AI is typing...";

    typingDiv.style.cssText = `
      max-width: 80%;
      padding: 8px 12px;
      border-radius: 12px;
      background: #f3f4f6;
      color: #374151;
      align-self: flex-start;
    `;

    this.messagesContainer.appendChild(
      typingDiv
    );

    this.messagesContainer.scrollTop =
      this.messagesContainer.scrollHeight;
  }

  hideTypingIndicator() {
    this.isTyping = false;

    const typingIndicator =
      this.messagesContainer.querySelector(
        ".typing-indicator"
      );

    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  loadConversationHistory() {
    const history =
      localStorage.getItem(
        "ai_chatbot_history"
      );

    if (history) {
      try {
        this.conversationHistory =
          JSON.parse(history);
      } catch {
        this.conversationHistory = [];
      }
    }
  }

  saveConversationHistory() {
    localStorage.setItem(
      "ai_chatbot_history",
      JSON.stringify(
        this.conversationHistory
      )
    );
  }

  clearHistory() {
    this.conversationHistory = [];

    this.messagesContainer.innerHTML = "";

    this.addMessage(
      "Hello! How can I help you today?",
      "bot"
    );

    localStorage.removeItem(
      "ai_chatbot_history"
    );
  }
}