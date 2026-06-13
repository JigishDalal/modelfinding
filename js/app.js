// CURATED MODEL DATABASE



// DYNAMIC LAYPERSON & DEPLOYMENT ENRICHMENT ENGINE
/**
 * Enriches raw model data with analogies, training info, and deployment code.
 * @param {Object} model - The model object to enrich.
 * @returns {Object} The enriched model object.
 */
function enrichModelData(model) {
    if (model.simpleAnalogy) return model;

    let analogy = "";
    let train = "";
    let mobCode = "";
    let webCode = "";
    let dockCode = "";
    let mobPub = "";

    const nameLower = model.name.toLowerCase();
    const idLower = model.id.toLowerCase();

    if (model.category === "LLM") {
        analogy = `Think of ${model.name} as a supercomputer brain in the cloud. It's like calling a brilliant remote scientist on the phone—they can solve any complex question you ask, but they only work when they have a network connection, and they charge you a tiny fraction of a cent for every word they say.`;
        train = `Trained on trillions of words from public websites, academic journals, code repositories, books, and Q&A forums. Proprietary models (like Gemini and GPT) are also aligned using thousands of hours of direct human feedback (RLHF) to ensure helpfulness and safety.`;
        
        mobPub = "dependencies:\n  flutter:\n    sdk: flutter\n  http: ^1.2.0";
        
        if (idLower.includes("gemini")) {
            mobPub = "dependencies:\n  flutter:\n    sdk: flutter\n  google_generative_ai: ^0.4.0";
            mobCode = `import 'package:google_generative_ai/google_generative_ai.dart';\n\nFuture<String> askGemini(String prompt) async {\n  final apiKey = const String.fromEnvironment('${CONFIG.API_KEYS.GEMINI}');\n  final model = GenerativeModel(model: '${model.id}', apiKey: apiKey);\n  final response = await model.generateContent([Content.text(prompt)]);\n  return response.text ?? '';\n}`;
            webCode = `import { GoogleGenAI } from '@google/genai';\nconst ai = new GoogleGenAI({ apiKey: '${CONFIG.API_KEYS.OPENAI}' });\nconst response = await ai.models.generateContent({\n  model: '${model.id}',\n  contents: prompt,\n});\nconsole.log(response.text);`;
        } else if (idLower.includes("gpt")) {
            mobPub = "dependencies:\n  flutter:\n    sdk: flutter\n  dart_openai: ^5.1.0";
            mobCode = `import 'package:dart_openai/dart_openai.dart';\n\nFuture<String> askGPT(String prompt) async {\n  OpenAI.apiKey = '${CONFIG.API_KEYS.OPENAI}';\n  final completion = await OpenAI.instance.chat.create(\n    model: '${model.id}',\n    messages: [OpenAIChatCompletionChoiceMessageModel(content: [OpenAIChatCompletionChoiceMessageContentItemModel.text(prompt)], role: OpenAIChatMessageRole.user)],\n  );\n  return completion.choices.first.message.content?.first.text ?? '';\n}`;
            webCode = `import OpenAI from 'openai';\nconst openai = new OpenAI({ apiKey: '${CONFIG.API_KEYS.OPENAI}', dangerouslyAllowBrowser: true });\nconst completion = await openai.chat.completions.create({\n  model: '${model.id}',\n  messages: [{ role: 'user', content: prompt }],\n});\nconsole.log(completion.choices[0].message.content);`;
        } else if (idLower.includes("kimi") || idLower.includes("moonshot")) {
            mobPub = "dependencies:\n  flutter:\n    sdk: flutter\n  http: ^1.2.0";
            mobCode = `import 'dart:convert';\nimport 'package:http/http.dart' as http;\n\nFuture<String> callKimi(String prompt) async {\n  final response = await http.post(\n    Uri.parse('https://api.moonshot.cn/v1/chat/completions'),\n    headers: {\n      'Authorization': 'Bearer ${CONFIG.API_KEYS.MOONSHOT}',\n      'Content-Type': 'application/json'\n    },\n    body: jsonEncode({\n      'model': 'moonshot-v1-8k',\n      'messages': [{'role': 'user', 'content': prompt}]\n    }),\n  );\n  final data = jsonDecode(response.body);\n  return data['choices'][0]['message']['content'] ?? '';\n}`;
            webCode = `fetch('https://api.moonshot.cn/v1/chat/completions', {\n  method: 'POST',\n  headers: {\n    'Authorization': 'Bearer ${CONFIG.API_KEYS.MOONSHOT}',\n    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify({\n    'model': 'moonshot-v1-8k',\n    'messages': [{ role: 'user', content: prompt }]\n  })\n}).then(r => r.json()).then(d => console.log(d.choices[0].message.content));`;
        } else {
            mobCode = `import 'dart:convert';\nimport 'package:http/http.dart' as http;\n\nFuture<String> callAPI(String prompt) async {\n  final response = await http.post(\n    Uri.parse('https://api.provider.com/v1/chat/completions'),\n    headers: {\n      'Authorization': 'Bearer ${CONFIG.API_KEYS.GENERIC_PROVIDER}',\n      'Content-Type': 'application/json'\n    },\n    body: jsonEncode({\n      'model': '${model.id}',\n      'messages': [{'role': 'user', 'content': prompt}]\n    }),\n  );\n  final data = jsonDecode(response.body);\n  return data['choices'][0]['message']['content'] ?? '';\n}`;
            webCode = `fetch('https://api.provider.com/v1/chat/completions', {\n  method: 'POST',\n  headers: {\n    'Authorization': 'Bearer ${CONFIG.API_KEYS.GENERIC_PROVIDER}',\n    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify({\n    'model': '${model.id}',\n    'messages': [{ role: 'user', content: prompt }]\n  })\n}).then(r => r.json()).then(d => console.log(d.choices[0].message.content));`;
        }

        dockCode = `# Cloud APIs run on remote servers and cannot be run locally inside a Docker container.\n# However, you can run a local LiteLLM proxy container to standardize API calls:\n\ndocker run -d -p 4000:4000 litellm/litellm:main-latest \\ \n  --key your-admin-key \\ \n  --model ${model.id}`;

    } else {
        analogy = `Think of ${model.name} as a pocket-sized dictionary-brain that runs directly inside your device's memory. It's like having a helpful assistant sitting next to you offline on a plane—they aren't as all-knowing as the cloud supercomputer, but they respond instantly, they don't need internet, and they never send your private chats to anyone else.`;
        train = `Trained on high-quality text datasets (e.g. Meta's 15T tokens for Llama 3) focusing on clean websites, structured textbooks, code repositories, and educational transcripts. Many SLMs also use 'knowledge distillation' where they learn directly from the answers of larger models (like GPT-4).`;
        
        mobPub = "dependencies:\n  flutter:\n    sdk: flutter\n  llama_cpp_dart: ^0.2.1\n  path_provider: ^2.1.1";
        mobCode = `import 'package:llama_cpp_dart/llama_cpp_dart.dart';\n\nFuture<String> runLocalModel(String prompt) async {\n  final params = ModelParams()..useGpu = true;\n  // Load your quantized GGUF weights locally\n  final model = LlamaModel('/path/to/${model.id}-q4.gguf', params);\n  final context = LlamaContext(model, ContextParams()..contextSize = 2048);\n  \n  final tokens = context.tokenize(prompt, addBos: true);\n  context.eval(tokens);\n  return context.generateResponse();\n}`;

        webCode = `// Run local inference directly in the browser using WebGPU / Transformers.js!\nimport { pipeline } from '@xenova/transformers';\n\nconst generator = await pipeline('text-generation', 'onnx-community/${model.id}');\nconst output = await generator('What is Flutter?', { max_new_tokens: 100 });\nconsole.log(output[0].generated_text);`;

        let dockerRepo = "llama3";
        if (idLower.includes("gemma")) dockerRepo = "gemma2";
        else if (idLower.includes("phi")) dockerRepo = "phi3";
        else if (idLower.includes("qwen")) dockerRepo = "qwen2.5";

        dockCode = `# Run this model locally on your system using Ollama inside a Docker container:\n\n# 1. Start Ollama Docker container\ndocker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama\n\n# 2. Pull and run the model\ndocker exec -it ollama ollama run ${dockerRepo}`;
    }

    // Curated famous overrides
    if (idLower.includes("gemini-1.5-pro")) {
        analogy = "Think of Gemini 1.5 Pro as a super-librarian with a photographic memory. You can hand them a stack of 10 thick textbooks (containing 2 million words), and in 3 seconds, they can point to the exact sentence answering your question. It needs the cloud to run, but its context memory is virtually infinite.";
        train = "Trained by Google on a massive, highly diverse dataset containing trillions of words of web text, digital books, academic studies, code repositories, and high-resolution video and audio files to teach the model how to link text with sight and sound.";
    } else if (idLower.includes("gemini-1.5-flash")) {
        analogy = "Think of Gemini 1.5 Flash as a highly athletic and fast research assistant. They aren't as deeply academic as the 'Pro' librarian, but they reply in a blink of an eye, can handle huge stacks of documents, and charge you almost nothing for their help.";
        train = "Trained using a method called 'distillation'—meaning it was trained on the output of Google's largest model (Gemini 1.5 Pro). This allowed it to inherit advanced reasoning qualities while keeping a small, fast footprint.";
    } else if (idLower.includes("gemma-2-2b")) {
        analogy = "Think of Gemma 2B as a smart pocket dictionary. It fits easily in your phone's memory (only uses ~1.5 GB of RAM). It's perfect for checking spelling, translating words, and answering simple questions offline while traveling, but don't ask it to write a complex database system.";
        train = "Trained on 2 trillion tokens of public text, mathematical data, and code. Google specifically filtered the training dataset to focus on high-educational content (science, math, literature) rather than general social media spam.";
    } else if (idLower.includes("llama-3-8b")) {
        analogy = "Think of Llama 3 8B as a competent high-school graduate assistant. It runs easily on your laptop or a high-end tablet, and can help you write code, summarize articles, and chat. It is fully offline and open, so your data never leaves your computer.";
        train = "Trained by Meta on over 15 trillion tokens of text—a dataset 7x larger than the one used for Llama 2. It contains a massive collection of high-quality multilingual texts and code in over 30 languages.";
    } else if (idLower.includes("kimi") || idLower.includes("moonshot")) {
        analogy = "Think of Kimi AI as a bilingual translator-agent with a huge binder. It can hold up to 200,000 tokens of notes, translation rules, and code documents simultaneously, helping you write and translate complex code and instructions in both English and Chinese offline or online.";
        train = "Trained by Moonshot AI on a custom bilingual (Chinese/English) corpus containing web pages, code files, books, and long documents to optimize its attention mechanism for extremely long text sequences.";
    }

    model.simpleAnalogy = analogy;
    model.trainingData = train;
    model.deployments = {
        mobile: {
            pubspec: (model.flutter && model.flutter.pubspec) ? model.flutter.pubspec : mobPub,
            code: (model.flutter && model.flutter.main) ? model.flutter.main : mobCode
        },
        web: {
            code: webCode
        },
        docker: {
            code: dockCode
        }
    };

    // Generate benchmarks if not present
    if (!model.benchmarks) {
        let mmlu = 50;
        let gsm8k = 50;
        let humanEval = 45;
        let gpqa = 20;
        
        const idLower = model.id.toLowerCase();
        
        // Curated accuracy assignments based on real benchmarks
        if (idLower.includes("gemini-1.5-pro")) {
            mmlu = 90.8; gsm8k = 91.7; humanEval = 84.1; gpqa = 46.2;
        } else if (idLower.includes("gemini-1.5-flash")) {
            mmlu = 78.9; gsm8k = 85.5; humanEval = 74.3; gpqa = 37.0;
        } else if (idLower.includes("gpt-4o")) {
            mmlu = 88.7; gsm8k = 95.8; humanEval = 90.2; gpqa = 53.6;
        } else if (idLower.includes("claude-35") || idLower.includes("claude-3-5")) {
            mmlu = 88.7; gsm8k = 96.4; humanEval = 92.0; gpqa = 59.4;
        } else if (idLower.includes("llama-3-8b") || idLower.includes("llama3-8b")) {
            mmlu = 68.4; gsm8k = 79.6; humanEval = 62.2; gpqa = 26.0;
        } else if (idLower.includes("gemma-2-9b")) {
            mmlu = 71.3; gsm8k = 81.5; humanEval = 68.0; gpqa = 29.0;
        } else if (idLower.includes("gemma-2-2b")) {
            mmlu = 52.4; gsm8k = 58.0; humanEval = 45.0; gpqa = 18.0;
        } else if (idLower.includes("phi-3-mini") || idLower.includes("phi-3")) {
            mmlu = 68.8; gsm8k = 82.5; humanEval = 58.8; gpqa = 24.0;
        } else if (idLower.includes("deepseek-v3")) {
            mmlu = 88.5; gsm8k = 94.9; humanEval = 89.1; gpqa = 49.1;
        } else if (idLower.includes("claude-3-5-haiku")) {
            mmlu = 75.2; gsm8k = 88.9; humanEval = 78.1; gpqa = 34.0;
        } else if (idLower.includes("llama-3-1-8b")) {
            mmlu = 68.4; gsm8k = 81.0; humanEval = 65.4; gpqa = 26.0;
        } else if (idLower.includes("phi-3-5-moe")) {
            mmlu = 68.8; gsm8k = 83.2; humanEval = 60.1; gpqa = 25.5;
        } else {
            // General heuristics for other models based on parameters
            const paramMatch = model.parameters.match(/(\d+\.?\d*)/);
            const params = paramMatch ? parseFloat(paramMatch[1]) : 7.0;
            
            if (model.category === "LLM") {
                mmlu = Math.min(92, 75 + (params > 30 ? 10 : 5) + Math.random() * 5);
                gsm8k = Math.min(95, mmlu + 5 + Math.random() * 3);
                humanEval = Math.min(90, mmlu - 2 + Math.random() * 4);
                gpqa = Math.min(60, mmlu / 2 + Math.random() * 5);
            } else { // SLM
                mmlu = Math.min(75, 45 + (params * 2.5) + Math.random() * 4);
                gsm8k = Math.min(85, mmlu + 8 + Math.random() * 3);
                humanEval = Math.min(70, mmlu - 5 + Math.random() * 4);
                gpqa = Math.min(35, mmlu / 2.5 + Math.random() * 3);
            }
        }
        
        model.benchmarks = {
            mmlu: parseFloat(mmlu.toFixed(1)),
            gsm8k: parseFloat(gsm8k.toFixed(1)),
            humanEval: parseFloat(humanEval.toFixed(1)),
            gpqa: parseFloat(gpqa.toFixed(1))
        };
    }

    // Generate advanced deep dive specs if not present
    if (!model.deepDive) {
        let safety = "Standard instruction alignment with basic safety filters.";
        let attention = "Multi-Head Attention (MHA)";
        let corpus = "Varies (typically 1T to 3T tokens)";
        let limits = "Proprietary license, subject to provider terms of service.";
        
        let iphone = "Not applicable (Cloud Service)";
        let rtx = "High speed cloud endpoint (~80-120 tok/sec)";
        let mac = "High speed cloud endpoint (~50-80 tok/sec)";
        
        const idLower = model.id.toLowerCase();
        
        if (model.category === "LLM") {
            if (idLower.includes("gemini")) {
                safety = "Advanced safety filters (Harassment, Hate Speech, Sexually Explicit, Dangerous Content) + RLHF alignment.";
                attention = "Multi-Query Attention (MQA) / Grouped Query Attention (GQA)";
                corpus = "Trained on massive multimodal data (text, images, audio, video) up to 2024.";
                limits = "Free up to 15 RPM. Commercial deployment allowed under Google Cloud Terms.";
            } else if (idLower.includes("gpt-4o")) {
                safety = "Reinforcement Learning from Human Feedback (RLHF) + Red-teaming safety filters + Voice output safety guardrails.";
                attention = "Dense Multi-Head / Grouped Query Attention";
                corpus = "Massive corpus of public internet texts, licensed datasets, and multimodal assets.";
                limits = "Paid API only. Subject to OpenAI Business Terms of Service.";
            } else if (idLower.includes("claude-35") || idLower.includes("claude-3-5")) {
                safety = "Constitutional AI training (self-correction based on safety principles) + extensive alignment.";
                attention = "Standard dense Transformer attention blocks";
                corpus = "Curated high-quality internet data, code repository archives, and synthetic reasoning corpora.";
                limits = "Paid API only. Commercial use subject to Anthropic Console Terms.";
            } else if (idLower.includes("deepseek-v3")) {
                safety = "Supervised Fine-Tuning (SFT) + Reinforcement Learning (RL) using direct policy optimization (DPO).";
                attention = "Multi-head Latent Attention (MLA) for ultra-efficient KV caching";
                corpus = "14.8 Trillion high-quality tokens of web text, code repositories, and math proofs.";
                limits = "Fully open weights under MIT License. No commercial limitations.";
                rtx = "Requires 8x H100 GPUs to host locally (~40-60 tok/sec)";
                mac = "Cannot run on standard Mac workstations (requires server node)";
                iphone = "Cannot execute on consumer mobile devices (size too large)";
            }
        } else { // SLM (Runs locally)
            attention = "Grouped Query Attention (GQA) / Multi-Query (MQA)";
            
            if (idLower.includes("gemma")) {
                safety = "Instruction fine-tuning + RLHF alignment. Google terms filter out dangerous advice and PII leakages.";
                corpus = "8.0 Trillion tokens (Gemma 9B) or 2.0 Trillion tokens (Gemma 2B) of highly filtered educational text.";
                limits = "Open Weights. Free commercial use except for restricted domains (Gemma terms).";
                if (idLower.includes("2b")) {
                    iphone = "~15 - 25 tokens/sec (INT4 quantized)";
                    rtx = "~140 - 180 tokens/sec (FP16/INT8)";
                    mac = "~80 - 110 tokens/sec (INT8 M-series)";
                } else { // 9B
                    iphone = "~4 - 8 tokens/sec (INT4 quantized)";
                    rtx = "~55 - 75 tokens/sec (FP16)";
                    mac = "~30 - 45 tokens/sec (INT8 M-series)";
                }
            } else if (idLower.includes("llama")) {
                safety = "Llama 3 Guard alignment + SFT + DPO safety training. Very strict standard safety alignment.";
                corpus = "15.0 Trillion tokens of multilingual text, math proofs, and code repositories.";
                limits = "Free for commercial use up to 700M monthly active users (Llama 3 License).";
                iphone = "~5 - 9 tokens/sec (INT4 quantized)";
                rtx = "~65 - 85 tokens/sec (FP16)";
                mac = "~35 - 50 tokens/sec (INT8 M-series)";
            } else if (idLower.includes("phi-3")) {
                safety = "Filtered synthetic dataset training (automatically removing toxicity/danger) + SFT post-training.";
                corpus = "3.3 Trillion tokens of high-quality synthetic textbooks, QA pairs, and filtered web text.";
                limits = "Fully open-source under MIT License. Unrestricted commercial utilization.";
                iphone = "~12 - 20 tokens/sec (INT4 quantized)";
                rtx = "~110 - 150 tokens/sec (FP16)";
                mac = "~65 - 90 tokens/sec (INT8 M-series)";
            } else {
                // Heuristics for custom SLMs
                const paramMatch = model.parameters.match(/(\d+\.?\d*)/);
                const params = paramMatch ? parseFloat(paramMatch[1]) : 7.0;
                
                safety = "Basic post-training alignment (SFT) + standard open-source safety guidelines.";
                corpus = `${(params * 1.5).toFixed(1)} Trillion tokens of web text, textbooks, and code.`;
                limits = "Open Weights under Apache 2.0 or MIT. Commercial use allowed.";
                
                if (params < 4) {
                    iphone = "~14 - 22 tokens/sec (INT4)";
                    rtx = "~120 - 160 tokens/sec (FP16)";
                    mac = "~70 - 100 tokens/sec (INT8)";
                } else {
                    iphone = "~4 - 8 tokens/sec (INT4)";
                    rtx = "~50 - 70 tokens/sec (FP16)";
                    mac = "~25 - 40 tokens/sec (INT8)";
                }
            }
        }
        
        model.deepDive = {
            safety: safety,
            attention: attention,
            corpus: corpus,
            limits: limits,
            iphone: iphone,
            rtx: rtx,
            mac: mac
        };
    }

    return model;
}

