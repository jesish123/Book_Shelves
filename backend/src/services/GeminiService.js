require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const SUPPORTED_MODELS = (process.env.GEMINI_MODELS || 'gemini-2.5-flash').split(',').map((model) => model.trim()).filter(Boolean);

async function generateContent(prompt) {
  let lastError;

  for (const modelName of SUPPORTED_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result?.response?.text?.trim();
      if (text) {
        return text;
      }
    } catch (error) {
      console.warn(`Gemini model ${modelName} failed:`, error?.message || error);
      lastError = error;
    }
  }

  if (lastError) {
    throw lastError;
  }

  return "";
}

const createBookSummaryPrompt = (book) => {
  const details = [
    `Title: ${book.title || 'Unknown title'}`,
    `Author: ${book.author || 'Unknown author'}`,
    `Genre: ${book.genre || 'No genre provided'}`,
    `Status: ${book.status || 'No status provided'}`,
    `Review: ${book.review || 'No review provided'}`,
  ].join('\n');

  return `Summarize the following book entry in one professional sentence suitable for a reading report or book shelf overview. Be concise and clear.\n\n${details}`;
};

const createFallbackSummary = (book) => {
  const title = book.title || 'Untitled book';
  const author = book.author || 'Unknown author';
  const genre = book.genre ? `${book.genre} ` : '';
  const status = book.status ? `It is currently marked as ${book.status}.` : '';
  const review = book.review ? ` Review: ${book.review}` : '';
  return `${title} by ${author} is a ${genre.trim()}book on your shelf. ${status}${review}`.trim();
};

const generateBookSummary = async (book) => {
  const prompt = createBookSummaryPrompt(book);

  try {
    return await generateContent(prompt);
  } catch (error) {
    console.error('Gemini summary generation failed:', error?.message || error);
    return createFallbackSummary(book);
  }
};

module.exports = {
  generateBookSummary,
};
