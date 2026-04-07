import apiClient from "../apiClient";

export const qaService = {
  // Ask a new question
  async askQuestion(questionData) {
    const response = await apiClient.post("/questions", questionData);
    return response.data;
  },

  // Get questions with optional filtering
  async getQuestions(params = {}) {
    const response = await apiClient.get("/questions", { params });
    return response.data;
  },

  // Get user's own questions (uses auth token)
  async getMyQuestions(params = {}) {
    const response = await apiClient.get("/questions/my", { params });
    return response.data;
  },

  // Get a specific question by ID
  async getQuestionById(questionId) {
    const response = await apiClient.get(`/questions/${questionId}`);
    return response.data;
  },

  // Submit an answer to a question
  async submitAnswer(questionId, answerData) {
    const response = await apiClient.post(`/questions/${questionId}/answers`, answerData);
    return response.data;
  },

  // Upvote a question
  async upvoteQuestion(questionId) {
    const response = await apiClient.post(`/questions/${questionId}/upvote`);
    return response.data;
  },

  // Downvote a question
  async downvoteQuestion(questionId) {
    const response = await apiClient.post(`/questions/${questionId}/downvote`);
    return response.data;
  },

  // Get answers for a specific question
  async getQuestionAnswers(questionId) {
    const response = await apiClient.get(`/questions/${questionId}/answers`);
    return response.data;
  }
};
