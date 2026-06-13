// Centralized Data Storage
// All static arrays and objects are stored here for easy maintenance.

const curatedModels = [
    {
        id: "gemini-1.5-pro",
        name: "Gemini 1.5 Pro",
        creator: "Google Developer AI",
        category: "LLM",
        parameters: "N/A (Multi-Expert)",
        accuracy: "90.8% (MMLU)",
        context: "2,000,000 tokens",
        cost: "Paid / Free tier",
        license: "Proprietary",
        description: "Gemini 1.5 Pro is Google's state-of-the-art multimodal model. It features a massive context window of 2 million tokens, enabling the model to process hours of video, audio, or millions of lines of code. It excels at complex reasoning, mathematics, coding, and multilingual tasks.",
        useCases: [
            "Advanced logical reasoning & multi-step problem solving",
            "Analyzing massive codebases or entire documents in a single prompt",
            "High-quality translation, summarization, and creative writing",
            "Multimodal inputs (Processing Video + Audio + Images simultaneously)"
        ],
        specs: {
            arch: "Mixture-of-Experts (MoE)",
            latency: "Medium (~40-60 tokens/sec)",
            hardware: "Cloud TPU v5e/v5p cluster (Cloud API)",
            quantization: "Not applicable (Cloud Service)"
        },
        pricing: {
            input: "$1.25",
            output: "$5.00",
            note: "Free tier in Google AI Studio up to 15 RPM / 32k context."
        },
        flutter: {
            intro: "This model runs in the cloud. Integrate it into your Flutter app using the official Google Generative AI Dart SDK:",
            pubspec: "dependencies:\n  flutter:\n    sdk: flutter\n  google_generative_ai: ^0.4.0",
            main: "import 'package:google_generative_ai/google_generative_ai.dart';\n\nFuture<String> generateText(String prompt) async {\n  final apiKey = const String.fromEnvironment('${CONFIG.API_KEYS.GEMINI}');\n  \n  final model = GenerativeModel(\n    model: 'gemini-1.5-pro',\n    apiKey: apiKey,\n  );\n  \n  final response = await model.generateContent([Content.text(prompt)]);\n  return response.text ?? 'Empty response';\n}"
        }
    },
    {
        id: "gemini-1.5-flash",
        name: "Gemini 1.5 Flash",
        creator: "Google Developer AI",
        category: "LLM",
        parameters: "N/A (MoE)",
        accuracy: "78.9% (MMLU)",
        context: "1,000,000 tokens",
        cost: "Paid / Free tier",
        license: "Proprietary",
        description: "Gemini 1.5 Flash is Google's lightweight, fast, and highly cost-efficient model. It is designed for high-frequency, low-latency tasks. It inherits the same long context capacity (up to 1M tokens) of the Gemini 1.5 family, making it incredibly versatile for general application workloads.",
        useCases: [
            "High-speed conversational agents and chatbots",
            "Text summarization, structural data extraction, and indexing",
            "General developer workflows with short-to-medium prompts",
            "Cost-sensitive production deployments at scale"
        ],
        specs: {
            arch: "Mixture-of-Experts (MoE) - Distilled",
            latency: "Fast (~90-120 tokens/sec)",
            hardware: "Cloud TPU v5e cluster (Cloud API)",
            quantization: "Not applicable (Cloud Service)"
        },
        pricing: {
            input: "$0.075",
            output: "$0.30",
            note: "Free tier in Google AI Studio up to 15 RPM / 1M context."
        },
        flutter: {
            intro: "Integrate Gemini 1.5 Flash in your Flutter app for fast cloud inference at near-zero cost during development:",
            pubspec: "dependencies:\n  flutter:\n    sdk: flutter\n  google_generative_ai: ^0.4.0",
            main: "import 'package:google_generative_ai/google_generative_ai.dart';\n\nFuture<String> generateText(String prompt) async {\n  final apiKey = const String.fromEnvironment('${CONFIG.API_KEYS.GEMINI}');\n  \n  final model = GenerativeModel(\n    model: 'gemini-1.5-flash',\n    apiKey: apiKey,\n  );\n  \n  final response = await model.generateContent([Content.text(prompt)]);\n  return response.text ?? 'Empty response';\n}"
        }
    },
    {
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
            "Complex data analysis, chart parsing, and vision recognition",
            "Enterprise workflows requiring OpenAI ecosystems"
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
        },
        flutter: {
            intro: "Connect to OpenAI's GPT-4o API in Dart using the community-maintained `dart_openai` or `langchain_openai` packages:",
            pubspec: "dependencies:\n  flutter:\n    sdk: flutter\n  dart_openai: ^5.1.0",
            main: "import 'package:dart_openai/dart_openai.dart';\n\nFuture<String> askGPT4o(String prompt) async {\n  OpenAI.apiKey = '${CONFIG.API_KEYS.OPENAI}';\n  \n  OpenAIChatCompletionModel chatCompletion = await OpenAI.instance.chat.create(\n    model: 'gpt-4o',\n    messages: [\n      OpenAIChatCompletionChoiceMessageModel(\n        content: [OpenAIChatCompletionChoiceMessageContentItemModel.text(prompt)],\n        role: OpenAIChatMessageRole.user,\n      ),\n    ],\n  );\n  \n  return chatCompletion.choices.first.message.content?.first.text ?? '';\n}"
        }
    },
    {
        id: "claude-35-sonnet",
        name: "Claude 3.5 Sonnet",
        creator: "Anthropic",
        category: "LLM",
        parameters: "N/A",
        accuracy: "88.7% (MMLU)",
        context: "200,000 tokens",
        cost: "Paid",
        license: "Proprietary",
        description: "Claude 3.5 Sonnet sets new industry benchmarks for graduate-level reasoning, undergraduate-level knowledge, and coding proficiency. It features a friendly, helpful conversational tone and is highly effective at writing, parsing visual charts, and multi-step reasoning.",
        useCases: [
            "High-precision software engineering and architecture planning",
            "Analysis of financial charts, PDFs, and structural tables",
            "Creative writing, copyediting, and empathetic customer support",
            "Retrieval-Augmented Generation (RAG) on long documents"
        ],
        specs: {
            arch: "Transformer",
            latency: "Medium (~50-70 tokens/sec)",
            hardware: "AWS Bedrock / Google Cloud Vertex (Cloud API)",
            quantization: "Not applicable (Cloud Service)"
        },
        pricing: {
            input: "$3.00",
            output: "$15.00",
            note: "Paid only. Offered through Anthropic Console, AWS, or GCP."
        },
        flutter: {
            intro: "Connect to Anthropic's Claude API in Flutter using standard HTTP POST requests or community langchain dart packages:",
            pubspec: "dependencies:\n  flutter:\n    sdk: flutter\n  http: ^1.2.0",
            main: "import 'dart:convert';\nimport 'package:http/http.dart' as http;\n\nFuture<String> askClaude(String prompt) async {\n  final url = Uri.parse('https://api.anthropic.com/v1/messages');\n  final response = await http.post(url, headers: {\n    'content-type': 'application/json',\n    'x-api-key': '${CONFIG.API_KEYS.CLAUDE}',\n    'anthropic-version': '2023-06-01',\n  }, body: jsonEncode({\n    'model': 'claude-3-5-sonnet-20240620',\n    'max_tokens': 1024,\n    'messages': [{'role': 'user', 'content': prompt}]\n  }));\n  \n  final data = jsonDecode(response.body);\n  return data['content'][0]['text'] ?? '';\n}"
        }
    },
    {
        id: "gemma-2-2b",
        name: "Gemma 2 2B",
        creator: "Google Developer AI",
        category: "SLM",
        parameters: "2.6 Billion",
        accuracy: "52.4% (MMLU)",
        context: "8,192 tokens",
        cost: "$0.00 (Local)",
        license: "Open-weights (Gemma Terms)",
        description: "Gemma 2 2B is an ultra-compact open-weights model built from the same research and technology used to create the Gemini models. It is highly optimized to run locally on resource-constrained devices like mobile phones, laptops, and web browsers, offering state-of-the-art capability for its size.",
        useCases: [
            "On-device mobile chat and digital assistants",
            "Offline text grammar check, classification, and summarization",
            "Edge deployment in areas with poor internet connectivity",
            "Personal data processing (100% private on-device)"
        ],
        specs: {
            arch: "Decoder-only Transformer",
            latency: "Very Fast (~15-30 tok/s on phone CPU)",
            hardware: "Mobile CPU/GPU (runs on standard 4GB RAM phones)",
            quantization: "INT4, INT8, FP16 (GGUF or MediaPipe bin)"
        },
        pricing: {
            input: "$0.00 (Local)",
            output: "$0.00 (Local)",
            note: "Free to download, modify, and distribute on-device."
        },
        flutter: {
            intro: "Run Gemma 2B locally offline on mobile devices (Android/iOS) using Google's MediaPipe Tasks LLM Inference API:",
            pubspec: "dependencies:\n  flutter:\n    sdk: flutter\n  mediapipe_genai: ^0.1.0 # MediaPipe bindings",
            main: "import 'package:mediapipe_genai/mediapipe_genai.dart';\n\n// Run fully offline on device!\nFuture<String> askLocalGemma(String prompt) async {\n  final options = LlmInferenceOptions(\n    modelPath: '/path/to/gemma-2b-it-cpu.bin', // Downloaded locally\n    maxTokens: 256,\n    temperature: 0.7,\n  );\n  final inference = await LlmInference.create(options);\n  final response = await inference.generateResponse(prompt);\n  inference.close();\n  return response;\n}"
        }
    },
    {
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
            "Private data analysis on high-end desktop/macOS apps",
            "Self-hosted server deployments for small businesses"
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
        },
        flutter: {
            intro: "Run Gemma 9B on Apple macOS or high-end mobile devices using `llama_cpp_dart` by loading a quantized GGUF file:",
            pubspec: "dependencies:\n  flutter:\n    sdk: flutter\n  llama_cpp_dart: ^0.2.1",
            main: "import 'package:llama_cpp_dart/llama_cpp_dart.dart';\n\nFuture<String> runLocalLlama(String prompt) async {\n  // Load 4-bit GGUF model from local storage\n  final params = ModelParams()..useGpu = true..gpuLayers = 12;\n  final model = LlamaModel('/path/to/gemma-2-9b-q4_k_m.gguf', params);\n  final context = LlamaContext(model, ContextParams()..contextSize = 2048);\n  \n  final tokens = context.tokenize(prompt, addBos: true);\n  context.eval(tokens);\n  return context.generateResponse();\n}"
        }
    },
    {
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
            "Offline reading comprehension and educational quizzes",
            "Commercial edge deployments without license constraints"
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
        },
        flutter: {
            intro: "Integrate Phi-3 in Flutter via `onnxruntime` or `llama.cpp` using Dart FFI bindings for GGUF formats:",
            pubspec: "dependencies:\n  flutter:\n    sdk: flutter\n  llama_cpp_dart: ^0.2.1",
            main: "import 'package:llama_cpp_dart/llama_cpp_dart.dart';\n\nFuture<String> runPhi3(String prompt) async {\n  final params = ModelParams()..useGpu = true;\n  final model = LlamaModel('/path/to/phi-3-mini-q4.gguf', params);\n  final context = LlamaContext(model, ContextParams()..contextSize = 1024);\n  \n  final tokens = context.tokenize(prompt, addBos: true);\n  context.eval(tokens);\n  return context.generateResponse();\n}"
        }
    },
    {
        id: "llama-3-8b",
        name: "Llama 3 8B",
        creator: "Meta AI",
        category: "SLM",
        parameters: "8.0 Billion",
        accuracy: "68.4% (MMLU)",
        context: "8,192 tokens",
        cost: "$0.00 (Local)",
        license: "Llama 3 Community License",
        description: "Llama 3 8B is Meta's next-generation open weights model. It features a new vocabulary size of 128k tokens and is trained on over 15 trillion tokens. It excels at coding support, text synthesis, translation, and structured output formatting.",
        useCases: [
            "Local offline coding assistants",
            "General-purpose offline assistants with high vocabulary coverage",
            "Private information extraction and database summarization",
            "Self-hosted developer sandboxes"
        ],
        specs: {
            arch: "Grouped Query Attention (GQA) Transformer",
            latency: "Medium-Fast (~10-18 tok/s on mobile GPU)",
            hardware: "Requires 6GB-8GB RAM phone or laptop CPU",
            quantization: "INT4, INT8, FP16 (GGUF format)"
        },
        pricing: {
            input: "$0.00 (Local)",
            output: "$0.00 (Local)",
            note: "Free under Llama 3 license for up to 700M monthly active users."
        },
        flutter: {
            intro: "Implement local llama 3 inside your Flutter project using llama.cpp bindings, utilizing FFI:",
            pubspec: "dependencies:\n  flutter:\n    sdk: flutter\n  llama_cpp_dart: ^0.2.1",
            main: "import 'package:llama_cpp_dart/llama_cpp_dart.dart';\n\nFuture<String> runLlama3(String prompt) async {\n  final params = ModelParams()..useGpu = true;\n  final model = LlamaModel('/path/to/llama-3-8b-q4_k_m.gguf', params);\n  final context = LlamaContext(model, ContextParams()..contextSize = 2048);\n  \n  final tokens = context.tokenize(prompt, addBos: true);\n  context.eval(tokens);\n  return context.generateResponse();\n}"
        }
    }
];


