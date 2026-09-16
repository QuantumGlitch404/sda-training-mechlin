module.exports = {
  ci: {
    collect: {
      url: [
        "http://localhost:3000/health"
      ],
      numberOfRuns: 1
    },
    assert: {
      assertions: {
        "categories:performance": "off",
        "categories:accessibility": "off",
        "categories:best-practices": "off"
      }
    },
    upload: {
      target: "temporary-public-storage"
    }
  }
};