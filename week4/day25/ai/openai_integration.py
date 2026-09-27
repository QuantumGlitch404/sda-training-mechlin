import os
from google import genai


class GeminiIntegration:
    def __init__(self, api_key=None, model=None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        self.model = model or os.getenv(
            "GEMINI_MODEL",
            "gemini-3.8-flash"
        )

        if not self.api_key:
            raise ValueError("GEMINI_API_KEY is not set")

        self.client = genai.Client(api_key=self.api_key)

    def chat_completion(self, messages):
        conversation = []

        for message in messages:
            role = message.get("role", "user")
            content = message.get("content", "")

            conversation.append(
                f"{role}: {content}"
            )

        prompt = "\n".join(conversation)

        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt
        )

        return response.text

    def generate_text(self, prompt):
        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt
        )

        return response.text