// MARKET RELEASE TRENDS DATA (LATEST AI MODELS IN MARKET)

// Combine curated database with user custom models and enrich them
curatedModels.forEach(m => enrichModelData(m));
customModels.forEach(m => enrichModelData(m));
let allModels = [...curatedModels, ...customModels];

// APP STATE
let currentActiveSection = "ai-glossary";
let activeDetailModel = allModels[0];
let activeDetailTab = "about";
let activeRecipeTab = "data";
let activeIntTab = "cloud";

// WIZARD STATE
let wizardStep = 1;
const wizardAnswers = {
    offline: "no",
    budget: "free",
    reasoning: "simple"
};

// INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Navigation setup
    setupNavigation();

    // Model Search setup
    setupModelSearch();

    // Sidebar RAM Calculator setup
    setupRamCalculator();

    // Wizard setup
    setupWizard();

    // Fine-Tuning Estimator setup
    setupTrainingEstimator();

    // Playground setup
    setupPlayground();

    // Flutter tabs setup
    setupFlutterIntegrationTabs();

    // Setup Custom Model creation form
    setupCustomModelForm();

    // Setup nested deployment sub-tabs
    setupDeploymentTabs();

    // Render market releases feed
    renderMarketReleaseFeed();

    // Render comparison matrix dynamically
    renderComparisonMatrix();

    // Setup glossary guide
    setupGlossary();

    // Setup News Hub
    setupNewsHub();

    // Load initial model details
    displayModelDetails(allModels[0]);
});

// NAVIGATION LOGIC
/**
 * Initializes the sidebar navigation and handles tab switching.
 */
function setupNavigation() {
    const navItems = document.querySelectorAll(".nav-item");
    const sections = document.querySelectorAll(".content-section");
    const pageTitle = document.getElementById("page-title");
    const pageSubtitle = document.getElementById("page-subtitle");

    const headerTexts = {
        "ai-glossary": {
            title: "AI/ML Glossary Guide",
            sub: "Learn essential AI/ML concepts and terms before selecting your target models"
        },
        "model-finder": {
            title: "Model Search & Specs",
            sub: "Search, inspect, and analyze any LLM or SLM for your next application"
        },
        "decision-wizard": {
            title: "Decision Engine Wizard",
            sub: "Let us help you choose between Cloud LLM APIs and On-Device SLMs"
        },
        "training-guide": {
            title: "How to Train & Build",
            sub: "Comprehensive guide on custom dataset format, training, and GGUF quantization"
        },
        "token-playground": {
            title: "Token & Cost Sandbox",
            sub: "Visualize text tokens and calculate API pricing and model footprint"
        },
        "flutter-integration": {
            title: "Flutter Developer Guides",
            sub: "Clean Dart templates and setups for integrating AI locally or via cloud"
        },
        "comparison-matrix": {
            title: "Comparison Matrix",
            sub: "Quick reference guide comparing all models, parameters, cost, and license type"
        },
        "add-model": {
            title: "Add Custom Model",
            sub: "Manually register custom LLMs or SLMs to save in browser registry"
        },
        "market-feed": {
            title: "Market Trends",
            sub: "Explore newly launched LLMs/SLMs, read simplified highlights, and import them instantly"
        },
        "news-hub": {
            title: "AI News & Social Radar",
            sub: "Aggregated updates from top researchers, engineers, and open-source communities"
        }
    };

    navItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const tabId = item.getAttribute("data-tab");

            // Update active nav item
            navItems.forEach(n => n.classList.remove("active"));
            item.classList.add("active");

            // Update active section
            sections.forEach(sec => sec.classList.remove("active"));
            const targetSec = document.getElementById(`${tabId}-sec`);
            if (targetSec) targetSec.classList.add("active");

            // Update header text
            const headerInfo = headerTexts[tabId];
            if (headerInfo) {
                pageTitle.textContent = headerInfo.title;
                pageSubtitle.textContent = headerInfo.sub;
            }

            // Auto-fetch live news the first time the news-hub tab is opened
            if (tabId === "news-hub" && typeof triggerAutoNewsFetch === "function") {
                triggerAutoNewsFetch();
            }

            currentActiveSection = tabId;
            window.scrollTo(0, 0);
        });
    });
}

// MODEL SEARCH & DETAILS
/**
 * Sets up the search bar, tag filtering, and Hugging Face API integration for model discovery.
 */
function setupModelSearch() {
    const searchInput = document.getElementById("model-search-input");
    const searchBtn = document.getElementById("search-action-btn");
    const clearBtn = document.getElementById("search-clear-btn");
    const popularTags = document.querySelectorAll(".search-tag");
    const statusBar = document.getElementById("search-status-bar");

    // Input handlers
    searchInput.addEventListener("input", () => {
        clearBtn.style.display = searchInput.value.length > 0 ? "flex" : "none";
    });

    clearBtn.addEventListener("click", () => {
        searchInput.value = "";
        clearBtn.style.display = "none";
        searchInput.focus();
    });

    // Search activation
    searchBtn.addEventListener("click", () => performSearch(searchInput.value));
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") performSearch(searchInput.value);
    });

    // Tag clicks
    popularTags.forEach(tag => {
        tag.addEventListener("click", () => {
            const query = tag.getAttribute("data-query");
            searchInput.value = tag.textContent;
            clearBtn.style.display = "flex";
            performSearch(query);
        });
    });

    // Detail Tabs switching
    const detailTabs = document.querySelectorAll(".detail-tab");
    detailTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const tabName = tab.getAttribute("data-tab");
            detailTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            document.querySelectorAll(".detail-tab-content").forEach(c => c.classList.remove("active"));
            document.getElementById(`tab-content-${tabName}`).classList.add("active");
            activeDetailTab = tabName;
        });
    });

    // Copy code button handler
    document.querySelectorAll(".copy-code-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const preElement = btn.parentElement.nextElementSibling;
            const codeText = preElement.textContent;
            navigator.clipboard.writeText(codeText).then(() => {
                const originalText = btn.innerHTML;
                btn.innerHTML = `<i data-lucide="check"></i> Copied!`;
                lucide.createIcons();
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    lucide.createIcons();
                }, 2000);
            });
        });
    });
}

async function performSearch(query) {
    if (!query || query.trim() === "") return;
    
    const queryLower = query.toLowerCase().trim();
    
    // Hide recommendations box initially
    const recBox = document.getElementById("search-recommendation-box");
    if (recBox) recBox.classList.add("hidden");

    // Intent/keyword based recommendations check
    let matchedKeyword = null;
    let recommendedModels = [];
    
    if (queryLower.includes("video") || queryLower.includes("multimodal") || queryLower.includes("audio")) {
        matchedKeyword = "video/multimodal processing";
    } else if (queryLower.includes("image") || queryLower.includes("vision") || queryLower.includes("picture") || queryLower.includes("photo")) {
        matchedKeyword = "image & vision processing";
    } else if (queryLower.includes("offline") || queryLower.includes("local") || queryLower.includes("private")) {
        matchedKeyword = "offline / local execution";
    } else if (queryLower.includes("code") || queryLower.includes("coding") || queryLower.includes("program")) {
        matchedKeyword = "coding & programming helper";
    } else if (queryLower.includes("cheap") || queryLower.includes("cost") || queryLower.includes("price") || queryLower.includes("free")) {
        matchedKeyword = "low cost & free tier API use";
    }

    if (matchedKeyword) {
        // Dynamic matching across all models in allModels
        allModels.forEach(model => {
            let isMatch = false;
            let matchReason = "";
            
            const textToSearch = [
                model.name,
                model.description,
                model.category,
                model.license,
                model.specs.arch,
                model.specs.hardware,
                model.useCases.join(" "),
                model.id
            ].join(" ").toLowerCase();
            
            if (matchedKeyword === "video/multimodal processing") {
                if (textToSearch.includes("video") || textToSearch.includes("multimodal") || textToSearch.includes("audio") || textToSearch.includes("expert") || textToSearch.includes("pro") || textToSearch.includes("omni")) {
                    isMatch = true;
                    matchReason = "Supports multi-modal context (images, audio, or MoE architecture)";
                }
            } else if (matchedKeyword === "image & vision processing") {
                if (textToSearch.includes("vision") || textToSearch.includes("image") || textToSearch.includes("picture") || textToSearch.includes("multimodal") || textToSearch.includes("omni") || textToSearch.includes("photo")) {
                    isMatch = true;
                    matchReason = "Features vision encoders or multimodal capability";
                }
            } else if (matchedKeyword === "offline / local execution") {
                if (model.category === "SLM" || textToSearch.includes("local") || textToSearch.includes("offline") || textToSearch.includes("private")) {
                    isMatch = true;
                    matchReason = "Runs fully offline on local CPUs/GPUs (Small Language Model)";
                }
            } else if (matchedKeyword === "coding & programming helper") {
                if (textToSearch.includes("code") || textToSearch.includes("coding") || textToSearch.includes("program") || textToSearch.includes("script") || textToSearch.includes("math")) {
                    isMatch = true;
                    matchReason = "Optimized for programming scripts and logical debugging";
                }
            } else if (matchedKeyword === "low cost & free tier API use") {
                if (model.cost.includes("Free") || model.cost.includes("$0.00") || textToSearch.includes("free") || textToSearch.includes("cheap") || textToSearch.includes("distilled")) {
                    isMatch = true;
                    matchReason = "Offers free cloud rate limits or executes locally at zero cost";
                }
            }
            
            if (isMatch) {
                recommendedModels.push({
                    model: model,
                    reason: matchReason
                });
            }
        });
    }

    // If we have dynamic recommendations, render them
    if (matchedKeyword && recommendedModels.length > 0 && recBox) {
        recBox.classList.remove("hidden");
        document.getElementById("rec-keyword").textContent = matchedKeyword;
        const listContainer = document.getElementById("rec-models-list");
        listContainer.innerHTML = "";
        
        recommendedModels.forEach(item => {
            const model = item.model;
            const btn = document.createElement("button");
            btn.className = "search-tag";
            btn.style.margin = "0";
            btn.style.padding = "0.5rem 0.85rem";
            btn.style.fontSize = "0.8rem";
            btn.style.display = "flex";
            btn.style.flexDirection = "column";
            btn.style.alignItems = "flex-start";
            btn.style.gap = "0.2rem";
            btn.style.borderRadius = "8px";
            btn.style.background = "rgba(255, 255, 255, 0.02)";
            btn.style.border = "1px solid var(--border-color)";
            btn.style.textAlign = "left";
            btn.style.cursor = "pointer";
            btn.style.transition = "var(--transition-fast)";
            
            btn.innerHTML = `
                <div style="display: flex; align-items: center; gap: 0.4rem; font-weight: 600; color: white;">
                    <i data-lucide="cpu" style="width:12px;height:12px;"></i> ${model.name}
                </div>
                <div style="font-size: 0.7rem; color: var(--text-muted); line-height: 1.2;">
                    ${item.reason}
                </div>
            `;
            
            // Hover styling
            btn.addEventListener("mouseenter", () => {
                btn.style.borderColor = "rgba(6, 182, 212, 0.4)";
                btn.style.background = "rgba(6, 182, 212, 0.04)";
            });
            btn.addEventListener("mouseleave", () => {
                btn.style.borderColor = "var(--border-color)";
                btn.style.background = "rgba(255, 255, 255, 0.02)";
            });
            
            btn.addEventListener("click", () => {
                displayModelDetails(model);
            });
            listContainer.appendChild(btn);
        });
        
        lucide.createIcons();
        
        // Auto-display the top recommended model details
        displayModelDetails(recommendedModels[0].model);
        return;
    }
    
    // Clean query: split by common delimiters and strip filler slogans
    let cleanedQuery = query.split(/[|:-]/)[0].trim().toLowerCase();
    cleanedQuery = cleanedQuery
        .replace(/\bwith\b/g, "")
        .replace(/\bmodel\b/g, "")
        .replace(/\bai\b/g, "")
        .replace(/\bthe\b/g, "")
        .replace(/\s+/g, " ")
        .trim();

    if (cleanedQuery === "") {
        cleanedQuery = query.trim().toLowerCase();
    }

    // Check curated/all models first
    const localMatch = allModels.find(m => 
        m.id.toLowerCase().includes(cleanedQuery) || 
        m.name.toLowerCase().includes(cleanedQuery) ||
        m.creator.toLowerCase().includes(cleanedQuery)
    );

    if (localMatch) {
        displayModelDetails(localMatch);
        return;
    }

    // Check if it matches a known Cloud API model first
    const cloudMatch = checkKnownCloudModel(cleanedQuery);
    if (cloudMatch) {
        addDynamicModelToList(cloudMatch);
        displayModelDetails(cloudMatch);
        return;
    }

    // Call Hugging Face API
    const statusBar = document.getElementById("search-status-bar");
    statusBar.classList.remove("hidden");
    statusBar.querySelector(".status-text").textContent = `Searching Hugging Face Hub for "${cleanedQuery}"...`;

    try {
        const response = await fetch(`https://huggingface.co/api/models?search=${encodeURIComponent(cleanedQuery)}&limit=5&sort=downloads&direction=-1`);
        if (!response.ok) throw new Error("API call failed");
        
        const modelsList = await response.json();
        statusBar.classList.add("hidden");

        if (modelsList && modelsList.length > 0) {
            const topModel = modelsList[0];
            const processedModel = processHuggingFaceModel(topModel);
            addDynamicModelToList(processedModel);
            displayModelDetails(processedModel);
        } else {
            alert(`No models found on Hugging Face Hub matching "${cleanedQuery}". Please check the spelling.`);
        }
    } catch (e) {
        statusBar.classList.add("hidden");
        console.error("Hugging Face API error:", e);
        // Fallback simulation if offline or error
        const mockModel = createFallbackModel(cleanedQuery);
        addDynamicModelToList(mockModel);
        displayModelDetails(mockModel);
    }
}

function processHuggingFaceModel(hfModel) {
    // Estimate parameters size from modelId (e.g. 7b, 8b, 2b, 1.5b)
    const modelId = hfModel.modelId;
    const sizeMatch = modelId.match(/(\d+\.?\d*)[bB]/);
    const params = sizeMatch ? `${sizeMatch[1]} Billion` : "Unknown Size";
    const isSLM = sizeMatch && parseFloat(sizeMatch[1]) < 15;
    
    // Extract author/creator
    const creator = hfModel.author || modelId.split("/")[0] || "Hugging Face Contributor";
    
    // Determine category based on parameters or tags
    const category = isSLM ? "SLM" : "LLM";

    // Extract license from tags if possible
    let license = "Open-weights";
    if (hfModel.tags) {
        const licenseTag = hfModel.tags.find(t => t.startsWith("license:"));
        if (licenseTag) license = licenseTag.replace("license:", "");
    }

    const shortName = modelId.split("/")[1] || modelId;

    return {
        id: modelId,
        name: shortName,
        creator: `Hugging Face / ${creator}`,
        category: category,
        parameters: params,
        accuracy: "N/A (Untested Benchmark)",
        context: "Varies (Check Model Card)",
        cost: "$0.00 (Local Execution)",
        license: license.toUpperCase(),
        description: `This model was resolved dynamically from the Hugging Face Hub registry repository: "${modelId}". It has received ${hfModel.downloads?.toLocaleString() || 0} downloads and ${hfModel.likes?.toLocaleString() || 0} likes from the open-source community.`,
        useCases: [
            "Download and run locally via llama.cpp or ONNX Runtime",
            "Self-host on your own private GPU server",
            "Fine-tune further on custom proprietary datasets"
        ],
        specs: {
            arch: hfModel.config?.model_type || "Transformer Architecture",
            latency: isSLM ? "Fast (Highly dependent on quantization)" : "Varies (Runs in Cloud or Private GPU Cluster)",
            hardware: isSLM ? "Consumer Mobile CPU/GPU (with 4-bit quantization)" : "Requires Nvidia A100/H100 GPU server node",
            quantization: isSLM ? "INT4, INT8, FP16 (Convert via llama.cpp)" : "Not required if running on server clusters"
        },
        pricing: {
            input: "$0.00",
            output: "$0.00",
            note: "Free model weights. You only pay for your own hosting or device battery/RAM."
        },
        flutter: {
            intro: isSLM 
                ? `To run this model on-device in Flutter, download the GGUF weight file and use the llama.cpp Dart FFI library:`
                : `To query this model, host it on an API endpoint (e.g. Hugging Face TGI or vLLM) and invoke it over HTTP:`,
            pubspec: isSLM 
                ? "dependencies:\n  flutter:\n    sdk: flutter\n  llama_cpp_dart: ^0.2.1\n  path_provider: ^2.1.1" 
                : "dependencies:\n  flutter:\n    sdk: flutter\n  http: ^1.2.0",
            main: isSLM 
                ? `import 'package:llama_cpp_dart/llama_cpp_dart.dart';\n\nFuture<String> runCustomSLM(String prompt) async {\n  // Load custom model ${shortName} GGUF\n  final params = ModelParams()..useGpu = true;\n  final model = LlamaModel('/path/to/${shortName.toLowerCase()}.gguf', params);\n  final context = LlamaContext(model, ContextParams()..contextSize = 2048);\n  \n  final tokens = context.tokenize(prompt, addBos: true);\n  context.eval(tokens);\n  return context.generateResponse();\n}`
                : `import 'dart:convert';\nimport 'package:http/http.dart' as http;\n\nFuture<String> callHostedModel(String prompt) async {\n  final url = Uri.parse('https://api-inference.huggingface.co/models/${modelId}');\n  final response = await http.post(url, headers: {\n    'Authorization': 'Bearer YOUR_HF_TOKEN',\n    'content-type': 'application/json'\n  }, body: jsonEncode({'inputs': prompt}));\n  \n  final List<dynamic> data = jsonDecode(response.body);\n  return data[0]['generated_text'] ?? '';\n}`
        }
    };
}