const marketReleaseFeed = [
    {
        id: "deepseek-v3",
        name: "DeepSeek-V3",
        creator: "DeepSeek AI",
        releaseDate: "December 2024",
        category: "LLM",
        parameters: "671B (MoE)",
        context: "128,000 tokens",
        cost: "API ($0.14/1M input)",
        license: "MIT License (Open weights)",
        highlight: "The most cost-efficient open-weights reasoning model, matching GPT-4o performance at a fraction of the cost.",
        trainingHighlight: "Trained on 14.8 trillion high-quality tokens of internet text, code repositories, and mathematical proofs, followed by supervised fine-tuning and DPO preference alignment.",
        laypersonTarget: "For developers who want cheap, top-tier reasoning and coding capability without paying high OpenAI fees."
    },
    {
        id: "gemma-2-9b-it",
        name: "Gemma 2 9B IT",
        creator: "Google Developer AI",
        releaseDate: "July 2024",
        category: "SLM",
        parameters: "9.2 Billion",
        context: "8,192 tokens",
        cost: "Free (Local)",
        license: "Open weights (Gemma Terms)",
        highlight: "Google's lightweight instruction-tuned model, outperforming other open models twice its size. Optimized for fast local execution.",
        trainingHighlight: "Trained on 8 trillion tokens of text, mathematical datasets, and programming code, using novel knowledge distillation methods from larger Gemini models.",
        laypersonTarget: "For users who want a smart, offline writing and coding helper that runs locally on personal laptops and premium smartphones."
    },
    {
        id: "claude-3-5-haiku",
        name: "Claude 3.5 Haiku",
        creator: "Anthropic",
        releaseDate: "November 2024",
        category: "LLM",
        parameters: "N/A (Lightweight)",
        context: "200,000 tokens",
        cost: "API ($0.80/1M input)",
        license: "Proprietary",
        highlight: "Anthropic's fastest model. Blends high reasoning speed with excellent coding capability and huge context capacity.",
        trainingHighlight: "Trained on Anthropic's curated dataset of multilingual conversations, long documents, and programming files, optimized specifically for low latency.",
        laypersonTarget: "For real-time chatbots, auto-routing agents, and high-frequency code editors who need answers in less than a second."
    },
    {
        id: "llama-3-1-8b-instruct",
        name: "Llama 3.1 8B Instruct",
        creator: "Meta AI",
        releaseDate: "July 2024",
        category: "SLM",
        parameters: "8.0 Billion",
        context: "128,000 tokens",
        cost: "Free (Local)",
        license: "Llama 3.1 Community License",
        highlight: "Meta's open-weights milestone, expanding context window to 128k tokens. Perfect for offline multilingual tasks and coding.",
        trainingHighlight: "Trained on over 15 trillion tokens of multilingual data and code from open sources, with a new vocabulary size of 128,000 tokens for clean encoding.",
        laypersonTarget: "For local offline applications requiring long text understanding, document translation, and private personal assistants."
    },
    {
        id: "phi-3-5-moe-instruct",
        name: "Phi-3.5 MoE Instruct",
        creator: "Microsoft",
        releaseDate: "August 2024",
        category: "SLM",
        parameters: "42B (6.6B active)",
        context: "128,000 tokens",
        cost: "Free (Local)",
        license: "MIT License",
        highlight: "A mixture-of-experts model that uses only 6.6 billion parameters at a time. Fits on laptops but delivers high-tier reasoning.",
        trainingHighlight: "Trained heavily on synthetic datasets of high-quality textbooks, QA pairs, and filtered web data, forcing the model to learn logical thinking instead of memorization.",
        laypersonTarget: "For commercial developers who want to run smart reasoning models offline without paying licensing fees."
    }
];


