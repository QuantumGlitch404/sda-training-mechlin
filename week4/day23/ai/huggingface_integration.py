import logging
from typing import Any, Dict

import torch
from transformers import pipeline


class HuggingFaceIntegration:
    """Integration class for Hugging Face pipelines."""

    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.device = 0 if torch.cuda.is_available() else -1
        self.device_name = "cuda" if torch.cuda.is_available() else "cpu"
        self.models = {}

    def load_text_generation_model(
        self,
        model_name: str = "gpt2",
    ):
        """Load a text-generation model."""

        self.models["text_generation"] = pipeline(
            "text-generation",
            model=model_name,
            device=self.device,
        )

    def load_summarization_model(
        self,
        model_name: str = "facebook/bart-large-cnn",
    ):
        """Load a summarization model."""

        self.models["summarization"] = pipeline(
            "summarization",
            model=model_name,
            device=self.device,
        )

    def load_question_answering_model(
        self,
        model_name: str = "distilbert-base-cased-distilled-squad",
    ):
        """Load a question-answering model."""

        self.models["question_answering"] = pipeline(
            "question-answering",
            model=model_name,
            device=self.device,
        )

    def generate_text(
        self,
        prompt: str,
        max_new_tokens: int = 50,
        temperature: float = 0.7,
    ) -> str:
        """Generate text using a loaded or default model."""

        if "text_generation" not in self.models:
            self.load_text_generation_model()

        result = self.models["text_generation"](
            prompt,
            max_new_tokens=max_new_tokens,
            temperature=temperature,
            do_sample=True,
        )

        return result[0]["generated_text"]

    def summarize_text(
        self,
        text: str,
        max_length: int = 150,
        min_length: int = 30,
    ) -> str:
        """Summarize text."""

        if "summarization" not in self.models:
            self.load_summarization_model()

        result = self.models["summarization"](
            text,
            max_length=max_length,
            min_length=min_length,
            do_sample=False,
        )

        return result[0]["summary_text"]

    def answer_question(
        self,
        question: str,
        context: str,
    ) -> Dict[str, Any]:
        """Answer a question using a context paragraph."""

        if "question_answering" not in self.models:
            self.load_question_answering_model()

        return self.models["question_answering"](
            question=question,
            context=context,
        )

    def get_model_info(self) -> Dict[str, Any]:
        """Return information about loaded models."""

        return {
            "device": self.device_name,
            "loaded_models": list(self.models.keys()),
            "cuda_available": torch.cuda.is_available(),
        }