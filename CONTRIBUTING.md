# Contributing to paystack-sdk-node

First off, thanks for taking the time to contribute! 🎉

We welcome contributions of all forms, including bug reports, feature requests, documentation improvements, and code changes.

## 🛠 Prerequisites

This project uses **[Bun](https://bun.sh/)** as the package manager and test runner.

- **Node.js**: >= 18
- **Bun**: latest

## 🚀 Getting Started

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally:
    ```bash
    git clone https://github.com/YOUR_USERNAME/paystack-sdk-node.git
    cd paystack-sdk-node
    ```
3.  **Install dependencies**:
    ```bash
    bun install
    ```

## 💻 Development Workflow

### Building the SDK
To build the project (using `tsup`):
```bash
bun run build
```

To run the build in watch mode during development:
```bash
bun run dev
```

### Running Tests
We use **Bun's built-in test runner**.
```bash
bun test
```

### Formatting & Linting
We use **Prettier** for formatting and **ESLint** for linting.

To format your code:
```bash
bun run format
```

To check for linting errors:
```bash
bun run lint
```

## 📥 Submitting a Pull Request

1.  **Create a new branch** for your feature or bug fix:
    ```bash
    git checkout -b feature/amazing-feature
    ```
2.  **Make your changes**. Ensure your code follows the project's style and conventions.
3.  **Add tests** for your changes if applicable.
4.  **Run tests** to ensure everything is working:
    ```bash
    bun test
    ```
5.  **Commit your changes** using descriptive commit messages.
6.  **Push to your fork**:
    ```bash
    git push origin feature/amazing-feature
    ```
7.  **Open a Pull Request** against the `main` branch of the original repository.

## 📝 Coding Guidelines

-   **Type Safety**: Ensure all new code is fully typed. Avoid using `any` unless absolutely necessary.
-   **Documentation**: Add JSDoc comments to new methods and interfaces.
-   **Tests**: Write clear and concise unit tests for your logic.

## 🐛 Reporting Bugs

If you find a bug, please open an issue on GitHub with:
-   A clear title and description.
-   Steps to reproduce the issue.
-   Expected vs. actual behavior.

Thank you for contributing!
