/**
 * Generator — Core LLM Call and Response Parsing
 *
 * This module handles the actual API call to Groq's LLM and raw response
 * parsing. It is decoupled from prompt construction (promptBuilder.ts)
 * and output formatting (formatter.ts).
 *
 * Responsibilities:
 *   1. Manage the Groq SDK client (singleton)
 *   2. Send the structured prompt to the LLM
 *   3. Strip markdown code fences from the response
 *   4. Parse the JSON into a RawLLMResponse
 *   5. Return the parsed response for the formatter to validate
 */

import Groq from 'groq-sdk';
import { InterviewData, RawLLMResponse, PromptContext } from './types';
import { buildPrompt } from './promptBuilder';

const MODEL_NAME = 'llama-3.3-70b-versatile';
const TEMPERATURE = 0.3;
const MAX_TOKENS = 4096;

let _groq: Groq | null = null;

function getGroqClient(): Groq {
  if (!_groq) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error(
        'GROQ_API_KEY is not set — cannot generate dynamic report',
      );
    }
    _groq = new Groq({ apiKey });
  }
  return _groq;
}

function stripCodeFences(text: string): string {
  return text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/gi, '')
    .trim();
}

function parseRawResponse(content: string): RawLLMResponse {
  const cleaned = stripCodeFences(content);

  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch (parseError) {
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error(
        `LLM response is not valid JSON. First 200 chars: ${cleaned.substring(0, 200)}`,
      );
    }
    parsed = JSON.parse(jsonMatch[0]);
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('LLM response parsed to non-object');
  }

  return parsed as RawLLMResponse;
}

export interface GeneratorResult {
  success: boolean;
  data: RawLLMResponse | null;
  error: string | null;
  promptContext: PromptContext;
}

export async function generateRawReport(
  data: InterviewData,
): Promise<GeneratorResult> {
  const promptContext = buildPrompt(data);

  try {
    const client = getGroqClient();

    const response = await client.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        { role: 'system', content: promptContext.systemPrompt },
        { role: 'user', content: promptContext.userPrompt },
      ],
      temperature: TEMPERATURE,
      max_tokens: MAX_TOKENS,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return {
        success: false,
        data: null,
        error: 'Empty response from LLM',
        promptContext,
      };
    }

    const parsed = parseRawResponse(content);

    return {
      success: true,
      data: parsed,
      error: null,
      promptContext,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error during LLM call';
    return {
      success: false,
      data: null,
      error: message,
      promptContext,
    };
  }
}

export { buildPrompt, parseRawResponse, stripCodeFences };
