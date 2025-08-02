
'use client';

import { Search, CircleUser, Home, Map, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/analysis', label: 'Analysis', icon: BarChart3 },
    { href: '/filters', label: 'Interactive Map', icon: Map },
  ];

  return (
    <header className="bg-stone-800 text-white shadow-md sticky top-0 z-50">
      <div className="w-full max-w-7xl mx-auto flex h-20 md:h-24 items-center justify-between px-4 md:px-8">
        {/* Left Side: Logo + Navigation */}
        <div className="flex items-center gap-6 md:gap-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 md:gap-3 flex-shrink-0 py-1 md:py-2">
            <div className="w-8 h-8 md:w-9 md:h-9 bg-white rounded-full flex items-center justify-center">
              <Map className="w-4 h-4 md:w-5 md:h-5 text-stone-800" />
            </div>
            <span className="font-bold text-lg md:text-xl">AI Powered Site Analysis</span>
          </Link>
          
          {/* Navigation Links */}
          <nav className="flex items-center gap-1 md:gap-2">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <Button
                  variant="ghost"
                  className={`flex items-center gap-2 md:gap-3 px-3 md:px-5 py-2 md:py-3 h-10 md:h-12 rounded-md md:rounded-lg transition-colors ${
                    pathname === href
                      ? 'bg-stone-700 text-white'
                      : 'text-stone-300 hover:bg-stone-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                  <span className="text-xs md:text-sm font-medium hidden sm:inline">{label}</span>
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Side: Search + User */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Search Bar */}
          <div className="relative w-48 md:w-64 hidden md:block">
            <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <Input 
              placeholder="Search..." 
              className="bg-stone-700 border-stone-600 text-white pl-10 md:pl-12 pr-3 md:pr-4 py-2 md:py-3 h-9 md:h-11 text-sm rounded-md md:rounded-lg focus:ring-stone-500 focus:border-stone-500"
            />
          </div>
          
          {/* User Menu */}
          <Button variant="ghost" size="sm" className="w-9 h-9 md:w-11 md:h-11 p-0 rounded-full hover:bg-stone-700">
            <CircleUser className="h-5 w-5 md:h-6 md:w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
