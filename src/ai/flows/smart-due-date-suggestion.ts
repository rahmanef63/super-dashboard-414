'use server';

/**
 * @fileOverview An AI agent that suggests a due date for a task based on its description and current workload.
 *
 * - suggestDueDateFlow - A function that suggests a due date for a task.
 * - SuggestDueDateInput - The input type for the suggestDueDate function.
 * - SuggestDueDateOutput - The return type for the suggestDueDate function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {suggestDueDate as suggestDueDateService, SuggestDueDateParams, SuggestedDueDate} from '@/services/date-suggestion';

const SuggestDueDateInputSchema = z.object({
  taskDescription: z.string().describe('The description of the task.'),
  currentWorkload: z.string().describe('The current workload in the workspace.'),
});
export type SuggestDueDateInput = z.infer<typeof SuggestDueDateInputSchema>;

const SuggestDueDateOutputSchema = z.object({
  dueDate: z.string().describe('The suggested due date in ISO format.'),
  confidenceScore: z.number().describe('A score indicating the confidence in the suggestion (0 to 1).'),
});
export type SuggestDueDateOutput = z.infer<typeof SuggestDueDateOutputSchema>;

export async function suggestDueDate(input: SuggestDueDateInput): Promise<SuggestDueDateOutput> {
  return suggestDueDateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDueDatePrompt',
  input: {
    schema: z.object({
      taskDescription: z.string().describe('The description of the task.'),
      currentWorkload: z.string().describe('The current workload in the workspace.'),
    }),
  },
  output: {
    schema: z.object({
      dueDate: z.string().describe('The suggested due date in ISO format.'),
      confidenceScore: z.number().describe('A score indicating the confidence in the suggestion (0 to 1).'),
    }),
  },
  prompt: `You are an AI assistant helping to suggest a due date for a task.

  Consider the task description and the current workload in the workspace to suggest a suitable due date.

  Task Description: {{{taskDescription}}}
  Current Workload: {{{currentWorkload}}}

  Please provide the due date in ISO format and a confidence score between 0 and 1.
  `,
});

const suggestDueDateFlow = ai.defineFlow<
  typeof SuggestDueDateInputSchema,
  typeof SuggestDueDateOutputSchema
>(
  {
    name: 'suggestDueDateFlow',
    inputSchema: SuggestDueDateInputSchema,
    outputSchema: SuggestDueDateOutputSchema,
  },
  async input => {
    // Use the service to suggest a due date
    const suggestedDate: SuggestedDueDate = await suggestDueDateService({
      taskDescription: input.taskDescription,
      currentWorkload: input.currentWorkload,
    });

    // Return the suggested date
    return {
      dueDate: suggestedDate.dueDate,
      confidenceScore: suggestedDate.confidenceScore,
    };
  }
);
