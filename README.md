# ModelVerse

**ModelVerse** is an interactive hub for developers to discover, compare, and integrate Large Language Models (LLMs) and Small Language Models (SLMs). This static app features curated AI model lists, an interactive AI glossary, a mobile RAM calculator, and copy-paste code snippets for Web and Flutter, helping you seamlessly build AI applications.

## Features
- **Model Finder**: Search and explore a curated database of top LLMs and SLMs.
- **Decision Wizard**: Get automated recommendations on whether to use a cloud API or an on-device local model based on your project constraints.
- **Comparison Matrix**: Side-by-side comparison of model capabilities, hardware requirements, and costs.
- **AI/ML Glossary**: An interactive roadmap to learn core AI terminology.
- **Developer Snippets**: Copy-paste integration code for Web and Flutter (Dart).
- **RAM Calculator**: Estimate how much mobile memory (RAM) is required to run quantized models locally.

## Project Structure
This is a pure Vanilla HTML/CSS/JS application organized for maintainability:

```text
modelfinding/
├── index.html       # The main application view
├── css/             
│   └── styles.css   # All CSS styling and layout rules
└── js/              
    ├── config.js    # Centralized configuration for API Keys
    ├── data.js      # Static data arrays (models, glossary, etc.)
    └── app.js       # Main application logic, UI rendering, and event listeners
```

## Setup & Deployment

### Local Development
Because this project uses ES6 Modules (or separate JS files), you can simply open `index.html` in your browser to view it. 
However, for the best development experience, run it on a local server:
1. Use an extension like **Live Server** in VS Code.
2. Or use Python: `python3 -m http.server 8000`
3. Or use Node: `npx serve .`

### API Keys
Before deploying, ensure you configure your API keys if you plan to use live cloud endpoints.
1. Open `js/config.js`.
2. Replace the placeholder values (e.g., `'YOUR_GEMINI_API_KEY'`) with your actual API keys.
*Note: Do not commit real secret keys to public version control.*

### Deploying to Vercel
This project is perfectly suited for zero-configuration static deployment on [Vercel](https://vercel.com).
1. **Via GitHub (Recommended):** Push this repository to GitHub and import it into Vercel. It will deploy automatically.
2. **Via CLI:** Run `npx vercel` in this directory to deploy directly from your terminal.

## Built With
- HTML5
- CSS3 (Vanilla)
- JavaScript (Vanilla, ES6)
- [Lucide Icons](https://lucide.dev/)
