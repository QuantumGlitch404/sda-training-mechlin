class AIContentGenerator {
  constructor(containerId, options = {}) {
    this.container =
      document.getElementById(containerId);

    this.options = {
      apiUrl:
        options.apiUrl ||
        "/api/ai/generate",
      ...options
    };

    this.init();
  }

  init() {
    this.createUI();
    this.bindEvents();
  }

  createUI() {
    this.container.innerHTML = `
      <div class="ai-content-generator">

        <div class="generator-header">
          <h3>AI Content Generator</h3>
          <p>
            Generate high-quality content using AI
          </p>
        </div>

        <div class="generator-form">

          <div class="form-group">
            <label for="content-type">
              Content Type
            </label>

            <select id="content-type">
              <option value="article">
                Article
              </option>

              <option value="blog-post">
                Blog Post
              </option>

              <option value="social-media">
                Social Media
              </option>

              <option value="email">
                Email
              </option>

              <option value="product-description">
                Product Description
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="topic">
              Topic/Subject
            </label>

            <input
              type="text"
              id="topic"
              placeholder="Enter your topic..."
            />
          </div>

          <div class="form-group">
            <label for="tone">
              Tone
            </label>

            <select id="tone">
              <option value="professional">
                Professional
              </option>

              <option value="casual">
                Casual
              </option>

              <option value="friendly">
                Friendly
              </option>

              <option value="formal">
                Formal
              </option>

              <option value="creative">
                Creative
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="length">
              Length
            </label>

            <select id="length">
              <option value="short">
                Short (100-200 words)
              </option>

              <option value="medium">
                Medium (200-500 words)
              </option>

              <option value="long">
                Long (500+ words)
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="keywords">
              Keywords
            </label>

            <input
              type="text"
              id="keywords"
              placeholder="Enter keywords separated by commas..."
            />
          </div>

          <button
            id="generate-btn"
            class="btn btn-primary"
          >
            Generate Content
          </button>
        </div>

        <div
          class="generator-result"
          id="generator-result"
          style="display:none;"
        >
          <div class="result-header">
            <h4>Generated Content</h4>

            <div>
              <button
                id="copy-btn"
                class="btn btn-secondary"
              >
                Copy
              </button>

              <button
                id="regenerate-btn"
                class="btn btn-outline"
              >
                Regenerate
              </button>
            </div>
          </div>

          <div
            id="result-content"
            class="result-content"
          ></div>
        </div>

        <div
          id="generator-loading"
          class="generator-loading"
          style="display:none;"
        >
          <p>Generating content...</p>
        </div>

      </div>
    `;
  }

  bindEvents() {
    document
      .getElementById("generate-btn")
      .onclick = () =>
        this.generateContent();

    document
      .getElementById("copy-btn")
      .onclick = () =>
        this.copyContent();

    document
      .getElementById("regenerate-btn")
      .onclick = () =>
        this.generateContent();
  }

  async generateContent() {
    const contentType =
      document.getElementById(
        "content-type"
      ).value;

    const topic =
      document.getElementById(
        "topic"
      ).value;

    const tone =
      document.getElementById(
        "tone"
      ).value;

    const length =
      document.getElementById(
        "length"
      ).value;

    const keywords =
      document.getElementById(
        "keywords"
      ).value;

    if (!topic.trim()) {
      alert(
        "Please enter a topic"
      );

      return;
    }

    this.showLoading();

    try {
      const response =
        await fetch(
          this.options.apiUrl,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json"
            },
            body: JSON.stringify({
              content_type:
                contentType,

              topic,

              tone,

              length,

              keywords:
                keywords
                  .split(",")
                  .map(
                    keyword =>
                      keyword.trim()
                  )
                  .filter(Boolean)
            })
          }
        );

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status}`
        );
      }

      const result =
        await response.json();

      this.showResult(
        result.content
      );

    } catch (error) {
      this.hideLoading();

      alert(
        "Failed to generate content. Please try again."
      );

      console.error(
        "Content generation error:",
        error
      );
    }
  }

  showLoading() {
    document
      .getElementById(
        "generator-loading"
      )
      .style.display = "block";

    document
      .getElementById(
        "generator-result"
      )
      .style.display = "none";
  }

  hideLoading() {
    document
      .getElementById(
        "generator-loading"
      )
      .style.display = "none";
  }

  showResult(content) {
    this.hideLoading();

    document
      .getElementById(
        "result-content"
      )
      .textContent = content;

    document
      .getElementById(
        "generator-result"
      )
      .style.display = "block";
  }

  copyContent() {
    const content =
      document.getElementById(
        "result-content"
      ).textContent;

    navigator.clipboard
      .writeText(content)
      .then(() => {
        alert(
          "Content copied to clipboard!"
        );
      })
      .catch(error => {
        console.error(
          "Failed to copy content:",
          error
        );
      });
  }
}