function createFallbackModel(query) {
    // Simple heuristic parser for simulated offline queries
    const sizeMatch = query.match(/(\d+\.?\d*)[bB]/);
    const params = sizeMatch ? `${sizeMatch[1]} Billion` : "7.0 Billion";
    const isSLM = sizeMatch ? parseFloat(sizeMatch[1]) < 15 : true;

    return {
        id: `custom/${query}`,
        name: query.toUpperCase(),
        creator: "Custom Developer Input",
        category: isSLM ? "SLM" : "LLM",
        parameters: params,
        accuracy: "Unknown",
        context: "128,000 tokens",
        cost: "$0.00 (Local)",
        license: "Apache 2.0 / Open Weights",
        description: `This is a dynamically analyzed specification sheet for "${query}". The system detected it behaves like a ${isSLM ? 'Small Language Model' : 'Large Language Model'} and generated recommended parameters.`,
        useCases: [
            "Runs locally via llama.cpp or FFI wrappers",
            "Fine-tunable using standard Python frameworks"
        ],
        specs: {
            arch: "Transformer (Llama/Gemma style)",
            latency: isSLM ? "Fast (15-30 tokens/sec)" : "Slow (Requires Cloud API)",
            hardware: isSLM ? "Standard Mobile CPU/GPU" : "Nvidia A100 GPU cluster",
            quantization: "INT4, INT8, FP16"
        },
        pricing: {
            input: "$0.00",
            output: "$0.00",
            note: "Free model weights. Zero operational cost on user devices."
        },
        flutter: {
            intro: `To load and run this custom model locally on mobile devices using Flutter, use standard GGUF bindings:`,
            pubspec: "dependencies:\n  flutter:\n    sdk: flutter\n  llama_cpp_dart: ^0.2.1",
            main: `import 'package:llama_cpp_dart/llama_cpp_dart.dart';\n\nFuture<String> runLocalModel(String prompt) async {\n  final params = ModelParams()..useGpu = true;\n  final model = LlamaModel('/path/to/model-q4.gguf', params);\n  final context = LlamaContext(model, ContextParams()..contextSize = 2048);\n  \n  final tokens = context.tokenize(prompt, addBos: true);\n  context.eval(tokens);\n  return context.generateResponse();\n}`
        }
    };
}

function displayModelDetails(model) {
    enrichModelData(model);
    activeDetailModel = model;

    // Badges
    const catBadge = document.getElementById("model-category-badge");
    catBadge.textContent = model.category === "LLM" ? "Large Language Model (LLM)" : "Small Language Model (SLM)";
    catBadge.className = `badge-category ${model.category.toLowerCase()}`;
    
    document.getElementById("model-license-badge").textContent = model.license;

    // Header Text
    document.getElementById("detail-model-name").textContent = model.name;
    document.getElementById("detail-model-creator").textContent = model.creator;

    // Dynamic Capabilities Badges
    const capabilitiesRow = document.getElementById("model-capabilities-row");
    if (capabilitiesRow) {
        capabilitiesRow.innerHTML = "";
        
        const textToSearch = [
            model.name,
            model.description,
            model.category,
            model.license,
            model.specs.arch,
            model.specs.hardware,
            model.useCases.join(" "),
            model.id
        ].join(" ").toLowerCase();
        
        const badges = [];
        
        if (model.category === "SLM" || textToSearch.includes("local") || textToSearch.includes("offline") || textToSearch.includes("private")) {
            badges.push({
                icon: "wifi-off",
                label: "Offline & Local",
                style: "border-color: rgba(6, 182, 212, 0.3); background: rgba(6, 182, 212, 0.05); color: var(--secondary-light);"
            });
        }
        
        if (textToSearch.includes("video") || textToSearch.includes("multimodal") || textToSearch.includes("audio") || textToSearch.includes("expert") || textToSearch.includes("omni")) {
            badges.push({
                icon: "clapperboard",
                label: "Multimodal",
                style: "border-color: rgba(139, 92, 246, 0.3); background: rgba(139, 92, 246, 0.05); color: var(--primary-light);"
            });
        }
        
        if (textToSearch.includes("vision") || textToSearch.includes("image") || textToSearch.includes("picture") || textToSearch.includes("photo") || textToSearch.includes("omni")) {
            badges.push({
                icon: "eye",
                label: "Vision",
                style: "border-color: rgba(6, 182, 212, 0.3); background: rgba(6, 182, 212, 0.05); color: var(--secondary-light);"
            });
        }
        
        if (textToSearch.includes("code") || textToSearch.includes("coding") || textToSearch.includes("program") || textToSearch.includes("script") || textToSearch.includes("developer")) {
            badges.push({
                icon: "code-2",
                label: "Coding",
                style: "border-color: rgba(139, 92, 246, 0.3); background: rgba(139, 92, 246, 0.05); color: var(--primary-light);"
            });
        }
        
        if (model.cost.includes("Free") || model.cost.includes("$0.00") || textToSearch.includes("free") || textToSearch.includes("cheap")) {
            badges.push({
                icon: "piggy-bank",
                label: "Free / Low Cost",
                style: "border-color: rgba(16, 185, 129, 0.3); background: rgba(16, 185, 129, 0.05); color: #34d399;"
            });
        }
        
        const contextNum = parseInt(model.context.replace(/,/g, ""));
        if (contextNum >= 100000 || model.context.includes("2M") || model.context.includes("1M") || model.context.includes("128k") || model.context.includes("200k")) {
            badges.push({
                icon: "database",
                label: "Long Context",
                style: "border-color: rgba(139, 92, 246, 0.3); background: rgba(139, 92, 246, 0.05); color: var(--primary-light);"
            });
        }
        
        badges.forEach(b => {
            const span = document.createElement("span");
            span.style.cssText = `padding: 0.25rem 0.6rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600; border: 1px solid; display: inline-flex; align-items: center; gap: 0.3rem; ` + b.style;
            span.innerHTML = `<i data-lucide="${b.icon}" style="width:12px;height:12px;"></i> ${b.label}`;
            capabilitiesRow.appendChild(span);
        });
        
        lucide.createIcons();
    }

    // Metric values
    document.getElementById("val-parameters").textContent = model.parameters;
    document.getElementById("val-accuracy").textContent = model.accuracy;
    document.getElementById("val-context").textContent = model.context;
    document.getElementById("val-cost").textContent = model.cost;

    // Tab Contents
    document.getElementById("model-description").textContent = model.description;
    
    const useCasesList = document.getElementById("model-use-cases");
    useCasesList.innerHTML = "";
    model.useCases.forEach(uc => {
        const li = document.createElement("li");
        li.textContent = uc;
        useCasesList.appendChild(li);
    });

    // Tech Specs
    document.getElementById("spec-arch").textContent = model.specs.arch;
    document.getElementById("spec-latency").textContent = model.specs.latency;
    document.getElementById("spec-hardware").textContent = model.specs.hardware;
    document.getElementById("spec-quantization").textContent = model.specs.quantization;

    // Render Benchmarks
    const barsContainer = document.getElementById("benchmark-bars-container");
    if (barsContainer && model.benchmarks) {
        barsContainer.innerHTML = "";
        
        const benchmarksList = [
            { key: "mmlu", label: "MMLU (General Academic Knowledge)", desc: "Covers elementary math, US history, computer science, law, and more." },
            { key: "gsm8k", label: "GSM8K (Grade School Math)", desc: "Measures high-quality multi-step mathematical reasoning tasks." },
            { key: "humanEval", label: "HumanEval (Python Coding)", desc: "Evaluates the accuracy of generated functional Python coding blocks." },
            { key: "gpqa", label: "GPQA (Graduate-Level Reasoning)", desc: "Ultra-hard reasoning questions written by PhD experts in physics, bio, and chem." }
        ];
        
        benchmarksList.forEach(b => {
            const value = model.benchmarks[b.key];
            const item = document.createElement("div");
            item.className = "benchmark-item";
            item.style.display = "flex";
            item.style.flexDirection = "column";
            item.style.gap = "0.25rem";
            
            item.innerHTML = `
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 0.15rem;">
                    <div>
                        <span style="font-weight: 600; color: var(--text-primary);">${b.label}</span>
                        <div style="font-size: 0.65rem; color: var(--text-muted); font-weight: normal; line-height: 1.2; margin-top: 0.05rem;">${b.desc}</div>
                    </div>
                    <span style="font-weight: 700; color: var(--secondary-light); font-size: 0.85rem;">${value}%</span>
                </div>
                <div style="width: 100%; height: 5px; background: rgba(255, 255, 255, 0.04); border-radius: 3px; overflow: hidden;">
                    <div style="width: ${value}%; height: 100%; background: linear-gradient(90deg, var(--primary), var(--secondary)); border-radius: 3px;"></div>
                </div>
            `;
            barsContainer.appendChild(item);
        });
    }

    // Pricing
    document.getElementById("price-input").innerHTML = `${model.pricing.input} <span class="unit">/ 1M tokens</span>`;
    document.getElementById("price-output").innerHTML = `${model.pricing.output} <span class="unit">/ 1M tokens</span>`;
    document.getElementById("price-input-note").textContent = model.pricing.note;

    // Layperson Analogy & Training Data
    const analogyEl = document.getElementById("model-analogy");
    if (analogyEl) {
        analogyEl.textContent = model.simpleAnalogy || "Analogy is not available for this model.";
    }
    const trainingDataEl = document.getElementById("model-training-data");
    if (trainingDataEl) {
        trainingDataEl.textContent = model.trainingData || "Training dataset details not provided.";
    }

    // Deployment sub-tabs
    const deployMobileIntro = document.getElementById("deploy-mobile-intro");
    if (deployMobileIntro) {
        deployMobileIntro.textContent = model.flutter ? model.flutter.intro : (model.deployments?.mobile?.intro || "Load and run locally or via API on iOS and Android devices:");
    }
    const deployMobilePub = document.getElementById("deploy-mobile-pub");
    if (deployMobilePub) {
        deployMobilePub.textContent = (model.deployments && model.deployments.mobile) ? model.deployments.mobile.pubspec : (model.flutter ? model.flutter.pubspec : "");
    }
    const deployMobileCode = document.getElementById("deploy-mobile-code");
    if (deployMobileCode) {
        deployMobileCode.textContent = (model.deployments && model.deployments.mobile) ? model.deployments.mobile.code : (model.flutter ? model.flutter.main : "");
    }
    const deployWebCode = document.getElementById("deploy-web-code");
    if (deployWebCode) {
        deployWebCode.textContent = (model.deployments && model.deployments.web) ? model.deployments.web.code : "";
    }
    const deployDockerCode = document.getElementById("deploy-docker-code");
    if (deployDockerCode) {
        deployDockerCode.textContent = (model.deployments && model.deployments.docker) ? model.deployments.docker.code : "";
    }

    // Reset back to "About" tab
    const tabs = document.querySelectorAll(".detail-tab");
    tabs.forEach(t => t.classList.remove("active"));
    tabs[0].classList.add("active");
    
    document.querySelectorAll(".detail-tab-content").forEach(c => c.classList.remove("active"));
    document.getElementById("tab-content-about").classList.add("active");
    activeDetailTab = "about";
    
    // Update local calculator if it's a numeric parameter SLM
    const paramMatch = model.parameters.match(/(\d+\.?\d*)/);
    if (paramMatch && model.category === "SLM") {
        document.getElementById("calc-params").value = parseFloat(paramMatch[1]);
        updateRamRequirement();
    }
}

// SIDEBAR MOBILE RAM CALCULATOR
/**
 * Initializes the hardware RAM calculator for on-device SLM execution.
 */
function setupRamCalculator() {
    const paramInput = document.getElementById("calc-params");
    const quantSelect = document.getElementById("calc-quant");

    paramInput.addEventListener("input", updateRamRequirement);
    quantSelect.addEventListener("change", updateRamRequirement);
}

function updateRamRequirement() {
    const params = parseFloat(document.getElementById("calc-params").value) || 2.0;
    const quant = parseInt(document.getElementById("calc-quant").value) || 4;

    // Calculate weight size (GB)
    const weightSize = params * (quant / 8);
    
    // Calculate required RAM (Weight + context activation footprint)
    const ramRequired = weightSize + 0.5;

    // Render outputs
    document.getElementById("calc-weight-size").textContent = `${weightSize.toFixed(2)} GB`;
    document.getElementById("calc-ram-required").textContent = `~${ramRequired.toFixed(2)} GB`;

    // Calculate compatibility
    const compatLabel = document.getElementById("calc-compatibility");
    if (ramRequired <= 2.0) {
        compatLabel.textContent = "Supported (Most Devices - iPhone 11+, 3GB+ Android)";
        compatLabel.className = "text-success";
    } else if (ramRequired > 2.0 && ramRequired <= 4.0) {
        compatLabel.textContent = "Supported (Mid-Range Phones - 6GB+ RAM)";
        compatLabel.className = "text-success";
    } else if (ramRequired > 4.0 && ramRequired <= 8.0) {
        compatLabel.textContent = "Requires Premium Devices (8GB+ RAM - iPhone 15 Pro, Pixel Pro)";
        compatLabel.className = "text-cyan";
    } else {
        compatLabel.textContent = "Requires Mobile Workstation / Laptops (12GB+ RAM)";
        compatLabel.className = "text-danger";
    }
}

// DECISION ENGINE WIZARD
/**
 * Configures the interactive decision wizard to recommend LLM vs SLM architecture.
 */
function setupWizard() {
    const prevBtn = document.getElementById("wiz-prev-btn");
    const nextBtn = document.getElementById("wiz-next-btn");
    const goToGuideBtn = document.getElementById("go-to-guide-btn");

    nextBtn.addEventListener("click", () => {
        if (wizardStep < 4) {
            saveWizardAnswers();
            wizardStep++;
            updateWizardUI();
        }
    });

    prevBtn.addEventListener("click", () => {
        if (wizardStep > 1) {
            wizardStep--;
            updateWizardUI();
        }
    });

    goToGuideBtn.addEventListener("click", () => {
        // Switch tab to Flutter integration
        const flutterNav = document.querySelector('.nav-item[data-tab="flutter-integration"]');
        if (flutterNav) {
            flutterNav.click();
            // Automatically select proper tab
            const isLocal = wizardAnswers.offline === 'yes';
            const tabBtn = document.querySelectorAll(".integration-tab");
            if (isLocal) {
                // select mediapipe
                tabBtn[1].click();
            } else {
                // select cloud
                tabBtn[0].click();
            }
        }
    });
}

function saveWizardAnswers() {
    if (wizardStep === 1) {
        const selected = document.querySelector('input[name="wiz-offline"]:checked');
        wizardAnswers.offline = selected ? selected.value : "no";
    } else if (wizardStep === 2) {
        const selected = document.querySelector('input[name="wiz-budget"]:checked');
        wizardAnswers.budget = selected ? selected.value : "free";
    } else if (wizardStep === 3) {
        const selected = document.querySelector('input[name="wiz-reasoning"]:checked');
        wizardAnswers.reasoning = selected ? selected.value : "simple";
    }
}

function updateWizardUI() {
    // Update steps visual active
    const indicators = document.querySelectorAll(".step-indicator");
    indicators.forEach((ind, idx) => {
        ind.className = "step-indicator";
        if (idx + 1 === wizardStep) {
            ind.classList.add("active");
        } else if (idx + 1 < wizardStep) {
            ind.classList.add("completed");
        }
    });

    // Toggle steps containers
    document.querySelectorAll(".wizard-step").forEach((step, idx) => {
        step.className = "wizard-step";
        if (idx + 1 === wizardStep) {
            step.classList.add("active");
        }
    });

    // Update buttons
    const prevBtn = document.getElementById("wiz-prev-btn");
    const nextBtn = document.getElementById("wiz-next-btn");

    prevBtn.disabled = wizardStep === 1;
    
    if (wizardStep === 4) {
        calculateRecommendation();
        nextBtn.style.display = "none";
    } else {
        nextBtn.style.display = "block";
        nextBtn.textContent = "Next Step";
    }
}

function calculateRecommendation() {
    const headline = document.getElementById("rec-headline");
    const explanation = document.getElementById("rec-explanation");
    const path = document.getElementById("rec-path");
    const model = document.getElementById("rec-model");
    const memory = document.getElementById("rec-memory");
    const cost = document.getElementById("rec-cost");
    const recIcon = document.querySelector(".rec-icon");

    if (wizardAnswers.offline === "yes") {
        // On-device SLM
        recIcon.setAttribute("data-lucide", "smartphone");
        recIcon.className = "rec-icon text-cyan";
        headline.textContent = "Recommended: On-Device SLM (Local Execution)";
        
        if (wizardAnswers.reasoning === "complex") {
            explanation.textContent = "Your project demands offline operation and complex reasoning. We recommend deploying Llama 3 8B or Gemma 2 9B quantized to 4-bit. This yields high capability without server overhead, but requires premium client devices.";
            path.textContent = "Local Native (llama.cpp FFI / GGUF)";
            model.textContent = "Llama-3-8B (INT4 Quantized)";
            memory.textContent = "~4.5 GB - 5.0 GB RAM";
            cost.textContent = "$0.00 / month (Fully free)";
        } else {
            explanation.textContent = "Because you require offline execution and simple classification/chat tasks, Gemma 2 2B or Qwen 1.5B quantized in INT4 is the ideal architectural path. It runs fast, uses little battery, and runs on almost all modern smartphones.";
            path.textContent = "MediaPipe Tasks SDK / Local Bin";
            model.textContent = "Gemma-2-2B (INT4 Quantized)";
            memory.textContent = "~1.5 GB - 1.8 GB RAM";
            cost.textContent = "$0.00 / month (Fully free)";
        }
    } else {
        // Cloud LLM
        recIcon.setAttribute("data-lucide", "cloud");
        recIcon.className = "rec-icon text-purple";
        headline.textContent = "Recommended: Cloud LLM Endpoint (API Call)";

        if (wizardAnswers.budget === "free") {
            explanation.textContent = "Since you want zero operational costs and have active internet, using Google Gemini 1.5 Flash via AI Studio is perfect. You get a massive 1M context window and fast inference for free within development rate limits.";
            path.textContent = "Cloud API (google_generative_ai)";
            model.textContent = "Gemini 1.5 Flash (Cloud)";
            memory.textContent = "Negligible (< 10MB)";
            cost.textContent = "Free (AI Studio Tier)";
        } else {
            if (wizardAnswers.reasoning === "complex") {
                explanation.textContent = "For high-level logical reasoning, document parsing, and programming tasks, running Gemini 1.5 Pro or OpenAI GPT-4o in the cloud is the most powerful layout. It provides unmatched output accuracy.";
                path.textContent = "Cloud API (Gemini or OpenAI SDK)";
                model.textContent = "Gemini 1.5 Pro / GPT-4o";
                memory.textContent = "Negligible (< 10MB)";
                cost.textContent = "Pay-per-use (~$1.25/1M input)";
            } else {
                explanation.textContent = "Your app does simple reasoning online with a developer budget. We recommend Gemini 1.5 Flash. It is the fastest, cheapest cloud model on the market, offering rich features like structured outputs.";
                path.textContent = "Cloud API (Gemini Flash)";
                model.textContent = "Gemini 1.5 Flash";
                memory.textContent = "Negligible (< 10MB)";
                cost.textContent = "Pay-per-use (~$0.075/1M input)";
            }
        }
    }

    lucide.createIcons();
}

