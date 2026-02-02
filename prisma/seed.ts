import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const url = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter });

// ---------------------------------------------------------------------------
// Content JSON shape for lessons
// ---------------------------------------------------------------------------
interface LessonContentJson {
  bullets: string[];
  example: string;
  takeaways: string[];
}

function contentJson(obj: LessonContentJson): string {
  return JSON.stringify(obj);
}

// ---------------------------------------------------------------------------
// Quiz question/choice shape
// ---------------------------------------------------------------------------
interface QuizChoice {
  text: string;
  isCorrect: boolean;
}

interface QuizQuestionDef {
  prompt: string;
  explanation: string;
  choices: QuizChoice[];
}

// ---------------------------------------------------------------------------
// Module definitions (orderIndex 1–6)
// ---------------------------------------------------------------------------
const MODULES = [
  { orderIndex: 1, title: "Foundations of LLMs", description: "Core concepts behind large language models." },
  { orderIndex: 2, title: "Using LLMs Effectively", description: "Prompting and evaluation for practical use." },
  { orderIndex: 3, title: "RAG", description: "Retrieval-augmented generation and grounding in your data." },
  { orderIndex: 4, title: "Intelligent Agents", description: "Multi-step reasoning and tool-using systems." },
  { orderIndex: 5, title: "AI Automation Systems", description: "End-to-end workflows and reliability." },
  { orderIndex: 6, title: "Monitoring & Optimization", description: "Observability and continuous improvement." },
] as const;

// ---------------------------------------------------------------------------
// Lesson definitions (orderIndex 1–20), mapped to modules 1–6
// Module 1: 1–4, Module 2: 5–7, Module 3: 8–11, Module 4: 12–15, Module 5: 16–18, Module 6: 19–20
// ---------------------------------------------------------------------------
interface LessonDef {
  orderIndex: number;
  moduleOrderIndex: number;
  title: string;
  timeMinutes: number;
  overview: string;
  content: LessonContentJson;
  quiz: QuizQuestionDef[];
}

