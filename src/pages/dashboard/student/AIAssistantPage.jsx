import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Bot, Send, User, Trash2, BookOpen, Lightbulb, 
  Code, Calculator, CheckCircle, Copy, RefreshCw,
  Sparkles, MessageSquare, History, X, Download,
  HelpCircle, ArrowLeft, Check, Compass, Cpu, Dna, Atom
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const CHAT_STORAGE_KEY = 'sstg_ai_study_chat_history';

// Academic Knowledge & Response Engine
const ACADEMIC_KNOWLEDGE_BASE = [
  {
    keywords: ['binary search', 'bst', 'search tree', 'tree'],
    title: 'Binary Search Tree (BST)',
    content: `### Binary Search Tree (BST) Fundamentals

A **Binary Search Tree** is a hierarchical data structure with the key property:
> For any node $N$:
> - All keys in the **left subtree** are **strictly less** than $N$'s key.
> - All keys in the **right subtree** are **strictly greater** than $N$'s key.

\`\`\`python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def search_bst(root, target):
    if not root or root.val == target:
        return root
    if target < root.val:
        return search_bst(root.left, target)
    return search_bst(root.right, target)
\`\`\`

#### Time Complexities:
* **Search / Insert / Delete (Average)**: $\\mathcal{O}(\\log n)$
* **Worst Case (Degenerate Tree)**: $\\mathcal{O}(n)$ — Solved by self-balancing trees like AVL or Red-Black Trees.`
  },
  {
    keywords: ['dijkstra', 'shortest path', 'graph'],
    title: "Dijkstra's Algorithm",
    content: `### Dijkstra's Shortest Path Algorithm

**Dijkstra's algorithm** finds the shortest paths from a single source node to all other nodes in a weighted graph with **non-negative weights**.

\`\`\`python
import heapq

def dijkstra(graph, start_node):
    # distances dictionary initialized to infinity
    distances = {node: float('inf') for node in graph}
    distances[start_node] = 0
    
    # Priority queue stores tuples of (current_dist, node)
    pq = [(0, start_node)]
    
    while pq:
        curr_dist, u = heapq.heappop(pq)
        
        if curr_dist > distances[u]:
            continue
            
        for v, weight in graph[u].items():
            dist = curr_dist + weight
            if dist < distances[v]:
                distances[v] = dist
                heapq.heappush(pq, (dist, v))
                
    return distances
\`\`\`

#### Complexity:
Using a Min-Heap priority queue: **$\\mathcal{O}((V + E) \\log V)$** where $V$ is vertices and $E$ is edges.`
  },
  {
    keywords: ['derivative', 'calculus', 'differentiation', 'integral', 'integrate'],
    title: 'Calculus & Derivatives',
    content: `### Calculus & Derivative Rules

The derivative of a function $f(x)$ represents the instantaneous rate of change or the slope of the tangent line at any point $x$.

#### Core Rules of Differentiation:
1. **Power Rule**: $\\frac{d}{dx}[x^n] = n x^{n-1}$
2. **Product Rule**: $\\frac{d}{dx}[u \\cdot v] = u'v + uv'$
3. **Quotient Rule**: $\\frac{d}{dx}\\left[\\frac{u}{v}\\right] = \\frac{u'v - uv'}{v^2}$
4. **Chain Rule**: $\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)$

#### Worked Example:
Differentiate $f(x) = x^3 \\cdot \\sin(x)$:
* Let $u = x^3 \\implies u' = 3x^2$
* Let $v = \\sin(x) \\implies v' = \\cos(x)$
* Applying the Product Rule:
$$f'(x) = (3x^2)\\sin(x) + (x^3)\\cos(x)$$`
  },
  {
    keywords: ['eigen', 'matrix', 'eigenvalue', 'eigenvector', 'linear algebra'],
    title: 'Eigenvalues & Eigenvectors',
    content: `### Eigenvalues & Eigenvectors

For a square matrix $A$, a non-zero vector $v$ is an **eigenvector** and $\\lambda$ is its **eigenvalue** if:
$$A v = \\lambda v$$

#### Step-by-Step Method to Find Them:
1. **Characteristic Equation**: Solve $\\det(A - \\lambda I) = 0$ for $\\lambda$.
2. **Find Eigenvectors**: For each eigenvalue $\\lambda_i$, solve the homogeneous system $(A - \\lambda_i I)v = 0$.

#### Geometrical Meaning:
During transformation $A$, the eigenvector $v$ does not change its directional line—it only scales by the factor $\\lambda$.`
  },
  {
    keywords: ['circuit', 'kirchhoff', 'ohm', 'voltage', 'current', 'resistor'],
    title: "Kirchhoff's & Ohm's Circuit Laws",
    content: `### Electrical Engineering Circuit Laws

#### 1. Ohm's Law:
$$V = I \\cdot R \\quad (\\text{Voltage} = \\text{Current} \\times \\text{Resistance})$$

#### 2. Kirchhoff's Current Law (KCL - Node Law):
The algebraic sum of currents entering any electrical node equals the sum leaving that node (Conservation of Charge):
$$\\sum I_{\\text{in}} = \\sum I_{\\text{out}}$$

#### 3. Kirchhoff's Voltage Law (KVL - Loop Law):
The algebraic sum of all voltages around any closed loop in a circuit must equal zero (Conservation of Energy):
$$\\sum V_{\\text{loop}} = 0$$`
  },
  {
    keywords: ['crop', 'soil', 'nitrogen', 'agriculture', 'rhizobium'],
    title: 'Soil Nitrogen & Crop Rotation',
    content: `### Agricultural Science: Nitrogen Fixation & Crop Rotation

#### How Legumes Enrich Soil Fertility:
1. **Symbiotic Relationship**: Legume roots (e.g. cowpea, soybean, groundnut) are infected by beneficial *Rhizobium* soil bacteria, forming root nodules.
2. **Atmospheric Nitrogen Fixation**: Rhizobium possesses the enzyme **nitrogenase**, converting inert atmospheric $N_2$ into plant-accessible ammonium ($NH_4^+$).
3. **Nutrient Legacy**: When crop residue decomposes, fixed nitrogen enriches the soil, significantly reducing chemical fertilizer needs for the subsequent cereal crop (like maize or sorghum).`
  }
];

