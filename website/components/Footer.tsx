import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pathfinder</h3>
            <p className="text-gray-600 max-w-md">
              Turning uncertainty into clarity. Personalized mentorship for students and early-career professionals.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-600 hover:text-gray-900">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/mentors" className="text-gray-600 hover:text-gray-900">
                  Mentors
                </Link>
              </li>
              <li>
                <Link href="/results" className="text-gray-600 hover:text-gray-900">
                  Results
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
                  Pricing
                </Link>
              </li>
              <li>
                <a href="mailto:hello@pathfinder.mentor" className="text-gray-600 hover:text-gray-900">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600 text-sm">
          <p>&copy; {new Date().getFullYear()} Pathfinder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}



