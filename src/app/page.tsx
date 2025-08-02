
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown } from 'lucide-react';

function LandingPage() {
  return (
    <div className="bg-white">
      <section 
        className="relative w-full h-[50vh] bg-cover bg-center text-white flex flex-col items-center justify-center"
        style={{ backgroundImage: "url('https://placehold.co/1920x1080')" }}
        data-ai-hint="aerial forest"
      >
        <div 
          className="absolute inset-0 bg-black/60"
        />
        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold">Interactive Map</h1>
          <Button className="mt-6 bg-stone-700 hover:bg-stone-800 text-white px-10 py-6 text-lg rounded-lg">Open</Button>
        </div>
        <nav className="absolute bottom-0 left-0 right-0 z-10">
          <div className="container mx-auto">
            <div className="flex items-center gap-8 border-t border-stone-500 py-3 text-sm">
              <a href="#" className="flex items-center gap-1 text-white/80 hover:text-white">DASHBOARD <ChevronDown className="w-4 h-4"/></a>
              <a href="#" className="text-white/80 hover:text-white">SOURCES</a>
              <a href="#" className="text-white/80 hover:text-white">FEEDBACK</a>
            </div>
          </div>
        </nav>
      </section>

      <main className="container mx-auto py-16 px-4 space-y-20">
        <section id="site-location">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-stone-800">Site Location</h2>
              <p className="text-stone-600 max-w-md">
                Enter the latitude and longitude co-ordinates or upload a kml file to obtain precise details on the site.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude" className="font-semibold text-stone-700">Latitude</Label>
                  <Input id="latitude" placeholder="Latitude" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="longitude" className="font-semibold text-stone-700">Longitude</Label>
                  <Input id="longitude" placeholder="Longitude" className="mt-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="kml-file" className="font-semibold text-stone-700">Upload KML File</Label>
                <Button variant="outline" className="w-full mt-1 bg-stone-700 text-white hover:bg-stone-800 border-stone-700">Upload</Button>
              </div>
            </div>
            <div>
              <Image
                src="https://placehold.co/600x400"
                width={600}
                height={400}
                alt="Site location map"
                className="rounded-lg shadow-lg w-full h-auto object-cover"
                data-ai-hint="topographic map"
              />
            </div>
          </div>
        </section>

        <section id="vegetation-analysis">
            <h2 className="text-4xl font-bold text-stone-800">Vegetation &amp; Terrain Analysis</h2>
            <p className="text-stone-600 mt-2 mb-6 max-w-2xl">
              Automatically retrieves vegetation, terrain slope, water bodies in and around your site
            </p>
            <Card className="overflow-hidden relative">
              <Image
                  src="https://placehold.co/1200x600"
                  width={1200}
                  height={600}
                  alt="Vegetation analysis map"
                  className="w-full h-auto object-cover"
                  data-ai-hint="vegetation map"
                />
              <Button className="absolute bottom-6 right-6 bg-stone-700 hover:bg-stone-800 text-white px-8 py-5">Retrieve</Button>
            </Card>
            <p className="text-center mt-4 text-stone-600">
              <a href="#" className="underline hover:text-stone-800">click here to download vegetation and terrain report</a>
            </p>
        </section>

        <section id="climate-conditions">
          <h2 className="text-4xl font-bold text-stone-800">Climate Conditions At Your Site</h2>
          <p className="text-stone-600 mt-2 mb-6 max-w-2xl">
            Automatically retrieves the temperature, humidity, sun exposure, and wind conditions at your site.
          </p>
          <Card className="overflow-hidden relative">
            <Image
              src="https://placehold.co/1200x600"
              width={1200}
              height={600}
              alt="Climate conditions map"
              className="w-full h-auto object-cover"
              data-ai-hint="weather map"
            />
            <Button className="absolute bottom-6 right-6 bg-stone-700 hover:bg-stone-800 text-white px-8 py-5">Retrieve</Button>
          </Card>
          <p className="text-center mt-4 text-stone-600">
            <a href="#" className="underline hover:text-stone-800">click here to download climate condition report</a>
          </p>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;
