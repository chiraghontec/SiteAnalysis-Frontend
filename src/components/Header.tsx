import { MountainSnow } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="bg-background/80 sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <MountainSnow className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg text-foreground">Terra Cognita</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="#about" className="text-muted-foreground transition-colors hover:text-foreground">
            About
          </Link>
          <Link href="#reports" className="text-muted-foreground transition-colors hover:text-foreground">
            Reports
          </Link>
          <Link href="#ai-tool" className="text-muted-foreground transition-colors hover:text-foreground">
            AI Tool
          </Link>
        </nav>
        <Button>Contact Us</Button>
      </div>
    </header>
  );
}
