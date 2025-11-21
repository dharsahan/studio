'use server';

/**
 * @fileOverview Generates a playful message based on the compatibility percentage and input names.
 *
 * - generatePlayfulMessage - A function that generates the playful message.
 * - GeneratePlayfulMessageInput - The input type for the generatePlayfulMessage function.
 * - GeneratePlayfulMessageOutput - The return type for the generatePlayfulMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePlayfulMessageInputSchema = z.object({
  name1: z.string().describe('The first name.'),
  name2: z.string().describe('The second name.'),
  compatibilityPercentage: z.number().describe('The compatibility percentage between the two names.'),
});
export type GeneratePlayfulMessageInput = z.infer<typeof GeneratePlayfulMessageInputSchema>;

const GeneratePlayfulMessageOutputSchema = z.object({
  playfulMessage: z.string().describe('A playful message based on the compatibility percentage and names.'),
});
export type GeneratePlayfulMessageOutput = z.infer<typeof GeneratePlayfulMessageOutputSchema>;

export async function generatePlayfulMessage(
  input: GeneratePlayfulMessageInput
): Promise<GeneratePlayfulMessageOutput> {
  return generatePlayfulMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePlayfulMessagePrompt',
  input: {schema: GeneratePlayfulMessageInputSchema},
  output: {schema: GeneratePlayfulMessageOutputSchema},
  prompt: `You are a playful AI assistant that generates fun and insightful messages based on the compatibility between two names.

  Given the following information, generate a playful message about the relationship:

  Name 1: {{{name1}}}
  Name 2: {{{name2}}}
  Compatibility Percentage: {{{compatibilityPercentage}}}%

  The message should be engaging, lighthearted, and offer a unique perspective on the compatibility.
  The message should be no more than 5 sentences long.
`,
});

const generatePlayfulMessageFlow = ai.defineFlow(
  {
    name: 'generatePlayfulMessageFlow',
    inputSchema: GeneratePlayfulMessageInputSchema,
    outputSchema: GeneratePlayfulMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
