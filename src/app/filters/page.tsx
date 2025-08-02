
import Image from 'next/image';
import Link from 'next/link';

export default function FiltersPage() {
  return (
    <div className="bg-white text-stone-800">
      <div className="container mx-auto max-w-7xl py-12 px-4 md:px-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Map of Planning Data for Bengaluru</h1>
        <div className="border rounded-lg overflow-hidden shadow-lg">
          <Image
            src="https://placehold.co/1200x600"
            width={1200}
            height={600}
            alt="Map of Bengaluru"
            className="w-full h-auto object-cover"
            data-ai-hint="city map"
          />
        </div>
        <div className="text-center mt-6">
          <Link href="#" className="text-primary underline hover:text-primary/80">
            click here to generate report ONLY on selected filters
          </Link>
        </div>
      </div>
    </div>
  );
}
