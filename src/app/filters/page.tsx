
import { FiltersSheet } from '@/components/FiltersSheet';

export default function FiltersPage() {
  return (
    <div className="bg-white text-stone-800">
      <div className="container mx-auto max-w-4xl py-12 px-4 md:px-6">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Filters</h1>
            <p className="mt-2 text-stone-600">
              Select filters to apply to the map.
            </p>
          </div>
          <div className="flex justify-start">
            <FiltersSheet />
          </div>
        </div>
      </div>
    </div>
  );
}
