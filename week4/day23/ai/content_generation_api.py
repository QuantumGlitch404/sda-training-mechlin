import logging
import os
from typing import Any, Dict, Optional

from flask import Flask, jsonify, request

from .huggingface_integration import HuggingFaceIntegration
from .ollama_integration import OllamaIntegration
from .openai_integration import OpenAIIntegration


class AIContentGenerationAPI:
    """Flask API for AI text, summary, code, and chat features."""

    def __init__(
        self,
        openai_key: Optional[str] = None,
        ollama_url: Optional[str] = None,
    ):
        self.app = Flask(__name__)
        self.logger = logging.getLogger(__name__)

        self.openai_service = None
        self.ollama_service = None
        self.huggingface_service = HuggingFaceIntegration()

        if openai_key or os.getenv("OPENAI_API_KEY"):
            self.openai_service = OpenAIIntegration(openai_key)

        if ollama_url:
            self.ollama_service = OllamaIntegration(ollama_url)

        self.setup_routes()

    def setup_routes(self):
        @self.app.post("/generate/text")
        def generate_text():
            data: Dict[str, Any] = request.get_json(silent=True) or {}

            prompt = data.get("prompt")
            model = data.get("model", "gpt-4o-mini")

            if not prompt:
                return jsonify({"error": "Prompt is required"}), 400

            try:
                if model.startswith("gpt-"):
                    if not self.openai_service:
                        return jsonify({
                            "error": "OpenAI service is not configured"
                        }), 503

                    result = self.openai_service.generate_text(
                        prompt=prompt,
                        model=model,
                        max_tokens=data.get("max_tokens", 500),
                        temperature=data.get("temperature", 0.7),
                    )
                elif self.ollama_service and model.startswith("llama"):
                    result = self.ollama_service.generate_text(
                        prompt,
                        model,
                    )
                else:
                    result = self.huggingface_service.generate_text(prompt)

                return jsonify({
                    "success": True,
                    "result": result,
                    "model": model,
                })

            except Exception as error:
                self.logger.exception("Text generation failed")
                return jsonify({"error": str(error)}), 500

        @self.app.post("/generate/summary")
        def generate_summary():
            data: Dict[str, Any] = request.get_json(silent=True) or {}
            text = data.get("text")

            if not text:
                return jsonify({"error": "Text is required"}), 400

            try:
                result = self.huggingface_service.summarize_text(
                    text,
                    max_length=data.get("max_length", 150),
                )

                return jsonify({
                    "success": True,
                    "summary": result,
                    "original_length": len(text),
                    "summary_length": len(result),
                })

            except Exception as error:
                self.logger.exception("Summarization failed")
                return jsonify({"error": str(error)}), 500

        @self.app.post("/generate/code")
        def generate_code():
            data: Dict[str, Any] = request.get_json(silent=True) or {}
            description = data.get("description")
            language = data.get("language", "python")

            if not description:
                return jsonify({"error": "Description is required"}), 400

            if not self.openai_service:
                return jsonify({
                    "error": "OpenAI service is not configured"
                }), 503

            try:
                result = self.openai_service.generate_code(
                    description,
                    language,
                )

                return jsonify({
                    "success": True,
                    "code": result,
                    "language": language,
                })

            except Exception as error:
                self.logger.exception("Code generation failed")
                return jsonify({"error": str(error)}), 500

        @self.app.post("/chat")
        def chat():
            data: Dict[str, Any] = request.get_json(silent=True) or {}
            messages = data.get("messages", [])
            model = data.get("model", "gpt-4o-mini")

            if not messages:
                return jsonify({"error": "Messages are required"}), 400

            if model.startswith("gpt-"):
                if not self.openai_service:
                    return jsonify({
                        "error": "OpenAI service is not configured"
                    }), 503

                result = self.openai_service.chat_completion(
                    messages,
                    model,
                )
            elif self.ollama_service and model.startswith("llama"):
                result = self.ollama_service.chat_completion(
                    messages,
                    model,
                )
            else:
                return jsonify({"error": "Unsupported model"}), 400

            return jsonify({
                "success": True,
                "response": result,
                "model": model,
            })

        @self.app.get("/models")
        def list_models():
            return jsonify({
                "success": True,
                "models": {
                    "openai": (
                        list(self.openai_service.models.keys())
                        if self.openai_service
                        else []
                    ),
                    "ollama": (
                        self.ollama_service.list_models()
                        if self.ollama_service
                        else []
                    ),
                    "huggingface": [
                        "gpt2",
                        "facebook/bart-large-cnn",
                    ],
                },
            })

        @self.app.get("/health")
        def health():
            return jsonify({
                "status": "healthy",
                "services": {
                    "openai": self.openai_service is not None,
                    "ollama": self.ollama_service is not None,
                    "huggingface": self.huggingface_service is not None,
                },
            })

    def run(self, host: str = "127.0.0.1", port: int = 5000):
        """Start the Flask server."""

        self.app.run(host=host, port=port, debug=False)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)

    api = AIContentGenerationAPI(
        openai_key=os.getenv("OPENAI_API_KEY"),
        ollama_url=os.getenv("OLLAMA_URL"),
    )

    api.run()