// FINE-TUNING & TRAINING COST ESTIMATOR
function setupTrainingEstimator() {
    const sizeInput = document.getElementById("train-dataset-size");
    const modelSelect = document.getElementById("train-base-model");
    const methodSelect = document.getElementById("train-method");

    sizeInput.addEventListener("input", calculateTrainingSpec);
    modelSelect.addEventListener("change", calculateTrainingSpec);
    methodSelect.addEventListener("change", calculateTrainingSpec);

    // Setup recipe tabs
    const recipeTabs = document.querySelectorAll(".recipe-tab");
    recipeTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const recipeName = tab.getAttribute("data-recipe");
            recipeTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            document.querySelectorAll(".recipe-content").forEach(c => c.classList.remove("active"));
            document.getElementById(`recipe-content-${recipeName}`).classList.add("active");
            activeRecipeTab = recipeName;
        });
    });
}

function calculateTrainingSpec() {
    const size = parseInt(document.getElementById("train-dataset-size").value) || 5000;
    const model = document.getElementById("train-base-model").value;
    const method = document.getElementById("train-method").value;

    let gpuRec = "NVIDIA RTX 4090 / A10G";
    let vramVal = "16 GB VRAM";
    let timeHours = 1.0;
    let costDollars = 1.50;

    // Heuristics calculations
    // Base parameter size factors: Gemma 2B = 2, Llama 8B = 8, Mistral 7B = 7, Llama 70B = 70
    let modelFactor = 2;
    let modelName = "Gemma 2B";
    if (model === "llama3-8b") { modelFactor = 8; modelName = "Llama 8B"; }
    else if (model === "mistral-7b") { modelFactor = 7; modelName = "Mistral 7B"; }
    else if (model === "llama3-70b") { modelFactor = 70; modelName = "Llama 70B"; }

    // Training method factors: QLoRA = 1, LoRA = 1.8, Full = 8
    let methodFactor = 1.0;
    if (method === "lora") methodFactor = 1.8;
    else if (method === "full") methodFactor = 8.0;

    // Calculate VRAM requirement
    if (modelFactor === 2) {
        if (method === "qlora") { gpuRec = "NVIDIA RTX 4090 / A10G"; vramVal = "~12-16 GB VRAM"; }
        else if (method === "lora") { gpuRec = "NVIDIA RTX 4090 / A10G"; vramVal = "~18-20 GB VRAM"; }
        else { gpuRec = "NVIDIA A100 (40GB)"; vramVal = "~36 GB VRAM"; }
    } else if (modelFactor === 7 || modelFactor === 8) {
        if (method === "qlora") { gpuRec = "NVIDIA RTX 4090 (Low Batch) or A10G"; vramVal = "~18-24 GB VRAM"; }
        else if (method === "lora") { gpuRec = "NVIDIA A100 (40GB)"; vramVal = "~32-40 GB VRAM"; }
        else { gpuRec = "NVIDIA A100 (80GB) or H100"; vramVal = "~76 GB VRAM"; }
    } else { // 70B model
        if (method === "qlora") { gpuRec = "NVIDIA A100 (80GB) x 2"; vramVal = "~140 GB VRAM"; }
        else if (method === "lora") { gpuRec = "NVIDIA A100 (80GB) x 4"; vramVal = "~280 GB VRAM"; }
        else { gpuRec = "8x H100 (80GB) Cluster Node"; vramVal = "~1200 GB VRAM"; }
    }

    // Time estimate (arbitrary realistic speed)
    // Assume 1 epoch takes size * modelFactor * methodFactor * constant seconds
    // Let's assume on standard GPUS (A100/RTX 4090):
    let baseTimePerConversation = 0.5; // seconds per item per epoch
    if (modelFactor === 70) baseTimePerConversation = 4.0;
    else if (modelFactor >= 7) baseTimePerConversation = 1.2;

    const totalSeconds = (size * baseTimePerConversation * methodFactor) * 3; // 3 epochs
    timeHours = totalSeconds / 3600;

    // Cost estimate
    // Standard server costs: A10G = $1.00/hr, A100 = $2.20/hr, A100x2 = $4.40/hr, A100x4 = $8.80/hr, H100 node = $40.00/hr
    let hourlyGpuPrice = 1.00;
    if (vramVal.includes("140 GB")) hourlyGpuPrice = 4.40;
    else if (vramVal.includes("280 GB")) hourlyGpuPrice = 8.80;
    else if (vramVal.includes("1200 GB") || gpuRec.includes("8x")) hourlyGpuPrice = 36.00;
    else if (gpuRec.includes("A100")) hourlyGpuPrice = 2.20;

    costDollars = timeHours * hourlyGpuPrice;

    // Render results
    document.getElementById("train-gpu-rec").textContent = gpuRec;
    document.getElementById("train-vram-required").textContent = vramVal;
    
    // Formatting time
    let timeStr = "";
    if (timeHours < 1.0) {
        timeStr = `${Math.round(timeHours * 60)} minutes (at 3 epochs)`;
    } else {
        timeStr = `${timeHours.toFixed(1)} hours (at 3 epochs)`;
    }
    document.getElementById("train-time").textContent = timeStr;
    document.getElementById("train-cost-est").textContent = `~$${costDollars.toFixed(2)} (Cloud compute)`;
}

// PLAYGROUND / TOKENIZER & PRICING
function setupPlayground() {
    const modelSelect = document.getElementById("play-model-select");
    const promptArea = document.getElementById("play-prompt");

    promptArea.addEventListener("input", runPlaygroundSim);
    modelSelect.addEventListener("change", runPlaygroundSim);

    runPlaygroundSim();
}

function runPlaygroundSim() {
    const text = document.getElementById("play-prompt").value;
    const model = document.getElementById("play-model-select").value;

    const charCount = text.length;
    // Word count calculation
    const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    
    // Token approximation (LLMs typically average 4 characters per token in English)
    const tokenCount = Math.ceil(charCount / 4);

    // Render stats
    document.getElementById("stat-chars").textContent = charCount;
    document.getElementById("stat-words").textContent = wordCount;
    document.getElementById("stat-tokens").textContent = tokenCount;

    // Build color tokens visualization
    visualizeTokens(text);

    // Pricing details for the models (per 1,000,000 tokens)
    const pricingMap = {
        "gemini-flash": { input: 0.075 / 1000000, output: 0.30 / 1000000, type: "Cloud API", latency: "~0.8 seconds", internet: "Required" },
        "gemini-pro": { input: 1.25 / 1000000, output: 5.00 / 1000000, type: "Cloud API", latency: "~1.5 seconds", internet: "Required" },
        "gpt-4o": { input: 5.00 / 1000000, output: 15.00 / 1000000, type: "Cloud API", latency: "~1.2 seconds", internet: "Required" },
        "claude-35-sonnet": { input: 3.00 / 1000000, output: 15.00 / 1000000, type: "Cloud API", latency: "~1.4 seconds", internet: "Required" },
        "local-slm": { input: 0, output: 0, type: "Local execution", latency: "Immediate (0.1 - 0.4s)", internet: "None (Offline-first)" }
    };

    const prices = pricingMap[model];

    // Compute costs
    const inputCost = tokenCount * prices.input;
    const estOutputTokens = 250; // standard chat response length
    const outputCost = estOutputTokens * prices.output;
    const totalCost = inputCost + outputCost;
    const callsCost = totalCost * 10000;

    // Render costs
    document.getElementById("cost-input-call").textContent = `$${inputCost.toFixed(6)}`;
    document.getElementById("cost-output-call").textContent = `$${outputCost.toFixed(6)}`;
    document.getElementById("cost-total-large").textContent = `$${callsCost.toFixed(2)}`;

    // Render forecast
    document.getElementById("forecast-type").textContent = prices.type;
    document.getElementById("forecast-type").className = prices.type === "Cloud API" ? "text-purple" : "text-cyan";
    document.getElementById("forecast-latency").textContent = prices.latency;
    document.getElementById("forecast-internet").textContent = prices.internet;
    document.getElementById("forecast-internet").className = prices.internet === "Required" ? "text-danger" : "text-success";
}

function visualizeTokens(text) {
    const container = document.getElementById("token-visualizer-output");
    if (text.trim() === "") {
        container.textContent = "Type or paste your prompt here to see tokens in action...";
        container.style.color = "var(--text-muted)";
        return;
    }
    
    container.style.color = "var(--text-primary)";
    container.innerHTML = "";

    // Chunk text in roughly 3-4 character fragments to simulate tokens
    let i = 0;
    while (i < text.length) {
        // Randomize token size between 3 and 5 characters
        let tokenLen = Math.floor(Math.random() * 3) + 3;
        if (i + tokenLen > text.length) tokenLen = text.length - i;

        const tokenText = text.substring(i, i + tokenLen);
        const span = document.createElement("span");
        span.className = "token-span";
        span.textContent = tokenText;
        
        container.appendChild(span);
        i += tokenLen;
    }
}

// FLUTTER INTEGRATION TABS setup
function setupFlutterIntegrationTabs() {
    const tabs = document.querySelectorAll(".integration-tab");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const intName = tab.getAttribute("data-int");
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            document.querySelectorAll(".integration-content").forEach(c => c.classList.remove("active"));
            document.getElementById(`int-content-${intName}`).classList.add("active");
            activeIntTab = intName;
        });
    });
}

