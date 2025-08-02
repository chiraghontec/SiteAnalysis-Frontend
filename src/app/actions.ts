'use server';

import { z } from 'zod';

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
    // Simple coordinate validation response
    const { latitude, longitude } = validation.data;
    return {
      success: true,
      description: `Location analysis for coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: 'Failed to process coordinates. Please try again later.',
    };
  }
}
