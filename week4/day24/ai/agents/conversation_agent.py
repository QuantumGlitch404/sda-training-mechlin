from __future__ import annotations

from typing import Any

from .langchain_agent import LangChainAgent


class ConversationAgent:
    """
    Agent that manages multi-turn conversations.

    It stores recent messages and keeps basic conversation context.
    """

    def __init__(self, max_memory_length: int = 10):
        self.max_memory_length = max_memory_length
        self.agent = LangChainAgent()
        self.conversation_context: dict[str, Any] = {}
        self.history: list[dict[str, str]] = []

    def chat(self, message: str) -> str:
        """Process a message and update the conversation context."""

        response = self.agent.chat(message)

        self.history.append(
            {
                "user": message,
                "agent": response,
            }
        )

        self.history = self.history[-self.max_memory_length:]

        self.conversation_context["last_input"] = message
        self.conversation_context["last_response"] = response
        self.conversation_context["message_count"] = len(self.history)

        return response

    def get_conversation_history(self) -> list[dict[str, str]]:
        """Return the stored conversation history."""

        return self.history.copy()

    def get_conversation_summary(self) -> str:
        """Return a simple summary of the conversation."""

        if not self.history:
            return "No conversation history available."

        messages = []

        for item in self.history:
            messages.append(
                f"User: {item['user']} | Agent: {item['agent']}"
            )

        return "\n".join(messages)

    def get_context(self, key: str) -> Any:
        """Get one context value."""

        return self.conversation_context.get(key)

    def set_context(self, key: str, value: Any) -> None:
        """Set one context value."""

        self.conversation_context[key] = value

    def clear_memory(self) -> None:
        """Clear conversation history and context."""

        self.history.clear()
        self.agent.clear_memory()
        self.conversation_context.clear()

    def list_tools(self) -> list[str]:
        """Return the tools available to the internal agent."""

        return self.agent.list_tools()