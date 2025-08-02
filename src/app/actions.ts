'use server';

import { z } from 'zod';
import { generateImageDescription } from '@/ai/flows/suggest-image-description';

const formSchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
});

type ActionResult = {
  success: boolean;
  description?: string;
  error?: string;
}

export async function generateDescriptionAction(formData: FormData): Promise<ActionResult> {
  const rawFormData = {
    latitude: formData.get('latitude'),
    longitude: formData.get('longitude'),
  };

  const validation = formSchema.safeParse(rawFormData);

  if (!validation.success) {
    return {
      success: false,
      error: 'Invalid input. Please enter valid coordinates.',
    };
  }
  
  try {
    const result = await generateImageDescription(validation.data);
    return {
      success: true,
      description: result.description,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: 'Failed to generate description. Please try again later.',
    };
  }
}
