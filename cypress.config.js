const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: false,
    specPattern: 'cypress/e2e/**/*.cy.js',
    video: false,
    screenshot: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

