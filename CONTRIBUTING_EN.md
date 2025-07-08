# Contributing to Draws Folder Structure

Thank you for your interest in improving Draws Folder Structure! Your contribution is essential for maintaining and improving the quality of this project. Below, you'll find some guidelines for participating.

## How can I contribute?

### Reporting bugs

1. Make sure the bug hasn't been reported previously by [checking the issues](https://github.com/krivoox/draw-folder-structure/issues).
2. If the bug hasn't been reported, [create a new issue](https://github.com/krivoox/draw-folder-structure/issues/new). Provide a detailed description and, if possible, steps to reproduce the bug.

### Suggestions and improvements

We love suggestions! Follow the same steps as for reporting bugs, but label your issue as "suggestion" or "enhancement".

### Pull Requests

1. Fork the repository.
2. Create a new branch with a descriptive name for your change.
3. Make your changes in that branch.
4. Make sure your code follows the project's style guidelines and that you've tested your code.
5. Submit a pull request describing your changes. If your PR resolves an existing issue, mention the issue number.

## Development Environment Setup

### Prerequisites

- Node.js (version 16 or higher)
- VS Code
- Git

### Installation

1. Fork the repository
2. Clone your fork locally:

   ```bash
   git clone https://github.com/your-username/draw-folder-structure.git
   cd draw-folder-structure
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. (Optional) Configure telemetry for testing:
   ```bash
   cp env.example .env
   # Edit .env and add your connection string if you want to test telemetry
   ```

### Building and Testing

- To compile: `npm run compile`
- For development mode: `npm run watch`
- For testing: `npm run pretest`

### Environment Variables

For development, you can use the following environment variables:

- `AZURE_INSIGHTS_CONNECTION_STRING`: Azure Application Insights connection string (optional)

**Important**: Never include real credentials in your code. Use the `.env` file (which is in `.gitignore`) or system environment variables.

### Project Structure

```
src/
├── extension.ts          # Main entry point
├── services/
│   └── telemetry.ts     # Telemetry service
├── functions/           # Helper functions
└── types/              # Type definitions
```

### Telemetry Testing

Telemetry is enabled by default. To test it:

1. Set up your own Azure Application Insights instance
2. Add the connection string to `.env`
3. Telemetry will automatically activate if a valid connection string is detected

## Style Guidelines

- There are no defined code styles but we expect you to apply your best practices!
- Use descriptive names for variables and functions
- Include comments in English for complex code
- Maintain consistency with existing code

## Credential Management

### ❌ NEVER do this:

```typescript
// ❌ BAD - hardcoded credentials
const connectionString = "InstrumentationKey=real-key-here...";
```

### ✅ DO this:

```typescript
// ✅ GOOD - use environment variables
const connectionString = process.env.AZURE_INSIGHTS_CONNECTION_STRING;
```

### Production Deployment

To push changes to production:

1. Make sure there are no hardcoded credentials in the code
2. Verify that the `.env` file is in `.gitignore`
3. Document any new environment variables needed
4. Update the version in `package.json`
5. Make a pull request with detailed description

## Acknowledgments

Every contribution, no matter how small, is valuable for the development and maintenance of Draws Folder Structure. Thank you for taking the time to help!
