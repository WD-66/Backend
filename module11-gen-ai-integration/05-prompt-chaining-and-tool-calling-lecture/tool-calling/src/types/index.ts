import type { z } from 'zod';
import type { FinalResponse, PromptBodySchema } from '#schemas';

export type IncomingPrompt = z.infer<typeof PromptBodySchema>;

export type ErrorResponseDTO = {
  success: false;
  error: string;
};

export type FinalResponseDTO =
  | z.infer<typeof FinalResponse>
  | ErrorResponseDTO
  | { completion: string };
