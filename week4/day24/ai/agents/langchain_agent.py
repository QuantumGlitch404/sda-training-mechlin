from __future__ import annotations

import ast
import logging
import operator
from dataclasses import dataclass
from typing import Callable, Any


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class AgentTool:
    """Represents a tool that an AI agent can use."""

    name: str
    description: str
    function: Callable[[str], str]

    def run(self, query: str) -> str:
        """Run the tool safely."""
        return self.function(query)


class LangChainAgent:
    """
    A simple AI-agent-style system with:

    - Tool support
    - Conversation memory
    - Basic reasoning
    - Tool selection
    - Custom tool support

    This implementation does not require an external paid AI API.
    """

    def __init__(self, openai_api_key: str | None = None):
        self.openai_api_key = openai_api_key
        self.memory: list[dict[str, str]] = []
        self.tools = self._initialize_tools()

    def _initialize_tools(self) -> list[AgentTool]:
        """Create the default tools available to the agent."""

        return [
            AgentTool(
                name="calculator",
                description="Performs basic mathematical calculations.",
                function=self._calculator_tool,
            ),
            AgentTool(
                name="web_search",
                description="Returns a safe placeholder for web search.",
                function=self._web_search_tool,
            ),
            AgentTool(
                name="file_operations",
                description="Explains file operation requests.",
                function=self._file_operations_tool,
            ),
            AgentTool(
                name="database_query",
                description="Returns a safe database query placeholder.",
                function=self._database_query_tool,
            ),
            AgentTool(
                name="custom_tool",
                description="Runs a custom text-processing tool.",
                function=self._custom_tool,
            ),
        ]

    def _calculator_tool(self, query: str) -> str:
        """
        Safely calculate simple arithmetic.

        This method does not use eval().
        """

        try:
            tree = ast.parse(query, mode="eval")

            allowed_operators = {
                ast.Add: operator.add,
                ast.Sub: operator.sub,
                ast.Mult: operator.mul,
                ast.Div: operator.truediv,
                ast.Pow: operator.pow,
                ast.Mod: operator.mod,
                ast.USub: operator.neg,
            }

            def evaluate(node: ast.AST) -> float:
                if isinstance(node, ast.Constant):
                    if isinstance(node.value, (int, float)):
                        return node.value
                    raise ValueError("Only numbers are allowed.")

                if isinstance(node, ast.BinOp):
                    operation = allowed_operators.get(type(node.op))
                    if operation is None:
                        raise ValueError("This operator is not allowed.")
                    return operation(
                        evaluate(node.left),
                        evaluate(node.right),
                    )

                if isinstance(node, ast.UnaryOp):
                    operation = allowed_operators.get(type(node.op))
                    if operation is None:
                        raise ValueError("This unary operator is not allowed.")
                    return operation(evaluate(node.operand))

                raise ValueError("Invalid mathematical expression.")

            result = evaluate(tree.body)
            return f"Calculation result: {result}"

        except Exception as error:
            return f"Calculation error: {error}"

    def _web_search_tool(self, query: str) -> str:
        """Safe placeholder for a real web-search integration."""

        return f"Web search placeholder result for: {query}"

    def _file_operations_tool(self, query: str) -> str:
        """Describe the requested file operation without modifying files."""

        return f"File operation request received: {query}"

    def _database_query_tool(self, query: str) -> str:
        """Safe placeholder for a database integration."""

        return f"Database query placeholder result for: {query}"

    def _custom_tool(self, query: str) -> str:
        """Simple custom tool that returns uppercase text."""

        return f"Custom tool result: {query.upper()}"

    def chat(self, message: str) -> str:
        """
        Process a message and return an agent response.

        The agent selects a tool when the message clearly requests
        a supported operation.
        """

        if not message or not message.strip():
            return "Please provide a message."

        clean_message = message.strip()
        lower_message = clean_message.lower()

        if any(char.isdigit() for char in clean_message):
            if any(symbol in clean_message for symbol in ["+", "-", "*", "/", "%"]):
                response = self._calculator_tool(clean_message)
            else:
                response = f"You provided a message containing numbers: {clean_message}"
        elif "search" in lower_message:
            response = self._web_search_tool(clean_message)
        elif "file" in lower_message:
            response = self._file_operations_tool(clean_message)
        elif "database" in lower_message:
            response = self._database_query_tool(clean_message)
        elif "custom" in lower_message:
            response = self._custom_tool(clean_message)
        else:
            response = f"Agent response: I received your message: {clean_message}"

        self.memory.append(
            {
                "user": clean_message,
                "agent": response,
            }
        )

        return response

    def get_memory(self) -> dict[str, Any]:
        """Return the current conversation memory."""

        return {
            "chat_history": self.memory,
            "memory_variables": ["chat_history"],
        }

    def clear_memory(self) -> None:
        """Clear the agent's conversation memory."""

        self.memory.clear()

    def add_tool(self, tool: AgentTool) -> None:
        """Add a new tool."""

        self.tools.append(tool)

    def remove_tool(self, tool_name: str) -> None:
        """Remove a tool by name."""

        self.tools = [
            tool for tool in self.tools
            if tool.name != tool_name
        ]

    def list_tools(self) -> list[str]:
        """Return the names of all available tools."""

        return [tool.name for tool in self.tools]