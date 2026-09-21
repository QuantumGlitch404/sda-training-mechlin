from __future__ import annotations

from flask import Flask, jsonify, request

from .conversation_agent import ConversationAgent
from .langchain_agent import LangChainAgent


class AIAgentAPI:
    """Flask API for AI-agent operations."""

    def __init__(self):
        self.app = Flask(__name__)

        self.langchain_agent = LangChainAgent()
        self.conversation_agent = ConversationAgent()

        self.setup_routes()

    def _select_agent(self, agent_type: str):
        """Select an agent based on the requested type."""

        if agent_type == "langchain":
            return self.langchain_agent

        if agent_type == "conversation":
            return self.conversation_agent

        return None

    def setup_routes(self) -> None:
        """Register API routes."""

        @self.app.route("/health", methods=["GET"])
        def health():
            return jsonify(
                {
                    "status": "healthy",
                    "agents": {
                        "langchain": True,
                        "conversation": True,
                    },
                }
            )

        @self.app.route("/chat", methods=["POST"])
        def chat():
            data = request.get_json(silent=True) or {}

            message = data.get("message")
            agent_type = data.get("agent_type", "langchain")

            if not isinstance(message, str) or not message.strip():
                return jsonify(
                    {
                        "success": False,
                        "error": "Message is required",
                    }
                ), 400

            agent = self._select_agent(agent_type)

            if agent is None:
                return jsonify(
                    {
                        "success": False,
                        "error": "Invalid agent type",
                    }
                ), 400

            response = agent.chat(message)

            return jsonify(
                {
                    "success": True,
                    "response": response,
                    "agent_type": agent_type,
                }
            )

        @self.app.route("/memory", methods=["GET"])
        def get_memory():
            agent_type = request.args.get("agent_type", "langchain")

            if agent_type == "langchain":
                memory = self.langchain_agent.get_memory()
            elif agent_type == "conversation":
                memory = self.conversation_agent.get_conversation_history()
            else:
                return jsonify(
                    {
                        "success": False,
                        "error": "Invalid agent type",
                    }
                ), 400

            return jsonify(
                {
                    "success": True,
                    "memory": memory,
                    "agent_type": agent_type,
                }
            )

        @self.app.route("/memory/clear", methods=["POST"])
        def clear_memory():
            data = request.get_json(silent=True) or {}
            agent_type = data.get("agent_type", "langchain")

            if agent_type == "langchain":
                self.langchain_agent.clear_memory()
            elif agent_type == "conversation":
                self.conversation_agent.clear_memory()
            else:
                return jsonify(
                    {
                        "success": False,
                        "error": "Invalid agent type",
                    }
                ), 400

            return jsonify(
                {
                    "success": True,
                    "message": "Memory cleared successfully",
                    "agent_type": agent_type,
                }
            )

        @self.app.route("/tools", methods=["GET"])
        def list_tools():
            agent_type = request.args.get("agent_type", "langchain")

            if agent_type == "langchain":
                tools = self.langchain_agent.list_tools()
            elif agent_type == "conversation":
                tools = self.conversation_agent.list_tools()
            else:
                return jsonify(
                    {
                        "success": False,
                        "error": "Invalid agent type",
                    }
                ), 400

            return jsonify(
                {
                    "success": True,
                    "tools": tools,
                    "agent_type": agent_type,
                }
            )


api = AIAgentAPI()
app = api.app