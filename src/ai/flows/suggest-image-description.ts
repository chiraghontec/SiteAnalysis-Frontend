'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate a textual description for an image placeholder based on coordinates.
 *
 * - generateImageDescription - A function that generates a textual description for an image placeholder based on coordinates.
 * - GenerateImageDescriptionInput - The input type for the generateImageDescription function.
 * - GenerateImageDescriptionOutput - The return type for the generateImageDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImageDescriptionInputSchema = z.object({
  latitude: z.number().describe('The latitude of the location.'),
  longitude: z.number().describe('The longitude of the location.'),
});
export type GenerateImageDescriptionInput = z.infer<typeof GenerateImageDescriptionInputSchema>;

const GenerateImageDescriptionOutputSchema = z.object({
  description: z.string().describe('A textual description of the location.'),
});
export type GenerateImageDescriptionOutput = z.infer<typeof GenerateImageDescriptionOutputSchema>;

export async function generateImageDescription(
  input: GenerateImageDescriptionInput
): Promise<GenerateImageDescriptionOutput> {
  return generateImageDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateImageDescriptionPrompt',
  input: {schema: GenerateImageDescriptionInputSchema},
  output: {schema: GenerateImageDescriptionOutputSchema},
  prompt: `You are an AI assistant that generates textual descriptions for image placeholders based on coordinates.\n\nGenerate a description for an image at the following coordinates:\nLatitude: {{latitude}}\nLongitude: {{longitude}}\n\nThe description should be concise and evocative, suitable for use as a placeholder text for an image. Focus on landscape features. Be descriptive and specific; if the coordinates are near a city, do not mention the city, mention what natural features are present in the image.\nExample output: A serene landscape featuring rolling hills and a tranquil lake at dusk.\n`,
});

const generateImageDescriptionFlow = ai.defineFlow(
  {
    name: 'generateImageDescriptionFlow',
    inputSchema: GenerateImageDescriptionInputSchema,
    outputSchema: GenerateImageDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
