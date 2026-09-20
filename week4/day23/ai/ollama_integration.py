import logging
from typing import Any, Dict, List

import requests


class OllamaIntegration:
    """Integration class for a local Ollama server."""

    def __init__(self, base_url: str = "http://localhost:11434"):
        self.base_url = base_url.rstrip("/")
        self.logger = logging.getLogger(__name__)
        self.available_models: List[str] = []
        self.load_available_models()

    def load_available_models(self) -> None:
        """Load the models available on the Ollama server."""

        try:
            response = requests.get(
                f"{self.base_url}/api/tags",
                timeout=10,
            )

            if response.ok:
                data = response.json()
                self.available_models = [
                    model["name"]
                    for model in data.get("models", [])
                ]
        except requests.RequestException as error:
            self.logger.warning("Ollama is not available: %s", error)

    def pull_model(self, model_name: str) -> bool:
        """Pull a model from the Ollama registry."""

        try:
            response = requests.post(
                f"{self.base_url}/api/pull",
                json={"name": model_name},
                timeout=300,
            )

            if response.ok:
                self.load_available_models()
                return True

        except requests.RequestException as error:
            self.logger.error("Model download failed: %s", error)

        return False

    def generate_text(
        self,
        prompt: str,
        model: str = "llama3.2",
        options: Dict[str, Any] | None = None,
    ) -> str:
        """Generate text using a local Ollama model."""

        payload: Dict[str, Any] = {
            "model": model,
            "prompt": prompt,
            "stream": False,
        }

        if options:
            payload["options"] = options

        response = requests.post(
            f"{self.base_url}/api/generate",
            json=payload,
            timeout=300,
        )
        response.raise_for_status()

        return response.json().get("response", "")

    def chat_completion(
        self,
        messages: List[Dict[str, str]],
        model: str = "llama3.2",
    ) -> str:
        """Generate a chat response."""

        response = requests.post(
            f"{self.base_url}/api/chat",
            json={
                "model": model,
                "messages": messages,
                "stream": False,
            },
            timeout=300,
        )
        response.raise_for_status()

        return response.json().get("message", {}).get("content", "")

    def get_model_info(self, model: str) -> Dict[str, Any]:
        """Return information about a model."""

        response = requests.post(
            f"{self.base_url}/api/show",
            json={"name": model},
            timeout=30,
        )
        response.raise_for_status()

        return response.json()

    def list_models(self) -> List[str]:
        """Return available model names."""

        return self.available_models.copy()

    def delete_model(self, model: str) -> bool:
        """Delete a local model."""

        response = requests.delete(
            f"{self.base_url}/api/delete",
            json={"name": model},
            timeout=30,
        )

        if response.ok:
            self.load_available_models()
            return True

        return False