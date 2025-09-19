# Contributing to Discover Kaçkar

Thank you for your interest in contributing to the Discover Kaçkar website! This document provides guidelines and information for contributors.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/discoverkackar-website.git
   cd discoverkackar-website
   ```
3. **Set up the development environment** following the [README.md](README.md) instructions
4. **Create a new branch** for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Types of Contributions

We welcome various types of contributions:

### 🐛 Bug Reports
- Use the GitHub issue template
- Provide clear steps to reproduce
- Include environment details (OS, Node.js version, etc.)
- Add screenshots if applicable

### ✨ Feature Requests
- Use the GitHub issue template
- Describe the feature clearly
- Explain the use case and benefits
- Consider implementation complexity

### 🔧 Code Contributions
- Bug fixes
- New features
- Performance improvements
- Documentation updates
- Translation improvements

### 🌍 Translation Contributions
- Improve existing translations
- Add new language support
- Fix translation errors
- Update cultural context

## 🛠️ Development Guidelines

### Code Style
- Use **TypeScript** for all new code
- Follow the existing code style and patterns
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### File Structure
- Place components in appropriate directories
- Use the existing naming conventions
- Follow the established folder structure

### Testing
- Test your changes thoroughly
- Ensure the build passes (`npm run build`)
- Check for TypeScript errors (`npm run type-check`)
- Test in multiple browsers if applicable

### Database Changes
- Create migration files for database changes
- Test migrations on a fresh database
- Update documentation if schema changes

## 📋 Pull Request Process

1. **Ensure your branch is up to date**:
   ```bash
   git checkout main
   git pull origin main
   git checkout your-feature-branch
   git rebase main
   ```

2. **Make your changes** following the guidelines above

3. **Test your changes**:
   ```bash
   npm run build
   npm run type-check
   npm run lint
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

5. **Push to your fork**:
   ```bash
   git push origin your-feature-branch
   ```

6. **Create a Pull Request** on GitHub with:
   - Clear title and description
   - Reference related issues
   - Add screenshots if applicable
   - Request review from maintainers

### Commit Message Format
Use conventional commit messages:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

Examples:
- `feat: add French language support`
- `fix: resolve image loading issue on mobile`
- `docs: update installation instructions`

## 🎯 Areas for Contribution

### High Priority
- **Performance optimization** - Image loading, bundle size
- **Accessibility improvements** - WCAG compliance
- **Mobile responsiveness** - Touch interactions, layouts
- **SEO enhancements** - Meta tags, structured data

### Medium Priority
- **New features** - Search functionality, interactive maps
- **UI/UX improvements** - Better user experience
- **Content management** - Admin panel enhancements
- **Testing** - Unit tests, integration tests

### Low Priority
- **Documentation** - Code comments, guides
- **Translation** - Additional languages
- **Styling** - Theme improvements, animations

## 🌍 Translation Guidelines

### Adding New Languages
1. Create new locale files in `locales/` directory
2. Update `i18n.ts` configuration
3. Add language switcher options
4. Test all pages in the new language

### Improving Translations
- Maintain cultural context
- Use appropriate terminology
- Keep consistency across pages
- Test with native speakers when possible

## 🚨 Security Considerations

- **Never commit sensitive data** (API keys, passwords, etc.)
- **Use environment variables** for configuration
- **Validate user input** properly
- **Follow security best practices**
- **Report security issues** privately to security@discoverkackar.com

## 📞 Getting Help

- **GitHub Discussions** - General questions and ideas
- **GitHub Issues** - Bug reports and feature requests
- **Email** - info@discoverkackar.com for direct contact

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Discover Kaçkar! 🏔️
