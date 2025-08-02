import Link from 'next/link';

export default function AnalysisPage() {
  return (
    <div className="bg-white text-stone-800">
      <div className="container mx-auto max-w-4xl py-12 px-4 md:px-6">
        <div className="space-y-12">
          <div className="border-b border-stone-200 pb-8">
            <h1 className="text-4xl font-bold tracking-tight">Site Info</h1>
            <p className="mt-2 text-stone-600">
              (If lat long coordinates or kml file isn&apos;t uploaded)
            </p>
            <Link href="/#site-location" className="text-primary underline hover:text-primary/80">
              click here to input site coordinates.
            </Link>
          </div>

          <div className="border-b border-stone-200 pb-8">
            <h2 className="text-4xl font-bold tracking-tight">Vegetation &amp; Terrain Analysis</h2>
            <p className="mt-2 text-stone-600">
              Report on the vegetation and terrain of the site
            </p>
          </div>

          <div className="border-b border-stone-200 pb-8">
            <h2 className="text-4xl font-bold tracking-tight">Climate Conditions</h2>
            <p className="mt-2 text-stone-600">
              Report on the climate/weather
            </p>
          </div>

          <div>
            <h2 className="text-4xl font-bold tracking-tight">Optimal Usage</h2>
            <p className="mt-2 text-stone-600">
              Gives a report on optimal things to build/preserve on the site
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