const glossaryCategories = {
    "all": "All Concepts",
    "architecture": "Model Types & Architecture",
    "quantization": "Quantization & Formats",
    "hardware": "Hardware & Memory",
    "generation": "Decoding & Generation",
    "evaluation": "Evaluation Benchmarks",
    "training": "Training & Systems"
};


const glossarySteps = [
    {
        number: 1,
        title: "Step 1: The Core Foundations",
        description: "Start here to understand the core types of AI models and how they read and count information."
    },
    {
        number: 2,
        title: "Step 2: Inside the AI Brain (Architectures)",
        description: "Learn how modern neural networks are shaped under the hood to process and link text."
    },
    {
        number: 3,
        title: "Step 3: Hardware & VRAM (What Runs AI?)",
        description: "Calculate what computing chips and how much memory are required to execute models."
    },
    {
        number: 4,
        title: "Step 4: Quantization (Compression for Local Use)",
        description: "Explore how massive files are compressed so they can run directly on consumer devices."
    },
    {
        number: 5,
        title: "Step 5: Generation, Decoding & Hyperparameters",
        description: "Understand the parameters that control how AIs generate words and manage memory."
    },
    {
        number: 6,
        title: "Step 6: Evaluation & Standard Benchmarks",
        description: "Learn how to read standardized benchmark scores to gauge model intelligence."
    },
    {
        number: 7,
        title: "Step 7: Customization & Systems Integration",
        description: "Final step: adapt models to your private documents and connect them to applications."
    }
];


