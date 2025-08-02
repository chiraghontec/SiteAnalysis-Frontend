
'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
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
  Filter,
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

export function FiltersSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" /> Filters
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Map Filters</SheetTitle>
          <SheetDescription>
            Select the data layers to display on the interactive map.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          {filters.map((filter) => (
            <div
              key={filter.name}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <filter.icon />
                <label htmlFor={`filter-${filter.name}`} className="text-lg">
                  {filter.name}
                </label>
              </div>
              <Checkbox id={`filter-${filter.name}`} defaultChecked className="h-6 w-6" />
            </div>
          ))}
        </div>
        <SheetFooter>
          <Button type="submit">Apply Filters</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
