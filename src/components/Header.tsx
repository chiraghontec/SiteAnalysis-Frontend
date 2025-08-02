
import { Search, CircleUser } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function Header() {
  return (
    <header className="bg-stone-800 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-full"></div>
          <span className="font-bold text-xl">Website name</span>
        </Link>
        <div className="relative flex-1 max-w-md mx-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
            <Input 
                placeholder="Search..." 
                className="bg-stone-700 border-stone-600 text-white pl-10 focus:ring-stone-500"
            />
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-stone-700">
            <CircleUser className="h-7 w-7" />
          </Button>
        </div>
      </div>
    </header>
  );
}