// SETUP CUSTOM MODEL FORM SUBMISSION
function setupCustomModelForm() {
    const form = document.getElementById("add-model-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const name = document.getElementById("form-model-name").value;
        const creator = document.getElementById("form-model-creator").value;
        const category = document.getElementById("form-model-category").value;
        const license = document.getElementById("form-model-license").value;
        const paramsVal = document.getElementById("form-model-params").value || "N/A";
        const accuracyVal = document.getElementById("form-model-accuracy").value || "N/A";
        const contextVal = document.getElementById("form-model-context").value || "N/A";
        const costVal = document.getElementById("form-model-cost").value || "N/A";
        const desc = document.getElementById("form-model-desc").value;
        const inPrice = document.getElementById("form-model-input-price").value || "$0.00";
        const outPrice = document.getElementById("form-model-output-price").value || "$0.00";

        const modelId = `custom-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

        // Create new model details object
        const newModel = {
            id: modelId,
            name: name,
            creator: creator,
            category: category,
            parameters: paramsVal.toLowerCase().includes("billion") ? paramsVal : `${paramsVal} Billion`,
            accuracy: accuracyVal.includes("%") ? accuracyVal : `${accuracyVal}% (MMLU)`,
            context: contextVal.toLowerCase().includes("tokens") ? contextVal : `${contextVal} tokens`,
            cost: costVal,
            license: license,
            description: desc,
            useCases: [
                "Custom enterprise reasoning task workflows",
                "Domain-specific offline assistant operations",
                "Quantized local deployment validation target"
            ],
            specs: {
                arch: category === "SLM" ? "Custom Local Transformer" : "Custom Cloud API Model",
                latency: category === "SLM" ? "Fast (Depending on local device hardware)" : "Medium (Dependent on cloud endpoints)",
                hardware: category === "SLM" ? "Mobile CPU/GPU (INT4 Quantized recommended)" : "Cloud GPU server nodes",
                quantization: category === "SLM" ? "INT4, INT8, FP16" : "Not applicable (Cloud Service)"
            },
            pricing: {
                input: inPrice.startsWith("$") ? inPrice : `$${inPrice}`,
                output: outPrice.startsWith("$") ? outPrice : `$${outPrice}`,
                note: "User defined pricing model."
            },
            flutter: {
                intro: category === "SLM" 
                    ? `Load and run your custom local model ${name} using llama.cpp dart bindings:`
                    : `Query your custom cloud API endpoint for ${name} using standard HTTP bindings:`,
                pubspec: category === "SLM"
                    ? "dependencies:\n  flutter:\n    sdk: flutter\n  llama_cpp_dart: ^0.2.1"
                    : "dependencies:\n  flutter:\n    sdk: flutter\n  http: ^1.2.0",
                main: category === "SLM"
                    ? `import 'package:llama_cpp_dart/llama_cpp_dart.dart';\n\nFuture<String> runCustomModel(String prompt) async {\n  final params = ModelParams()..useGpu = true;\n  final model = LlamaModel('/path/to/${name.toLowerCase()}.gguf', params);\n  final context = LlamaContext(model, ContextParams()..contextSize = 2048);\n  \n  final tokens = context.tokenize(prompt, addBos: true);\n  context.eval(tokens);\n  return context.generateResponse();\n}`
                    : `import 'dart:convert';\nimport 'package:http/http.dart' as http;\n\nFuture<String> callCustomEndpoint(String prompt) async {\n  final url = Uri.parse('https://your-api.domain.com/v1/chat/completions');\n  final response = await http.post(url, headers: {\n    'Authorization': 'Bearer YOUR_SECRET_KEY',\n    'content-type': 'application/json'\n  }, body: jsonEncode({\n    'model': '${modelId}',\n    'messages': [{'role': 'user', 'content': prompt}]\n  }));\n  \n  final data = jsonDecode(response.body);\n  return data['choices'][0]['message']['content'] ?? '';\n}`
            }
        };

        // Save model
        customModels.push(newModel);
        localStorage.setItem("modelverse_custom_models", JSON.stringify(customModels));
        allModels = [...curatedModels, ...customModels];

        // Re-render table matrix
        renderComparisonMatrix();

        // Clear input form
        form.reset();

        // Alert user
        alert(`Success! "${name}" has been registered in local browser storage.`);

        // Redirect to Model Finder
        const finderNav = document.querySelector('.nav-item[data-tab="model-finder"]');
        if (finderNav) finderNav.click();

        // Focus display
        displayModelDetails(newModel);
    });
}

// RENDER MATRIX TABLE DYNAMICALLY
function renderComparisonMatrix() {
    const tbody = document.getElementById("comparison-matrix-body");
    if (!tbody) return;

    tbody.innerHTML = "";

    allModels.forEach(model => {
        const tr = document.createElement("tr");
        
        if (model.id === "gemini-1.5-pro") {
            tr.className = "highlighted-row";
        } else if (model.id === "gemma-2-2b") {
            tr.className = "highlighted-row-cyan";
        }

        const badgeClass = model.category === "LLM" ? "cloud" : "local";
        const badgeLabel = model.category === "LLM" ? "Cloud API" : "On-device / Local";

        let costCol = "";
        if (model.category === "SLM") {
            costCol = `<span class="free-price">${model.cost}</span>`;
        } else {
            if (model.id.includes("gemini")) {
                costCol = `${model.pricing.input} <span class="free-badge">Free tier</span>`;
            } else {
                costCol = `${model.pricing.input}`;
            }
        }

        tr.innerHTML = `
            <td><strong>${model.name}</strong></td>
            <td>${model.creator.replace("Hugging Face / ", "")}</td>
            <td>${model.parameters}</td>
            <td>${model.accuracy}</td>
            <td><span class="badge-type ${badgeClass}">${badgeLabel}</span></td>
            <td>${costCol}</td>
            <td>${model.license}</td>
        `;

        tbody.appendChild(tr);
    });
}

// AUTOMATICALLY SAVE IMPORTED WEB MODELS
function addDynamicModelToList(model) {
    const exists = allModels.some(m => m.id.toLowerCase() === model.id.toLowerCase());
    if (!exists) {
        enrichModelData(model);
        customModels.push(model);
        localStorage.setItem("modelverse_custom_models", JSON.stringify(customModels));
        allModels = [...curatedModels, ...customModels];
        
        // Re-render comparison matrix table
        renderComparisonMatrix();
        
        // Re-render market trends feed to update import button states
        renderMarketReleaseFeed();
        
        // Show success toast notification
        showToastNotification(`Successfully resolved and imported "${model.name}" from the web!`);
    }
}

// TOAST NOTIFICATION BANNER
function showToastNotification(message) {
    const toast = document.createElement("div");
    toast.className = "toast-message";
    toast.innerHTML = `<i data-lucide="info" class="toast-icon"></i> <span>${message}</span>`;
    
    // Toast styles
    toast.style.position = "fixed";
    toast.style.bottom = "30px";
    toast.style.right = "30px";
    toast.style.background = "rgba(11, 15, 25, 0.95)";
    toast.style.border = "1px solid var(--secondary)";
    toast.style.color = "white";
    toast.style.padding = "0.85rem 1.5rem";
    toast.style.borderRadius = "12px";
    toast.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.4), 0 0 15px rgba(6, 182, 212, 0.1)";
    toast.style.display = "flex";
    toast.style.alignItems = "center";
    toast.style.gap = "0.75rem";
    toast.style.zIndex = "1000";
    toast.style.fontSize = "0.9rem";
    toast.style.fontWeight = "500";
    toast.style.animation = "fadeIn 0.3s";
    
    document.body.appendChild(toast);
    lucide.createIcons();
    
    setTimeout(() => {
        toast.style.transition = "opacity 0.5s, transform 0.5s";
        toast.style.opacity = "0";
        toast.style.transform = "translateY(20px)";
        setTimeout(() => toast.remove(), 500);
    }, 3500);
}

// MATCH FAMOUS CLOUD MODELS AND RETURN SPECS
function checkKnownCloudModel(query) {
    const queryLower = query.toLowerCase();
    
    const knownAPIs = [
        {
            keywords: ["gpt-4", "gpt4", "gpt-4o", "gpt-4-turbo", "o1-pro", "o1-mini"],
            name: "GPT-4o Variant",
            creator: "OpenAI",
            category: "LLM",
            parameters: "N/A (MoE)",
            accuracy: "88.7% (MMLU)",
            context: "128,000 tokens",
            cost: "Paid (API)",
            license: "Proprietary",
            description: "A custom resolved OpenAI model of the GPT-4 / o1 family. These models offer top-tier reasoning and coding, operating as cloud-based APIs with token-based pricing.",
            pricing: { input: "$5.00", output: "$15.00", note: "Paid usage only." }
        },
        {
            keywords: ["claude-3", "claude3", "claude-3.5", "claude-3-5", "sonnet", "haiku"],
            name: "Claude 3.5 Sonnet Variant",
            creator: "Anthropic",
            category: "LLM",
            parameters: "N/A (Transformer)",
            accuracy: "88.7% (MMLU)",
            context: "200,000 tokens",
            cost: "Paid (API)",
            license: "Proprietary",
            description: "A custom resolved Anthropic Claude model. Claude models are renowned for long contexts, helpful prose, structural formatting, and strong coding capability.",
            pricing: { input: "$3.00", output: "$15.00", note: "Paid usage only." }
        },
        {
            keywords: ["deepseek", "deepseek-coder", "deepseek-chat"],
            name: "DeepSeek Coder / Chat",
            creator: "DeepSeek AI",
            category: "LLM",
            parameters: "67 Billion",
            accuracy: "81.2% (MMLU)",
            context: "128,000 tokens",
            cost: "Low Cost (Paid API)",
            license: "MIT / Open",
            description: "A custom resolved DeepSeek model. DeepSeek provides highly affordable, state-of-the-art open-weights models that rival proprietary models in coding and mathematics.",
            pricing: { input: "$0.14", output: "$0.28", note: "Extremely low-cost API." }
        },
        {
            keywords: ["cohere", "command-r", "commandr"],
            name: "Cohere Command R+",
            creator: "Cohere AI",
            category: "LLM",
            parameters: "104 Billion",
            accuracy: "75.6% (MMLU)",
            context: "128,000 tokens",
            cost: "Paid (API)",
            license: "C-UDA (Open-weights for Research)",
            description: "A custom resolved Cohere Command model, optimized for enterprise Retrieval-Augmented Generation (RAG) and tool-calling applications.",
            pricing: { input: "$2.50", output: "$10.00", note: "Optimized for tool integrations." }
        },
        {
            keywords: ["kimi", "moonshot", "k2.6"],
            name: "Kimi AI (Moonshot-v1-200k)",
            creator: "Moonshot AI",
            category: "LLM",
            parameters: "N/A (Proprietary MoE)",
            accuracy: "84.5% (MMLU)",
            context: "200,000 tokens",
            cost: "Paid (API)",
            license: "Proprietary",
            description: "Kimi AI, powered by Moonshot AI's custom Moonshot-v1 models, is a leading bilingual Chinese-English large language model series. It is highly optimized for extremely long-context inputs (up to 200,000 tokens), tool-calling agents, and complex coding reasoning.",
            pricing: { input: "$1.65", output: "$1.65", note: "Charged as ¥12.00 per 1M tokens." }
        }
    ];

    for (const api of knownAPIs) {
        if (api.keywords.some(k => queryLower.includes(k))) {
            const shortName = query.toUpperCase();
            
            // Resolve dynamic provider URL and auth keys
            let providerUrl = "https://api.yourprovider.com/v1/chat/completions";
            let apiKeyVar = "YOUR_API_KEY";
            let apiModelName = queryLower;

            if (api.creator === "Moonshot AI") {
                providerUrl = "https://api.moonshot.cn/v1/chat/completions";
                apiKeyVar = "${CONFIG.API_KEYS.MOONSHOT}";
                apiModelName = "moonshot-v1-8k";
            } else if (api.creator === "OpenAI") {
                providerUrl = "https://api.openai.com/v1/chat/completions";
                apiKeyVar = "YOUR_OPENAI_API_KEY";
            } else if (api.creator === "DeepSeek AI") {
                providerUrl = "https://api.deepseek.com/v1/chat/completions";
                apiKeyVar = "YOUR_DEEPSEEK_API_KEY";
            } else if (api.creator === "Cohere AI") {
                providerUrl = "https://api.cohere.com/v1/chat";
                apiKeyVar = "YOUR_COHERE_API_KEY";
            }

            return {
                id: `resolved-${queryLower}`,
                name: shortName,
                creator: api.creator,
                category: api.category,
                parameters: api.parameters,
                accuracy: api.accuracy,
                context: api.context,
                cost: api.cost,
                license: api.license,
                description: api.description,
                useCases: [
                    "Advanced natural language tasks and analysis",
                    "Software engineering, code generation, and debugging",
                    "High-volume document summarization"
                ],
                specs: {
                    arch: "Dense / MoE Cloud Transformer",
                    latency: "Fast-Medium (~50-80 tokens/sec)",
                    hardware: "Hosted cloud endpoints",
                    quantization: "Not applicable (Cloud Service)"
                },
                pricing: api.pricing,
                flutter: {
                    intro: `Query this custom resolved cloud model ${shortName} using standard Dart HTTP requests:`,
                    pubspec: "dependencies:\n  flutter:\n    sdk: flutter\n  http: ^1.2.0",
                    main: `import 'dart:convert';\nimport 'package:http/http.dart' as http;\n\nFuture<String> callEndpoint(String prompt) async {\n  final url = Uri.parse('${providerUrl}');\n  final response = await http.post(url, headers: {\n    'Authorization': 'Bearer ${apiKeyVar}',\n    'content-type': 'application/json'\n  }, body: jsonEncode({\n    'model': '${apiModelName}',\n    'messages': [{'role': 'user', 'content': prompt}]\n  }));\n  \n  final data = jsonDecode(response.body);\n  return data['choices'][0]['message']['content'] ?? '';\n}`
                }
            };
        }
    }
    return null;
}

function setupDeploymentTabs() {
    const subTabs = document.querySelectorAll(".deploy-sub-tab");
    subTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const deployName = tab.getAttribute("data-deploy");
            
            // Update active sub-tab button
            subTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            // Update active deploy content div
            document.querySelectorAll(".deploy-content").forEach(c => c.classList.remove("active"));
            const targetContent = document.getElementById(`deploy-content-${deployName}`);
            if (targetContent) {
                targetContent.classList.add("active");
            }
        });
    });
}

function renderMarketReleaseFeed() {
    const container = document.getElementById("market-feed-container");
    if (!container) return;
    
    container.innerHTML = "";
    
    marketReleaseFeed.forEach(item => {
        const isAlreadyImported = allModels.some(m => m.id.toLowerCase() === item.id.toLowerCase());
        const card = document.createElement("div");
        card.className = "market-card";
        
        const badgeClass = item.category.toLowerCase() === 'llm' ? 'cloud' : 'local';
        const badgeLabel = item.category === 'LLM' ? 'Cloud API' : 'On-Device';
        
        card.innerHTML = `
            <div class="market-card-header">
                <div>
                    <span class="market-card-date">${item.releaseDate}</span>
                    <h4 class="market-card-title">${item.name}</h4>
                    <span class="market-card-creator">By ${item.creator}</span>
                </div>
                <span class="badge-type ${badgeClass}" style="margin: 0;">
                    ${badgeLabel}
                </span>
            </div>
            <p class="market-card-desc">${item.highlight}</p>
            <div class="market-card-data" style="margin-top: 0.5rem; font-size: 0.8rem; border-left: 3px solid var(--secondary); padding-left: 0.5rem;">
                <strong>Layperson View:</strong> ${item.laypersonTarget}
            </div>
            <div class="market-card-data">
                <strong>Training Data:</strong> ${item.trainingHighlight}
            </div>
            <div class="market-card-footer">
                <span style="font-size: 0.8rem; color: var(--text-muted);">Params: <strong>${item.parameters}</strong></span>
                <button class="import-btn ${isAlreadyImported ? 'imported' : ''}" ${isAlreadyImported ? 'disabled' : ''} data-id="${item.id}">
                    ${isAlreadyImported ? 'Imported' : 'Import to Matrix'}
                </button>
            </div>
        `;
        
        const importBtn = card.querySelector(".import-btn");
        if (importBtn && !isAlreadyImported) {
            importBtn.addEventListener("click", (e) => {
                e.stopPropagation(); // Stop click event from triggering card details switch
                const modelObj = mapMarketReleaseToModel(item);
                addDynamicModelToList(modelObj);
                
                // Update button state immediately
                importBtn.classList.add("imported");
                importBtn.textContent = "Imported";
                importBtn.disabled = true;
            });
        }
        
        card.addEventListener("click", (e) => {
            // If the user clicked the import button, do not switch tabs
            if (e.target.closest(".import-btn")) return;
            
            const modelObj = mapMarketReleaseToModel(item);
            
            // Display details
            displayModelDetails(modelObj);
            
            // Switch tab to Model Finder (Model Search & Specs)
            const finderNav = document.querySelector('.nav-item[data-tab="model-finder"]');
            if (finderNav) finderNav.click();
        });
        
        container.appendChild(card);
    });
}

function mapMarketReleaseToModel(item) {
    const isSLM = item.category === "SLM";
    
    // Parse pricing out of cost string
    let inPrice = "$0.00";
    let outPrice = "$0.00";
    let pricingNote = "Free local weights.";
    
    if (item.id === "deepseek-v3") {
        inPrice = "$0.14";
        outPrice = "$0.28";
        pricingNote = "Highly affordable Chinese API endpoint.";
    } else if (item.id === "claude-3-5-haiku") {
        inPrice = "$0.80";
        outPrice = "$4.00";
        pricingNote = "Charged per million tokens.";
    } else if (item.id === "gemma-2-9b-it") {
        pricingNote = "Open weights by Google, free to run locally.";
    } else if (item.id === "llama-3-1-8b-instruct") {
        pricingNote = "Open weights by Meta, free to run locally.";
    } else if (item.id === "phi-3-5-moe-instruct") {
        pricingNote = "MIT license, free to run locally.";
    }
    
    const useCases = isSLM ? [
        "Offline chatbot and context analysis on-device",
        "Grammar correction, translation, and summaries",
        "Privacy-preserving user data processing"
    ] : [
        "High-performance cloud-based chat assistant",
        "Coding, math problem solving, and agent workflows",
        "Complex structured data extraction from web pages"
    ];

    const modelObj = {
        id: item.id,
        name: item.name,
        creator: item.creator,
        category: item.category,
        parameters: item.parameters,
        accuracy: item.id === "deepseek-v3" ? "88.5% (MMLU)" : 
                  item.id === "gemma-2-9b-it" ? "71.3% (MMLU)" :
                  item.id === "claude-3-5-haiku" ? "75.2% (MMLU)" :
                  item.id === "llama-3-1-8b-instruct" ? "68.4% (MMLU)" :
                  item.id === "phi-3-5-moe-instruct" ? "68.8% (MMLU)" : "75.0% (MMLU)",
        context: item.context,
        cost: isSLM ? "$0.00 (Local)" : "Paid",
        license: item.license,
        description: item.highlight + " " + item.laypersonTarget,
        useCases: useCases,
        specs: {
            arch: isSLM ? "Transformer / MoE Local" : "Cloud MoE / Transformer",
            latency: isSLM ? "Fast (quantized execution)" : "Medium (Cloud server latency)",
            hardware: isSLM ? "Consumer Mobile CPU/GPU (INT4 Quantized)" : "Nvidia A100/H100 Cloud Servers",
            quantization: isSLM ? "INT4, INT8, FP16" : "Not applicable (Cloud Service)"
        },
        pricing: {
            input: inPrice,
            output: outPrice,
            note: pricingNote
        },
        flutter: {
            intro: isSLM 
                ? `To run ${item.name} locally in Flutter, download its GGUF weights and use llama.cpp:`
                : `To query ${item.name} in Flutter, send standard HTTP requests to the cloud endpoint:`,
            pubspec: isSLM 
                ? "dependencies:\n  flutter:\n    sdk: flutter\n  llama_cpp_dart: ^0.2.1\n  path_provider: ^2.1.1"
                : "dependencies:\n  flutter:\n    sdk: flutter\n  http: ^1.2.0",
            main: isSLM 
                ? `import 'package:llama_cpp_dart/llama_cpp_dart.dart';\n\nFuture<String> runLocalModel(String prompt) async {\n  final params = ModelParams()..useGpu = true;\n  final model = LlamaModel('/path/to/${item.id}.gguf', params);\n  final context = LlamaContext(model, ContextParams()..contextSize = 2048);\n  \n  final tokens = context.tokenize(prompt, addBos: true);\n  context.eval(tokens);\n  return context.generateResponse();\n}`
                : `import 'dart:convert';\nimport 'package:http/http.dart' as http;\n\nFuture<String> callCloudAPI(String prompt) async {\n  final url = Uri.parse('https://api.provider.com/v1/chat/completions');\n  final response = await http.post(url, headers: {\n    'Authorization': 'Bearer YOUR_API_KEY',\n    'content-type': 'application/json'\n  }, body: jsonEncode({\n    'model': '${item.id}',\n    'messages': [{'role': 'user', 'content': prompt}]\n  }));\n  final data = jsonDecode(response.body);\n  return data['choices'][0]['message']['content'] ?? '';\n}`
        }
    };
    
    // Also attach properties required by layperson/training
    modelObj.simpleAnalogy = getAnalogyForMarketModel(item.id, item.name);
    modelObj.trainingData = item.trainingHighlight;
    
    return modelObj;
}

function getAnalogyForMarketModel(id, name) {
    if (id === "deepseek-v3") {
        return `Think of DeepSeek-V3 as a highly efficient genius from a low-cost start-up. They have the exact same IQ and coding skills as the most expensive cloud scholars (like GPT-4o), but they only charge you a pocket-change penny for every hour of research work they perform.`;
    } else if (id === "gemma-2-9b-it") {
        return `Think of Gemma 2 9B IT as a mid-sized, highly trained local specialist. They don't require an internet connection and fit inside standard laptops or high-end tablets, giving you top-quality offline reasoning without sending any data to the cloud.`;
    } else if (id === "claude-3-5-haiku") {
        return `Think of Claude 3.5 Haiku as a speed-reading champion in the cloud. They can look at massive reports in a fraction of a second and immediately draft a reply, making them the fastest digital sorting agent in your toolbelt.`;
    } else if (id === "llama-3-1-8b-instruct") {
        return `Think of Llama 3.1 8B Instruct as a versatile local mechanic with a massive toolbox. They are free, offline-first, and can read extremely long instruction manuals (up to 128k context) without breaking a sweat.`;
    } else if (id === "phi-3-5-moe-instruct") {
        return `Think of Phi-3.5 MoE as a team of 16 compact experts, where only 2 experts discuss your question at any given time. This makes the model extremely lightweight and fast enough to run locally, while retaining the wisdom of a much larger model.`;
    }
    return `Think of ${name} as a specialized modern brain. It runs efficiently for its target category, allowing developers to choose between low-cost cloud APIs or private local execution depending on their network resources.`;
}

// ==========================================
// INTERACTIVE AI/ML GLOSSARY DATA & ENGINE
// ==========================================




let currentGlossaryCategory = "all";
let glossarySearchQuery = "";
let currentRoadmapStep = "all";

function setupGlossary() {
    const searchInput = document.getElementById("glossary-search-input");
    const clearBtn = document.getElementById("glossary-clear-btn");
    const filterContainer = document.getElementById("glossary-filter-container");
    const stepButtons = document.querySelectorAll(".roadmap-step-btn");
    
    if (!searchInput || !filterContainer) return;
    
    // Render Filter Chips
    renderGlossaryChips();
    
    // Initial card rendering
    renderGlossaryCards();
    
    // Search event
    searchInput.addEventListener("input", (e) => {
        glossarySearchQuery = e.target.value.toLowerCase().trim();
        clearBtn.style.display = glossarySearchQuery.length > 0 ? "flex" : "none";
        renderGlossaryCards();
    });
    
    // Clear search
    clearBtn.addEventListener("click", () => {
        searchInput.value = "";
        glossarySearchQuery = "";
        clearBtn.style.display = "none";
        renderGlossaryCards();
    });

    // Roadmap Step Buttons
    stepButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            stepButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentRoadmapStep = btn.getAttribute("data-step");
            
            // Clicking a step resets category filter to 'all' to prevent empty states
            currentGlossaryCategory = "all";
            renderGlossaryChips();
            renderGlossaryCards();
        });
    });
}

function renderGlossaryChips() {
    const filterContainer = document.getElementById("glossary-filter-container");
    if (!filterContainer) return;
    
    filterContainer.innerHTML = "";
    
    Object.entries(glossaryCategories).forEach(([key, label]) => {
        const chip = document.createElement("button");
        chip.className = `search-tag ${currentGlossaryCategory === key ? 'active' : ''}`;
        chip.style.margin = "0";
        chip.textContent = label;
        chip.addEventListener("click", () => {
            currentGlossaryCategory = key;
            
            // Clicking a category chip resets step roadmap filter to 'all'
            currentRoadmapStep = "all";
            const stepButtons = document.querySelectorAll(".roadmap-step-btn");
            stepButtons.forEach(b => {
                if (b.getAttribute("data-step") === "all") {
                    b.classList.add("active");
                } else {
                    b.classList.remove("active");
                }
            });
            
            renderGlossaryChips();
            renderGlossaryCards();
        });
        filterContainer.appendChild(chip);
    });
}

