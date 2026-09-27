import logging
import os
from typing import Any, Dict, List

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

from ai.openai_integration import GeminiIntegration

load_dotenv()


class AIWebService:

    def __init__(self, gemini_api_key: str = None):
        self.app = Flask(__name__)
        CORS(self.app)

        self.logger = logging.getLogger(__name__)

        self.gemini_service = None

        api_key = gemini_api_key or os.getenv("GEMINI_API_KEY")
        model = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")

        if api_key:
            self.gemini_service = GeminiIntegration(
                api_key=api_key,
                model=model
            )

        self.setup_routes()

    def setup_routes(self):

        @self.app.route("/api/ai/chat", methods=["POST"])
        def chat():
            try:
                data = request.get_json() or {}

                message = data.get("message")
                conversation_history = data.get(
                    "conversation_history",
                    []
                )

                if not message:
                    return jsonify({
                        "error": "Message is required"
                    }), 400

                if not self.gemini_service:
                    return jsonify({
                        "error": "Gemini service not available"
                    }), 500

                messages = []

                for msg in conversation_history:
                    messages.append({
                        "role": msg.get("role", "user"),
                        "content": msg.get("content", "")
                    })

                messages.append({
                    "role": "user",
                    "content": message
                })

                response = self.gemini_service.chat_completion(
                    messages
                )

                updated_history = conversation_history + [
                    {
                        "role": "user",
                        "content": message
                    },
                    {
                        "role": "assistant",
                        "content": response
                    }
                ]

                return jsonify({
                    "success": True,
                    "response": response,
                    "conversation_history": updated_history
                })

            except Exception as error:
                self.logger.exception("Chat error")

                return jsonify({
                    "error": str(error)
                }), 500

        @self.app.route("/api/ai/generate", methods=["POST"])
        def generate_content():
            try:
                data = request.get_json() or {}

                content_type = data.get(
                    "content_type",
                    "article"
                )

                topic = data.get("topic")
                tone = data.get("tone", "professional")
                length = data.get("length", "medium")
                keywords = data.get("keywords", [])

                if not topic:
                    return jsonify({
                        "error": "Topic is required"
                    }), 400

                if not self.gemini_service:
                    return jsonify({
                        "error": "Gemini service not available"
                    }), 500

                prompt = self._build_content_prompt(
                    content_type,
                    topic,
                    tone,
                    length,
                    keywords
                )

                content = self.gemini_service.generate_text(
                    prompt
                )

                return jsonify({
                    "success": True,
                    "content": content,
                    "metadata": {
                        "content_type": content_type,
                        "topic": topic,
                        "tone": tone,
                        "length": length,
                        "keywords": keywords
                    }
                })

            except Exception as error:
                self.logger.exception(
                    "Content generation error"
                )

                return jsonify({
                    "error": str(error)
                }), 500

        @self.app.route(
            "/api/ai/recommendations/profile",
            methods=["GET"]
        )
        def get_profile():
            return jsonify({
                "interests": [
                    "web development",
                    "artificial intelligence",
                    "software development"
                ],
                "preferred_category": "Technology"
            })

        @self.app.route(
            "/api/ai/recommendations",
            methods=["POST"]
        )
        def get_recommendations():
            try:
                data = request.get_json() or {}

                user_profile = data.get(
                    "user_profile",
                    {}
                )

                max_recommendations = data.get(
                    "max_recommendations",
                    5
                )

                recommendations = (
                    self._generate_recommendations(
                        user_profile,
                        max_recommendations
                    )
                )

                return jsonify({
                    "success": True,
                    "recommendations": recommendations
                })

            except Exception as error:
                self.logger.exception(
                    "Recommendations error"
                )

                return jsonify({
                    "error": str(error)
                }), 500

        @self.app.route(
            "/api/ai/recommendations/feedback",
            methods=["POST"]
        )
        def submit_feedback():
            try:
                data = request.get_json() or {}

                rating = data.get("rating")
                recommendations = data.get(
                    "recommendations",
                    []
                )

                user_profile = data.get(
                    "user_profile",
                    {}
                )

                self._process_feedback(
                    rating,
                    recommendations,
                    user_profile
                )

                return jsonify({
                    "success": True,
                    "message": "Feedback received"
                })

            except Exception as error:
                self.logger.exception(
                    "Feedback error"
                )

                return jsonify({
                    "error": str(error)
                }), 500

        @self.app.route("/api/ai/health", methods=["GET"])
        def health():
            return jsonify({
                "status": "healthy",
                "services": {
                    "gemini": self.gemini_service is not None
                }
            })

    def _build_content_prompt(
        self,
        content_type: str,
        topic: str,
        tone: str,
        length: str,
        keywords: List[str]
    ) -> str:

        length_map = {
            "short": "100-200 words",
            "medium": "200-500 words",
            "long": "500+ words"
        }

        prompt = f"""
Write a {content_type} about {topic}
in a {tone} tone.

Length:
{length_map.get(length, "200-500 words")}
"""

        if keywords:
            prompt += (
                "\nInclude these keywords: "
                + ", ".join(keywords)
            )

        prompt += (
            "\n\nPlease provide only the content "
            "without explanations or meta information."
        )

        return prompt

    def _generate_recommendations(
        self,
        user_profile: Dict[str, Any],
        max_recommendations: int
    ) -> List[Dict[str, Any]]:

        recommendations = []

        max_recommendations = min(
            int(max_recommendations),
            5
        )

        for i in range(max_recommendations):
            recommendations.append({
                "title": f"Recommended Item {i + 1}",
                "description": (
                    "This is a recommended item "
                    "based on your profile."
                ),
                "category": "Technology",
                "score": round(
                    0.8 + (i * 0.05),
                    2
                ),
                "url": f"/item/{i + 1}",
                "image": ""
            })

        return recommendations

    def _process_feedback(
        self,
        rating: int,
        recommendations: List[Dict[str, Any]],
        user_profile: Dict[str, Any]
    ):
        self.logger.info(
            "Feedback received: rating=%s, recommendations=%s",
            rating,
            len(recommendations)
        )

    def run(
        self,
        host: str = "127.0.0.1",
        port: int = 5000
    ):
        self.logger.info(
            "Starting AI Web Service on %s:%s",
            host,
            port
        )

        self.app.run(
            host=host,
            port=port,
            debug=False
        )


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO
    )

    service = AIWebService()
    service.run()
