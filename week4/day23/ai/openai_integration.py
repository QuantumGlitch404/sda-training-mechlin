import logging
import os
from typing import Dict, List, Optional

from openai import OpenAI


class OpenAIIntegration:
    """Integration class for OpenAI text-generation services."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")

        if not self.api_key:
            raise ValueError("OpenAI API key is required")

        self.client = OpenAI(api_key=self.api_key)
        self.logger = logging.getLogger(__name__)

        self.models = {
            "gpt-4o-mini": "gpt-4o-mini",
            "gpt-4o": "gpt-4o",
        }

    def generate_text(
        self,
        prompt: str,
        model: str = "gpt-4o-mini",
        max_tokens: int = 1000,
        temperature: float = 0.7,
    ) -> str:
        """Generate text using an OpenAI model."""

        if not prompt.strip():
            raise ValueError("Prompt cannot be empty")

        response = self.client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            max_tokens=max_tokens,
            temperature=temperature,
        )

        return response.choices[0].message.content.strip()

    def generate_summary(self, text: str, max_length: int = 150) -> str:
        """Generate a short summary."""

        prompt = (
            f"Summarize the following text in no more than "
            f"{max_length} words:\n\n{text}"
        )

        return self.generate_text(prompt, max_tokens=max_length)

    def generate_code(
        self,
        description: str,
        language: str = "python",
    ) -> str:
        """Generate code from a description."""

        prompt = (
            f"Write {language} code for the following description:\n\n"
            f"{description}\n\n"
            "Return only the code without explanations."
        )

        return self.generate_text(
            prompt,
            temperature=0.3,
        )

    def generate_documentation(
        self,
        code: str,
        language: str = "python",
    ) -> str:
        """Generate documentation for source code."""

        prompt = (
            f"Generate documentation for the following {language} code.\n\n"
            f"{code}\n\n"
            "Include function descriptions, parameters, return values, "
            "and usage examples."
        )

        return self.generate_text(
            prompt,
            temperature=0.5,
        )

    def chat_completion(
        self,
        messages: List[Dict[str, str]],
        model: str = "gpt-4o-mini",
    ) -> str:
        """Generate a response using conversation history."""

        if not messages:
            raise ValueError("Messages cannot be empty")

        response = self.client.chat.completions.create(
            model=model,
            messages=messages,
            max_tokens=1000,
            temperature=0.7,
        )

        return response.choices[0].message.content.strip()

    def generate_embeddings(
        self,
        text: str,
        model: str = "text-embedding-3-small",
    ) -> List[float]:
        """Generate an embedding vector for text."""

        response = self.client.embeddings.create(
            model=model,
            input=text,
        )

        return response.data[0].embedding

    def batch_generate(
        self,
        prompts: List[str],
        model: str = "gpt-4o-mini",
    ) -> List[str]:
        """Generate responses for multiple prompts."""

        results = []

        for prompt in prompts:
            try:
                results.append(self.generate_text(prompt, model=model))
            except Exception as error:
                self.logger.error("Batch generation failed: %s", error)
                results.append(f"Error: {error}")

        return results