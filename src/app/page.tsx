
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageDescriptionGenerator } from '@/components/ImageDescriptionGenerator';
import { Globe, BarChart, FileText } from 'lucide-react';

function LandingPage() {
  return (
    <>
      <section className="w-full py-20 md:py-32 lg:py-40 bg-card">
        <div className="container mx-auto text-center px-4 md:px-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 font-headline">
            Terra Cognita: Explore Your World
          </h1>
          <p className="max-w-[700px] mx-auto text-lg text-muted-foreground md:text-xl mb-8">
            A clean, versatile informational platform focusing on content presentation, providing key data and reports about our world.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg">Get Started</Button>
            <Button size="lg" variant="outline">Learn More</Button>
          </div>
        </div>
      </section>

      <section id="about" className="w-full py-16 md:py-24 bg-background">
        <div className="container mx-auto grid gap-8 px-4 md:px-6 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">About Terra Cognita</h2>
            <p className="text-muted-foreground md:text-lg">
              Terra Cognita is dedicated to providing accessible and beautifully presented information. Our platform is built on a foundation of clarity and precision, ensuring that you can find and understand the data you need without distraction. We believe in the power of knowledge to inspire and drive change.
            </p>
            <p className="text-muted-foreground md:text-lg">
              We leverage modern web technologies and a minimalist design philosophy to create a user-friendly experience. Whether you're a researcher, a student, or just curious, Terra Cognita is your gateway to a world of information.
            </p>
          </div>
          <div className="aspect-video overflow-hidden rounded-lg shadow-lg">
            <Image
              src="https://placehold.co/600x400"
              width={600}
              height={400}
              alt="Abstract representation of data"
              className="object-cover w-full h-full"
              data-ai-hint="earth data"
            />
          </div>
        </div>
      </section>

      <section id="reports" className="w-full py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Key Data & Reports</h2>
            <p className="max-w-[700px] mx-auto text-muted-foreground md:text-lg">
              Explore our featured reports and data sets, curated by our team of experts.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Global Climate Report</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">An in-depth analysis of changing climate patterns across the globe over the last decade.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                  <div className="bg-primary/10 p-3 rounded-full">
                      <BarChart className="h-6 w-6 text-primary" />
                  </div>
                <CardTitle>Economic Outlook 2024</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Projections and analysis of global economic trends, market behavior, and industry growth.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                  <div className="bg-primary/10 p-3 rounded-full">
                      <FileText className="h-6 w-6 text-primary" />
                  </div>
                <CardTitle>Urban Development Study</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">A comprehensive study on the growth of major urban centers and their impact on society.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="ai-tool" className="w-full py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <ImageDescriptionGenerator />
        </div>
      </section>
    </>
  );
}

export default LandingPage;