const LESSONS: LessonDef[] = [
  // Module 1: Foundations of LLMs (1–4)
  {
    orderIndex: 1,
    moduleOrderIndex: 1,
    title: "What Is a Large Language Model?",
    timeMinutes: 8,
    overview: "LLMs are probabilistic models that predict the next token. They learn from massive text and can be steered via prompts for many tasks.",
    content: {
      bullets: [
        "LLMs predict the next token given previous tokens in a sequence.",
        "They learn statistical patterns from text, not explicit rules.",
        "The same model can summarize, translate, or answer questions depending on the prompt.",
      ],
      example: "Given the prompt 'In one sentence, what is an LLM?', the model samples tokens step by step to form a coherent answer.",
      takeaways: ["LLMs are general-purpose; prompting steers behavior.", "They operate on tokens, not raw words.", "Training is next-token prediction at scale."],
    },
    quiz: [
      {
        prompt: "What is the core training objective of an LLM?",
        explanation: "LLMs are trained to predict the next token in a sequence, not to output factual truth or classify documents.",
        choices: [
          { text: "Predict the next token given previous tokens", isCorrect: true },
          { text: "Classify documents into categories", isCorrect: false },
          { text: "Output only verified facts", isCorrect: false },
          { text: "Compress text into summaries", isCorrect: false },
        ],
      },
      {
        prompt: "Why can one LLM perform many different tasks?",
        explanation: "Learned representations can be steered by the prompt; the model is not hard-coded for each task.",
        choices: [
          { text: "It stores a separate sub-model per task", isCorrect: false },
          { text: "Its learned representations can be steered via prompts", isCorrect: true },
          { text: "It is explicitly programmed for every task", isCorrect: false },
          { text: "It retrains on each new task", isCorrect: false },
        ],
      },
    ],
  },
  {
    orderIndex: 2,
    moduleOrderIndex: 1,
    title: "Transformer Architecture Basics",
    timeMinutes: 8,
    overview: "Transformers use self-attention to relate tokens across the sequence. Stacked layers and positional encodings enable parallel training and long-range context.",
    content: {
      bullets: [
        "Self-attention lets each token attend to any other token in the context.",
        "Stacked Transformer layers build hierarchical representations.",
        "Positional encodings or embeddings inject order so the model distinguishes word order.",
      ],
      example: "In 'The cat sat on the mat', the word 'cat' can attend strongly to 'sat' and 'mat' to capture subject–verb–object relations.",
      takeaways: ["Self-attention captures long-range dependencies.", "Position information is essential for meaning.", "Transformers scale well on GPUs due to parallelism."],
    },
    quiz: [
      {
        prompt: "What does self-attention primarily provide?",
        explanation: "Self-attention allows the model to relate any pair of tokens in the sequence, capturing dependencies without recurrence.",
        choices: [
          { text: "Storing model parameters on disk", isCorrect: false },
          { text: "Relationships between any pair of tokens in the sequence", isCorrect: true },
          { text: "Guaranteed gradient flow", isCorrect: false },
          { text: "Smaller context windows", isCorrect: false },
        ],
      },
      {
        prompt: "Why do Transformers need positional encodings or embeddings?",
        explanation: "Self-attention is order-invariant; position encodings tell the model where each token sits in the sequence.",
        choices: [
          { text: "To compress weights", isCorrect: false },
          { text: "Because self-attention alone does not encode token order", isCorrect: true },
          { text: "To make training unsupervised", isCorrect: false },
          { text: "To reduce latency", isCorrect: false },
        ],
      },
    ],
  },
  {
    orderIndex: 3,
    moduleOrderIndex: 1,
    title: "Tokenization and Context Windows",
    timeMinutes: 6,
    overview: "Text is split into tokens before the model. Context windows limit how much the model can see; design prompts and retrieval to fit within them.",
    content: {
      bullets: [
        "Tokenizers (e.g. BPE) map text to subword units.",
        "Every model has a maximum context length; excess tokens are truncated.",
        "Chunk size and prompt length affect what the model can use.",
      ],
      example: "With an 8k context and a 7k-token prompt, you have limited space for the answer or must trim the prompt.",
      takeaways: ["Tokenization affects how text is represented.", "Context limits constrain system design.", "Minimize unnecessary tokens in prompts."],
    },
    quiz: [
      {
        prompt: "What happens when input exceeds the model's context window?",
        explanation: "Earlier tokens are typically truncated or dropped; the model does not expand the window.",
        choices: [
          { text: "Earlier tokens are truncated or dropped", isCorrect: true },
          { text: "The model refuses to generate", isCorrect: false },
          { text: "The context window grows automatically", isCorrect: false },
          { text: "The prompt is compressed losslessly", isCorrect: false },
        ],
      },
      {
        prompt: "Why use subword tokenization?",
        explanation: "Subwords let rare words be built from common pieces, improving coverage without a huge vocabulary.",
        choices: [
          { text: "To force one token per character", isCorrect: false },
          { text: "To represent rare words from common subword pieces", isCorrect: true },
          { text: "To store prompts as images", isCorrect: false },
          { text: "To reduce model size", isCorrect: false },
        ],
      },
    ],
  },
  {
    orderIndex: 4,
    moduleOrderIndex: 1,
    title: "Capabilities and Limitations of LLMs",
    timeMinutes: 7,
    overview: "LLMs excel at pattern matching and generation but can hallucinate. Production systems use retrieval, validation, and monitoring to reduce risk.",
    content: {
      bullets: [
        "LLMs are strong at language understanding and generation.",
        "They do not have grounded access to the real world or guaranteed truth.",
        "Hallucinations are fluent but incorrect outputs; mitigate with retrieval and checks.",
      ],
      example: "An LLM might invent a plausible API for an internal service; validate against real docs or APIs before use.",
      takeaways: ["Treat outputs as suggestions; verify when it matters.", "Combine with tools and data to reduce hallucinations.", "Design UX to convey uncertainty where appropriate."],
    },
    quiz: [
      {
        prompt: "What is an LLM hallucination?",
        explanation: "A hallucination is output that is fluent and plausible but factually wrong or fabricated.",
        choices: [
          { text: "A fluent but factually incorrect or fabricated answer", isCorrect: true },
          { text: "A server crash", isCorrect: false },
          { text: "A prompt that is too long", isCorrect: false },
          { text: "A slow response", isCorrect: false },
        ],
      },
      {
        prompt: "Which approach best reduces hallucination impact in production?",
        explanation: "Retrieval, validation, and monitoring around the model are more reliable than trusting raw output.",
        choices: [
          { text: "Using only the largest model", isCorrect: false },
          { text: "Adding retrieval, validation, and monitoring", isCorrect: true },
          { text: "Hiding model output from users", isCorrect: false },
          { text: "Disabling long responses", isCorrect: false },
        ],
      },
    ],
  },
  // Module 2: Using LLMs Effectively (5–7)
  {
    orderIndex: 5,
    moduleOrderIndex: 2,
    title: "Prompt Design Basics",
    timeMinutes: 8,
    overview: "Clear instructions and format constraints improve output. Few-shot examples and system vs. user prompts help steer behavior.",
    content: {
      bullets: [
        "Specify task, constraints, tone, and output format explicitly.",
        "Few-shot examples teach patterns without retraining.",
        "System prompts set global behavior; user prompts handle the current request.",
      ],
      example: "Instead of 'Summarize this', use: 'Summarize in 3 bullet points under 12 words each. Return JSON with keys summary and top_quotes.'",
      takeaways: ["Good prompts specify task, format, and constraints.", "Examples are powerful.", "Separate system and user instructions."],
    },
    quiz: [
      {
        prompt: "Which prompt is more likely to yield a structured response?",
        explanation: "Explicit format and length constraints lead to more predictable, parseable output.",
        choices: [
          { text: "'Explain our product'", isCorrect: false },
          { text: "'Explain in exactly 3 bullet points, each under 12 words.'", isCorrect: true },
          { text: "'Say something about it'", isCorrect: false },
          { text: "'Describe everything'", isCorrect: false },
        ],
      },
      {
        prompt: "What is a key benefit of few-shot prompting?",
        explanation: "Examples show the model the pattern you want without changing model weights.",
        choices: [
          { text: "It retrains the model on the fly", isCorrect: false },
          { text: "It shows the model the pattern to imitate", isCorrect: true },
          { text: "It increases context length", isCorrect: false },
          { text: "It reduces latency", isCorrect: false },
        ],
      },
    ],
  },
  {
    orderIndex: 6,
    moduleOrderIndex: 2,
    title: "Designing Structured Outputs",
    timeMinutes: 6,
    overview: "JSON or other schemas make LLM output machine-readable. Validate and repair malformed output before using it downstream.",
    content: {
      bullets: [
        "Request JSON, XML, or another schema so output is parseable.",
        "APIs often support JSON mode or function calling for structure.",
        "Validate against a schema; repair or fall back when invalid.",
      ],
      example: "Ask for a JSON object with fields 'title' (string) and 'priority' ('low'|'medium'|'high'), then validate before creating tasks.",
      takeaways: ["Structured output reduces glue code and errors.", "Always validate before use.", "Use JSON mode or function calling when available."],
    },
    quiz: [
      {
        prompt: "Why is JSON often preferable to plain text for LLM output?",
        explanation: "Programs can parse and validate JSON reliably; free text is harder to consume.",
        choices: [
          { text: "JSON is always shorter", isCorrect: false },
          { text: "Easier for programs to parse and validate", isCorrect: true },
          { text: "Models can only generate JSON", isCorrect: false },
          { text: "JSON is faster to generate", isCorrect: false },
        ],
      },
      {
        prompt: "If the model sometimes returns invalid JSON, what should you do?",
        explanation: "Add a validation and repair step (e.g. retry with a repair prompt or safe default) before using the output.",
        choices: [
          { text: "Ignore errors and hope downstream handles it", isCorrect: false },
          { text: "Add validation and repair before using the output", isCorrect: true },
          { text: "Stop using structured output", isCorrect: false },
          { text: "Use a smaller model", isCorrect: false },
        ],
      },
    ],
  },
  {
    orderIndex: 7,
    moduleOrderIndex: 2,
    title: "Evaluating LLM Quality",
    timeMinutes: 7,
    overview: "Define what 'good' means per feature. Combine human evaluation, automated metrics, and LLM-as-judge; track regressions over time.",
    content: {
      bullets: [
        "Human evaluation is the gold standard but does not scale.",
        "Automated metrics and LLM-as-judge can approximate quality.",
        "Maintain test sets and re-run evaluations when prompts or models change.",
      ],
      example: "For a summarization feature, keep 200 real tickets with ideal summaries and score each prompt or model change against them.",
      takeaways: ["Define success metrics per feature.", "Mix human, automated, and LLM-based evaluation.", "Re-run evaluations as you iterate."],
    },
    quiz: [
      {
        prompt: "Why is evaluation important for LLM features?",
        explanation: "Prompt and model changes can change behavior in subtle ways; evaluation catches regressions.",
        choices: [
          { text: "Models never change", isCorrect: false },
          { text: "Prompt or model changes can change behavior subtly", isCorrect: true },
          { text: "Evaluation removes hallucinations", isCorrect: false },
          { text: "It is required by law", isCorrect: false },
        ],
      },
      {
        prompt: "What is a good starting point for evaluation?",
        explanation: "A curated set of real prompts and ideal outputs gives a repeatable benchmark.",
        choices: [
          { text: "A curated test set of real prompts and ideal outputs", isCorrect: true },
          { text: "Only synthetic data", isCorrect: false },
          { text: "Relying on intuition only", isCorrect: false },
          { text: "No test set", isCorrect: false },
        ],
      },
    ],
  },
  // Module 3: RAG (8–11)
  {
    orderIndex: 8,
    moduleOrderIndex: 3,
    title: "RAG Concepts and Motivation",
    timeMinutes: 8,
    overview: "RAG retrieves relevant documents and feeds them into the LLM context so answers are grounded in your data and less prone to hallucination.",
    content: {
      bullets: [
        "RAG combines retrieval with generation.",
        "It grounds answers in external knowledge beyond training data.",
        "Pipeline: chunk docs, index, retrieve top-k per query, inject into prompt.",
      ],
      example: "A support bot retrieves the top 5 relevant doc sections for the user's question, then prompts the LLM to answer using only that context.",
      takeaways: ["RAG extends LLMs without retraining.", "Retrieval quality drives answer quality.", "Prompt construction is critical."],
    },
    quiz: [
      {
        prompt: "What is the main goal of RAG?",
        explanation: "RAG grounds generations in external, task-specific knowledge rather than only training data.",
        choices: [
          { text: "To compress model weights", isCorrect: false },
          { text: "To ground generations in external, task-specific knowledge", isCorrect: true },
          { text: "To increase parameter count", isCorrect: false },
          { text: "To replace the model with rules", isCorrect: false },
        ],
      },
      {
        prompt: "Which is typically NOT part of a RAG pipeline?",
        explanation: "Chunking, indexing, and retrieving are core; replacing the model with rules is not RAG.",
        choices: [
          { text: "Document chunking and indexing", isCorrect: false },
          { text: "Retrieving relevant chunks per query", isCorrect: false },
          { text: "Replacing the model with a rule-based system", isCorrect: true },
          { text: "Injecting context into the prompt", isCorrect: false },
        ],
      },
    ],
  },
  {
    orderIndex: 9,
    moduleOrderIndex: 3,
    title: "Chunking and Indexing Strategies",
    timeMinutes: 7,
    overview: "Chunk size and overlap affect recall and precision. Use metadata and hybrid (keyword + vector) retrieval when it helps.",
    content: {
      bullets: [
        "Chunk size and overlap trade off context vs. noise.",
        "Metadata (titles, tags) supports filtering and boosting.",
        "Indexes can be keyword (e.g. BM25), vector, or hybrid.",
      ],
      example: "Chunk technical docs by section with ~500 tokens and 50-token overlap; store product area and version in metadata for filters.",
      takeaways: ["Tune chunk size and overlap on real queries.", "Use metadata to narrow retrieval.", "Hybrid retrieval often helps."],
    },
    quiz: [
      {
        prompt: "What is a downside of very large chunks in RAG?",
        explanation: "Large chunks can include lots of irrelevant content, diluting the signal.",
        choices: [
          { text: "You need fewer documents", isCorrect: false },
          { text: "Retrieved chunks may contain lots of irrelevant content", isCorrect: true },
          { text: "Vector search stops working", isCorrect: false },
          { text: "Indexing is slower", isCorrect: false },
        ],
      },
      {
        prompt: "Why is metadata useful in retrieval?",
        explanation: "Metadata enables filtering and boosting so you can narrow and rank results.",
        choices: [
          { text: "It allows filtering and boosting of relevant documents", isCorrect: true },
          { text: "It replaces embeddings", isCorrect: false },
          { text: "It is only for logging", isCorrect: false },
          { text: "It reduces chunk size", isCorrect: false },
        ],
      },
    ],
  },
  {
    orderIndex: 10,
    moduleOrderIndex: 3,
    title: "Prompting with Retrieved Context",
    timeMinutes: 6,
    overview: "Separate system instructions, context, and user question in the prompt. Ask the model to cite or say 'I don't know' when context is insufficient.",
    content: {
      bullets: [
        "Clearly separate instructions, context, and the user question.",
        "Ask the model to cite or reference chunks when answering.",
        "Instruct the model to say 'I don't know' when context does not contain the answer.",
      ],
      example: "Use a template: 'You are a doc assistant. Use ONLY the context below. If the answer is not in the context, say I don't know based on the documents.'",
      takeaways: ["Prompt structure matters as much as retrieval.", "Encourage admitting uncertainty.", "Citations build trust."],
    },
    quiz: [
      {
        prompt: "Why tell the model to say 'I don't know' when context is insufficient?",
        explanation: "It reduces fabricated answers when retrieval misses, instead of guessing.",
        choices: [
          { text: "To increase hallucinations", isCorrect: false },
          { text: "To reduce fabricated answers when retrieval misses", isCorrect: true },
          { text: "Because models cannot answer otherwise", isCorrect: false },
          { text: "To save tokens", isCorrect: false },
        ],
      },
      {
        prompt: "What is a good practice for RAG prompts?",
        explanation: "Clear separation of instructions, context, and query helps the model use context correctly.",
        choices: [
          { text: "Mix context and question in one paragraph", isCorrect: false },
          { text: "Clearly separate instructions, context, and user query", isCorrect: true },
          { text: "Never mention that context is provided", isCorrect: false },
          { text: "Use only the user question", isCorrect: false },
        ],
      },
    ],
  },
  {
    orderIndex: 11,
    moduleOrderIndex: 3,
    title: "RAG Failure Modes and Debugging",
    timeMinutes: 7,
    overview: "Failures can come from retrieval, prompting, or the model. Inspect retrieved docs and log queries, chunks, and outputs to debug.",
    content: {
      bullets: [
        "Debug by checking retrieval, prompt construction, and model behavior.",
        "Inspect which documents were retrieved for bad answers.",
        "Log queries, retrieved chunks, and model I/O (with privacy controls) for replay.",
      ],
      example: "If answers are wrong, replay the query, inspect top-k chunks, and check if the right doc is missing or chunked poorly.",
      takeaways: ["RAG fails for many reasons; diagnose each stage.", "Observability is critical.", "Iterate on retrieval and prompts using real failures."],
    },
    quiz: [
      {
        prompt: "What is a good first step when debugging a RAG error?",
        explanation: "Checking what was retrieved often reveals missing or wrong context.",
        choices: [
          { text: "Switch to a larger model immediately", isCorrect: false },
          { text: "Inspect which documents were retrieved for the query", isCorrect: true },
          { text: "Delete the index and rebuild", isCorrect: false },
          { text: "Disable retrieval", isCorrect: false },
        ],
      },
      {
        prompt: "Why log retrieval and prompts in production?",
        explanation: "Logs let you replay and analyze failures systematically.",
        choices: [
          { text: "Only for billing", isCorrect: false },
          { text: "To replay and analyze failures systematically", isCorrect: true },
          { text: "To block long queries", isCorrect: false },
          { text: "To reduce latency", isCorrect: false },
        ],
      },
    ],
  },
  // Module 4: Intelligent Agents (12–15)
  {
    orderIndex: 12,
    moduleOrderIndex: 4,
    title: "Agent Concepts and Building Blocks",
    timeMinutes: 8,
    overview: "Agents use LLMs to decide actions in a loop: observe, think, act. Tools and memory extend what the model can do.",
    content: {
      bullets: [
        "Agents use the LLM to choose the next action at each step.",
        "They operate in loops: observe state, decide, call tools, update memory.",
        "Tools and memory turn stateless completion into goal-directed behavior.",
      ],
      example: "A research agent might: read the question, search the web, summarize pages, refine the search, then produce a final answer.",
      takeaways: ["Agents = LLM + tools + memory + control loop.", "Orchestration is as important as the model.", "Limit tool access for safety."],
    },
    quiz: [
      {
        prompt: "Which best describes an LLM agent?",
        explanation: "An agent is a loop that uses the LLM to choose tools and actions toward a goal.",
        choices: [
          { text: "A single one-shot completion call", isCorrect: false },
          { text: "A loop that uses an LLM to choose tools and actions toward a goal", isCorrect: true },
          { text: "A static rules engine with no model", isCorrect: false },
          { text: "A database query engine", isCorrect: false },
        ],
      },
      {
        prompt: "What do tools provide to an agent?",
        explanation: "Tools give the agent access to external capabilities like APIs and databases.",
        choices: [
          { text: "Access to external capabilities like APIs and databases", isCorrect: true },
          { text: "Larger parameter count", isCorrect: false },
          { text: "Guaranteed correct reasoning", isCorrect: false },
          { text: "Faster inference", isCorrect: false },
        ],
      },
    ],
  },
  {
    orderIndex: 13,
    moduleOrderIndex: 4,
    title: "Tool Calling Patterns",
    timeMinutes: 7,
    overview: "Describe APIs to the model as tools with schemas. The model chooses when and how to call them; your app executes and feeds results back.",
    content: {
      bullets: [
        "Register tools with JSON schemas for parameters.",
        "The model returns tool-call requests; your app runs the tool and sends results back.",
        "Tool responses become context for the next model step.",
      ],
      example: "Define searchTickets(query, limit); the model calls it when it needs past tickets; you run the search and inject results into the next call.",
      takeaways: ["Tool schemas are contracts between model and backend.", "You control what the model can call.", "Tool results feed into the next step."],
    },
    quiz: [
      {
        prompt: "Who executes the tool in a tool-calling setup?",
        explanation: "The application backend runs the tool; the model only requests the call.",
        choices: [
          { text: "The LLM itself", isCorrect: false },
          { text: "Your application backend", isCorrect: true },
          { text: "The user's browser", isCorrect: false },
          { text: "A separate microservice only", isCorrect: false },
        ],
      },
      {
        prompt: "What is the purpose of JSON schemas for tools?",
        explanation: "Schemas define valid arguments so the model can construct correct calls.",
        choices: [
          { text: "To compress weights", isCorrect: false },
          { text: "To specify valid arguments so the model can construct correct calls", isCorrect: true },
          { text: "To prevent any tool calls", isCorrect: false },
          { text: "To reduce latency", isCorrect: false },
        ],
      },
    ],
  },
  {
    orderIndex: 14,
    moduleOrderIndex: 4,
    title: "Memory and State Management",
    timeMinutes: 6,
    overview: "Keeping full history in the prompt is costly. Use summaries and external stores (e.g. vector DB) for short- and long-term memory.",
    content: {
      bullets: [
        "Full history in the prompt is expensive and hits context limits.",
        "Summarize past turns and store detailed logs externally.",
        "Long-term memory can use a vector store of past conversations or decisions.",
      ],
      example: "A coding assistant summarizes each resolved task into a few lines and stores them in a vector index to recall when a similar bug appears.",
      takeaways: ["Design explicit memory; don't rely only on long prompts.", "Summaries and retrieval scale better than raw transcripts.", "State is a systems concern."],
    },
    quiz: [
      {
        prompt: "What is a drawback of always sending full conversation history to the model?",
        explanation: "It increases cost, latency, and can hit context limits.",
        choices: [
          { text: "It guarantees perfect reasoning", isCorrect: false },
          { text: "It increases cost, latency, and may hit context limits", isCorrect: true },
          { text: "The model forgets earlier messages", isCorrect: false },
          { text: "Tools stop working", isCorrect: false },
        ],
      },
      {
        prompt: "How can agents implement long-term memory?",
        explanation: "External stores (e.g. vector DB) for summaries or embeddings allow recall across sessions.",
        choices: [
          { text: "By editing model weights after each message", isCorrect: false },
          { text: "By storing summaries or embeddings in external stores", isCorrect: true },
          { text: "By disabling logging", isCorrect: false },
          { text: "By using longer prompts only", isCorrect: false },
        ],
      },
    ],
  },
  {
    orderIndex: 15,
    moduleOrderIndex: 4,
    title: "Agent Risks and Guardrails",
    timeMinutes: 7,
    overview: "Agents can loop, spam APIs, or take unintended actions. Use guardrails: limit tools, require approval for sensitive actions, cap steps.",
    content: {
      bullets: [
        "Unbounded agents can loop or take unsafe actions.",
        "Guardrails: limit which tools are available, approval workflows, step limits.",
        "Human-in-the-loop is critical for high-impact actions.",
      ],
      example: "An agent may draft emails but require human approval before sending to executives or external partners.",
      takeaways: ["Never give agents unrestricted production access.", "Design explicit safety and approval.", "Start narrow and expand carefully."],
    },
    quiz: [
      {
        prompt: "Which is a sensible guardrail for agents?",
        explanation: "Requiring human approval for sensitive actions reduces unintended impact.",
        choices: [
          { text: "Unlimited API calls with no monitoring", isCorrect: false },
          { text: "Requiring human approval for certain sensitive actions", isCorrect: true },
          { text: "Letting the model modify its own tool list", isCorrect: false },
          { text: "No step limit", isCorrect: false },
        ],
      },
      {
        prompt: "Why is a step limit (max iterations) useful?",
        explanation: "It prevents runaway loops and unbounded cost or API abuse.",
        choices: [
          { text: "It guarantees optimal solutions", isCorrect: false },
          { text: "It prevents runaway loops and unbounded cost", isCorrect: true },
          { text: "It disables tool calling", isCorrect: false },
          { text: "It speeds up the agent", isCorrect: false },
        ],
      },
    ],
  },
  // Module 5: AI Automation Systems (16–18)
  {
    orderIndex: 16,
    moduleOrderIndex: 5,
    title: "Designing AI Workflows",
    timeMinutes: 8,
    overview: "Break automation into stages (ingestion, understanding, planning, execution, reporting). LLMs are components; clear interfaces simplify debugging.",
    content: {
      bullets: [
        "Production systems decompose work into stages and services.",
        "LLMs are components inside larger architectures.",
        "Clear interfaces between stages simplify debugging and iteration.",
      ],
      example: "A triage system: classify tickets, route to playbooks, retrieve similar cases, draft responses, then human approval for high severity.",
      takeaways: ["Think in pipelines and services, not one giant prompt.", "Each stage has clear inputs, outputs, metrics.", "Optimize or swap stages independently."],
    },
    quiz: [
      {
        prompt: "Why decompose AI systems into stages?",
        explanation: "Stages clarify responsibilities and make debugging and monitoring easier.",
        choices: [
          { text: "It makes deployment impossible", isCorrect: false },
          { text: "It clarifies responsibilities and simplifies debugging", isCorrect: true },
          { text: "It prevents monitoring", isCorrect: false },
          { text: "It reduces accuracy", isCorrect: false },
        ],
      },
      {
        prompt: "Where do LLMs typically sit in automation systems?",
        explanation: "LLMs are usually one component in a broader workflow, not the only piece.",
        choices: [
          { text: "As the only component", isCorrect: false },
          { text: "As one component within a broader workflow", isCorrect: true },
          { text: "Only in logging", isCorrect: false },
          { text: "Outside the workflow", isCorrect: false },
        ],
      },
    ],
  },
  {
    orderIndex: 17,
    moduleOrderIndex: 5,
    title: "Reliability and Fallback Patterns",
    timeMinutes: 7,
    overview: "LLM APIs can fail or be slow. Use timeouts, retries with backoff, and fallbacks (simpler model, cached answer, or safe message).",
    content: {
      bullets: [
        "Use timeouts, retries with jitter, and circuit breakers.",
        "Fallbacks: simpler rules, cached answers, or reduced-scope responses.",
        "Graceful degradation protects user experience when the primary path fails.",
      ],
      example: "If the primary model times out, retry once then fall back to a smaller model or a generic safe message.",
      takeaways: ["Treat LLM calls as unreliable dependencies.", "Design alternate paths.", "Monitor fallback rates."],
    },
    quiz: [
      {
        prompt: "Which is a good reliability pattern for LLM calls?",
        explanation: "Bounded retries with backoff and timeouts avoid cascading failures.",
        choices: [
          { text: "Infinite retries until success", isCorrect: false },
          { text: "Bounded retries with backoff and timeouts", isCorrect: true },
          { text: "Never handling errors", isCorrect: false },
          { text: "No timeouts", isCorrect: false },
        ],
      },
      {
        prompt: "What is graceful degradation?",
        explanation: "Offering a simpler but still useful experience when the primary AI path fails.",
        choices: [
          { text: "Disabling the product when AI is down", isCorrect: false },
          { text: "Offering a simpler but useful experience when AI fails", isCorrect: true },
          { text: "Always using the largest model", isCorrect: false },
          { text: "Hiding errors from users", isCorrect: false },
        ],
      },
    ],
  },
  {
    orderIndex: 18,
    moduleOrderIndex: 5,
    title: "Security, Privacy, and Governance",
    timeMinutes: 8,
    overview: "Prompts and outputs can contain sensitive data. Apply encryption, access control, redaction, and audit logs; align with compliance.",
    content: {
      bullets: [
        "Treat prompts and outputs as sensitive; apply same security as rest of product.",
        "Redact PII and secrets before sending to LLMs or logging.",
        "Access controls and audit logs are key governance controls.",
      ],
      example: "Redact credit card numbers and PII from support tickets before sending to an LLM; store only hashed IDs in logs.",
      takeaways: ["Treat LLM I/O as sensitive by default.", "Least-privilege access to AI infra and logs.", "Work with security and legal on acceptable use."],
    },
    quiz: [
      {
        prompt: "Why can LLM logs be sensitive from a privacy perspective?",
        explanation: "They may contain raw prompts and outputs with PII or secrets.",
        choices: [
          { text: "They never contain user data", isCorrect: false },
          { text: "They may contain raw prompts and outputs with PII or secrets", isCorrect: true },
          { text: "They are only in memory", isCorrect: false },
          { text: "They are encrypted by default", isCorrect: false },
        ],
      },
      {
        prompt: "Which is a good governance control for AI systems?",
        explanation: "Audit logs show who accessed or changed configurations, supporting accountability.",
        choices: [
          { text: "Unlimited log access for all employees", isCorrect: false },
          { text: "Audit logs for who accessed or changed AI config", isCorrect: true },
          { text: "Disabling encryption for debugging", isCorrect: false },
          { text: "No access controls", isCorrect: false },
        ],
      },
    ],
  },
  // Module 6: Monitoring & Optimization (19–20)
  {
    orderIndex: 19,
    moduleOrderIndex: 6,
    title: "Monitoring and User-Focused Metrics",
    timeMinutes: 7,
    overview: "Monitor latency, cost, quality, and safety. User-centric metrics (resolution rate, satisfaction) matter as much as model-level metrics.",
    content: {
      bullets: [
        "Track latency, cost, quality, and safety for AI features.",
        "User-centric metrics (e.g. resolution rate, satisfaction) matter more than raw model metrics.",
        "Dashboards and alerts help detect regressions quickly.",
      ],
      example: "For summarization, track how often agents accept vs. edit summaries and correlate with model or prompt changes.",
      takeaways: ["Define success metrics aligned with user outcomes.", "Correlate product metrics with AI changes.", "Alert on failures and quality regressions."],
    },
    quiz: [
      {
        prompt: "Which is a user-centric metric for an AI feature?",
        explanation: "Ticket resolution time reflects user outcome; GPU temperature does not.",
        choices: [
          { text: "Average GPU temperature", isCorrect: false },
          { text: "Ticket resolution time after introducing AI", isCorrect: true },
          { text: "Model parameter count", isCorrect: false },
          { text: "Token count per request", isCorrect: false },
        ],
      },
      {
        prompt: "Why are dashboards useful for AI systems?",
        explanation: "They visualize trends and anomalies in key metrics.",
        choices: [
          { text: "They replace logging", isCorrect: false },
          { text: "They visualize trends and anomalies in key metrics", isCorrect: true },
          { text: "They fix failing prompts", isCorrect: false },
          { text: "They reduce cost", isCorrect: false },
        ],
      },
    ],
  },
  {
    orderIndex: 20,
    moduleOrderIndex: 6,
    title: "Optimization and Experimentation",
    timeMinutes: 8,
    overview: "AI systems are never 'done'. Use A/B tests and gradual rollouts to measure the impact of prompt, model, and workflow changes.",
    content: {
      bullets: [
        "Experiment with prompts, models, and system design.",
        "A/B tests compare variants objectively on real users.",
        "Continuous improvement keeps systems competitive.",
      ],
      example: "Test a new summarization prompt on 10% of users; compare satisfaction and handle time; roll out the better variant.",
      takeaways: ["Treat AI design as iterative and data-driven.", "Use experiments to validate changes.", "Balance quality vs. latency and cost."],
    },
    quiz: [
      {
        prompt: "Why is experimentation important in AI systems?",
        explanation: "It lets you measure the real impact of changes before full rollout.",
        choices: [
          { text: "Because AI systems cannot be changed after deployment", isCorrect: false },
          { text: "Because it lets you measure the real impact of changes", isCorrect: true },
          { text: "Because it eliminates monitoring", isCorrect: false },
          { text: "Because it reduces cost", isCorrect: false },
        ],
      },
      {
        prompt: "What is a common pattern for rolling out AI changes safely?",
        explanation: "Gradual rollout with A/B testing and metric monitoring reduces risk.",
        choices: [
          { text: "Immediate 100% rollout with no measurement", isCorrect: false },
          { text: "Gradual rollout with A/B testing and metric monitoring", isCorrect: true },
          { text: "Only internal testing with no user traffic", isCorrect: false },
          { text: "No rollout", isCorrect: false },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Seed: upsert modules, then lessons + quizzes + questions + choices
// ---------------------------------------------------------------------------
async function main() {
  console.log("Seeding AI Systems Academy...");

  const moduleIds = new Map<number, string>();

  for (const mod of MODULES) {
    const created = await prisma.module.upsert({
      where: { orderIndex: mod.orderIndex },
      create: {
        orderIndex: mod.orderIndex,
        title: mod.title,
        description: mod.description ?? undefined,
      },
      update: {
        title: mod.title,
        description: mod.description ?? undefined,
      },
    });
    moduleIds.set(mod.orderIndex, created.id);
  }

  for (const lesson of LESSONS) {
    const moduleId = moduleIds.get(lesson.moduleOrderIndex);
    if (!moduleId) throw new Error(`Module orderIndex ${lesson.moduleOrderIndex} not found`);

    const lessonRecord = await prisma.lesson.upsert({
      where: { orderIndex: lesson.orderIndex },
      create: {
        orderIndex: lesson.orderIndex,
        moduleId,
        title: lesson.title,
        timeMinutes: lesson.timeMinutes,
        overview: lesson.overview,
        contentJson: contentJson(lesson.content),
      },
      update: {
        moduleId,
        title: lesson.title,
        timeMinutes: lesson.timeMinutes,
        overview: lesson.overview,
        contentJson: contentJson(lesson.content),
      },
    });

    const quizRecord = await prisma.quiz.upsert({
      where: { lessonId: lessonRecord.id },
      create: {
        lessonId: lessonRecord.id,
        passScore: 80,
      },
      update: { passScore: 80 },
    });

    for (let q = 0; q < lesson.quiz.length; q++) {
      const qq = lesson.quiz[q];
      const orderIndex = q + 1;

      const questionRecord = await prisma.question.upsert({
        where: {
          quizId_orderIndex: {
            quizId: quizRecord.id,
            orderIndex,
          },
        },
        create: {
          quizId: quizRecord.id,
          orderIndex,
          prompt: qq.prompt,
          explanation: qq.explanation,
        },
        update: {
          prompt: qq.prompt,
          explanation: qq.explanation,
        },
      });

      for (let c = 0; c < qq.choices.length; c++) {
        const choice = qq.choices[c];
        await prisma.choice.upsert({
          where: {
            questionId_orderIndex: {
              questionId: questionRecord.id,
              orderIndex: c + 1,
            },
          },
          create: {
            questionId: questionRecord.id,
            orderIndex: c + 1,
            text: choice.text,
            isCorrect: choice.isCorrect,
          },
          update: {
            text: choice.text,
            isCorrect: choice.isCorrect,
          },
        });
      }
    }
  }

  console.log("Seed complete: 6 modules, 20 lessons with quizzes.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
