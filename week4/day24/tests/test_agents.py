from ai.agents.agent_api import app
from ai.agents.conversation_agent import ConversationAgent
from ai.agents.langchain_agent import LangChainAgent


def test_agent_chat():
    agent = LangChainAgent()

    response = agent.chat("Hello agent")

    assert "Hello agent" in response
    assert len(agent.get_memory()["chat_history"]) == 1


def test_calculator_tool():
    agent = LangChainAgent()

    response = agent.chat("2 + 3")

    assert "5" in response


def test_agent_tools():
    agent = LangChainAgent()

    tools = agent.list_tools()

    assert "calculator" in tools
    assert "custom_tool" in tools


def test_conversation_history():
    agent = ConversationAgent()

    agent.chat("First message")
    agent.chat("Second message")

    history = agent.get_conversation_history()

    assert len(history) == 2
    assert history[0]["user"] == "First message"


def test_clear_memory():
    agent = ConversationAgent()

    agent.chat("Test message")
    agent.clear_memory()

    assert agent.get_conversation_history() == []


def test_health_endpoint():
    client = app.test_client()

    response = client.get("/health")

    assert response.status_code == 200

    data = response.get_json()

    assert data["status"] == "healthy"


def test_chat_endpoint():
    client = app.test_client()

    response = client.post(
        "/chat",
        json={
            "message": "Hello API",
            "agent_type": "langchain",
        },
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["success"] is True
    assert "Hello API" in data["response"]


def test_empty_message_is_rejected():
    client = app.test_client()

    response = client.post(
        "/chat",
        json={
            "message": "",
            "agent_type": "langchain",
        },
    )

    assert response.status_code == 400


def test_invalid_agent_type_is_rejected():
    client = app.test_client()

    response = client.post(
        "/chat",
        json={
            "message": "Hello",
            "agent_type": "unknown",
        },
    )

    assert response.status_code == 400


def test_tools_endpoint():
    client = app.test_client()

    response = client.get("/tools?agent_type=langchain")

    assert response.status_code == 200

    data = response.get_json()

    assert "calculator" in data["tools"]