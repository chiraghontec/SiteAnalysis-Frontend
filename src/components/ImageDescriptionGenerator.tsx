'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateDescriptionAction } from '@/app/actions';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2 } from 'lucide-react';

const formSchema = z.object({
  latitude: z.coerce.number().min(-90, { message: 'Must be >= -90' }).max(90, { message: 'Must be <= 90' }),
  longitude: z.coerce.number().min(-180, { message: 'Must be >= -180' }).max(180, { message: 'Must be <= 180' }),
});

export function ImageDescriptionGenerator() {
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      latitude: 40.7128,
      longitude: -74.0060,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setDescription('');

    const formData = new FormData();
    formData.append('latitude', String(values.latitude));
    formData.append('longitude', String(values.longitude));

    const result = await generateDescriptionAction(formData);

    if (result.success && result.description) {
      setDescription(result.description);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }

    setIsLoading(false);
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/20 rounded-full">
            <Wand2 className="h-6 w-6 text-accent-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-headline">AI Content Suggestion Tool</CardTitle>
            <CardDescription className="mt-1">
              Enter coordinates to generate a plausible landscape description for an image placeholder.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                placeholder="e.g., 40.7128"
                {...form.register('latitude')}
              />
              {form.formState.errors.latitude && (
                <p className="text-sm font-medium text-destructive">{form.formState.errors.latitude.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                placeholder="e.g., -74.0060"
                {...form.register('longitude')}
              />
              {form.formState.errors.longitude && (
                <p className="text-sm font-medium text-destructive">{form.formState.errors.longitude.message}</p>
              )}
            </div>
          </div>
          {description && (
            <div className="space-y-2">
                <Label htmlFor="description">Generated Description</Label>
                <Textarea id="description" value={description} readOnly rows={3} className="bg-secondary" />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Description'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