function matchAcademicQuery(query) {
  const lower = query.toLowerCase();

  for (const item of ACADEMIC_KNOWLEDGE_BASE) {
    if (item.keywords.some(kw => lower.includes(kw))) {
      return item.content;
    }
  }

  // Fallback dynamic responses
  if (lower.includes('code') || lower.includes('python') || lower.includes('javascript') || lower.includes('function') || lower.includes('program')) {
    return `### Programming Solution

Here is the standard algorithmic approach:

\`\`\`python
def solution(data):
    """
    Step 1: Validate input
    Step 2: Process using optimal time complexity
    Step 3: Return result
    """
    result = []
    for item in data:
        if item not in result:
            result.append(item)
    return result

# Example Execution
test_data = [1, 2, 2, 3, 4, 4, 5]
print("Cleaned Data:", solution(test_data))
\`\`\`

#### Best Practices:
1. Prefer $\\mathcal{O}(n)$ time complexity using sets or hashmaps where applicable.
2. Ensure edge cases (empty collections, invalid inputs) are safely checked.`;
  }

  if (lower.includes('study') || lower.includes('tip') || lower.includes('exam') || lower.includes('prepare')) {
    return `### Academic Study Strategy

1. **Active Recall**: Test yourself using flashcards or practice questions without looking at the notes first.
2. **Spaced Repetition**: Revisit topics on Day 1, Day 3, and Day 7 to cement them in long-term memory.
3. **Feynman Technique**: Explain the core idea out loud in plain English. If you get stuck on a detail, that is where your knowledge gap lies.
4. **Solve Past Questions**: Analyze exam patterns from previous university semester assessments.`;
  }

  return `### Academic Concept Explanation

Here is a structured breakdown of **"${query}"**:

1. **Core Definition**: Break the topic into its foundational principles and definitions.
2. **Mathematical / Theoretical Model**: Identify the governing rules, formulas, or system flow.
3. **Real-World Application**: Connect the theoretical concept to practical engineering or scientific problems.
4. **Key Takeaways**: Understand the constraints and performance implications.

Would you like me to walk you through a detailed worked example or provide a practice quiz?`;
}

