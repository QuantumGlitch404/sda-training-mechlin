import React, { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  metadata?: {
    model?: string;
    response_time?: number;
  };
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text:
        "I can help you break project work into tasks, organize priorities, and plan your next steps.",
      isUser: false,
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendMessage = async (value?: string) => {
    const message = (value ?? input).trim();

    if (!message || loading) {
      return;
    }

    setInput("");

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      text: message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((current) => [...current, userMessage]);
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/ai/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "AI request failed"
        );
      }

      const assistantMessage: Message = {
        id: `${Date.now()}-assistant`,
        text: data.response,
        isUser: false,
        timestamp: new Date(),
        metadata: {
          model: data.model,
          response_time: data.response_time,
        },
      };

      setMessages((current) => [
        ...current,
        assistantMessage,
      ]);
    } catch (error) {
      console.error("AI request failed:", error);

      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-error`,
          text:
            "The assistant could not process that request. Make sure the backend is running on port 5000.",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearConversation = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        text:
          "I can help you break project work into tasks, organize priorities, and plan your next steps.",
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  };

  const suggestions = [
    "Break my capstone into smaller tasks",
    "What should I work on next?",
    "Help me plan today's work",
  ];

  return (
    <main className="page assistant-page">
      <header className="page-header assistant-header">
        <div>
          <p className="eyebrow">ASSISTANT</p>
          <h1>Project Assistant</h1>
          <p className="page-description">
            Ask for help with planning, tasks and project execution.
          </p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={clearConversation}
        >
          Clear
        </button>
      </header>

      <section className="assistant-layout">
        <div className="assistant-main">
          <div className="conversation">
            {messages.map((message) => (
              <div
                className={`message-row ${
                  message.isUser
                    ? "message-user"
                    : "message-assistant"
                }`}
                key={message.id}
              >
                <div className="message-content">
                  <div className="message-meta">
                    <span>
                      {message.isUser
                        ? "You"
                        : "Assistant"}
                    </span>

                    <time>
                      {message.timestamp.toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </time>
                  </div>

                  <div className="message-text">
                    {message.text}
                  </div>

                  {message.metadata && (
                    <div className="message-details">
                      {message.metadata.model && (
                        <span>
                          {message.metadata.model}
                        </span>
                      )}

                      {message.metadata.response_time && (
                        <span>
                          {message.metadata.response_time}ms
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="message-row message-assistant">
                <div className="message-content">
                  <div className="message-meta">
                    <span>Assistant</span>
                  </div>

                  <div className="typing-indicator">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="assistant-composer">
            <textarea
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey
                ) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask about your project..."
              disabled={loading}
              rows={1}
            />

            <button
              type="button"
              className="send-button"
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
            >
              Send
            </button>
          </div>

          <p className="composer-note">
            Press Enter to send · Shift + Enter for a new
            line
          </p>
        </div>

        <aside className="assistant-sidebar">
          <div className="assistant-side-section">
            <span className="side-label">
              QUICK ACTIONS
            </span>

            <div className="suggestion-list">
              {suggestions.map((suggestion) => (
                <button
                  type="button"
                  className="suggestion-button"
                  key={suggestion}
                  onClick={() =>
                    sendMessage(suggestion)
                  }
                  disabled={loading}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <div className="assistant-side-section">
            <span className="side-label">
              AVAILABLE HELP
            </span>

            <div className="capability-list">
              <div>
                <strong>Task planning</strong>
                <span>
                  Break work into actionable steps.
                </span>
              </div>

              <div>
                <strong>Priorities</strong>
                <span>
                  Organize work by importance.
                </span>
              </div>

              <div>
                <strong>Project guidance</strong>
                <span>
                  Get practical development
                  suggestions.
                </span>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default AIAssistant;