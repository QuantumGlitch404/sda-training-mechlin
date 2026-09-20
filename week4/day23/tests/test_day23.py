import os
import sys
from pathlib import Path

import pytest

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT))

from ai.content_generation_api import AIContentGenerationAPI
from ai.ollama_integration import OllamaIntegration


def test_required_files_exist():
    required_files = [
        "ai/openai_integration.py",
        "ai/huggingface_integration.py",
        "ai/ollama_integration.py",
        "ai/content_generation_api.py",
        "ai/web-ai-integration.js",
        "docs/generative-ai-guide.md",
    ]

    for relative_path in required_files:
        assert (PROJECT_ROOT / relative_path).exists()


def test_health_endpoint():
    api = AIContentGenerationAPI()
    client = api.app.test_client()

    response = client.get("/health")

    assert response.status_code == 200

    data = response.get_json()

    assert data["status"] == "healthy"
    assert "services" in data


def test_text_endpoint_requires_prompt():
    api = AIContentGenerationAPI()
    client = api.app.test_client()

    response = client.post("/generate/text", json={})

    assert response.status_code == 400
    assert response.get_json()["error"] == "Prompt is required"


def test_chat_endpoint_requires_messages():
    api = AIContentGenerationAPI()
    client = api.app.test_client()

    response = client.post("/chat", json={})

    assert response.status_code == 400
    assert response.get_json()["error"] == "Messages are required"


def test_ollama_model_list_is_safe_when_unavailable():
    service = OllamaIntegration(
        base_url="http://127.0.0.1:59999"
    )

    assert isinstance(service.list_models(), list)