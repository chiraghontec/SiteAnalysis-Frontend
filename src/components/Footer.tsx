
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-stone-700 text-stone-300">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          <div className="space-y-3">
            <h4 className="font-semibold text-white">Dashboard</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-white">Home</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-white">Sources</h4>
             <ul className="space-y-2">
              <li><Link href="#" className="hover:text-white">Data</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-white">Feedback</h4>
             <ul className="space-y-2">
              <li><Link href="#" className="hover:text-white">Survey</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-white">About</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-white">Our Mission</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-white">Contact</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-white">Support</Link></li>
            </ul>
          </div>
           <div className="space-y-3">
            <h4 className="font-semibold text-white">Terms And Conditions</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-stone-600 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} XYZ copyright. All rights reserved.</p>
          <div className="w-20 h-12 bg-stone-500 rounded-md mt-4 sm:mt-0"></div>
        </div>
      </div>
    </footer>
  );
}