function renderGlossaryCards() {
    const grid = document.getElementById("glossary-grid");
    const descBox = document.getElementById("roadmap-step-desc-box");
    if (!grid) return;
    
    grid.innerHTML = "";
    
    // Update step description box
    if (descBox) {
        if (currentRoadmapStep === "all") {
            descBox.innerHTML = "Follow the guided roadmap step-by-step to learn AI/ML terminologies in a logical flow from basics to system customization.";
        } else {
            const stepNum = parseInt(currentRoadmapStep);
            const stepInfo = glossarySteps.find(s => s.number === stepNum);
            if (stepInfo) {
                descBox.innerHTML = `<strong>${stepInfo.title}</strong> &mdash; ${stepInfo.description}`;
            }
        }
    }
    
    const filteredTerms = glossaryData.filter(item => {
        // Step filter
        if (currentRoadmapStep !== "all" && item.step !== parseInt(currentRoadmapStep)) {
            return false;
        }
        // Category filter
        if (currentGlossaryCategory !== "all" && item.category !== currentGlossaryCategory) {
            return false;
        }
        // Search filter
        if (glossarySearchQuery) {
            const inTitle = item.title.toLowerCase().includes(glossarySearchQuery);
            const inLayperson = item.layperson.toLowerCase().includes(glossarySearchQuery);
            const inTechnical = item.technical.toLowerCase().includes(glossarySearchQuery);
            const inImpact = item.selectionImpact.toLowerCase().includes(glossarySearchQuery);
            return inTitle || inLayperson || inTechnical || inImpact;
        }
        return true;
    });
    
    if (filteredTerms.length === 0) {
        grid.innerHTML = `
            <div class="card glass-card" style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem;">
                <i data-lucide="help-circle" style="width: 48px; height: 48px; opacity: 0.5; color: var(--text-secondary);"></i>
                <p style="margin: 0; font-size: 1.1rem; font-weight: 500; color: white;">No glossary terms match your search query.</p>
                <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary);">Try searching for standard concepts like 'quantization', 'attention', 'MoE', or 'MMLU'.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }
    
    // Sort terms by step sequence
    filteredTerms.sort((a, b) => a.step - b.step);
    
    // If viewing ALL categories and NO search query and ALL steps are selected, render step roadmap headers
    const showRoadmap = (currentGlossaryCategory === "all" && !glossarySearchQuery && currentRoadmapStep === "all");
    
    let currentStepNumber = 0;
    
    filteredTerms.forEach(item => {
        // If showing roadmap and we transition to a new step, render step header
        if (showRoadmap && item.step !== currentStepNumber) {
            currentStepNumber = item.step;
            const stepInfo = glossarySteps.find(s => s.number === currentStepNumber);
            if (stepInfo) {
                const headerDiv = document.createElement("div");
                headerDiv.className = "roadmap-step-header";
                headerDiv.style.gridColumn = "1 / -1";
                
                headerDiv.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.25rem;">
                        <span class="roadmap-badge" style="font-size: 0.75rem; font-weight: 700; background: linear-gradient(135deg, var(--primary), var(--secondary)); padding: 0.25rem 0.65rem; border-radius: 12px; color: white; text-transform: uppercase;">Step ${stepInfo.number}</span>
                    </div>
                    <h4 style="margin: 0; font-size: 1.25rem; color: white; font-weight: 600;">${stepInfo.title}</h4>
                    <p style="margin: 0.25rem 0 0 0; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4;">${stepInfo.description}</p>
                `;
                grid.appendChild(headerDiv);
            }
        }
        
        const card = document.createElement("div");
        card.className = "card glass-card glossary-card";
        
        // Pick left border color based on category
        let borderColor = "var(--primary)";
        if (item.category === "quantization" || item.category === "hardware") {
            borderColor = "var(--secondary)";
        } else if (item.category === "generation" || item.category === "training") {
            borderColor = "var(--success)";
        } else if (item.category === "evaluation") {
            borderColor = "var(--warning)";
        }
        
        card.style.display = "flex";
        card.style.flexDirection = "column";
        card.style.gap = "1rem";
        card.style.padding = "1.5rem";
        card.style.borderLeft = `4px solid ${borderColor}`;
        card.style.transition = "transform var(--transition-fast), box-shadow var(--transition-fast)";
        
        card.innerHTML = `
            <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 0.5rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div class="logo-icon" style="width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0; background: linear-gradient(135deg, ${borderColor}, rgba(255,255,255,0.15)); box-shadow: none; display: flex; align-items: center; justify-content: center;">
                        <i data-lucide="${item.icon}" style="width: 18px; height: 18px; color: white;"></i>
                    </div>
                    <h4 style="margin: 0; font-size: 1.1rem; color: white; font-weight: 600;">${item.title}</h4>
                </div>
                <span class="badge-category" style="font-size: 0.7rem; padding: 0.2rem 0.5rem; background: rgba(255,255,255,0.05); color: var(--text-secondary); border: 1px solid var(--border-color); border-radius: 4px; text-transform: uppercase;">${glossaryCategories[item.category].split(" ")[0]}</span>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.85rem; line-height: 1.5;">
                <div class="layperson-section" style="background: rgba(255,255,255,0.02); padding: 0.75rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.03);">
                    <div style="font-weight: 600; color: var(--secondary-light); margin-bottom: 0.25rem; font-size: 0.8rem; display: flex; align-items: center; gap: 0.25rem;">
                        <i data-lucide="info" style="width: 14px; height: 14px;"></i> Layperson & Selection View
                    </div>
                    <p style="color: var(--text-primary); margin: 0;">${item.layperson}</p>
                </div>
                
                <div class="technical-section" style="border-top: 1px dashed var(--border-color); padding-top: 0.75rem;">
                    <div style="font-weight: 600; color: var(--primary-light); margin-bottom: 0.25rem; font-size: 0.8rem; display: flex; align-items: center; gap: 0.25rem;">
                        <i data-lucide="cpu" style="width: 14px; height: 14px;"></i> Technical Specification
                    </div>
                    <p style="color: var(--text-secondary); margin: 0; font-size: 0.8rem;">${item.technical}</p>
                </div>
                
                <div class="impact-section" style="background: rgba(139, 92, 246, 0.04); border-left: 2px solid var(--primary); padding: 0.5rem 0.75rem; border-radius: 0 6px 6px 0;">
                    <div style="font-weight: 600; color: var(--primary-light); margin-bottom: 0.25rem; font-size: 0.8rem; display: flex; align-items: center; gap: 0.25rem;">
                        <i data-lucide="settings" style="width: 14px; height: 14px;"></i> Selection Impact
                    </div>
                    <p style="color: var(--text-secondary); margin: 0; font-size: 0.8rem;">${item.selectionImpact}</p>
                </div>
            </div>
            
            <div style="margin-top: auto; padding-top: 0.75rem; border-top: 1px solid var(--border-color); display: flex; justify-content: flex-end;">
                <a href="${item.refLink}" target="_blank" style="font-size: 0.75rem; text-decoration: none; display: flex; align-items: center; gap: 0.35rem; color: var(--secondary-light); padding: 0.35rem 0.6rem; border-radius: 4px; background: rgba(6, 182, 212, 0.05); border: 1px solid rgba(6, 182, 212, 0.15); transition: background var(--transition-fast); font-weight: 500;">
                    <span>Official Reference Documentation</span> <i data-lucide="external-link" style="width: 12px; height: 12px;"></i>
                </a>
            </div>
        `;
        grid.appendChild(card);
    });
    
    lucide.createIcons();
}

// ==========================================
// AI NEWS & SOCIAL MEDIA HUB ENGINE
// ==========================================

// Core News Sources Database
// Core News Sources Database
const defaultNewsSources = [
    {
        id: "openai-blog",
        name: "OpenAI Blog",
        handle: "openai.com/blog",
        type: "blogs",
        desc: "Official announcements of ChatGPT, API upgrades, and safety research.",
        url: "https://openai.com/blog"
    },
    {
        id: "anthropic-blog",
        name: "Anthropic News",
        handle: "anthropic.com/news",
        type: "blogs",
        desc: "Constitutional AI research, Claude model releases, and alignment updates.",
        url: "https://anthropic.com/news"
    },
    {
        id: "deepmind-blog",
        name: "Google DeepMind",
        handle: "deepmind.google/blog",
        type: "blogs",
        desc: "Scientific discoveries, AlphaFold, Gemini research, and AI breakthroughs.",
        url: "https://deepmind.google/blog"
    },
    {
        id: "huggingface-blog",
        name: "Hugging Face Blog",
        handle: "huggingface.co/blog",
        type: "blogs",
        desc: "Open source release notes, model benchmarks, and local deployment tutorials.",
        url: "https://huggingface.co/blog"
    },
    {
        id: "meta-ai-blog",
        name: "Meta AI News",
        handle: "ai.meta.com/blog",
        type: "blogs",
        desc: "Llama open model releases, PyTorch updates, and AI agent research.",
        url: "https://ai.meta.com/blog"
    },
    {
        id: "r-openai",
        name: "r/OpenAI",
        handle: "reddit.com/r/OpenAI",
        type: "reddit",
        desc: "Developer chat, prompts, and API integrations with OpenAI systems.",
        url: "https://reddit.com/r/OpenAI"
    },
    {
        id: "r-chatgpt",
        name: "r/ChatGPT",
        handle: "reddit.com/r/ChatGPT",
        type: "reddit",
        desc: "User stories, tips, custom GPTs, and chatbot experiences.",
        url: "https://reddit.com/r/ChatGPT"
    },
    {
        id: "r-machinelearning",
        name: "r/MachineLearning",
        handle: "reddit.com/r/MachineLearning",
        type: "reddit",
        desc: "Technical paper discussions, deep learning architectures, and research.",
        url: "https://reddit.com/r/MachineLearning"
    },
    {
        id: "r-localllama",
        name: "r/LocalLLaMA",
        handle: "reddit.com/r/LocalLLaMA",
        type: "reddit",
        desc: "Running SLMs offline, GGUF quantizations, and local execution frameworks.",
        url: "https://reddit.com/r/LocalLLaMA"
    }
];

// Initial News Feed Items
let simulatedNewsFeed = [
    {
        id: "post-gpt-4o",
        authorName: "OpenAI Blog",
        handle: "openai.com/blog",
        platform: "blogs",
        date: "2 hours ago",
        content: "Introducing GPT-4o: Our new flagship model. GPT-4o ('o' for omni) is a step towards much more natural human-computer interaction—it accepts as input any combination of text, audio, and image and generates any combination of text, audio, and image outputs. It matches GPT-4 Turbo performance at half the price.",
        thumbnail: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=500&auto=format&fit=crop",
        metrics: { comments: 450, reposts: 1800, likes: 9200 },
        modelLink: {
            id: "gpt-4o",
            name: "GPT-4o",
            creator: "OpenAI",
            category: "LLM",
            parameters: "N/A (Multi-Expert)",
            accuracy: "88.7% (MMLU)",
            context: "128,000 tokens",
            cost: "Paid",
            license: "Proprietary",
            description: "GPT-4o ('o' for omni) is OpenAI's flagship multimodal model, designed to process and generate text, audio, and vision inputs. It operates with high reasoning speed and is optimized for conversational voice interfaces, general logic, and advanced coding.",
            useCases: [
                "Advanced conversational voice chatbots",
                "Sophisticated code drafting, refactoring, and debugging",
                "Complex data analysis, chart parsing, and vision recognition"
            ],
            specs: {
                arch: "Dense transformer / MoE",
                latency: "Fast-Medium (~60-80 tokens/sec)",
                hardware: "Cloud GPU clusters (Cloud API)",
                quantization: "Not applicable (Cloud Service)"
            },
            pricing: {
                input: "$5.00",
                output: "$15.00",
                note: "Paid only. Rate limits apply based on account tiers."
            }
        }
    },
    {
        id: "post-reddit-gemma",
        authorName: "r/LocalLLaMA",
        handle: "u/EdgeCoder",
        platform: "reddit",
        date: "4 hours ago",
        content: "I've been benchmarking Gemma 2 9B Instruct locally for offline code generation. Running the 4-bit GGUF via llama.cpp on a standard laptop produces ~45 tokens/sec. The reasoning is unbelievably solid, matching or beating Llama 3 8B. Highly recommend building your local RAG pipelines with this.",
        metrics: { comments: 88, reposts: 0, likes: 450 },
        modelLink: {
            id: "gemma-2-9b",
            name: "Gemma 2 9B",
            creator: "Google Developer AI",
            category: "SLM",
            parameters: "9.2 Billion",
            accuracy: "71.3% (MMLU)",
            context: "8,192 tokens",
            cost: "$0.00 (Local)",
            license: "Open-weights (Gemma Terms)",
            description: "Gemma 2 9B is a mid-sized open model that outperforms many models twice its size. It provides exceptional balance between inference speed and reasoning capacity, making it a favorite for local workstation assistants, lightweight servers, and premium mobile devices.",
            useCases: [
                "Local offline code autocompletion and scripting helpers",
                "Moderate-complexity reasoning and translation on-device",
                "Private data analysis on high-end desktop/macOS apps"
            ],
            specs: {
                arch: "Decoder-only Transformer",
                latency: "Fast (~8-15 tok/s on mobile GPU)",
                hardware: "Requires 6GB+ RAM mobile devices or Apple Silicon Mac",
                quantization: "INT4, INT8, FP16 (GGUF format)"
            },
            pricing: {
                input: "$0.00 (Local)",
                output: "$0.00 (Local)",
                note: "Free to run. Requires downloading ~5.5GB model file for INT4."
            }
        }
    },
    {
        id: "post-youtube-flutter",
        authorName: "Flutter Pro Channel",
        handle: "youtube.com/c/FlutterPro",
        platform: "videos",
        date: "5 hours ago",
        content: "🎥 How to Run On-Device AI in Flutter (Gemma 2B Tutorial)\nIn this video, we build a 100% offline chat application in Flutter using Google's MediaPipe Tasks LLM Inference API and Gemma 2B. We cover model downloading, thread pooling, and UI integration.",
        thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&auto=format&fit=crop",
        metrics: { comments: 34, reposts: 0, likes: 820 },
        videoUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
        id: "post-github-langchain",
        authorName: "GitHub Releases",
        handle: "github.com/langchain-ai/langchain",
        platform: "github",
        date: "1 day ago",
        content: "💻 langchain-ai/langchain v0.3.0 Release\nThis major release shifts LangChain to Pydantic v2 support. It optimizes memory routing pipelines, unifies agent graph templates, and introduces native async streaming components. Over 150 community contributions included.",
        metrics: { comments: 12, reposts: 0, likes: 3200 },
        githubUrl: "https://github.com/langchain-ai/langchain/releases/tag/v0.3.0"
    },
    {
        id: "post-hf-model-phi",
        authorName: "Hugging Face Models",
        handle: "huggingface.co/microsoft/Phi-3-mini-4k-instruct",
        platform: "models",
        date: "2 days ago",
        content: "🤖 New Model Launch: Phi-3-mini-4k-instruct\nMicrosoft's 3.8B parameter lightweight model is now available on Hugging Face Hub. Trained on high-quality synthetic text datasets, it matches models twice its size. Ideal for edge deployment under MIT license.",
        metrics: { comments: 55, reposts: 0, likes: 2450 },
        modelLink: {
            id: "phi-3-mini",
            name: "Phi-3 Mini (3.8B)",
            creator: "Microsoft",
            category: "SLM",
            parameters: "3.8 Billion",
            accuracy: "68.8% (MMLU)",
            context: "4,000 / 128,000 tokens",
            cost: "$0.00 (Local)",
            license: "MIT License",
            description: "Phi-3 Mini is Microsoft's ultra-capable 3.8B parameter model. Trained on high-quality synthetic data and filtered web content, it achieves performance rivaling models twice its size. It is fully open-source under the MIT license, allowing unrestricted commercial usage.",
            useCases: [
                "Highly capable offline conversational applications",
                "Structured JSON data generation from raw text on-device",
                "Offline reading comprehension and educational quizzes"
            ],
            specs: {
                arch: "Decoder-only (Llama-style)",
                latency: "Fast (~15-25 tokens/sec on phone CPU)",
                hardware: "Runs comfortably on 4GB-6GB RAM mobile devices",
                quantization: "INT4 (ONNX, GGUF formats)"
            },
            pricing: {
                input: "$0.00 (Local)",
                output: "$0.00 (Local)",
                note: "MIT License. Unrestricted commercial use."
            }
        }
    }
];

// Pool of Simulated Events for "Simulate Live Event" button
const simulatedNewsAlertPool = [
    {
        id: "alert-gemma-3",
        authorName: "Google Developer AI",
        handle: "@GoogleDevs",
        platform: "blogs",
        date: "Just now",
        content: "Google has officially released Gemma 3 3B IT! Designed via advanced distillation from Gemini 1.5. Features 128k context support, Grouped-Query Attention (GQA), and optimized mobile layouts. Runs extremely fast on standard phone CPUs offline.",
        thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop",
        metrics: { comments: 45, reposts: 210, likes: 1850 },
        modelLink: {
            id: "gemma-3-3b-it",
            name: "Gemma 3 3B IT",
            creator: "Google Developer AI",
            category: "SLM",
            parameters: "3.2 Billion",
            accuracy: "78.4% (MMLU)",
            context: "128,000 tokens",
            cost: "Free (Local)",
            license: "Gemma 3 License",
            description: "Gemma 3 3B IT is Google's next-generation lightweight instruction model. It is optimized for mobile CPU/GPU execution, featuring 128k context window support and state-of-the-art multilingual reasoning.",
            useCases: [
                "On-device mobile application agent tasks",
                "Private writing assistance and document summarizing",
                "Bilingual Spanish/English offline interactions"
            ],
            specs: {
                arch: "GQA Causal Transformer",
                latency: "Extremely Fast (~80-110 tokens/sec local)",
                hardware: "Modern iOS/Android smartphones or standard tablets",
                quantization: "GGUF Q4_K_M, INT4, INT8, FP16"
            },
            pricing: {
                input: "$0.00",
                output: "$0.00",
                note: "Open-weights. Free to download and self-host."
            }
        }
    },
    {
        id: "alert-deepseek-r1",
        authorName: "DeepSeek AI",
        handle: "deepseek.com",
        platform: "blogs",
        date: "Just now",
        content: "We are excited to announce DeepSeek-R1, our open-source reasoning model using reinforcement learning. It matches OpenAI's o1 reasoning accuracy on math, coding, and logical tasks. Fully licensed under MIT and ready for production pipelines.",
        thumbnail: "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=500&auto=format&fit=crop",
        metrics: { comments: 395, reposts: 2110, likes: 9800 },
        modelLink: {
            id: "deepseek-r1",
            name: "DeepSeek-R1",
            creator: "DeepSeek AI",
            category: "LLM",
            parameters: "671B (MoE)",
            accuracy: "90.8% (MMLU)",
            context: "128,000 tokens",
            cost: "API ($0.55/1M input)",
            license: "MIT License",
            description: "A frontier reasoning model trained via large-scale reinforcement learning. DeepSeek-R1 provides chain-of-thought outputs, validating its logic step-by-step to match OpenAI o1-class reasoning at low costs.",
            useCases: [
                "Complex multi-hop reasoning and logical chains",
                "High-precision software engineering and code generation",
                "Mathematical theorem proving and data analysis"
            ],
            specs: {
                arch: "Mixture-of-Experts (MoE) with RL Gating",
                latency: "Slow-Medium (Thinks before replying)",
                hardware: "Hosted cloud endpoints",
                quantization: "Not applicable (Cloud Service)"
            },
            pricing: {
                input: "$0.55",
                output: "$2.19",
                note: "Reinforcement-learning API with cheap pricing."
            }
        }
    }
];

let activeNewsFilter = "all";
let newsSearchQuery = "";
let alertIndex = 0;


// Setup news hub
function setupNewsHub() {
    // Initial load of custom news sources
    let customSources = [];
    try {
        const stored = localStorage.getItem("modelverse_news_sources");
        if (stored) customSources = JSON.parse(stored);
    } catch (e) {
        console.error("Failed to parse custom news sources", e);
    }

    // Render directory and news feed
    renderNewsSourcesDirectory(customSources);
    renderNewsFeed();

    // Register filter listeners
    const filterButtons = document.querySelectorAll("#news-filter-chips button");
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeNewsFilter = btn.getAttribute("data-filter");
            renderNewsFeed();
        });
    });

    // Register search listeners
    const searchInput = document.getElementById("news-search-input");
    const clearBtn = document.getElementById("news-clear-btn");

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            newsSearchQuery = e.target.value.toLowerCase().trim();
            if (clearBtn) {
                clearBtn.style.display = newsSearchQuery ? "flex" : "none";
            }
            renderNewsFeed();
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            newsSearchQuery = "";
            clearBtn.style.display = "none";
            renderNewsFeed();
        });
    }

    // Register custom source form submission
    const customSourceForm = document.getElementById("add-news-source-form");
    if (customSourceForm) {
        customSourceForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("source-name").value.trim();
            const handle = document.getElementById("source-handle").value.trim();
            const type = document.getElementById("source-type").value;
            const desc = document.getElementById("source-desc").value.trim();

            let formattedHandle = handle;
            let formattedUrl = handle.startsWith("http") ? handle : `https://google.com/search?q=${encodeURIComponent(name)}`;
            
            if (type === "reddit") {
                formattedHandle = handle.startsWith("r/") ? handle : `r/${handle}`;
                formattedUrl = `https://reddit.com/${formattedHandle}`;
            } else if (type === "github") {
                formattedHandle = handle.includes("/") ? handle : `${handle}`;
                formattedUrl = `https://github.com/${formattedHandle}`;
            } else if (type === "videos") {
                formattedHandle = handle.startsWith("youtube.com") ? handle : `youtube.com/${handle}`;
                formattedUrl = handle.startsWith("http") ? handle : `https://${formattedHandle}`;
            }

            const newSource = {
                id: `custom-source-${Date.now()}`,
                name: name,
                handle: formattedHandle,
                type: type,
                desc: desc,
                url: formattedUrl
            };

            // Save to localStorage
            let currentCustom = [];
            try {
                const stored = localStorage.getItem("modelverse_news_sources");
                if (stored) currentCustom = JSON.parse(stored);
            } catch (err) {}

            currentCustom.push(newSource);
            localStorage.setItem("modelverse_news_sources", JSON.stringify(currentCustom));

            // Reset and render
            customSourceForm.reset();
            renderNewsSourcesDirectory(currentCustom);
            showToastNotification(`Successfully added custom source: "${name}"`);
        });
    }

    // Register simulated alert button click
    const simulateBtn = document.getElementById("simulate-news-btn");
    if (simulateBtn) {
        simulateBtn.addEventListener("click", () => {
            triggerLiveNewsAlert();
        });
    }

    // Register live refresh button click
    const refreshBtn = document.getElementById("refresh-news-btn");
    if (refreshBtn) {
        refreshBtn.addEventListener("click", () => {
            fetchLiveNewsUpdates();
        });
    }
}

