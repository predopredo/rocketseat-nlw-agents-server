import { GoogleGenAI } from '@google/genai'
import { env } from '../env.ts'

const gemini = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY })

const model = 'gemini-2.5-flash'

export const transcribeAudio = async (
  Base64Audio: string,
  mimeType: string
) => {
  const result = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: 'Transcript the following audio to brazilian portuguese. Be precise and natural. Keep the original punctuation and split the text into paragraphs when necessary.',
      },
      {
        inlineData: {
          mimeType,
          data: Base64Audio,
        },
      },
    ],
  })

  if (!result?.text) {
    throw new Error('Failed to transcribe audio')
  }

  return result.text
}

export const generateEmbeddings = async (text: string) => {
  const result = await gemini.models.embedContent({
    model: 'text-embedding-004',
    contents: [{ text }],
    config: {
      taskType: 'RETRIEVAL_DOCUMENT',
    },
  })

  if (!result?.embeddings?.[0]?.values) {
    throw new Error('Failed to generate embeddings')
  }

  return result.embeddings[0].values
}

export const generateAnswer = async (
  question: string,
  transcripts: string[]
) => {
  const context = transcripts.join('\n\n')

  const prompt = `
  You are a helpful assistant that can answer questions based on the context provided.
  Answer the provided question based on the context provided.

  CONTEXT:
  ${context}

  QUESTION:
  ${question}

  Instructions:
  - Answer the question based on the context provided.
  - Use only information from the context to answer the question.
  - Answer in brazilian portuguese, in a concise, accurate and natural way.
  - If the question is not related to the context, say that you don't know.
  - Mention parts of the context that are relevant to the question if appropriate.
  - If you mention the context, use the term "class content" to refer to it.
  `.trim()

  const result = await gemini.models.generateContent({
    model,
    contents: [{ text: prompt }],
  })

  if (!result?.text) {
    throw new Error('Failed to generate answer')
  }

  return result.text
}