// Markdown and Code Block Renderer Component
const FormattedMessage = ({ content, role }) => {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState(null);

  const parts = useMemo(() => {
    const regex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    const elements = [];
    let lastIndex = 0;
    let match;
    let codeIndex = 0;

    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        elements.push({
          type: 'text',
          content: content.substring(lastIndex, match.index)
        });
      }

      elements.push({
        type: 'code',
        language: match[1] || 'code',
        code: match[2].trim(),
        index: codeIndex++
      });

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      elements.push({
        type: 'text',
        content: content.substring(lastIndex)
      });
    }

    return elements;
  }, [content]);

  const handleCopy = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(index);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopiedCodeIndex(null), 2500);
  };

  return (
    <div className="space-y-3 text-sm leading-relaxed">
      {parts.map((part, i) => {
        if (part.type === 'code') {
          const isCopied = copiedCodeIndex === part.index;
          return (
            <div key={i} className="my-3 rounded-xl overflow-hidden border border-gray-700 bg-gray-950 text-gray-100 shadow-md">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800 text-xs text-gray-400">
                <span className="font-mono font-bold uppercase text-blue-400">{part.language || 'code'}</span>
                <button
                  onClick={() => handleCopy(part.code, part.index)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 transition text-xs"
                  title="Copy code"
                >
                  {isCopied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{isCopied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="p-4 overflow-x-auto font-mono text-xs text-emerald-300 leading-normal">
                <code>{part.code}</code>
              </pre>
            </div>
          );
        }

        return (
          <div key={i} className="whitespace-pre-wrap">
            {part.content}
          </div>
        );
      })}
    </div>
  );
};

const AIAssistantPage = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Load chat history from localStorage
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not load chat history");
    }
    return [
      {
        id: 1,
        role: 'assistant',
        content: `👋 Hello! I am your **AI Study Copilot**.

I'm configured to help university students with:
* 💻 **Computer Science & Coding** — Python, Data Structures, Algorithms, Debugging
* 📐 **Mathematics & Calculus** — Derivatives, Integrals, Linear Algebra, Statistics
* ⚙️ **Engineering & Physics** — Circuits, KVL/KCL, Thermodynamics, Mechanics
* 🔬 **Natural & Applied Sciences** — Chemistry reactions, Genetics, Agronomy
* 📝 **Study Skills** — Feynman technique, Exam preparation, Research formatting

What concept or problem would you like to explore today?`,
        timestamp: new Date().toISOString()
      }
    ];
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const messagesEndRef = useRef(null);

  // Save messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn("Could not save chat history");
    }
  }, [messages]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto-send prompt if passed via location.state (from Student Dashboard)
  useEffect(() => {
    if (location.state?.initialPrompt) {
      const prompt = location.state.initialPrompt;
      // Clear state so it doesn't fire again on navigation
      window.history.replaceState({}, document.title);
      sendQuery(prompt);
    }
  }, [location.state]);

  const sendQuery = async (queryText) => {
    if (!queryText.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: queryText.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI thinking and response generation
    setTimeout(() => {
      const responseContent = matchAcademicQuery(queryText);
      const aiResponse = {
        id: Date.now() + 1,
        role: 'assistant',
        content: responseContent,
        timestamp: new Date().toISOString(),
        suggestedFollowUps: [
          '💡 Give me a practical example',
          '🧩 Quiz me with a practice question',
          '👶 Explain in simpler terms',
          '📝 Summarize into 3 key takeaways'
        ]
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
      toast.success('Response ready!');
    }, 1000);
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    sendQuery(inputMessage);
  };

  const handleFollowUpClick = (followUpText) => {
    sendQuery(followUpText);
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear your study chat history?")) {
      const initial = [
        {
          id: Date.now(),
          role: 'assistant',
          content: `Chat history cleared! What would you like to study next?`,
          timestamp: new Date().toISOString()
        }
      ];
      setMessages(initial);
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(initial));
      toast.success('Chat history cleared');
    }
  };

  const handleExportChat = () => {
    const textContent = messages.map(m => `[${m.role.toUpperCase()} - ${new Date(m.timestamp).toLocaleTimeString()}]\n${m.content}\n\n`).join('---\n\n');
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student-stage-study-notes-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Study notes exported!');
  };

  const handleCopyMessage = (content, id) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(id);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const quickPromptChips = [
    { label: "Binary Search Tree in Python", icon: Code, prompt: "Explain Binary Search Tree with Python code and time complexity." },
    { label: "Product Rule in Calculus", icon: Calculator, prompt: "Explain the Product Rule and Chain Rule in Calculus with a worked example." },
    { label: "Dijkstra's Algorithm", icon: Cpu, prompt: "Explain Dijkstra's shortest path algorithm with Python implementation." },
    { label: "Eigenvalues & Eigenvectors", icon: Atom, prompt: "What are Eigenvalues and Eigenvectors and how do we calculate them?" },
    { label: "Kirchhoff's Laws in Circuits", icon: Lightbulb, prompt: "Explain Kirchhoff's Voltage and Current Laws (KVL/KCL) with circuit rules." },
    { label: "Soil Nitrogen Fixation", icon: Dna, prompt: "How does crop rotation and Rhizobium bacteria fix nitrogen in soil?" }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/dashboard" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="text-purple-600 dark:text-purple-400" size={28} />
              <span>AI Study Copilot</span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 ml-7">
            Your personal academic assistant for derivations, algorithm debugging, and exam preparation.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportChat}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-semibold transition"
            title="Export session to text file"
          >
            <Download size={14} />
            <span>Export Notes</span>
          </button>

          <button
            onClick={handleClearChat}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold transition"
            title="Clear chat history"
          >
            <Trash2 size={14} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Quick Prompt Chips */}
      <div className="card p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5">
          <Compass size={14} className="text-purple-500" />
          <span>Quick Study Prompts</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {quickPromptChips.map((chip, idx) => {
            const Icon = chip.icon;
            return (
              <button
                key={idx}
                onClick={() => sendQuery(chip.prompt)}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800/80 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-700 dark:hover:text-purple-300 text-gray-700 dark:text-gray-300 text-xs font-medium border border-gray-200 dark:border-gray-700 transition active:scale-95 disabled:opacity-50"
              >
                <Icon size={13} className="text-purple-500" />
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Chat Window (3 Cols) */}
        <div className="lg:col-span-3 card flex flex-col h-[650px] shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {messages.map((message) => {
              const isUser = message.role === 'user';
              const isCopied = copiedMessageId === message.id;

              return (
                <div
                  key={message.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-3 max-w-[90%] sm:max-w-[85%] ${isUser ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                      isUser 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-purple-600 text-white'
                    }`}>
                      {isUser ? <User size={16} /> : <Bot size={16} />}
                    </div>

                    {/* Message Bubble */}
                    <div className={`rounded-2xl p-4 sm:p-5 shadow-sm transition-all ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-gray-50 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 rounded-tl-none border border-gray-200 dark:border-gray-700'
                    }`}>
                      {/* Header in Assistant Box */}
                      <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-black/5 dark:border-white/5">
                        <span className="text-[11px] font-bold opacity-75">
                          {isUser ? 'You (Scholar)' : 'AI Study Copilot'}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyMessage(message.content, message.id)}
                            className="text-[11px] opacity-60 hover:opacity-100 flex items-center gap-1 transition"
                            title="Copy full text"
                          >
                            {isCopied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                            <span className="hidden sm:inline">{isCopied ? 'Copied' : 'Copy'}</span>
                          </button>
                          <span className="text-[10px] opacity-50">
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      {/* Formatted Content */}
                      <FormattedMessage content={message.content} role={message.role} />

                      {/* Follow-up Action Pills (Only for Assistant messages) */}
                      {!isUser && message.suggestedFollowUps && (
                        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700/60">
                          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                            Suggested Follow-ups:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {message.suggestedFollowUps.map((pill, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleFollowUpClick(pill)}
                                disabled={isLoading}
                                className="px-2.5 py-1 rounded-md bg-white dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-300 text-xs font-medium transition active:scale-95 disabled:opacity-50"
                              >
                                {pill}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                    <Sparkles size={16} />
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl rounded-tl-none p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      <span className="text-xs text-gray-500 ml-2 font-medium">Formulating academic response...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask any question (e.g. Differentiate x³·sin(x), Explain Quicksort, Circuit laws)..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                <Send size={16} />
                <span className="hidden sm:inline">Ask AI</span>
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Capabilities & Guidelines (1 Col) */}
        <div className="space-y-4">
          <div className="card p-5 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/20 border-purple-200 dark:border-purple-800/40">
            <div className="flex items-center gap-2 text-purple-800 dark:text-purple-300 font-bold text-sm">
              <Lightbulb size={18} />
              <span>Prompting Guidelines</span>
            </div>
            <ul className="mt-3 space-y-2 text-xs text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-1.5">
                <CheckCircle size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                <span>Specify your programming language (e.g. Python, JS, C++).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                <span>Include formulas or step-by-step requirements for math problems.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                <span>Ask for practice quizzes or simpler explanations whenever needed.</span>
              </li>
            </ul>
          </div>

          <div className="card p-5">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <BookOpen size={16} className="text-blue-600" />
              <span>Subject Specialties</span>
            </h3>
            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                <strong className="text-gray-900 dark:text-white block font-semibold">💻 Computing & Algorithms</strong>
                <span>Data structures, Big O analysis, debugging, dynamic programming.</span>
              </div>
              <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                <strong className="text-gray-900 dark:text-white block font-semibold">📐 Mathematics & Calculus</strong>
                <span>Derivatives, integrals, matrix algebra, differential equations.</span>
              </div>
              <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                <strong className="text-gray-900 dark:text-white block font-semibold">⚙️ Applied Engineering</strong>
                <span>Circuit theorems, thermodynamics, structural mechanics.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;