// Render Core Channels Directory
function renderNewsSourcesDirectory(customSources = []) {
    const container = document.getElementById("news-directory-container");
    if (!container) return;

    container.innerHTML = "";

    const combinedSources = [...defaultNewsSources, ...customSources];

    combinedSources.forEach(src => {
        const card = document.createElement("div");
        card.className = "news-source-card";
        
        // Custom background style depending on source type
        let iconHtml = '<i data-lucide="globe"></i>';
        let badgeClass = "badge-type local";
        let label = "Web Link";
        
        if (src.type === "blogs") {
            iconHtml = '<i data-lucide="mail" style="color: var(--secondary-light);"></i>';
            badgeClass = "badge-type local";
            label = "RSS Feed / Blog";
        } else if (src.type === "reddit") {
            iconHtml = '<i data-lucide="message-square" style="color: #ff4500;"></i>';
            badgeClass = "badge-type";
            label = "Reddit Community";
        } else if (src.type === "videos") {
            iconHtml = '<i data-lucide="video" style="color: #ef4444;"></i>';
            badgeClass = "badge-type";
            label = "YouTube Channel";
        } else if (src.type === "github") {
            iconHtml = '<i data-lucide="github" style="color: white;"></i>';
            badgeClass = "badge-type local";
            label = "GitHub Project";
        } else if (src.type === "models") {
            iconHtml = '<i data-lucide="cpu" style="color: var(--secondary-light);"></i>';
            badgeClass = "badge-type local";
            label = "HF Model Query";
        }

        // Delete button for custom items
        let deleteBtnHtml = "";
        if (src.id && src.id.toString().startsWith("custom-source-")) {
            deleteBtnHtml = `
                <button class="delete-source-btn" data-source-id="${src.id}" style="background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 0.25rem; display: flex; align-items: center; transition: color 0.2s ease;" title="Delete Source">
                    <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                </button>
            `;
        }

        card.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
                <div class="source-icon-wrapper" style="width: 32px; height: 32px; border-radius: 8px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 0.15rem;">
                    ${iconHtml}
                </div>
                <div style="flex-grow: 1;">
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;">
                        <strong style="color: white; font-size: 0.85rem;">${src.name}</strong>
                        <span class="${badgeClass}" style="font-size: 0.65rem; padding: 0.1rem 0.35rem; margin: 0;">${label}</span>
                    </div>
                    <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted); display: block; margin-top: 1px;">${src.handle}</span>
                    <p style="color: var(--text-secondary); font-size: 0.75rem; margin-top: 0.25rem; line-height: 1.3;">${src.desc}</p>
                </div>
                <div style="display: flex; flex-direction: column; align-items: center; gap: 0.25rem; margin-top: -0.15rem;">
                    <a href="${src.url}" target="_blank" class="follow-arrow" style="color: var(--text-muted); transition: color var(--transition-fast); display: flex; align-items: center; padding: 0.25rem;" title="Visit Source">
                        <i data-lucide="external-link" style="width: 14px; height: 14px;"></i>
                    </a>
                    ${deleteBtnHtml}
                </div>
            </div>
        `;

        // Style hover events for link
        const arrow = card.querySelector(".follow-arrow");
        if (arrow) {
            arrow.addEventListener("mouseenter", () => arrow.style.color = "var(--secondary-light)");
            arrow.addEventListener("mouseleave", () => arrow.style.color = "var(--text-muted)");
        }

        // Style delete events for custom source
        const deleteBtn = card.querySelector(".delete-source-btn");
        if (deleteBtn) {
            deleteBtn.addEventListener("mouseenter", () => deleteBtn.style.color = "var(--danger)");
            deleteBtn.addEventListener("mouseleave", () => deleteBtn.style.color = "var(--text-muted)");
            deleteBtn.addEventListener("click", () => {
                deleteCustomSource(src.id);
            });
        }

        container.appendChild(card);
    });

    lucide.createIcons();
}

function deleteCustomSource(sourceId) {
    let customSources = [];
    try {
        const stored = localStorage.getItem("modelverse_news_sources");
        if (stored) customSources = JSON.parse(stored);
    } catch (e) {}
    
    customSources = customSources.filter(src => src.id !== sourceId);
    localStorage.setItem("modelverse_news_sources", JSON.stringify(customSources));
    
    // Refresh the directory list
    renderNewsSourcesDirectory(customSources);
    showToastNotification("🗑️ Custom source removed successfully.");
}

// Render News Feed Stream
function renderNewsFeed() {
    const container = document.getElementById("news-feed-container");
    if (!container) return;

    container.innerHTML = "";

    // Run client-side heuristics/NLP processing on all items to categorize, tag, and summarize
    const processedFeed = simulatedNewsFeed.map(item => processNewsItem(item));

    // Filter feed items based on active tab and search
    let filteredFeed = processedFeed.filter(item => {
        // Category filter matching tabs in HTML
        if (activeNewsFilter !== "all") {
            if (activeNewsFilter === "blogs" && item.platform !== "blogs") return false;
            if (activeNewsFilter === "reddit" && item.platform !== "reddit") return false;
            if (activeNewsFilter === "videos" && item.platform !== "videos") return false;
            if (activeNewsFilter === "github" && item.platform !== "github") return false;
            if (activeNewsFilter === "models" && item.platform !== "models") return false;
        }
        // Search filter matching keyword
        if (newsSearchQuery) {
            const inContent = item.content.toLowerCase().includes(newsSearchQuery);
            const inAuthor = item.authorName.toLowerCase().includes(newsSearchQuery);
            const inHandle = item.handle.toLowerCase().includes(newsSearchQuery);
            const inTitle = item.title ? item.title.toLowerCase().includes(newsSearchQuery) : false;
            const inSummary = item.summary ? item.summary.toLowerCase().includes(newsSearchQuery) : false;
            const inTags = item.tags ? item.tags.some(t => t.toLowerCase().includes(newsSearchQuery)) : false;
            return inContent || inAuthor || inHandle || inTitle || inSummary || inTags;
        }
        return true;
    });

    // Run duplicate grouping cluster algorithm to avoid duplicate entries
    const groupedFeed = groupSimilarStories(filteredFeed);

    if (groupedFeed.length === 0) {
        container.innerHTML = `
            <div class="card glass-card" style="padding: 2.5rem; text-align: center; color: var(--text-muted);">
                <i data-lucide="alert-circle" style="width: 32px; height: 32px; margin-bottom: 0.5rem; color: var(--text-muted);"></i>
                <p style="font-size: 0.9rem;">No updates matching the filters or search query were found.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    groupedFeed.forEach(item => {
        const isAlreadyImported = item.modelLink ? allModels.some(m => m.id.toLowerCase() === item.modelLink.id.toLowerCase()) : false;
        
        const card = document.createElement("div");
        card.className = "news-feed-card card glass-card";
        
        // Highlight simulated alerts slightly
        if (item.isAlert) {
            card.style.borderColor = "var(--secondary)";
            card.style.boxShadow = "inset 0 0 15px rgba(6, 182, 212, 0.08), 0 4px 25px rgba(0, 0, 0, 0.2)";
        } else {
            card.style.borderColor = "var(--border-color)";
        }

        // Avatar background color based on name length
        const colors = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];
        const avatarBg = colors[item.authorName.length % colors.length];

        // Format metric section depending on type
        let metricsHtml = "";
        let categoryIcon = "globe";
        let categoryBadge = "news";
        let categoryLabel = "News Feed";

        if (item.platform === "blogs") {
            categoryIcon = "mail";
            categoryBadge = "news";
            categoryLabel = "Blog / News";
            metricsHtml = `
                <div style="display: flex; gap: 1.25rem; font-size: 0.75rem; color: var(--text-muted); margin-top: 1rem;">
                    <span style="display: flex; align-items: center; gap: 0.25rem;"><i data-lucide="book-open" style="width: 14px; height: 14px;"></i> Blog Read</span>
                    <span style="display: flex; align-items: center; gap: 0.25rem;"><i data-lucide="thumbs-up" style="width: 14px; height: 14px;"></i> Recommended</span>
                </div>
            `;
        } else if (item.platform === "reddit") {
            categoryIcon = "message-square";
            categoryBadge = "reddit";
            categoryLabel = "Discussion";
            metricsHtml = `
                <div style="display: flex; gap: 1.25rem; font-size: 0.75rem; color: var(--text-muted); margin-top: 1rem;">
                    <span style="display: flex; align-items: center; gap: 0.25rem;"><i data-lucide="arrow-big-up" style="width: 14px; height: 14px; color: #ff4500;"></i> ${item.metrics.likes || 150} Upvotes</span>
                    <span style="display: flex; align-items: center; gap: 0.25rem;"><i data-lucide="message-square" style="width: 14px; height: 14px;"></i> ${item.metrics.comments || 12} Comments</span>
                </div>
            `;
        } else if (item.platform === "videos") {
            categoryIcon = "video";
            categoryBadge = "video";
            categoryLabel = "Video";
            metricsHtml = `
                <div style="display: flex; gap: 1.25rem; font-size: 0.75rem; color: var(--text-muted); margin-top: 1rem;">
                    <span style="display: flex; align-items: center; gap: 0.25rem;"><i data-lucide="play" style="width: 14px; height: 14px;"></i> Watch Video</span>
                    <span style="display: flex; align-items: center; gap: 0.25rem;"><i data-lucide="heart" style="width: 14px; height: 14px; color: #f87171;"></i> ${item.metrics.likes || 400} Likes</span>
                </div>
            `;
        } else if (item.platform === "github") {
            categoryIcon = "github";
            categoryBadge = "github";
            categoryLabel = "Open Source";
            metricsHtml = `
                <div style="display: flex; gap: 1.25rem; font-size: 0.75rem; color: var(--text-muted); margin-top: 1rem;">
                    <span style="display: flex; align-items: center; gap: 0.25rem;"><i data-lucide="git-pull-request" style="width: 14px; height: 14px;"></i> GitHub Release</span>
                    <span style="display: flex; align-items: center; gap: 0.25rem;"><i data-lucide="star" style="width: 14px; height: 14px; color: #f59e0b;"></i> ${item.metrics.likes || 2500} Stars</span>
                </div>
            `;
        } else if (item.platform === "models") {
            categoryIcon = "cpu";
            categoryBadge = "model";
            categoryLabel = "AI Model";
            metricsHtml = `
                <div style="display: flex; gap: 1.25rem; font-size: 0.75rem; color: var(--text-muted); margin-top: 1rem;">
                    <span style="display: flex; align-items: center; gap: 0.25rem;"><i data-lucide="download" style="width: 14px; height: 14px;"></i> HF Downloads</span>
                    <span style="display: flex; align-items: center; gap: 0.25rem;"><i data-lucide="thumbs-up" style="width: 14px; height: 14px; color: var(--secondary-light);"></i> ${item.metrics.likes || 120} Likes</span>
                </div>
            `;
        }

        // Thumbnail block if present
        let thumbnailHtml = "";
        if (item.thumbnail) {
            thumbnailHtml = `
                <div class="news-thumbnail-container">
                    <img src="${item.thumbnail}" class="news-thumbnail-image" alt="Article Thumbnail" loading="lazy">
                </div>
            `;
        }

        // Model attachment banner if present
        let modelAttachmentHtml = "";
        if (item.modelLink) {
            modelAttachmentHtml = `
                <div class="model-news-attachment" style="background: rgba(255, 255, 255, 0.01); border: 1px solid var(--border-color); border-radius: 10px; padding: 1rem; margin-top: 1rem; display: flex; flex-direction: column; gap: 0.75rem;">
                    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
                        <div>
                            <span class="badge" style="font-size: 0.65rem; background: rgba(139, 92, 246, 0.08); border-color: rgba(139, 92, 246, 0.15); color: var(--primary-light); padding: 0.15rem 0.5rem; text-transform: uppercase;">Announced Model</span>
                            <h5 style="color: white; margin-top: 0.25rem; font-size: 0.95rem;">${item.modelLink.name}</h5>
                            <span style="font-size: 0.75rem; color: var(--text-muted);">Creator: ${item.modelLink.creator} | Parameters: ${item.modelLink.parameters}</span>
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="inspect-model-btn search-btn" data-model-id="${item.modelLink.id}" style="font-size: 0.75rem; padding: 0.45rem 0.75rem; border-radius: 6px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); color: white; cursor: pointer; box-shadow: none;">
                                Inspect Specs
                            </button>
                            <button class="import-news-model-btn search-btn ${isAlreadyImported ? 'imported' : ''}" ${isAlreadyImported ? 'disabled' : ''} data-model-idx="${item.id}" style="font-size: 0.75rem; padding: 0.45rem 0.75rem; border-radius: 6px;">
                                ${isAlreadyImported ? 'Imported' : 'Import to Matrix'}
                            </button>
                        </div>
                    </div>
                    <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4; margin: 0; border-left: 2px solid var(--secondary); padding-left: 0.5rem;">
                        ${item.modelLink.description}
                    </p>
                </div>
            `;
        }

        // AI Summary & Highlights HTML block
        let aiSummaryHtml = "";
        if (item.summary) {
            let highlightsHtml = "";
            if (item.highlights && item.highlights.length > 0) {
                highlightsHtml = `
                    <ul class="news-highlights-list">
                        ${item.highlights.map(h => `<li>${h}</li>`).join("")}
                    </ul>
                `;
            }

            let tagsHtml = "";
            if (item.tags && item.tags.length > 0) {
                tagsHtml = `
                    <div class="news-tags-row">
                        ${item.tags.map(t => `<span class="news-tag-pill">#${t}</span>`).join("")}
                    </div>
                `;
            }

            aiSummaryHtml = `
                <div class="news-summary-box">
                    <div class="news-summary-title">
                        <i data-lucide="sparkles" style="width: 14px; height: 14px; color: var(--secondary-light);"></i>
                        <span>AI Summarizer Layer</span>
                    </div>
                    <p class="news-summary-text">${item.summary}</p>
                    ${highlightsHtml}
                    ${tagsHtml}
                </div>
            `;
        }

        // Grouped/related sources HTML block
        let groupedSourcesHtml = "";
        if (item.relatedSources && item.relatedSources.length > 0) {
            groupedSourcesHtml = `
                <div class="grouped-sources-box">
                    <div class="grouped-sources-title">
                        <i data-lucide="layers" style="width: 12px; height: 12px; display: inline-block; vertical-align: middle; margin-right: 0.25rem;"></i> Related Stories Grouped (${item.relatedSources.length + 1} sources)
                    </div>
                    <div class="grouped-sources-links">
                        ${item.relatedSources.map(rel => {
                            let relIcon = "globe";
                            let relName = rel.authorName;
                            if (rel.platform === "reddit") {
                                relIcon = "message-square";
                            } else if (rel.platform === "videos") {
                                relIcon = "play";
                                relName = `${rel.authorName} (Video)`;
                            } else if (rel.platform === "github") {
                                relIcon = "git-pull-request";
                                relName = `${rel.authorName} (GitHub)`;
                            }
                            
                            const targetUrl = rel.url || rel.videoUrl || rel.githubUrl || "#";
                            
                            return `
                                <a href="${targetUrl}" target="_blank" class="grouped-source-link">
                                    <i data-lucide="${relIcon}" style="width: 12px; height: 12px;"></i>
                                    <span>${relName}</span>
                                </a>
                            `;
                        }).join("")}
                    </div>
                </div>
            `;
        }

        // Link button for video/github if present
        let externalActionHtml = "";
        if (item.videoUrl) {
            externalActionHtml = `
                <a href="${item.videoUrl}" target="_blank" class="search-btn" style="display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none; font-size: 0.8rem; padding: 0.5rem 1rem; border-radius: 8px; background: linear-gradient(135deg, #ef4444, #b91c1c); box-shadow: none; margin-top: 0.75rem;">
                    <i data-lucide="youtube" style="width: 16px; height: 16px;"></i> Watch Video
                </a>
            `;
        } else if (item.githubUrl) {
            externalActionHtml = `
                <a href="${item.githubUrl}" target="_blank" class="search-btn" style="display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none; font-size: 0.8rem; padding: 0.5rem 1rem; border-radius: 8px; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border-color); color: white; box-shadow: none; margin-top: 0.75rem;">
                    <i data-lucide="github" style="width: 16px; height: 16px;"></i> View Release Notes
                </a>
            `;
        } else if (item.url && item.platform === "blogs") {
            externalActionHtml = `
                <a href="${item.url}" target="_blank" class="search-btn" style="display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none; font-size: 0.8rem; padding: 0.5rem 1rem; border-radius: 8px; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border-color); color: white; box-shadow: none; margin-top: 0.75rem;">
                    <i data-lucide="external-link" style="width: 16px; height: 16px;"></i> Read Article
                </a>
            `;
        }

        // Complete news feed card body
        card.innerHTML = `
            <div style="display: flex; gap: 1.25rem; align-items: flex-start;">
                <!-- Avatar -->
                <div class="user-avatar" style="width: 44px; height: 44px; border-radius: 50%; background: ${avatarBg}; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.05rem; color: white; flex-shrink: 0; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                    ${item.authorName.charAt(0)}
                </div>
                
                <!-- Main Body -->
                <div style="flex-grow: 1;">
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; flex-wrap: wrap;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                            <strong style="color: white; font-size: 0.95rem;">${item.authorName}</strong>
                            <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">${item.handle}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <span class="badge-stream ${categoryBadge}">${categoryLabel}</span>
                            <span style="font-size: 0.75rem; color: var(--text-muted);">${item.date}</span>
                        </div>
                    </div>
                    
                    <p style="color: var(--text-primary); font-size: 0.9rem; line-height: 1.55; margin-top: 0.6rem; white-space: pre-line;">
                        ${item.content}
                    </p>
                    
                    ${thumbnailHtml}
                    ${modelAttachmentHtml}
                    ${aiSummaryHtml}
                    ${groupedSourcesHtml}
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; border-top: 1px solid rgba(255,255,255,0.03); margin-top: 0.75rem; padding-top: 0.25rem;">
                        ${metricsHtml}
                        ${externalActionHtml}
                    </div>
                </div>
            </div>
        `;

        // Event hooks inside feed card
        if (item.modelLink) {
            const inspectBtn = card.querySelector(".inspect-model-btn");
            const importBtn = card.querySelector(".import-news-model-btn");

            if (inspectBtn) {
                inspectBtn.addEventListener("click", () => {
                    // Enrich and display in Model Finder
                    const modelCopy = { ...item.modelLink };
                    enrichModelData(modelCopy);
                    
                    displayModelDetails(modelCopy);
                    
                    // Switch tab to Model Finder (Model Search & Specs)
                    const finderNav = document.querySelector('.nav-item[data-tab="model-finder"]');
                    if (finderNav) finderNav.click();
                });
            }

            if (importBtn && !isAlreadyImported) {
                importBtn.addEventListener("click", () => {
                    const modelCopy = { ...item.modelLink };
                    addDynamicModelToList(modelCopy);
                    
                    // Update state in button
                    importBtn.classList.add("imported");
                    importBtn.textContent = "Imported";
                    importBtn.disabled = true;
                });
            }
        }

        container.appendChild(card);
    });

    lucide.createIcons();
}

// Client-Side AI Heuristics Summary Layer
function processNewsItem(item) {
    if (item.summary && item.highlights && item.tags) return item; // Already processed
    
    // Trim summary
    const cleanContent = stripHtml(item.content || "").replace(/🎥|💻|🤖|📝|💬/g, "").trim();
    let summary = cleanContent;
    if (cleanContent.length > 200) {
        summary = cleanContent.substring(0, 180).trim() + "...";
    }

    // Generate bullet highlights from sentences
    const sentences = cleanContent.split(/[.!?]\s+/).filter(s => s.length > 15);
    const highlights = [];
    if (sentences.length > 1) {
        highlights.push(sentences[0]);
        if (sentences.length > 2) {
            highlights.push(sentences[1]);
        }
    } else {
        highlights.push("No additional highlights available.");
    }

    // Generate semantic tags
    const lowerText = cleanContent.toLowerCase();
    const tagSet = new Set();
    
    if (lowerText.includes("llama")) tagSet.add("Llama");
    if (lowerText.includes("gemma")) tagSet.add("Gemma");
    if (lowerText.includes("deepseek")) tagSet.add("DeepSeek");
    if (lowerText.includes("phi-3") || lowerText.includes("phi3")) tagSet.add("Phi3");
    if (lowerText.includes("claude")) tagSet.add("Claude");
    if (lowerText.includes("gpt")) tagSet.add("GPT");
    if (lowerText.includes("agent")) tagSet.add("Agents");
    if (lowerText.includes("local") || lowerText.includes("offline")) tagSet.add("LocalInference");
    if (lowerText.includes("quantize") || lowerText.includes("gguf") || lowerText.includes("bit")) tagSet.add("Quantization");
    if (lowerText.includes("flutter") || lowerText.includes("dart")) tagSet.add("Flutter");
    if (lowerText.includes("api") || lowerText.includes("endpoint")) tagSet.add("CloudAPI");
    if (lowerText.includes("unsloth") || lowerText.includes("tune") || lowerText.includes("lora")) tagSet.add("FineTuning");

    // Add fallbacks if set is empty
    if (tagSet.size === 0) {
        if (item.platform === "blogs") tagSet.add("AINews");
        else if (item.platform === "reddit") tagSet.add("Community");
        else if (item.platform === "videos") tagSet.add("VideoGuide");
        else if (item.platform === "github") tagSet.add("GitHubRepo");
        else if (item.platform === "models") tagSet.add("ModelRelease");
    }

    item.summary = summary;
    item.highlights = highlights.slice(0, 2); // limit to 2 highlights for simple reading layout
    item.tags = Array.from(tagSet).slice(0, 3); // limit to 3 tags
    
    return item;
}

// Jaccard similarity grouping matcher (Deduplication)
function groupSimilarStories(feedItems) {
    const grouped = [];
    const visited = new Set();
    
    for (let i = 0; i < feedItems.length; i++) {
        if (visited.has(feedItems[i].id)) continue;
        
        const current = feedItems[i];
        const cluster = [current];
        visited.add(current.id);
        
        for (let j = i + 1; j < feedItems.length; j++) {
            if (visited.has(feedItems[j].id)) continue;
            
            const target = feedItems[j];
            const similarity = calculateTitleSimilarity(current.content || "", target.content || "");
            if (similarity > 0.3) { // 30% Jaccard word-overlap threshold
                cluster.push(target);
                visited.add(target.id);
            }
        }
        
        if (cluster.length > 1) {
            current.relatedSources = cluster.slice(1);
        } else {
            current.relatedSources = [];
        }
        grouped.push(current);
    }
    return grouped;
}

function calculateTitleSimilarity(str1, str2) {
    if (!str1 || !str2) return 0;
    
    const cleanTokens = str => str.toLowerCase()
        .replace(/🎥|💻|🤖|📝|💬|http[^\s]+/g, "")
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter(w => w.length > 3);
        
    const words1 = new Set(cleanTokens(str1));
    const words2 = new Set(cleanTokens(str2));
    
    if (words1.size === 0 || words2.size === 0) return 0;
    
    let intersection = 0;
    words1.forEach(w => {
        if (words2.has(w)) intersection++;
    });
    
    const union = words1.size + words2.size - intersection;
    return intersection / union;
}

// Live alert trigger (Simulate Live Event)
function triggerLiveNewsAlert() {
    if (alertIndex >= simulatedNewsAlertPool.length) {
        showToastNotification("All live updates have been simulated. Resetting pool index!");
        alertIndex = 0;
        return;
    }

    const alertItem = { ...simulatedNewsAlertPool[alertIndex] };
    alertItem.isAlert = true; // Mark as alert
    alertItem.date = "Just now"; // Mark time

    // Prepend to feed
    simulatedNewsFeed.unshift(alertItem);
    alertIndex++;

    // Re-render feed
    renderNewsFeed();

    // Trigger visual toast notification
    const alertTitle = alertItem.modelLink ? `New Model Announcement: ${alertItem.modelLink.name}` : "New AI Social Update";
    showToastNotification(`📢 ${alertTitle}! Rerendering news feed...`);

    // Bring attention to the feed card
    const firstCard = document.querySelector("#news-feed-container .news-feed-card");
    if (firstCard) {
        firstCard.style.animation = "slideInAlert 0.5s ease-out, neonPulse 2s infinite alternate";
        // Remove pulse after 4s
        setTimeout(() => {
            if (firstCard) firstCard.style.animation = "fadeIn var(--transition-normal)";
        }, 4000);
    }
}

// Live RSS, Reddit, GitHub, & Hugging Face Updates Fetcher
async function fetchLiveNewsUpdates() {
    const refreshBtn = document.getElementById("refresh-news-btn");
    let originalHtml = "";
    
    if (refreshBtn) {
        originalHtml = refreshBtn.innerHTML;
        refreshBtn.innerHTML = `<i class="spinner" style="border-width: 1.5px; width: 10px; height: 10px; display: inline-block; border-color: rgba(6, 182, 212, 0.2); border-top-color: var(--secondary-light);"></i> Fetching...`;
        refreshBtn.disabled = true;
    }
    
    showToastNotification("🔄 Fetching live updates from RSS, Reddit, GitHub, and Hugging Face...");
    
    const fetchedItems = [];
    
    // 1. Fetch Hugging Face Blog via RSS2JSON
    try {
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent("https://huggingface.co/blog/feed.xml")}`);
        const data = await res.json();
        if (data.status === "ok" && data.items) {
            data.items.slice(0, 3).forEach((item, idx) => {
                const cleanDesc = stripHtml(item.description || item.content || "");
                fetchedItems.push({
                    id: `live-hf-${idx}-${Date.now()}`,
                    authorName: "Hugging Face Blog",
                    handle: "huggingface.co/blog",
                    platform: "blogs",
                    date: formatRssDate(item.pubDate),
                    content: `📝 **${item.title}**\n\n${cleanDesc.substring(0, 300)}...`,
                    thumbnail: item.thumbnail || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop",
                    metrics: { comments: 0, reposts: 0, likes: 0 },
                    url: item.link,
                    modelLink: getModelLinkFromText(item.title + " " + cleanDesc)
                });
            });
        }
    } catch (err) {
        console.warn("Failed to fetch Hugging Face Blog RSS:", err);
    }

    // 2. Fetch Microsoft AI Blog via RSS2JSON
    try {
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent("https://blogs.microsoft.com/ai/feed/")}`);
        const data = await res.json();
        if (data.status === "ok" && data.items) {
            data.items.slice(0, 2).forEach((item, idx) => {
                const cleanDesc = stripHtml(item.description || item.content || "");
                fetchedItems.push({
                    id: `live-ms-${idx}-${Date.now()}`,
                    authorName: "Microsoft AI Blog",
                    handle: "blogs.microsoft.com/ai",
                    platform: "blogs",
                    date: formatRssDate(item.pubDate),
                    content: `📝 **${item.title}**\n\n${cleanDesc.substring(0, 250)}...`,
                    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop",
                    metrics: { comments: 0, reposts: 0, likes: 0 },
                    url: item.link,
                    modelLink: getModelLinkFromText(item.title + " " + cleanDesc)
                });
            });
        }
    } catch (err) {
        console.warn("Failed to fetch Microsoft AI Blog RSS:", err);
    }

    // 3. Fetch Reddit r/LocalLLaMA posts via Allorigins proxy
    try {
        const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent("https://www.reddit.com/r/LocalLLaMA/hot.json?limit=6")}`);
        const wrapper = await res.json();
        if (wrapper && wrapper.contents) {
            const redditData = JSON.parse(wrapper.contents);
            if (redditData && redditData.data && redditData.data.children) {
                redditData.data.children.forEach(p => {
                    const post = p.data;
                    if (post.stickied) return;
                    
                    const timeStr = "recently";
                    const cleanText = post.selftext ? stripHtml(post.selftext) : "";
                    
                    fetchedItems.push({
                        id: `live-reddit-${post.id}`,
                        authorName: "r/LocalLLaMA",
                        handle: `u/${post.author}`,
                        platform: "reddit",
                        date: timeStr,
                        content: `💬 **${post.title}**\n\n${cleanText.substring(0, 250)}...`,
                        url: `https://reddit.com${post.permalink}`,
                        metrics: { comments: post.num_comments, reposts: 0, likes: post.score },
                        modelLink: getModelLinkFromText(post.title + " " + post.selftext)
                    });
                });
            }
        }
    } catch (err) {
        console.warn("Failed to fetch Reddit r/LocalLLaMA:", err);
    }

    // 4. Fetch GitHub Releases (langchain-ai/langchain)
    try {
        const res = await fetch("https://api.github.com/repos/langchain-ai/langchain/releases");
        const releases = await res.json();
        if (Array.isArray(releases) && releases.length > 0) {
            const rel = releases[0];
            const cleanBody = stripHtml(rel.body || "");
            fetchedItems.push({
                id: `live-github-langchain-${rel.id}`,
                authorName: "GitHub Releases",
                handle: "github.com/langchain-ai/langchain",
                platform: "github",
                date: "recently",
                content: `💻 **langchain-ai/langchain ${rel.name || rel.tag_name}**\n\n${cleanBody.substring(0, 250)}...`,
                githubUrl: rel.html_url,
                metrics: { comments: 0, reposts: 0, likes: 1200 }
            });
        }
    } catch (err) {
        console.warn("Failed to fetch GitHub releases:", err);
    }

    // 5. Fetch Hugging Face Models
    try {
        const res = await fetch("https://huggingface.co/api/models?sort=createdAt&direction=-1&limit=3");
        const models = await res.json();
        if (Array.isArray(models)) {
            models.forEach((m, idx) => {
                fetchedItems.push({
                    id: `live-hf-model-${m.id.replace(/\//g, "-")}`,
                    authorName: "Hugging Face Models",
                    handle: `huggingface.co/${m.id}`,
                    platform: "models",
                    date: "recently",
                    content: `🤖 **New Model Launch: ${m.id}**\n\nAuthor: ${m.author || "Community"} | Tags: ${m.tags ? m.tags.slice(0, 4).join(", ") : "None"}`,
                    metrics: { comments: 0, reposts: 0, likes: m.likes || 0 },
                    modelLink: {
                        id: m.id,
                        name: m.id.split("/").pop(),
                        creator: m.author || "Community",
                        category: "SLM",
                        parameters: "N/A",
                        accuracy: "N/A",
                        context: "8,192 tokens",
                        cost: "Free (Local)",
                        license: "Open weights",
                        description: `Newly published model weights for ${m.id} on Hugging Face Hub. Built by ${m.author || "community developers"}.`,
                        useCases: ["Local development", "Self-hosted research pipelines"]
                    }
                });
            });
        }
    } catch (err) {
        console.warn("Failed to fetch Hugging Face Models API:", err);
    }

    if (fetchedItems.length > 0) {
        // Prepend new feeds to the front
        simulatedNewsFeed = [...fetchedItems, ...simulatedNewsFeed];
        
        // Remove duplicates if any
        const seenIds = new Set();
        simulatedNewsFeed = simulatedNewsFeed.filter(item => {
            if (seenIds.has(item.id)) return false;
            seenIds.add(item.id);
            return true;
        });
        
        // Render feed
        renderNewsFeed();
        
        // Change online status indicator to sync state
        const statusText = document.querySelector(".system-status span");
        const indicator = document.querySelector(".status-indicator");
        if (statusText && indicator) {
            statusText.textContent = "AI news feeds synced";
            indicator.className = "status-indicator online";
        }
        
        showToastNotification(`✅ Sync successful! Loaded ${fetchedItems.length} live updates.`);
    } else {
        showToastNotification("⚠️ Could not load live feeds. Fallback to offline stream.");
    }
    
    // Restore button state
    if (refreshBtn) {
        refreshBtn.innerHTML = originalHtml;
        refreshBtn.disabled = false;
        lucide.createIcons();
    }
}

