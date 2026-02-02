import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** @typedef {{
 *  id: number;
 *  slug: string;
 *  title: string;
 *  timeEstimateMinutes: number;
 *  order: number;
 *  summary: string;
 *  body: string;
 *  practicalExample: string;
 *  keyTakeaways: string;
 *  quiz: {
 *    question: string;
 *    options: { text: string; isCorrect: boolean }[];
 *  }[];
 * }} LessonSeed
 */

/** @type {{
 *  id: number;
 *  slug: string;
 *  title: string;
 *  description: string;
 *  order: number;
 *  lessons: LessonSeed[];
 * }[]} */
const modules = [
  {
    id: 1,
    slug: "foundations-of-llms",
    title: "Foundations of LLMs",
    description: "Core concepts behind modern large language models.",
    order: 1,
    lessons: [
      {
        id: 1,
        slug: "what-is-an-llm",
        title: "What Is a Large Language Model?",
        order: 1,
        timeEstimateMinutes: 10,
        summary: [
          "LLMs are probabilistic models trained to predict the next token in a sequence.",
          "They learn statistical patterns from massive text corpora, not explicit rules.",
          "They can perform many tasks via prompting instead of task-specific training.",
        ].join("\n"),
        body:
          "Large Language Models (LLMs) are neural networks that operate over tokens—usually pieces of words. " +
          "During training, the model repeatedly predicts the next token given a context window of previous tokens. " +
          "By scaling model size, data, and compute, LLMs learn rich internal representations of language, facts, and reasoning patterns.\n\n" +
          "Crucially, LLMs are general-purpose: the same base model can summarize text, write code, or answer questions, depending on how you prompt it. " +
          "This is a shift from the traditional paradigm of building many narrow models, each trained for a single task.",
        practicalExample:
          "Imagine feeding the prompt: \"In one sentence, explain what an LLM is:\". " +
          "The model samples tokens one by one: \"A\", \" large\", \" language\", \" model\", ... until it finishes a coherent answer. " +
          "Every token is chosen based on probabilities learned from training data.",
        keyTakeaways: [
          "LLMs predict tokens, not facts or truths.",
          "General-purpose behavior emerges from scale and data.",
          "Prompting is how we steer an LLM toward specific tasks.",
        ].join("\n"),
        quiz: [
          {
            question: "What is the core training objective of an LLM?",
            options: [
              {
                text: "Predict the exact factual truth of every statement",
                isCorrect: false,
              },
              {
                text: "Predict the next token given previous tokens",
                isCorrect: true,
              },
              {
                text: "Classify documents into predefined categories",
                isCorrect: false,
              },
            ],
          },
          {
            question: "Why can a single LLM perform many tasks?",
            options: [
              {
                text: "Because it is explicitly programmed for every task",
                isCorrect: false,
              },
              {
                text: "Because its learned representations can be steered via prompts",
                isCorrect: true,
              },
              {
                text: "Because it stores a separate sub-model for each task",
                isCorrect: false,
              },
            ],
          },
        ],
      },
      {
        id: 2,
        slug: "llm-architecture",
        title: "Transformer Architecture Basics",
        order: 2,
        timeEstimateMinutes: 12,
        summary: [
          "Transformers rely on self-attention to relate tokens in a sequence.",
          "They use stacked layers to build hierarchical representations.",
          "Positional encodings inject order information into token embeddings.",
        ].join("\n"),
        body:
          "Most modern LLMs are based on the Transformer architecture. " +
          "At its core is the self-attention mechanism, which lets each token attend to any other token in the context window. " +
          "This avoids the sequential bottlenecks of RNNs and enables highly parallel training on GPUs.\n\n" +
          "Each Transformer layer consists of multi-head self-attention followed by a feed-forward network, with residual connections and normalization. " +
          "Positional encodings (or learned positional embeddings) ensure the model can distinguish between, for example, 'dog bites man' and 'man bites dog'.",
        practicalExample:
          "Given the sentence \"The cat sat on the mat\", the word \"cat\" may attend strongly to \"sat\" and \"mat\" when being processed. " +
          "This helps the model understand relationships like subject-verb-object within the sentence.",
        keyTakeaways: [
          "Self-attention enables long-range dependencies without recurrence.",
          "Stacked Transformer layers build deep representations of text.",
          "Position information is essential for word-order-sensitive understanding.",
        ].join("\n"),
        quiz: [
          {
            question: "What problem does self-attention primarily solve?",
            options: [
              {
                text: "Storing model parameters on disk",
                isCorrect: false,
              },
              {
                text: "Capturing relationships between any pair of tokens in a sequence",
                isCorrect: true,
              },
              {
                text: "Ensuring gradients never vanish",
                isCorrect: false,
              },
            ],
          },
          {
            question:
              "Why do Transformers need positional encodings or embeddings?",
            options: [
              {
                text: "Because self-attention alone is order-invariant",
                isCorrect: true,
              },
              {
                text: "To compress the model weights",
                isCorrect: false,
              },
              {
                text: "To make training completely unsupervised",
                isCorrect: false,
              },
            ],
          },
        ],
      },
      {
        id: 3,
        slug: "tokenization-and-context",
        title: "Tokenization and Context Windows",
        order: 3,
        timeEstimateMinutes: 10,
        summary: [
          "Text is split into tokens before entering the model.",
          "Context windows limit how many tokens the model can see at once.",
          "Long contexts require trade-offs in latency, cost, and quality.",
        ].join("\n"),
        body:
          "LLMs operate on tokens, not raw characters or words. Tokenizers like BPE or SentencePiece map text into subword units. " +
          "This allows rare words to be represented as combinations of more frequent pieces.\n\n" +
          "Every model has a maximum context length. If your prompt plus response exceed this window, earlier tokens are truncated or dropped. " +
          "Designing prompts and retrieval strategies that respect this limit is a key systems concern.",
        practicalExample:
          "If an LLM has a 8k token context window and your prompt is already 7k tokens long, you must keep the expected answer short, " +
          "or trim the prompt, or upgrade to a model with a larger context to avoid truncation.",
        keyTakeaways: [
          "Tokenization affects how prompts and data are represented internally.",
          "Context limits constrain how much information the model can use at once.",
          "System design should minimize unnecessary tokens in prompts.",
        ].join("\n"),
        quiz: [
          {
            question: "What happens when you exceed a model's context window?",
            options: [
              {
                text: "The model automatically increases its context size",
                isCorrect: false,
              },
              {
                text: "Earlier tokens are truncated or discarded",
                isCorrect: true,
              },
              {
                text: "The model refuses to generate any output",
                isCorrect: false,
              },
            ],
          },
          {
            question: "Why do LLMs use subword tokenization?",
            options: [
              {
                text: "To force every token to be exactly one character",
                isCorrect: false,
              },
              {
                text: "To handle rare words efficiently by composing them from common pieces",
                isCorrect: true,
              },
              {
                text: "To store prompts directly as images",
                isCorrect: false,
              },
            ],
          },
        ],
      },
      {
        id: 4,
        slug: "capabilities-and-limits",
        title: "Capabilities and Limitations of LLMs",
        order: 4,
        timeEstimateMinutes: 12,
        summary: [
          "LLMs excel at pattern recognition, language understanding, and generation.",
          "They do not have grounded understanding or direct access to the real world.",
          "Hallucinations occur when the model confidently invents plausible but false details.",
        ].join("\n"),
        body:
          "LLMs can summarize, translate, write code, reason about instructions, and more. " +
          "However, they are fundamentally pattern matchers over text, not agents with goals or beliefs.\n\n" +
          "They may produce hallucinations—outputs that are fluent and convincing but incorrect. " +
          "Robust systems mitigate this through retrieval, tool use, validation, and monitoring rather than trusting raw generations.",
        practicalExample:
          "Asking an LLM for the API of an internal service it has never seen may yield a perfectly formatted but nonexistent endpoint. " +
          "A production system should validate such answers against real documentation or introspection APIs.",
        keyTakeaways: [
          "Treat LLM outputs as suggestions that may need verification.",
          "Combine LLMs with tools and data sources to reduce hallucinations.",
          "Design UI and UX to communicate uncertainty to end users.",
        ].join("\n"),
        quiz: [
          {
            question: "What is an LLM hallucination?",
            options: [
              {
                text: "A random crash of the model server",
                isCorrect: false,
              },
              {
                text: "A fluent but factually incorrect or fabricated answer",
                isCorrect: true,
              },
              {
                text: "A prompt that is too long for the context window",
                isCorrect: false,
              },
            ],
          },
          {
            question:
              "Which strategy best reduces the impact of hallucinations in production?",
            options: [
              {
                text: "Rely only on larger models without any additional logic",
                isCorrect: false,
              },
              {
                text: "Add retrieval, validation, and monitoring around the model",
                isCorrect: true,
              },
              {
                text: "Hide model outputs from users",
                isCorrect: false,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    slug: "using-llms-effectively",
    title: "Using LLMs Effectively",
    description: "Prompting patterns and evaluation techniques for practical use.",
    order: 2,
    lessons: [
      {
        id: 5,
        slug: "prompt-design-basics",
        title: "Prompt Design Basics",
        order: 1,
        timeEstimateMinutes: 12,
        summary: [
          "Clear instructions significantly improve LLM output quality.",
          "Providing format and examples helps constrain generations.",
          "System prompts define global behavior; user prompts define specific tasks.",
        ].join("\n"),
        body:
          "Effective prompting starts with being explicit: specify the task, constraints, tone, and output format. " +
          "Ambiguous or underspecified prompts lead to unpredictable behavior.\n\n" +
          "Few-shot prompting—showing the model several input/output examples—can teach it patterns without retraining. " +
          "System-level instructions act as a high-level policy, while user prompts focus on the immediate request.",
        practicalExample:
          "Instead of asking \"Summarize this\", say: \"Summarize the following product feedback in 3 bullet points focusing on user pain points. " +
          "Return valid JSON with fields 'summary' and 'top_quotes'.\"",
        keyTakeaways: [
          "Good prompts specify task, format, and constraints.",
          "Examples are powerful; use them to shape behavior.",
          "Separate global system behavior from per-request instructions.",
        ].join("\n"),
        quiz: [
          {
            question:
              "Which prompt is more likely to yield a structured response?",
            options: [
              {
                text: "\"Explain our product\"",
                isCorrect: false,
              },
              {
                text: "\"Explain our product in exactly 3 bullet points, each under 12 words.\"",
                isCorrect: true,
              },
              {
                text: "\"Say something\"",
                isCorrect: false,
              },
            ],
          },
          {
            question:
              "What is a key benefit of few-shot prompting (providing examples)?",
            options: [
              {
                text: "It retrains the model weights on-the-fly",
                isCorrect: false,
              },
              {
                text: "It shows the model the pattern you want it to imitate",
                isCorrect: true,
              },
              {
                text: "It increases the context window length",
                isCorrect: false,
              },
            ],
          },
        ],
      },
      {
        id: 6,
        slug: "structuring-outputs",
        title: "Designing Structured Outputs",
        order: 2,
        timeEstimateMinutes: 10,
        summary: [
          "Structured outputs make LLMs easier to integrate into systems.",
          "Use schemas (JSON, XML, markdown tables) to define expected shapes.",
          "Validation and repair layers catch malformed outputs.",
        ].join("\n"),
        body:
          "Free-form text is hard to consume programmatically. " +
          "By asking for JSON, XML, or another constrained format, you turn generations into machine-readable data. " +
          "Modern APIs often support function calling or JSON schema to enforce this more strongly.\n\n" +
          "Downstream, always validate outputs against a schema. " +
          "If they fail, you can repair via a secondary prompt or fall back to a safe default.",
        practicalExample:
          "You can ask: \"Return a JSON object with fields 'title' (string) and 'priority' ('low' | 'medium' | 'high'). " +
          "Do not include any additional keys.\" Then validate the JSON before using it to create tasks in your system.",
        keyTakeaways: [
          "Structured outputs reduce glue code and parsing errors.",
          "Schemas and validation protect downstream systems.",
          "Consider using function calling / JSON mode when available.",
        ].join("\n"),
        quiz: [
          {
            question:
              "Why are JSON outputs often preferable to plain text in LLM systems?",
            options: [
              {
                text: "They are always shorter",
                isCorrect: false,
              },
              {
                text: "They are easier for programs to parse and validate",
                isCorrect: true,
              },
              {
                text: "Models can only generate JSON",
                isCorrect: false,
              },
            ],
          },
          {
            question:
              "What should you do if an LLM sometimes returns invalid JSON?",
            options: [
              {
                text: "Ignore the error and hope downstream code handles it",
                isCorrect: false,
              },
              {
                text: "Add a validation and repair step before using the output",
                isCorrect: true,
              },
              {
                text: "Stop using structured outputs altogether",
                isCorrect: false,
              },
            ],
          },
        ],
      },
      {
        id: 7,
        slug: "evaluating-llm-quality",
        title: "Evaluating LLM Quality",
        order: 3,
        timeEstimateMinutes: 14,
        summary: [
          "Human evaluation is the gold standard but does not scale.",
          "Automated metrics and LLM-as-a-judge approaches can approximate quality.",
          "Task-specific test sets help detect regressions over time.",
        ].join("\n"),
        body:
          "To ship reliable LLM features, you need evaluation loops. " +
          "Start by collecting representative prompts and desired outputs. " +
          "Human raters can score correctness, helpfulness, and safety.\n\n" +
          "To scale, use automated metrics (exact match, BLEU, ROUGE) where applicable, or leverage strong LLMs as judges. " +
          "Track metrics per scenario to catch regressions when you change prompts, models, or system logic.",
        practicalExample:
          "For a customer-support summarization feature, you might maintain a test set of 200 real tickets with ideal summaries written by support leads. " +
          "Each new prompt or model variant is evaluated against this set before deployment.",
        keyTakeaways: [
          "Define what 'good' means for each LLM feature.",
          "Combine human, automated, and LLM-based evaluation methods.",
          "Continuously re-run evaluations as you iterate on the system.",
        ].join("\n"),
        quiz: [
          {
            question: "Why is evaluation important for LLM-powered features?",
            options: [
              {
                text: "Because models never change over time",
                isCorrect: false,
              },
              {
                text: "Because prompt tweaks or model upgrades can change behavior in subtle ways",
                isCorrect: true,
              },
              {
                text: "Because evaluation disables hallucinations entirely",
                isCorrect: false,
              },
            ],
          },
          {
            question:
              "Which of the following is a good starting point for evaluation?",
            options: [
              {
                text: "A curated test set of real prompts and ideal outputs",
                isCorrect: true,
              },
              {
                text: "Only synthetic prompts with no real data",
                isCorrect: false,
              },
              {
                text: "Relying solely on your own intuition",
                isCorrect: false,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 3,
    slug: "rag",
    title: "Retrieval-Augmented Generation (RAG)",
    description: "Grounding LLMs in your own data via retrieval pipelines.",
    order: 3,
    lessons: [
      {
        id: 8,
        slug: "rag-concepts",
        title: "RAG Concepts and Motivation",
        order: 1,
        timeEstimateMinutes: 12,
        summary: [
          "RAG combines retrieval systems with generative models.",
          "It grounds answers in external knowledge beyond the training data.",
          "It reduces hallucinations by exposing relevant documents to the model.",
        ].join("\n"),
        body:
          "Retrieval-Augmented Generation (RAG) pipelines fetch relevant documents from a knowledge source and feed them into the LLM's context. " +
          "This allows the model to answer questions using up-to-date or proprietary information that was never part of its training set.\n\n" +
          "RAG typically involves chunking documents, building vector indexes, retrieving top-k chunks per query, and carefully constructing prompts to include context snippets.",
        practicalExample:
          "A support assistant might retrieve the top 5 relevant sections from your internal docs based on a customer's question, " +
          "then prompt the LLM: \"Using only the information below, answer the user's question.\"",
        keyTakeaways: [
          "RAG extends LLM capabilities without retraining the model.",
          "Retrieval quality strongly influences final answer quality.",
          "Proper prompt construction is crucial to get grounded answers.",
        ].join("\n"),
        quiz: [
          {
            question: "What is the main goal of a RAG system?",
            options: [
              {
                text: "To compress model weights on disk",
                isCorrect: false,
              },
              {
                text: "To ground generations in external, task-specific knowledge",
                isCorrect: true,
              },
              {
                text: "To increase the model's parameter count",
                isCorrect: false,
              },
            ],
          },
          {
            question:
              "Which component is typically NOT part of a RAG pipeline?",
            options: [
              {
                text: "Document chunking and indexing",
                isCorrect: false,
              },
              {
                text: "Retrieving relevant chunks per query",
                isCorrect: false,
              },
              {
                text: "Replacing the model with a rule-based system",
                isCorrect: true,
              },
            ],
          },
        ],
      },
      {
        id: 9,
        slug: "chunking-strategies",
        title: "Chunking and Indexing Strategies",
        order: 2,
        timeEstimateMinutes: 12,
        summary: [
          "Chunk size and overlap impact retrieval recall and precision.",
          "Metadata (titles, headings, tags) improves retrieval quality.",
          "Indexes can be keyword-based, vector-based, or hybrid.",
        ].join("\n"),
        body:
          "Chunking splits documents into pieces that fit comfortably into the model's context with room for prompts and answers. " +
          "Too small and you lose context; too large and you retrieve noisy, mixed content.\n\n" +
          "Indexing strategies include traditional inverted indexes (e.g., BM25), dense vector indexes using embeddings, or hybrids that combine both.",
        practicalExample:
          "For technical docs, you might chunk by section headings with a maximum of 500 tokens and 50-token overlaps. " +
          "Each chunk stores metadata like product area, version, and last-updated date for filtering.",
        keyTakeaways: [
          "Tune chunk size and overlap with real queries, not guesses.",
          "Use metadata filters to narrow retrieval to relevant subsets.",
          "Hybrid retrieval often outperforms purely dense or purely sparse methods.",
        ].join("\n"),
        quiz: [
          {
            question:
              "What is a common downside of using very large chunks in RAG?",
            options: [
              {
                text: "You need fewer documents overall",
                isCorrect: false,
              },
              {
                text: "Retrieved chunks may contain lots of irrelevant content",
                isCorrect: true,
              },
              {
                text: "Vector search stops working",
                isCorrect: false,
              },
            ],
          },
          {
            question:
              "Why is metadata (like tags or titles) useful in retrieval?",
            options: [
              {
                text: "It allows filtering and boosts relevant documents",
                isCorrect: true,
              },
              {
                text: "It replaces the need for embeddings",
                isCorrect: false,
              },
              {
                text: "It is only for logging and has no retrieval impact",
                isCorrect: false,
              },
            ],
          },
        ],
      },
      {
        id: 10,
        slug: "prompting-with-context",
        title: "Prompting with Retrieved Context",
        order: 3,
        timeEstimateMinutes: 10,
        summary: [
          "Explicitly separate user question and retrieved context in prompts.",
          "Ask the model to cite or reference specific chunks when answering.",
          "Instruct the model to say \"I don't know\" if the context is insufficient.",
        ].join("\n"),
        body:
          "Once you retrieve context, you must integrate it into the prompt so the model uses it correctly. " +
          "Good prompts clearly delineate system instructions, retrieved snippets, and the user question.\n\n" +
          "You can encourage faithful use of context by asking the model to quote relevant sections or list which chunks support its answer.",
        practicalExample:
          "A prompt template might say: \"You are a documentation assistant. Use ONLY the context sections below. " +
          "If the answer is not contained in the context, respond with 'I don't know based on the provided documents.'\"",
        keyTakeaways: [
          "Prompt structure matters as much as retrieval quality.",
          "Encourage the model to admit uncertainty when context is missing.",
          "Traceability (citations) builds user trust.",
        ].join("\n"),
        quiz: [
          {
            question:
              "Why should you tell the model to say \"I don't know\" when context is insufficient?",
            options: [
              {
                text: "To deliberately increase hallucinations",
                isCorrect: false,
              },
              {
                text: "To reduce fabricated answers when the retrieval misses",
                isCorrect: true,
              },
              {
                text: "Because models cannot answer questions otherwise",
                isCorrect: false,
              },
            ],
          },
          {
            question:
              "Which of the following is a good practice when building RAG prompts?",
            options: [
              {
                text: "Mix context and user question in the same paragraph with no separators",
                isCorrect: false,
              },
              {
                text: "Clearly separate system instructions, context, and user query",
                isCorrect: true,
              },
              {
                text: "Never mention that context is being provided",
                isCorrect: false,
              },
            ],
          },
        ],
      },
      {
        id: 11,
        slug: "rag-failure-modes",
        title: "RAG Failure Modes and Debugging",
        order: 4,
        timeEstimateMinutes: 14,
        summary: [
          "Failures can come from retrieval, prompting, or the model itself.",
          "Inspect retrieved documents to debug bad answers.",
          "Logging queries, retrieved chunks, and outputs is essential.",
        ].join("\n"),
        body:
          "When a RAG system answers poorly, you should ask: did we retrieve the right documents, did we prompt correctly, and did the model follow instructions? " +
          "Analyzing each stage helps you fix the root cause instead of guessing.\n\n" +
          "Production systems should log retrieval queries, selected chunks, and model inputs/outputs (with privacy controls) to support debugging and evaluation.",
        practicalExample:
          "If users report wrong answers, you might replay their queries, inspect the top-k retrieved chunks, and realize that a key document is missing from the index or chunked poorly.",
        keyTakeaways: [
          "RAG systems fail for many reasons beyond the base model.",
          "End-to-end observability is critical for debugging.",
          "Iterate on retrieval, chunking, and prompts using real failures.",
        ].join("\n"),
        quiz: [
          {
            question: "What is a common first step when debugging a RAG error?",
            options: [
              {
                text: "Immediately switch to a larger model",
                isCorrect: false,
              },
              {
                text: "Inspect which documents were retrieved for the query",
                isCorrect: true,
              },
              {
                text: "Delete the entire index and start over",
                isCorrect: false,
              },
            ],
          },
          {
            question:
              "Why is logging retrieval and prompts important in production?",
            options: [
              {
                text: "It has no impact on debugging but helps billing",
                isCorrect: false,
              },
              {
                text: "It enables you to replay and analyze failures systematically",
                isCorrect: true,
              },
              {
                text: "It prevents users from submitting long queries",
                isCorrect: false,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 4,
    slug: "intelligent-agents",
    title: "Intelligent Agents",
    description: "Multi-step reasoning and tool-using systems built on LLMs.",
    order: 4,
    lessons: [
      {
        id: 12,
        slug: "agent-concepts",
        title: "Agent Concepts and Building Blocks",
        order: 1,
        timeEstimateMinutes: 12,
        summary: [
          "Agents use LLMs to decide what actions to take next.",
          "They often operate in loops: observe, think, act.",
          "Tools and memory extend what the LLM can do.",
        ].join("\n"),
        body:
          "An LLM agent repeatedly decides what to do based on its current state and a goal. " +
          "At each step, it can call tools (APIs, databases, other models), update memory, and produce intermediate reasoning.\n\n" +
          "The agent loop orchestrates the LLM, tools, and environment, turning stateless text completion into goal-directed behavior.",
        practicalExample:
          "A research assistant agent might: read a user question, search the web, summarize pages, refine the search, and finally produce a consolidated answer—each step guided by LLM decisions.",
        keyTakeaways: [
          "Agents are LLMs plus tools, memory, and control loops.",
          "The orchestration logic is as important as the model itself.",
          "Carefully limiting tool access is key for safety and reliability.",
        ].join("\n"),
        quiz: [
          {
            question: "Which of the following best describes an LLM agent?",
            options: [
              {
                text: "A single one-shot completion call",
                isCorrect: false,
              },
              {
                text: "A loop that uses an LLM to choose tools and actions toward a goal",
                isCorrect: true,
              },
              {
                text: "A static rules engine with no model calls",
                isCorrect: false,
              },
            ],
          },
          {
            question: "What do tools provide to an LLM agent?",
            options: [
              {
                text: "Access to external capabilities like APIs and databases",
                isCorrect: true,
              },
              {
                text: "A larger parameter count",
                isCorrect: false,
              },
              {
                text: "Guaranteed perfect reasoning",
                isCorrect: false,
              },
            ],
          },
        ],
      },
      {
        id: 13,
        slug: "tool-calling",
        title: "Tool Calling Patterns",
        order: 2,
        timeEstimateMinutes: 12,
        summary: [
          "APIs can be described to the model as tools with schemas.",
          "The model chooses which tool to call and with what arguments.",
          "Tool outputs are fed back into the model for further reasoning.",
        ].join("\n"),
        body:
          "Many LLM APIs now support function or tool calling: you register tools with JSON schemas describing their parameters. " +
          "The model decides when and how to call them based on the conversation.\n\n" +
          "Your application receives tool call requests, executes the tools, and sends results back into the model as new messages, continuing the loop until the model produces a final answer.",
        practicalExample:
          "You might define a `searchTickets(query, limit)` tool. The model calls it when it needs historical tickets, you run the search in your backend, then feed the results into the next model call for reasoning.",
        keyTakeaways: [
          "Tool schemas act as contracts between the model and your backend.",
          "You remain in control of what the model is allowed to do.",
          "Tool responses become new context for subsequent model steps.",
        ].join("\n"),
        quiz: [
          {
            question:
              "In a tool-calling setup, who is responsible for actually executing the tool?",
            options: [
              {
                text: "The LLM model itself",
                isCorrect: false,
              },
              {
                text: "Your application backend",
                isCorrect: true,
              },
              {
                text: "The user's browser",
                isCorrect: false,
              },
            ],
          },
          {
            question:
              "What is the purpose of defining JSON schemas for tools?",
            options: [
              {
                text: "To compress model weights",
                isCorrect: false,
              },
              {
                text: "To specify valid arguments so the model can construct correct calls",
                isCorrect: true,
              },
              {
                text: "To prevent the model from calling any tools",
                isCorrect: false,
              },
            ],
          },
        ],
      },
      {
        id: 14,
        slug: "memory-and-state",
        title: "Memory and State Management",
        order: 3,
        timeEstimateMinutes: 10,
        summary: [
          "Agents need short-term and long-term memory.",
          "Too much history in the prompt increases cost and latency.",
          "External stores (databases, vector indexes) help manage state.",
        ].join("\n"),
        body:
          "Keeping all history in the prompt is simple but expensive and limited by context windows. " +
          "Agents often maintain compact summaries of past interactions and store detailed logs externally.\n\n" +
          "Long-term memory might use a vector store of past conversations, notes, or decisions that the agent can retrieve when relevant.",
        practicalExample:
          "A coding assistant could summarize each resolved task into a few sentences, store them in a vector index, and later recall related tasks when a similar bug appears.",
        keyTakeaways: [
          "Design explicit memory structures instead of relying solely on long prompts.",
          "Summaries and vector retrieval scale better than raw transcripts.",
          "State management is a systems problem, not just a model problem.",
        ].join("\n"),
        quiz: [
          {
            question:
              "What is a drawback of always sending the full conversation history to the model?",
            options: [
              {
                text: "It guarantees perfect reasoning",
                isCorrect: false,
              },
              {
                text: "It increases cost, latency, and may hit context limits",
                isCorrect: true,
              },
              {
                text: "It makes the model forget previous messages",
                isCorrect: false,
              },
            ],
          },
          {
            question: "How can agents implement long-term memory?",
            options: [
              {
                text: "By editing the model weights after every message",
                isCorrect: false,
              },
              {
                text: "By storing summaries or embeddings in external databases",
                isCorrect: true,
              },
              {
                text: "By disabling all logging",
                isCorrect: false,
              },
            ],
          },
        ],
      },
      {
        id: 15,
        slug: "agent-risks",
        title: "Agent Risks and Guardrails",
        order: 4,
        timeEstimateMinutes: 12,
        summary: [
          "Unbounded agents can loop or take unsafe actions.",
          "Guardrails constrain tools, goals, and allowed behaviors.",
          "Human-in-the-loop review is critical for high-impact actions.",
        ].join("\n"),
        body:
          "Powerful agents can act autonomously across many systems, which introduces new failure modes. " +
          "They might loop endlessly, spam APIs, or take actions users did not intend.\n\n" +
          "Guardrails include limiting which tools are available, enforcing approval workflows, adding safety classifiers, and bounding the number of steps per task.",
        practicalExample:
          "An automation agent might be allowed to draft emails but not send them without human approval for certain high-risk recipients like executives or external partners.",
        keyTakeaways: [
          "Never give agents unrestricted access to production systems.",
          "Design explicit safety and approval mechanisms.",
          "Start with narrow, well-scoped tasks and expand gradually.",
        ].join("\n"),
        quiz: [
          {
            question:
              "Which of the following is a sensible guardrail for agents?",
            options: [
              {
                text: "Allowing unlimited API calls without monitoring",
                isCorrect: false,
              },
              {
                text: "Requiring human approval for certain sensitive actions",
                isCorrect: true,
              },
              {
                text: "Letting the model modify its own tool list",
                isCorrect: false,
              },
            ],
          },
          {
            question: "Why is step limiting (max iterations) useful?",
            options: [
              {
                text: "It guarantees optimal solutions",
                isCorrect: false,
              },
              {
                text: "It prevents runaway loops and unbounded costs",
                isCorrect: true,
              },
              {
                text: "It disables tool calling entirely",
                isCorrect: false,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 5,
    slug: "ai-automation-systems",
    title: "AI Automation Systems",
    description: "Designing robust, end-to-end workflows powered by LLMs.",
    order: 5,
    lessons: [
      {
        id: 16,
        slug: "workflow-design",
        title: "Designing AI Workflows",
        order: 1,
        timeEstimateMinutes: 12,
        summary: [
          "Production systems decompose work into stages and services.",
          "LLMs are components inside larger architectures, not the whole system.",
          "Clear interfaces between stages simplify debugging and iteration.",
        ].join("\n"),
        body:
          "Instead of a single giant prompt, robust automation systems break work into stages: ingestion, understanding, planning, execution, and reporting. " +
          "Each stage can use different models, tools, and business logic.\n\n" +
          "Explicit workflows make it easier to add monitoring, fallbacks, and human review where needed.",
        practicalExample:
          "An AI triage system might: classify incoming tickets, route them to playbooks, retrieve similar past cases, draft responses, and then have humans approve them for high-severity issues.",
        keyTakeaways: [
          "Think in terms of pipelines and services, not monolithic prompts.",
          "Each stage should have clear inputs, outputs, and metrics.",
          "You can optimize or swap out stages independently over time.",
        ].join("\n"),
        quiz: [
          {
            question:
              "Why is it helpful to decompose AI systems into stages?",
            options: [
              {
                text: "It makes deployment impossible",
                isCorrect: false,
              },
              {
                text: "It clarifies responsibilities and simplifies debugging",
                isCorrect: true,
              },
              {
                text: "It prevents you from monitoring the system",
                isCorrect: false,
              },
            ],
          },
          {
            question: "Where do LLMs typically sit in automation systems?",
            options: [
              {
                text: "As one component within a broader workflow",
                isCorrect: true,
              },
              {
                text: "As the only component, with no other services",
                isCorrect: false,
              },
              {
                text: "Only in logging pipelines",
                isCorrect: false,
              },
            ],
          },
        ],
      },
      {
        id: 17,
        slug: "reliability-patterns",
        title: "Reliability and Fallback Patterns",
        order: 2,
        timeEstimateMinutes: 12,
        summary: [
          "Retries, timeouts, and fallbacks are essential for robustness.",
          "Use cheaper or simpler paths when models fail.",
          "Graceful degradation protects user experience.",
        ].join("\n"),
        body:
          "LLM APIs can fail, slow down, or produce low-quality responses. " +
          "Resilient systems use timeouts, retries with jitter, and circuit breakers to avoid cascading failures.\n\n" +
          "Fallbacks might include simpler rules, cached answers, or reduced-scope responses when the full AI feature is unavailable.",
        practicalExample:
          "If a high-capacity model times out, your system might retry once and then fall back to a smaller model with a shorter context, or return a generic but safe message.",
        keyTakeaways: [
          "Treat LLM calls like any other unreliable network dependency.",
          "Design alternate paths instead of hard failing.",
          "Log and monitor fallback rates to detect systemic issues.",
        ].join("\n"),
        quiz: [
          {
            question:
              "Which of the following is a good reliability technique for LLM calls?",
            options: [
              {
                text: "Infinite retries until success",
                isCorrect: false,
              },
              {
                text: "Bounded retries with backoff and timeouts",
                isCorrect: true,
              },
              {
                text: "Never handling errors",
                isCorrect: false,
              },
            ],
          },
          {
            question: "What is graceful degradation?",
            options: [
              {
                text: "Disabling your product whenever AI is unavailable",
                isCorrect: false,
              },
              {
                text: "Offering a simpler but still useful experience when AI features fail",
                isCorrect: true,
              },
              {
                text: "Always using the largest model regardless of cost",
                isCorrect: false,
              },
            ],
          },
        ],
      },
      {
        id: 18,
        slug: "security-and-privacy",
        title: "Security, Privacy, and Governance",
        order: 3,
        timeEstimateMinutes: 14,
        summary: [
          "AI systems must respect data privacy and compliance requirements.",
          "Prompt and output data can contain sensitive information.",
          "Access controls, redaction, and audit logs are key controls.",
        ].join("\n"),
        body:
          "LLM prompts often include user data, internal documents, or code. " +
          "You must handle this data under the same security and compliance standards as the rest of your product.\n\n" +
          "Key practices include encrypting data at rest and in transit, restricting who can access logs, redacting sensitive fields, and choosing deployment options that align with regulatory needs.",
        practicalExample:
          "Before sending support tickets to an LLM, you might redact credit card numbers and other PII, then store only hashed identifiers in logs for debugging.",
        keyTakeaways: [
          "Treat LLM inputs and outputs as sensitive by default.",
          "Implement least-privilege access to AI infrastructure and logs.",
          "Work with security and legal teams to define acceptable use.",
        ].join("\n"),
        quiz: [
          {
            question:
              "Why can LLM logs be particularly sensitive from a privacy perspective?",
            options: [
              {
                text: "They never contain any user data",
                isCorrect: false,
              },
              {
                text: "They may include raw prompts and outputs with PII or secrets",
                isCorrect: true,
              },
              {
                text: "They are stored only in memory",
                isCorrect: false,
              },
            ],
          },
          {
            question:
              "Which of the following is a good governance control for AI systems?",
            options: [
              {
                text: "Unlimited access to logs for all employees",
                isCorrect: false,
              },
              {
                text: "Audit logs showing who accessed or changed AI configurations",
                isCorrect: true,
              },
              {
                text: "Disabling encryption to simplify debugging",
                isCorrect: false,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 6,
    slug: "monitoring-and-optimization",
    title: "Monitoring & Optimization",
    description: "Observability, metrics, and continuous improvement of AI systems.",
    order: 6,
    lessons: [
      {
        id: 19,
        slug: "monitoring-metrics",
        title: "Monitoring and User-Focused Metrics",
        order: 1,
        timeEstimateMinutes: 12,
        summary: [
          "Monitor latency, cost, quality, and safety for AI features.",
          "User-centric metrics matter more than model-centric ones.",
          "Dashboards and alerts help you detect regressions quickly.",
        ].join("\n"),
        body:
          "AI monitoring goes beyond infrastructure metrics. " +
          "You should track how features perform for users: resolution rates, satisfaction scores, escalation rates, and more.\n\n" +
          "Combine these with model-level metrics (latency, token usage, error rates) to get a full picture of system health.",
        practicalExample:
          "For a support summarization feature, you might track how often agents accept vs. edit summaries, and correlate that with model versions and prompt changes.",
        keyTakeaways: [
          "Define success metrics aligned with user outcomes.",
          "Correlate product metrics with AI configuration changes.",
          "Alert on both technical failures and quality regressions.",
        ].join("\n"),
        quiz: [
          {
            question:
              "Which of the following is a user-centric metric for an AI feature?",
            options: [
              {
                text: "Average GPU temperature",
                isCorrect: false,
              },
              {
                text: "Ticket resolution time after introducing AI assistance",
                isCorrect: true,
              },
              {
                text: "Model parameter count",
                isCorrect: false,
              },
            ],
          },
          {
            question: "Why are dashboards useful for AI systems?",
            options: [
              {
                text: "They replace the need for logging",
                isCorrect: false,
              },
              {
                text: "They visualize trends and anomalies in key metrics",
                isCorrect: true,
              },
              {
                text: "They automatically fix failing prompts",
                isCorrect: false,
              },
            ],
          },
        ],
      },
      {
        id: 20,
        slug: "optimization-and-experimentation",
        title: "Optimization and Experimentation",
        order: 2,
        timeEstimateMinutes: 14,
        summary: [
          "Experiment with prompts, models, and system designs.",
          "A/B tests help you compare variants objectively.",
          "Continuous improvement loops keep systems competitive.",
        ].join("\n"),
        body:
          "AI systems are never \"done\". " +
          "You can tune prompts, swap models, change retrieval strategies, and adjust workflows to improve quality and cost.\n\n" +
          "Structured experimentation—such as A/B testing—lets you measure the impact of these changes on real users before rolling them out broadly.",
        practicalExample:
          "You might test a new summarization prompt on 10% of users, compare satisfaction scores and handle times, then roll out the better variant globally.",
        keyTakeaways: [
          "Treat AI system design as an iterative, data-driven process.",
          "Use experiments to validate changes rather than guessing.",
          "Balance quality gains against latency and cost impacts.",
        ].join("\n"),
        quiz: [
          {
            question: "Why is experimentation important in AI systems?",
            options: [
              {
                text: "Because once deployed, AI systems cannot be changed",
                isCorrect: false,
              },
              {
                text: "Because it lets you measure the real impact of changes",
                isCorrect: true,
              },
              {
                text: "Because it eliminates the need for monitoring",
                isCorrect: false,
              },
            ],
          },
          {
            question:
              "What is a common pattern for safely rolling out AI changes?",
            options: [
              {
                text: "Immediate 100% rollout with no measurement",
                isCorrect: false,
              },
              {
                text: "Gradual rollout with A/B testing and metric monitoring",
                isCorrect: true,
              },
              {
                text: "Only testing internally without user traffic",
                isCorrect: false,
              },
            ],
          },
        ],
      },
    ],
  },
];

async function main() {
  console.log("Seeding AI Systems Academy data...");

  await prisma.$transaction([
    prisma.lessonProgress.deleteMany(),
    prisma.quizOption.deleteMany(),
    prisma.quizQuestion.deleteMany(),
    prisma.lesson.deleteMany(),
    prisma.module.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  for (const mod of modules) {
    await prisma.module.create({
      data: {
        id: mod.id,
        slug: mod.slug,
        title: mod.title,
        description: mod.description,
        order: mod.order,
        lessons: {
          create: mod.lessons.map((lesson) => ({
            id: lesson.id,
            slug: lesson.slug,
            title: lesson.title,
            order: lesson.order,
            timeEstimateMinutes: lesson.timeEstimateMinutes,
            summary: lesson.summary,
            body: lesson.body,
            practicalExample: lesson.practicalExample,
            keyTakeaways: lesson.keyTakeaways,
            quizQuestions: {
              create: lesson.quiz.map((q, index) => ({
                order: index + 1,
                text: q.question,
                options: {
                  create: q.options.map((opt) => ({
                    text: opt.text,
                    isCorrect: opt.isCorrect,
                  })),
                },
              })),
            },
          })),
        },
      },
    });
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