const glossaryData = [
    {
        id: "llm",
        title: "Large Language Model (LLM)",
        category: "architecture",
        step: 1,
        icon: "cloud",
        layperson: "Think of an LLM as a giant digital brain hosted on supercomputers in the cloud. It knows almost everything and handles complex tasks easily. <strong>How to choose:</strong> Choose an LLM if you need maximum reasoning capacity, can assume a constant internet connection, and are comfortable paying a small fee per usage.",
        technical: "Dense neural networks (typically 30B to 1T+ parameters) served via cloud API endpoints (e.g. Gemini 1.5 Pro, GPT-4o). They require high-end datacenter infrastructure to run.",
        selectionImpact: "Select cloud LLMs when your application requires complex multi-step reasoning, coding, or parsing files larger than 100MB, where on-device hardware is insufficient.",
        refLink: "https://en.wikipedia.org/wiki/Large_language_model"
    },
    {
        id: "slm",
        title: "Small Language Model (SLM)",
        category: "architecture",
        step: 1,
        icon: "smartphone",
        layperson: "Think of an SLM as a compact, pocket-sized assistant that lives directly in your phone or laptop's memory. It is free, private, and works 100% offline. <strong>How to choose:</strong> Choose an SLM if your app must work without internet, you want zero hosting fees, or you want maximum privacy.",
        technical: "Optimized neural network architectures (typically 1B to 9B parameters) tailored for local edge execution. Examples include Gemma 2B, Llama 3 8B, and Phi-3 Mini.",
        selectionImpact: "Select SLMs for offline features, mobile deployments, or sensitive enterprise contexts where user data must never leave the device.",
        refLink: "https://huggingface.co/blog/gemma2"
    },
    {
        id: "parameters",
        title: "Model Parameters (Weights)",
        category: "hardware",
        step: 1,
        icon: "cpu",
        layperson: "Think of parameters as the number of 'connections' or 'dials' in the AI's brain. More parameters mean a smarter model that understands logic better, but it makes the model file larger and requires more RAM. <strong>How to choose:</strong> Select a parameter size that fits your device's memory limits.",
        technical: "The learned floating-point values (weights and biases) in the neural network layers. Counted in billions (e.g., 2B, 8B, 70B).",
        selectionImpact: "For smartphones, limit selection to 1B-3B parameters. For laptops, 7B-9B parameters. For cloud servers or API services, use 70B+ parameters.",
        refLink: "https://en.wikipedia.org/wiki/Parameter_(computer_programming)"
    },
    {
        id: "tokenization",
        title: "Tokenization",
        category: "generation",
        step: 1,
        icon: "scissors",
        layperson: "How AIs read text. AIs don't read full words; they break text down into word fragments called 'tokens'. For example, the word 'unbelievable' might be split into 'un', 'believ', and 'able'. <strong>How to choose:</strong> Think of 1 token as roughly 4 characters or 0.75 words.",
        technical: "The process of converting raw character strings into numerical IDs using algorithms like Byte-Pair Encoding (BPE) or WordPiece prior to neural processing.",
        selectionImpact: "API providers bill you per token, not per word. Longer words, special code syntax, and non-English scripts generate more tokens, increasing your costs.",
        refLink: "https://huggingface.co/docs/transformers/main_classes/tokenizer"
    },
    {
        id: "tokens",
        title: "Tokens (Word Fragments)",
        category: "generation",
        step: 1,
        icon: "scissors",
        layperson: "The small word fragments that AI reads and writes. AI doesn't read full words; it splits them into chunks (1 token is roughly 4 characters or 0.75 words in English). <strong>How to choose:</strong> Calculate your budget based on token counts.",
        technical: "Sub-word units generated by tokenizers (e.g., Byte-Pair Encoding). Language models predict the next token probability distribution.",
        selectionImpact: "Selection metrics are heavily tied to prompt tokens. For cost efficiency, prune system prompts to reduce the number of input tokens consumed.",
        refLink: "https://huggingface.co/docs/transformers/main_classes/tokenizer"
    },
    {
        id: "decoder_only",
        title: "Decoder-Only Transformer",
        category: "architecture",
        step: 2,
        icon: "layers",
        layperson: "The design layout behind almost all text-generating AIs. It works like a super-smart autocomplete: it reads the prompt, guesses the next word, adds it to the prompt, and repeats. <strong>How to choose:</strong> This is the default structure for all conversational or text-writing tasks.",
        technical: "Autoregressive neural architectures that process text token-by-token. They use causal self-attention masking to ensure the model only looks at previous tokens when predicting the next.",
        selectionImpact: "Select decoder-only models (like Llama, Gemma, Mistral) for chatbots, copywriters, and standard interactive chat interfaces.",
        refLink: "https://arxiv.org/abs/1706.03762"
    },
    {
        id: "moe",
        title: "Mixture of Experts (MoE)",
        category: "architecture",
        step: 2,
        icon: "git-branch",
        layperson: "Instead of one giant brain, think of MoE as a room of specialists. When you ask a question, a smart coordinator routes it to only 2 or 3 specialists who know that topic best. <strong>How to choose:</strong> Look for MoE models to get high reasoning capabilities without sacrificing generation speed.",
        technical: "An architectural approach where inputs are routed dynamically to specialized subnetworks ('experts') using a gating mechanism. Example: Mixtral-8x7B or Gemini 1.5.",
        selectionImpact: "MoE models provide the reasoning accuracy of huge models but with much lower computational cost (and latency) during inference since only a fraction of weights are activated.",
        refLink: "https://huggingface.co/blog/moe"
    },
    {
        id: "gqa",
        title: "Grouped-Query Attention (GQA)",
        category: "architecture",
        step: 2,
        icon: "shuffle",
        layperson: "A mathematical trick that helps local models remember long chat conversations without eating up all your phone's memory. <strong>How to choose:</strong> Always look for GQA in local models to ensure smooth, fast chatting during long sessions.",
        technical: "An attention optimization that groups query heads to share a single key-value projection head. It serves as an optimal trade-off between standard Multi-Head Attention and Multi-Query Attention.",
        selectionImpact: "GQA dramatically reduces the memory footprint of the Key-Value (KV) cache, enabling SLMs to handle 4x longer chat histories on low-RAM devices (like smartphones) without crashing.",
        refLink: "https://arxiv.org/abs/2305.13245"
    },
    {
        id: "vector_embeddings",
        title: "Vector Embeddings & Embedding Models",
        category: "architecture",
        step: 2,
        icon: "database",
        layperson: "Think of embeddings as a virtual map of meanings. Every sentence is converted to coordinates. Sentences with similar meanings (like 'How is the weather?' and 'Is it raining?') sit close to each other. <strong>How to choose:</strong> Choose an embedding model to build search engines, recommendation lists, or vector search tools.",
        technical: "Fixed-size numerical arrays representing the semantic meaning of text chunks. Generated using encoder models where cosine distance reflects semantic similarity.",
        selectionImpact: "Do not use generative chat models for searching databases. Use specialized embedding models (e.g., Google Text Embeddings) to convert documents into vectors for search indexation.",
        refLink: "https://huggingface.co/blog/getting-started-with-embeddings"
    },
    {
        id: "gpu_npu_cpu",
        title: "GPU vs. NPU vs. CPU",
        category: "hardware",
        step: 3,
        icon: "cpu",
        layperson: "CPU is the computer's general coordinator (good at basic logic, slow at AI). GPU is the heavy lifter (excellent for gaming and AI math). NPU is a specialized tiny engine built into modern mobile chips (like Apple M-series or Snapdragon) designed to run AI on your phone with almost zero battery drain. <strong>How to choose:</strong> Target the NPU/GPU for mobile apps, and GPUs for servers.",
        technical: "Central Processing Units (optimized for sequential tasks), Graphics Processing Units (optimized for parallel execution), and Neural Processing Units (optimized for matrix math).",
        selectionImpact: "When writing mobile Flutter apps running local models, compile configurations to use GPU/NPU delegates (via MediaPipe or CoreML) instead of running on the CPU to prevent overheating.",
        refLink: "https://en.wikipedia.org/wiki/AI_accelerator"
    },
    {
        id: "vram",
        title: "Video RAM (VRAM)",
        category: "hardware",
        step: 3,
        icon: "hard-drive",
        layperson: "Super-fast memory built directly into graphics cards (GPUs). To run an AI model locally at fast speed, the model weights must fit entirely inside this memory. <strong>How to choose:</strong> Calculate model size to ensure it fits in your graphics card memory.",
        technical: "Video Random Access Memory. High-bandwidth memory utilized by GPUs to hold active model weights and attention cache during execution.",
        selectionImpact: "To calculate VRAM requirements: `VRAM (GB) = (Parameters in Billions * Quantization Bits / 8) * 1.2`. If VRAM is exceeded, the model falls back to system RAM, slowing generation by 10x-20x.",
        refLink: "https://en.wikipedia.org/wiki/Video_RAM"
    },
    {
        id: "kv_cache",
        title: "Key-Value (KV) Cache",
        category: "hardware",
        step: 3,
        icon: "database",
        layperson: "A memory system that saves previous parts of your chat so the model doesn't have to re-read the entire conversation from scratch for every single new word it writes. <strong>How to choose:</strong> Higher context window usage increases VRAM requirements due to this cache.",
        technical: "A mechanism that stores key and value activations in the attention blocks of previous tokens during generation, avoiding redundant matrix multiplication.",
        selectionImpact: "As the chat history grows, the KV Cache consumes a significant amount of VRAM. GQA and FlashAttention are critical optimizations to keep KV Cache RAM usage low.",
        refLink: "https://huggingface.co/docs/transformers/llm_tutorial"
    },
    {
        id: "context_window",
        title: "Context Window (Memory)",
        category: "hardware",
        step: 3,
        icon: "book-open",
        layperson: "The short-term memory of the model. It determines how many pages of text (chat history, code files, or prompts) you can feed the model at once before it starts forgetting. <strong>How to choose:</strong> Look for large context windows if you need the AI to read whole documents or books.",
        technical: "The maximum sequence length (measured in tokens) that the self-attention mechanism can process in a single pass. Gemini 1.5 supports up to 2 million tokens.",
        selectionImpact: "If your app needs to analyze long codebases or customer support transcripts, choose models with at least 32k context windows (e.g., Gemini 1.5 Flash).",
        refLink: "https://huggingface.co/docs/transformers/main_classes/tokenizer"
    },
    {
        id: "quantization",
        title: "Model Quantization",
        category: "quantization",
        step: 4,
        icon: "minimize-2",
        layperson: "Like converting a massive high-resolution raw photo into a compressed JPEG. It simplifies the model's complex decimal weights into simpler whole numbers, shrinking the file size (e.g., from 16GB down to 4GB). <strong>How to choose:</strong> Essential for running any model locally on a phone or laptop.",
        technical: "The mathematical conversion of model weights from high-precision formats (FP32 or FP16) to lower-precision integers (typically INT8, INT4, or INT3) to save bandwidth and memory.",
        selectionImpact: "Quantizing a model reduces its RAM requirement by 70-75% with a negligible loss in reasoning accuracy (~1-2%), making edge deployment feasible.",
        refLink: "https://huggingface.co/docs/optimum/concept_guides/quantization"
    },
    {
        id: "fp16_int4",
        title: "FP16 vs. INT4 Precision",
        category: "quantization",
        step: 4,
        icon: "scale",
        layperson: "FP16 is the high-precision original brain (uses 16 bits of data per connection), while INT4 is the highly compressed version (uses 4 bits). FP16 is smarter but huge; INT4 is small, lightweight, and fast. <strong>How to choose:</strong> Choose INT4 for consumer devices and FP16 for cloud-level accuracy.",
        technical: "FP16 represents weights using 16-bit floating point numbers. INT4 represents weights using 4-bit integers. 4-bit precision reduces file size and VRAM by 75% compared to 16-bit.",
        selectionImpact: "For local app deployment, standard 4-bit (INT4 or Q4_K_M) is the industry sweet spot. Only use FP16 if you are hosting a high-accuracy API on high-end GPUs.",
        refLink: "https://en.wikipedia.org/wiki/Half-precision_floating-point_format"
    },
    {
        id: "gguf",
        title: "GGUF File Format",
        category: "quantization",
        step: 4,
        icon: "file-text",
        layperson: "A file format designed to run AI models on consumer computers (especially Macs and standard laptops). It packs the model into a single file and lets it run on your standard computer chip (CPU) if you don't have a graphics card. <strong>How to choose:</strong> Use this format if you want to run models locally on macOS/Windows using llama.cpp.",
        technical: "A binary container format developed by the llama.cpp project that allows unified file distribution and split execution offloading between CPU cores and GPU VRAM.",
        selectionImpact: "Select GGUF models for consumer-facing local apps. In Flutter, use `llama_cpp_dart` to load GGUF weights directly from mobile storage.",
        refLink: "https://github.com/ggerganov/llama.cpp"
    },
    {
        id: "awq_gptq",
        title: "AWQ & GPTQ Formats",
        category: "quantization",
        step: 4,
        icon: "zap",
        layperson: "Quantization formats optimized specifically for servers or gaming computers with Nvidia graphics cards. They make models run super fast on graphics cards but are not designed for phones. <strong>How to choose:</strong> Use these formats when hosting models on cloud servers with GPUs.",
        technical: "Activation-aware Weight Quantization (AWQ) and Generalized Post-Training Quantization (GPTQ). Both are optimized for GPU CUDA core hardware execution.",
        selectionImpact: "Select AWQ/GPTQ formats if you are deploying private models on cloud instances (e.g. RunPod, AWS) using GPU runtimes like vLLM or TGI.",
        refLink: "https://arxiv.org/abs/2306.00978"
    },
    {
        id: "inference_speed",
        title: "Inference Speed (Tokens/sec)",
        category: "generation",
        step: 5,
        icon: "zap",
        layperson: "How fast the AI writes out its response, measured in 'tokens per second' (roughly words per second). <strong>How to choose:</strong> Aim for models that generate at least 25 tokens/sec so the user doesn't feel the app is lagging.",
        technical: "The rate of token generation during autoregressive decoding. Calculated as the time taken for forward propagation steps per generated token.",
        selectionImpact: "User satisfaction drops if generation speed falls below reading speed (~15 tokens/sec). Choose fast models (like Gemini 1.5 Flash) for customer-facing chatbots.",
        refLink: "https://huggingface.co/docs/transformers/main_classes/text_generation"
    },
    {
        id: "temperature",
        title: "Temperature Hyperparameter",
        category: "generation",
        step: 5,
        icon: "thermometer",
        layperson: "The 'creativity' dial. Set it low (e.g., 0.1) to make the model focused, logical, and consistent (best for coding/math). Set it high (e.g., 0.9) to make it creative, random, and expressive (best for brainstorming). <strong>How to choose:</strong> Adjust temperature according to your specific task requirements.",
        technical: "A scaling parameter applied to logit outputs before the softmax function. Lower values sharpen the probability distribution; higher values flatten it.",
        selectionImpact: "For structured outputs (JSON, SQL, code), set temperature to 0.0 or 0.1. For creative copy or open-ended chats, set temperature to 0.7 or 0.8.",
        refLink: "https://huggingface.co/blog/how-to-generate"
    },
    {
        id: "topp_topk",
        title: "Top-P and Top-K Sampling",
        category: "generation",
        step: 5,
        icon: "settings",
        layperson: "Filters that keep the AI from saying gibberish. Top-K limits the model to choosing only from the top K most likely words (e.g., top 50). Top-P limits it to a pool of words that add up to a certain percentage (e.g., top 90% probability). <strong>How to choose:</strong> Standard values (Top-P = 0.9, Top-K = 40) work best for general chat.",
        technical: "Top-K restricts candidate tokens to a fixed size of highest-probability tokens. Top-P (nucleus sampling) dynamically adjusts the candidate pool to tokens exceeding cumulative probability threshold P.",
        selectionImpact: "Combining Top-P and Top-K restricts the model from selecting highly improbable, nonsensical tokens, keeping text creative yet coherent.",
        refLink: "https://arxiv.org/abs/1904.09751"
    },
    {
        id: "system_prompt",
        title: "System Prompt / Instruction",
        category: "generation",
        step: 5,
        icon: "info",
        layperson: "The master rules or personality you give the AI before the user starts talking. For example: 'You are a friendly junior coding assistant. Speak only in Python and keep answers short.' <strong>How to choose:</strong> Use this to enforce formatting or behavioral boundaries in your app.",
        technical: "A structural instruction injected at the start of the conversational context block. It sits outside the user/assistant chat history and has higher behavioral weight.",
        selectionImpact: "Use system prompts to prevent jailbreaking and enforce strict formatting rules, such as forcing the model to respond ONLY in valid JSON.",
        refLink: "https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/send-chat-prompts-gemini"
    },
    {
        id: "hallucination",
        title: "AI Hallucination",
        category: "generation",
        step: 5,
        icon: "eye-off",
        layperson: "When the AI confidently makes up facts, names, or URLs that do not actually exist. This happens because AI predicts likely-sounding words, not actual database facts. <strong>How to choose:</strong> If your application requires absolute factual accuracy, use search/database retrieval (RAG).",
        technical: "The generation of content that is factually incorrect or ungrounded in the source materials, occurring due to training data bias or token sampling randomness.",
        selectionImpact: "To combat hallucinations, set the temperature to 0.0, write strict system prompts, and use RAG to supply verified factual documents directly in the prompt.",
        refLink: "https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)"
    },
    {
        id: "mmlu",
        title: "MMLU Benchmark",
        category: "evaluation",
        step: 6,
        icon: "award",
        layperson: "A massive general knowledge exam for AI, covering 57 subjects like high school math, professional law, history, and computer science. <strong>How to choose:</strong> Look at MMLU scores to compare the general intelligence of different models.",
        technical: "Massive Multitask Language Understanding. A standard evaluation benchmark that assesses zero-shot and few-shot accuracy across multiple-choice questions.",
        selectionImpact: "Choose models with >80% MMLU for complex multi-topic applications. SLMs usually score between 50% and 75%, while top LLMs score above 85%.",
        refLink: "https://arxiv.org/abs/2009.03300"
    },
    {
        id: "gpqa",
        title: "GPQA Benchmark",
        category: "evaluation",
        step: 6,
        icon: "help-circle",
        layperson: "An extremely hard graduate-level physics, biology, and chemistry exam. The questions are designed so that even PhD-level humans struggle to answer them. <strong>How to choose:</strong> Use GPQA to compare the advanced reasoning and science skills of top-tier models.",
        technical: "Graduate-Level Google-Proof Q&A. A dataset designed to measure reasoning capabilities, where experts write questions that cannot be solved by simple web searching.",
        selectionImpact: "Look for models scoring >50% GPQA if you need to build advanced reasoning agents, complex math solvers, or deep scientific analysis tools.",
        refLink: "https://arxiv.org/abs/2311.12022"
    },
    {
        id: "humaneval",
        title: "HumanEval Benchmark",
        category: "evaluation",
        step: 6,
        icon: "code",
        layperson: "A coding exam for AI. It gives the AI programming problems and tests if the code written by the AI actually compiles and runs correctly. <strong>How to choose:</strong> Look at HumanEval scores to see how good the AI is at writing software.",
        technical: "An evaluation dataset of 164 Python programming tasks. It evaluates functional correctness using the pass@1 metric (whether the first generated solution passes unit tests).",
        selectionImpact: "For software engineering helpers, choose models scoring >80% on HumanEval (e.g. Gemini 1.5 Pro, Claude 3.5 Sonnet) to ensure high code reliability.",
        refLink: "https://github.com/openai/human-eval"
    },
    {
        id: "pretraining_finetuning",
        title: "Pre-training vs. Fine-Tuning",
        category: "training",
        step: 7,
        icon: "git-merge",
        layperson: "Pre-training is teaching the AI general language by reading the entire internet (takes months, costs millions). Fine-Tuning is taking that general AI and teaching it your specific company documents or guidelines (takes hours, costs dollars). <strong>How to choose:</strong> Never pre-train from scratch; always take an open model and fine-tune it.",
        technical: "Pre-training uses self-supervised learning to learn general representations. Fine-Tuning uses supervised training (SFT) to specialize model parameters on a smaller dataset.",
        selectionImpact: "Select a high-quality pre-trained base model (like Llama-3) and perform fine-tuning on your custom dataset to build a specialized company tool.",
        refLink: "https://huggingface.co/docs/transformers/training"
    },
    {
        id: "lora_qlora",
        title: "LoRA & QLoRA",
        category: "training",
        step: 7,
        icon: "git-branch",
        layperson: "A super-efficient way to fine-tune AI. Instead of changing all the billions of parameters, you freeze the model and add a tiny layer of connections on top to learn the new task. QLoRA does this on a compressed model. <strong>How to choose:</strong> Use this to customize models on a budget.",
        technical: "Low-Rank Adaptation (LoRA) and Quantized Low-Rank Adaptation (QLoRA). They freeze base weights and inject small rank-decomposition matrices, reducing training VRAM by up to 90%.",
        selectionImpact: "Allows developers to fine-tune an 8B model on a single consumer GPU (like an RTX 4090 or A10G) in just a few hours instead of requiring a server farm.",
        refLink: "https://arxiv.org/abs/2106.09685"
    },
    {
        id: "alignment_rlhf_dpo",
        title: "Alignment (RLHF & DPO)",
        category: "training",
        step: 7,
        icon: "shield-check",
        layperson: "The process of teaching the AI to be helpful, polite, and safe. Humans rate the AI's answers, guiding it to avoid illegal advice, bias, or hate speech, and to format answers nicely. <strong>How to choose:</strong> Always choose 'Instruct' or 'Chat' models for user-facing applications.",
        technical: "Reinforcement Learning from Human Feedback (RLHF) and Direct Preference Optimization (DPO). Optimization techniques that align model behavior with human preference data.",
        selectionImpact: "Raw base models only perform text completion. Aligned 'Instruct' or 'Chat' models are mandatory for conversing with users or executing prompt-response APIs.",
        refLink: "https://huggingface.co/blog/dpo-alignment"
    },
    {
        id: "rag",
        title: "Retrieval-Augmented Generation (RAG)",
        category: "training",
        step: 7,
        icon: "search",
        layperson: "Giving the AI an open-book exam. Instead of training the AI on your custom business documents, you build a search engine that looks up the relevant pages and pastes them into the prompt so the AI can read them and answer perfectly. <strong>How to choose:</strong> Use RAG if your company's data changes frequently (e.g., product inventories) or if you want to completely eliminate hallucinated facts about private documents.",
        technical: "A pattern where external document contexts are retrieved from a database (typically vector-based) and appended to the prompt context prior to generation.",
        selectionImpact: "RAG is cheaper, faster, and more factually auditable than fine-tuning for question-answering systems on custom documentation.",
        refLink: "https://huggingface.co/blog/ray-rag"
    }
];


// CUSTOM MODELS REGISTRY (PERSISTENT IN LOCALSTORAGE)
let customModels = [];
try {
    const saved = localStorage.getItem("modelverse_custom_models");
    if (saved) {
        customModels = JSON.parse(saved);
    }
} catch (e) {
    console.error("Failed to load custom models:", e);
}

