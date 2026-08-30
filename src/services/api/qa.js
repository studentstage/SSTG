import apiClient from "../apiClient";

const LOCAL_QUESTIONS_KEY = "sstg_local_questions_store";

const SEED_QUESTIONS = [
  {
    id: 101,
    title: "How to optimize time complexity of recursive algorithms using memoization in Python?",
    content: "I'm working on a dynamic programming assignment involving the Longest Common Subsequence (LCS). The standard recursive tree has exponential O(2^n) time complexity. Can someone demonstrate how to use a memoization dictionary or `functools.lru_cache` to bring it down to polynomial time?",
    category: "programming",
    userName: "Halima Abubakar",
    userId: "student-02",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    upvotes: 8,
    downvotes: 0,
    answers: [
      {
        id: 201,
        content: "You can use Python's built-in decorator `@functools.lru_cache(maxsize=None)` directly above your recursive function. Alternatively, pass a `memo = {}` dictionary as a parameter and check `if key in memo: return memo[key]` before executing the recursive branches.",
        userName: "Dr. Ibrahim (Tutor)",
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
      }
    ]
  },
  {
    id: 102,
    title: "What is the physical interpretation of Eigenvalues and Eigenvectors in Matrix Transformations?",
    content: "During linear transformations (like scaling or rotation), what geometrically happens along the eigenvector direction? Why are eigenvalues critical for stability analysis in engineering systems?",
    category: "mathematics",
    userName: "Usman Bello",
    userId: "student-03",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    upvotes: 12,
    downvotes: 1,
    answers: [
      {
        id: 202,
        content: "Geometrically, an eigenvector represents a direction along which a linear transformation only stretches or compresses vectors without changing their direction (no rotation). The eigenvalue lambda λ is the scalar factor by which the vector is stretched or compressed along that axis.",
        userName: "Prof. Sarah Johnson",
        createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
      }
    ]
  },
  {
    id: 103,
    title: "How does crop rotation and legume planting improve soil nitrogen retention in savannah soils?",
    content: "In Agronomy 201, we are studying soil fertility management. How do symbiotic Rhizobium bacteria in legume root nodules fix atmospheric nitrogen (N2) into plant-accessible nitrates?",
    category: "agriculture",
    userName: "Fatima Aliyu",
    userId: "student-04",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    upvotes: 6,
    downvotes: 0,
    answers: []
  },
  {
    id: 104,
    title: "What are the key differences between TCP and UDP protocols in Computer Networks?",
    content: "I understand TCP is connection-oriented and UDP is connectionless. For live video streaming or real-time gaming, why is UDP preferred over TCP despite potential packet loss?",
    category: "programming",
    userName: "Ahmad Sani",
    userId: "student-05",
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    upvotes: 15,
    downvotes: 0,
    answers: [
      {
        id: 203,
        content: "TCP enforces three-way handshakes, sequencing, and retransmission of lost packets, which introduces latency and jitter. In real-time video/gaming, receiving a delayed packet is useless because the frame has already passed. UDP prioritizes continuous, low-latency transmission.",
        userName: "Tukur Sunusi Gama",
        createdAt: new Date(Date.now() - 3600000 * 20).toISOString()
      }
    ]
  }
];

function getStoredQuestions() {
  try {
    const raw = localStorage.getItem(LOCAL_QUESTIONS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_QUESTIONS_KEY, JSON.stringify(SEED_QUESTIONS));
      return SEED_QUESTIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return SEED_QUESTIONS;
  }
}

function saveStoredQuestions(questions) {
  try {
    localStorage.setItem(LOCAL_QUESTIONS_KEY, JSON.stringify(questions));
  } catch (e) {
    console.warn("Could not save to localStorage", e);
  }
}

export const qaService = {
  // Ask a new question
  async askQuestion(questionData) {
    try {
      const response = await apiClient.post("/questions", questionData);
      return response.data;
    } catch (err) {
      console.warn("API offline: saving question locally", err);
      const questions = getStoredQuestions();
      const newQuestion = {
        id: Date.now(),
        title: questionData.title,
        content: questionData.content,
        category: questionData.category || "General",
        userId: questionData.userId || "demo-student",
        userName: questionData.userName || "Demo Student",
        createdAt: questionData.createdAt || new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
        answers: []
      };
      const updated = [newQuestion, ...questions];
      saveStoredQuestions(updated);
      return newQuestion;
    }
  },

  // Get questions with optional filtering
  async getQuestions(params = {}) {
    try {
      const response = await apiClient.get("/questions", { params });
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      // If empty from server, return stored questions
      return getStoredQuestions();
    } catch (err) {
      console.warn("API offline: loading questions from local store");
      return getStoredQuestions();
    }
  },

  // Get user's own questions (uses auth token)
  async getMyQuestions(params = {}) {
    try {
      const response = await apiClient.get("/questions/my", { params });
      return response.data;
    } catch (err) {
      const questions = getStoredQuestions();
      return questions;
    }
  },

  // Get a specific question by ID
  async getQuestionById(questionId) {
    try {
      const response = await apiClient.get(`/questions/${questionId}`);
      return response.data;
    } catch (err) {
      const questions = getStoredQuestions();
      return questions.find(q => q.id === Number(questionId) || q.id === questionId) || null;
    }
  },

  // Submit an answer to a question
  async submitAnswer(questionId, answerData) {
    try {
      const response = await apiClient.post(`/questions/${questionId}/answers`, answerData);
      return response.data;
    } catch (err) {
      console.warn("API offline: saving answer locally");
      const questions = getStoredQuestions();
      const newAnswer = {
        id: Date.now(),
        questionId,
        content: answerData.content,
        userId: answerData.userId || "demo-student",
        userName: answerData.userName || "Demo Student",
        createdAt: answerData.createdAt || new Date().toISOString(),
      };

      const updated = questions.map(q => {
        if (q.id === Number(questionId) || q.id === questionId) {
          return {
            ...q,
            answers: [...(q.answers || []), newAnswer]
          };
        }
        return q;
      });

      saveStoredQuestions(updated);
      return newAnswer;
    }
  },

  // Upvote a question
  async upvoteQuestion(questionId) {
    try {
      const response = await apiClient.post(`/questions/${questionId}/upvote`);
      return response.data;
    } catch (err) {
      const questions = getStoredQuestions();
      const updated = questions.map(q => {
        if (q.id === Number(questionId) || q.id === questionId) {
          return { ...q, upvotes: (q.upvotes || 0) + 1 };
        }
        return q;
      });
      saveStoredQuestions(updated);
      return { success: true };
    }
  },

  // Downvote a question
  async downvoteQuestion(questionId) {
    try {
      const response = await apiClient.post(`/questions/${questionId}/downvote`);
      return response.data;
    } catch (err) {
      const questions = getStoredQuestions();
      const updated = questions.map(q => {
        if (q.id === Number(questionId) || q.id === questionId) {
          return { ...q, downvotes: (q.downvotes || 0) + 1 };
        }
        return q;
      });
      saveStoredQuestions(updated);
      return { success: true };
    }
  },

  // Get answers for a specific question
  async getQuestionAnswers(questionId) {
    try {
      const response = await apiClient.get(`/questions/${questionId}/answers`);
      return response.data;
    } catch (err) {
      const q = await this.getQuestionById(questionId);
      return q?.answers || [];
    }
  }
};
