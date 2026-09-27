import logging
import os
from typing import Any, Dict, List

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from google import genai


load_dotenv()


class MobileAIService:
    """Backend service for Day 26 mobile AI features."""

    def __init__(self):
        self.app = Flask(__name__)
        CORS(self.app)

        self.logger = logging.getLogger(__name__)

        self.api_key = os.getenv("GEMINI_API_KEY")
        self.model = os.getenv(
            "GEMINI_MODEL",
            "gemini-3-flash-preview"
        )

        self.client = None

        if self.api_key:
            self.client = genai.Client(api_key=self.api_key)

        self.setup_routes()

    def setup_routes(self):
        """Create all mobile AI API routes."""

        @self.app.route("/chat", methods=["POST"])
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

                if not self.client:
                    return jsonify({
                        "error": "Gemini service not available"
                    }), 500

                conversation = []

                for item in conversation_history:
                    role = item.get("role", "user")
                    content = item.get("content", "")

                    conversation.append(
                        f"{role}: {content}"
                    )

                conversation.append(
                    f"user: {message}"
                )

                prompt = "\n".join(conversation)

                response = self.client.models.generate_content(
                    model=self.model,
                    contents=prompt
                )

                ai_response = response.text

                updated_history = (
                    conversation_history
                    + [
                        {
                            "role": "user",
                            "content": message
                        },
                        {
                            "role": "assistant",
                            "content": ai_response
                        }
                    ]
                )

                return jsonify({
                    "success": True,
                    "response": ai_response,
                    "conversation_history": updated_history
                })

            except Exception as error:
                self.logger.error(
                    "Chat error: %s",
                    error
                )

                return jsonify({
                    "error": str(error)
                }), 500

        @self.app.route("/generate", methods=["POST"])
        def generate_content():
            try:
                data = request.get_json() or {}

                content_type = data.get(
                    "content_type",
                    "article"
                )
                topic = data.get("topic")
                tone = data.get(
                    "tone",
                    "professional"
                )
                length = data.get(
                    "length",
                    "medium"
                )
                keywords = data.get(
                    "keywords",
                    []
                )

                if not topic:
                    return jsonify({
                        "error": "Topic is required"
                    }), 400

                if not self.client:
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

                response = self.client.models.generate_content(
                    model=self.model,
                    contents=prompt
                )

                return jsonify({
                    "success": True,
                    "content": response.text,
                    "metadata": {
                        "content_type": content_type,
                        "topic": topic,
                        "tone": tone,
                        "length": length,
                        "keywords": keywords
                    }
                })

            except Exception as error:
                self.logger.error(
                    "Content generation error: %s",
                    error
                )

                return jsonify({
                    "error": str(error)
                }), 500

        @self.app.route(
            "/recommendations",
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
                self.logger.error(
                    "Recommendations error: %s",
                    error
                )

                return jsonify({
                    "error": str(error)
                }), 500

        @self.app.route(
            "/recommendations/feedback",
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
                self.logger.error(
                    "Feedback error: %s",
                    error
                )

                return jsonify({
                    "error": str(error)
                }), 500

        @self.app.route("/profile", methods=["GET"])
        def get_user_profile():
            profile = {
                "interests": [
                    "technology",
                    "programming",
                    "ai"
                ],
                "preferences": {
                    "content_type": "articles",
                    "tone": "professional",
                    "length": "medium"
                },
                "history": {
                    "viewed_content": [],
                    "bookmarked_content": [],
                    "rated_content": []
                }
            }

            return jsonify({
                "success": True,
                "profile": profile
            })

        @self.app.route("/health", methods=["GET"])
        def health():
            return jsonify({
                "status": "healthy",
                "services": {
                    "gemini": self.client is not None
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
        """Build the content generation prompt."""

        length_map = {
            "short": "100-200 words",
            "medium": "200-500 words",
            "long": "500+ words"
        }

        prompt = (
            f"Write a {content_type} about {topic} "
            f"in a {tone} tone.\n"
            f"Length: {length_map.get(length, '200-500 words')}"
        )

        if keywords:
            prompt += (
                f"\nInclude these keywords: "
                f"{', '.join(keywords)}"
            )

        prompt += (
            "\n\nProvide only the content without "
            "extra explanations or meta information."
        )

        return prompt

    def _generate_recommendations(
        self,
        user_profile: Dict[str, Any],
        max_recommendations: int
    ) -> List[Dict[str, Any]]:
        """Generate mobile recommendation results."""

        interests = user_profile.get(
            "interests",
            ["technology"]
        )

        recommendations = []

        for index in range(max_recommendations):
            recommendations.append({
                "id": f"mobile_rec_{index + 1}",
                "title": (
                    f"AI Recommendation "
                    f"{index + 1}"
                ),
                "description": (
                    "Recommended content based "
                    "on your mobile AI profile "
                    f"and interests: {', '.join(interests)}."
                ),
                "category": "Technology",
                "score": round(
                    0.80 + (index * 0.03),
                    2
                ),
                "url": f"/item/{index + 1}",
                "image": (
                    f"/images/item_{index + 1}.jpg"
                )
            })

        return recommendations

    def _process_feedback(
        self,
        rating: int,
        recommendations: List[Dict[str, Any]],
        user_profile: Dict[str, Any]
    ):
        """Process recommendation feedback."""

        self.logger.info(
            "Feedback received: rating=%s, "
            "recommendations=%s, profile=%s",
            rating,
            len(recommendations),
            user_profile
        )

    def run(
        self,
        host: str = "0.0.0.0",
        port: int = 5001
    ):
        """Start the mobile AI service."""

        self.logger.info(
            "Starting Mobile AI Service on %s:%s",
            host,
            port
        )

        self.app.run(
            host=host,
            port=port,
            debug=False
        )


if __name__ == "__main__":
    MobileAIService().run()