class AIRecommendations {
  constructor(containerId, options = {}) {
    this.container =
      document.getElementById(containerId);

    this.options = {
      apiUrl:
        options.apiUrl ||
        "/api/ai/recommendations",

      maxRecommendations:
        options.maxRecommendations || 5,

      ...options
    };

    this.userProfile = {};
    this.recommendations = [];

    this.init();
  }

  init() {
    this.createUI();
    this.bindEvents();
    this.loadUserProfile();
  }

  createUI() {
    this.container.innerHTML = `
      <div class="ai-recommendations">

        <div class="recommendations-header">
          <h3>Recommended for You</h3>

          <button
            id="refresh-recommendations"
            class="btn btn-outline"
          >
            Refresh
          </button>
        </div>

        <div
          id="recommendations-content"
          class="recommendations-content"
        >
          <div class="loading-placeholder">
            <p>
              Loading recommendations...
            </p>
          </div>
        </div>

        <div
          id="recommendations-feedback"
          style="display:none;"
        >
          <h4>How did we do?</h4>

          <div class="feedback-buttons">

            <button
              class="feedback-btn"
              data-rating="1"
            >
              😞
            </button>

            <button
              class="feedback-btn"
              data-rating="2"
            >
              😐
            </button>

            <button
              class="feedback-btn"
              data-rating="3"
            >
              😊
            </button>

            <button
              class="feedback-btn"
              data-rating="4"
            >
              😍
            </button>

          </div>
        </div>

      </div>
    `;
  }

  bindEvents() {
    document
      .getElementById(
        "refresh-recommendations"
      )
      .onclick = () =>
        this.loadRecommendations();

    document.addEventListener(
      "click",
      event => {
        if (
          event.target.classList.contains(
            "feedback-btn"
          )
        ) {
          const rating =
            parseInt(
              event.target.dataset.rating
            );

          this.submitFeedback(
            rating
          );
        }
      }
    );
  }

  async loadUserProfile() {
    try {
      const response =
        await fetch(
          `${this.options.apiUrl}/profile`
        );

      if (response.ok) {
        this.userProfile =
          await response.json();

        this.loadRecommendations();
      }
    } catch (error) {
      console.error(
        "Failed to load user profile:",
        error
      );
    }
  }

  async loadRecommendations() {
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
              user_profile:
                this.userProfile,

              max_recommendations:
                this.options
                  .maxRecommendations
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

      this.recommendations =
        result.recommendations || [];

      this.displayRecommendations();

    } catch (error) {
      console.error(
        "Failed to load recommendations:",
        error
      );

      this.showError(
        "Failed to load recommendations. Please try again."
      );
    }
  }

  displayRecommendations() {
    const content =
      document.getElementById(
        "recommendations-content"
      );

    if (
      this.recommendations.length === 0
    ) {
      content.innerHTML =
        "<p>No recommendations available at the moment.</p>";

      return;
    }

    const recommendationsHTML =
      this.recommendations
        .map(
          (recommendation, index) => `
            <div
              class="recommendation-item"
            >

              <div
                class="recommendation-content"
              >
                <h4>
                  ${recommendation.title}
                </h4>

                <p>
                  ${recommendation.description}
                </p>

                <div
                  class="recommendation-meta"
                >
                  <span>
                    Score:
                    ${Number(
                      recommendation.score
                    ).toFixed(2)}
                  </span>

                  <span>
                    ${recommendation.category}
                  </span>
                </div>

                <div
                  class="recommendation-actions"
                >
                  <button
                    class="btn btn-primary"
                    data-index="${index}"
                    onclick="window.aiRecommendations.openRecommendation(${index})"
                  >
                    View
                  </button>

                  <button
                    class="btn btn-outline"
                    onclick="window.aiRecommendations.toggleBookmark(${index})"
                  >
                    Bookmark
                  </button>
                </div>

              </div>

            </div>
          `
        )
        .join("");

    content.innerHTML =
      recommendationsHTML;

    document.getElementById(
      "recommendations-feedback"
    ).style.display = "block";
  }

  showError(message) {
    document.getElementById(
      "recommendations-content"
    ).innerHTML =
      `<div class="error-message">${message}</div>`;
  }

  async submitFeedback(rating) {
    try {
      await fetch(
        `${this.options.apiUrl}/feedback`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            rating,

            recommendations:
              this.recommendations,

            user_profile:
              this.userProfile
          })
        }
      );

      document.getElementById(
        "recommendations-feedback"
      ).innerHTML =
        "<p>Thank you for your feedback!</p>";

    } catch (error) {
      console.error(
        "Failed to submit feedback:",
        error
      );
    }
  }

  openRecommendation(index) {
    const recommendation =
      this.recommendations[index];

    if (
      recommendation &&
      recommendation.url
    ) {
      window.open(
        recommendation.url,
        "_blank"
      );
    }
  }

  toggleBookmark(index) {
    const recommendation =
      this.recommendations[index];

    if (recommendation) {
      console.log(
        "Bookmark toggled for:",
        recommendation.title
      );
    }
  }
}