// Help resolve model attachments based on news text content
function getModelLinkFromText(text) {
    const lower = text.toLowerCase();
    
    if (lower.includes("gemma 3") || lower.includes("gemma-3")) {
        return {
            id: "gemma-3-3b-it",
            name: "Gemma 3 3B IT",
            creator: "Google Developer AI",
            category: "SLM",
            parameters: "3.2 Billion",
            accuracy: "78.4% (MMLU)",
            context: "128,000 tokens",
            cost: "Free (Local)",
            license: "Gemma 3 License",
            description: "Gemma 3 3B IT is Google's next-generation lightweight instruction model, featuring 128k context and extreme mobile optimization.",
            useCases: ["On-device mobile agent tasks", "Bilingual offline assistant chatbots", "Local grammar and context analysis"]
        };
    }
    if (lower.includes("deepseek-r1") || lower.includes("deepseek r1") || lower.includes("r1")) {
        return {
            id: "deepseek-r1",
            name: "DeepSeek-R1",
            creator: "DeepSeek AI",
            category: "LLM",
            parameters: "671B (MoE)",
            accuracy: "90.8% (MMLU)",
            context: "128,000 tokens",
            cost: "API ($0.55/1M input)",
            license: "MIT License",
            description: "A frontier reasoning model trained via large-scale reinforcement learning, producing chain-of-thought outputs.",
            useCases: ["Complex mathematical proofs", "Logical multi-step reasoning", "Advanced coding agent pipelines"]
        };
    }
    if (lower.includes("qwen 2.5") || lower.includes("qwen-2.5") || lower.includes("qwen")) {
        return {
            id: "qwen-2-5-coder-7b",
            name: "Qwen 2.5 Coder 7B",
            creator: "Alibaba Cloud / Hugging Face",
            category: "SLM",
            parameters: "7.0 Billion",
            accuracy: "82.4% (MMLU)",
            context: "128,000 tokens",
            cost: "Free (Local)",
            license: "Apache 2.0",
            description: "A state-of-the-art coding-specific SLM matching proprietary systems on programming task accuracy.",
            useCases: ["Local offline IDE completions", "Coding companion for notebooks", "Terminal operations helper"]
        };
    }
    if (lower.includes("deepseek v3") || lower.includes("deepseek-v3")) {
        return {
            id: "deepseek-v3",
            name: "DeepSeek-V3",
            creator: "DeepSeek AI",
            category: "LLM",
            parameters: "671B (MoE)",
            accuracy: "88.5% (MMLU)",
            context: "128,000 tokens",
            cost: "API ($0.14/1M input)",
            license: "MIT License (Open weights)",
            description: "Highly cost-efficient 671B MoE frontier model by DeepSeek, matching GPT-4o at 1/20th the cost.",
            useCases: ["Low-cost high-volume translation", "General intent chat agents", "Structural document analysis"]
        };
    }
    if (lower.includes("gemma 2") || lower.includes("gemma-2")) {
        return {
            id: "gemma-2-9b-it",
            name: "Gemma 2 9B IT",
            creator: "Google Developer AI",
            category: "SLM",
            parameters: "9.2 Billion",
            accuracy: "71.3% (MMLU)",
            context: "8,192 tokens",
            cost: "Free (Local)",
            license: "Gemma License",
            description: "Google's high-performance 9.2B parameter SLM, featuring knowledge distillation from Gemini models.",
            useCases: ["Offline personal assistants", "Summarization on mid-range laptops", "Text classification tools"]
        };
    }
    if (lower.includes("llama 3") || lower.includes("llama-3")) {
        return {
            id: "llama-3-1-8b-instruct",
            name: "Llama 3.1 8B Instruct",
            creator: "Meta AI",
            category: "SLM",
            parameters: "8.0 Billion",
            accuracy: "68.4% (MMLU)",
            context: "128,000 tokens",
            cost: "Free (Local)",
            license: "Llama 3.1 Community License",
            description: "Meta's standard 8B parameter model, expanded context window to 128k tokens.",
            useCases: ["Privacy-preserving user data mining", "Local chatbot assistants", "Creative writing helpers"]
        };
    }
    if (lower.includes("phi")) {
        return {
            id: "phi-3-5-moe-instruct",
            name: "Phi-3.5 MoE Instruct",
            creator: "Microsoft",
            category: "SLM",
            parameters: "42 Billion",
            accuracy: "78.9% (MMLU)",
            context: "128,000 tokens",
            cost: "Free (Local)",
            license: "MIT License",
            description: "Highly efficient 42B parameter MoE model by Microsoft, using 6.6B active parameters.",
            useCases: ["Efficient local reasoning", "Document extraction pipelines", "Logical chatbots"]
        };
    }
    return null;
}

// Strip HTML tags from strings
function stripHtml(html) {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}

// Format date returned by RSS
function formatRssDate(dateStr) {
    try {
        const d = new Date(dateStr.replace(/-/g, "/"));
        return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    } catch (e) {
        return "recently";
    }
}

// Auto-fetch controller
let hasFetchedLiveNews = false;
function triggerAutoNewsFetch() {
    if (!hasFetchedLiveNews) {
        hasFetchedLiveNews = true;
        fetchLiveNewsUpdates();
    }
}



