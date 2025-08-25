# Contributing to CodeMentor AI

We welcome contributions to CodeMentor AI! This guide will help you understand the process for contributing to this project.

## Getting Started

### Fork the Repository

1. **Fork** this repository to your GitHub account
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/codeMentor-ai.git
   cd codeMentor-ai
   ```

### Set Up Development Environment

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the environment example file:
   ```bash
   cp .env.example .env
   ```

3. Fill in your environment variables in `.env`

4. Start the development server:
   ```bash
   npm start
   ```

## Making Changes

### Create a Feature Branch

1. **Create a new branch** for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
   
   Use descriptive branch names:
   - `feature/add-leetcode-integration`
   - `bugfix/fix-contest-notifications`
   - `docs/update-setup-guide`

2. **Make your changes** following our coding standards

3. **Test your changes** thoroughly:
   ```bash
   npm test
   ```

4. **Commit your changes** with clear, descriptive messages:
   ```bash
   git add .
   git commit -m "Add: Brief description of what you added"
   ```

## Code Standards

### Coding Guidelines

- **JavaScript**: Follow ES6+ standards and modern JavaScript practices
- **Code Style**: Use consistent indentation (2 spaces) and formatting
- **Comments**: Add clear comments for complex logic
- **Error Handling**: Implement proper error handling and logging
- **Testing**: Write tests for new features when applicable

### Commit Message Standards

Use conventional commit format:
- `Add: New feature description`
- `Fix: Bug fix description`
- `Update: Changes to existing functionality`
- `Remove: Removal of features or code`
- `Docs: Documentation updates`

## Submitting Changes

### Create a Pull Request

1. **Push** your feature branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request** from your fork to our main repository

3. **Fill out the PR template** with:
   - Clear description of changes
   - Screenshots/GIFs for UI changes
   - Testing information
   - Related issue numbers (if applicable)

### Pull Request Guidelines

- **One feature per PR**: Keep pull requests focused and atomic
- **Clear description**: Explain what changes you made and why
- **Update documentation**: Update README or other docs if needed
- **Test coverage**: Ensure your changes don't break existing functionality
- **Responsive to feedback**: Address review comments promptly

## Types of Contributions

### We welcome contributions in these areas:

- **🐛 Bug Fixes**: Help us squash bugs and improve reliability
- **✨ New Features**: Add new functionality that enhances the bot
- **📚 Documentation**: Improve docs, examples, and guides
- **🎨 UI/UX**: Enhance the web dashboard experience
- **🧪 Testing**: Add test coverage and improve testing practices
- **🔧 DevOps**: Improve deployment, CI/CD, and development workflow

## Contact & Support

### Getting Help

- **Issues**: Create a GitHub issue for bugs or feature requests
- **Discussions**: Use [GitHub Discussions](https://github.com/anurag12sharma/codeMentor-ai/discussions) for questions
- **Email**: Contact the maintainer at [INSERT EMAIL]
- **Discord**: Join our development Discord (if available)

### Before Contributing

1. **Check existing issues** to avoid duplicate work
2. **Create an issue** for major changes to discuss approach
3. **Follow our [Code of Conduct](CODE_OF_CONDUCT.md)**
4. **Read through existing code** to understand patterns and conventions

## Development Workflow

1. **Fork** → Clone your fork locally
2. **Branch** → Create feature branch from main
3. **Code** → Make changes following our standards
4. **Test** → Ensure everything works correctly
5. **Commit** → Use clear, conventional commit messages
6. **Push** → Push changes to your fork
7. **PR** → Create pull request with detailed description
8. **Review** → Address feedback and iterate
9. **Merge** → Maintainers will merge approved changes

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Recognition

All contributors will be acknowledged in our README and release notes. We appreciate every contribution, no matter how small!

---

**Thank you for contributing to CodeMentor AI!** 🚀

Your contributions help make competitive programming more accessible and enjoyable for everyone.
