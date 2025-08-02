
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Trees,
  Building2,
  Waves,
  Wind,
  Thermometer,
  Droplets,
  CloudRain,
  TrendingUp,
  Leaf,
} from 'lucide-react';

const filters = [
  { name: 'Agricultural Land', icon: Leaf },
  { name: 'Forest', icon: Trees },
  { name: 'Urban', icon: Building2 },
  {
    name: 'Boundaries',
    icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 9.5H3" />
        <path d="M21 14.5H3" />
        <path d="M9 9.5V14.5" />
        <path d="M15 9.5V14.5" />
      </svg>
    ),
  },
  { name: 'Water Bodies', icon: Waves },
  { name: 'Wind', icon: Wind },
  { name: 'Temperature', icon: Thermometer },
  { name: 'Humidity', icon: Droplets },
  { name: 'Rainfall', icon: CloudRain },
  { name: 'Elevation', icon: TrendingUp },
  {
    name: 'Slope',
    icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="19" y1="5" x2="5" y2="19" />
        <circle cx="6.5" cy="17.5" r="1.5" />
        <circle cx="17.5" cy="6.5" r="1.5" />
      </svg>
    ),
  },
];

export default function FiltersPage() {
  return (
    <div className="bg-white text-stone-800">
      <div className="container mx-auto max-w-7xl py-12 px-4 md:px-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
          Map of Planning Data for Bengaluru
        </h1>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="p-6 border rounded-lg shadow-lg bg-card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Filters</h2>
                <Button>Apply</Button>
              </div>
              <div className="space-y-4">
                {filters.map((filter) => (
                  <div
                    key={filter.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <filter.icon />
                      <label
                        htmlFor={`filter-${filter.name}`}
                        className="text-lg"
                      >
                        {filter.name}
                      </label>
                    </div>
                    <Checkbox
                      id={`filter-${filter.name}`}
                      defaultChecked
                      className="h-6 w-6"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="border rounded-lg overflow-hidden shadow-lg h-full">
              <Image
                src="https://placehold.co/1200x800"
                width={1200}
                height={800}
                alt="Map of Bengaluru"
                className="w-full h-full object-cover"
                data-ai-hint="city map"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
