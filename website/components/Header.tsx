'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-semibold text-gray-900">Pathfinder</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link href="/how-it-works" className="text-gray-700 hover:text-gray-900 transition-colors">
              How It Works
            </Link>
            <Link href="/services" className="text-gray-700 hover:text-gray-900 transition-colors">
              Services
            </Link>
            <Link href="/mentors" className="text-gray-700 hover:text-gray-900 transition-colors">
              Mentors
            </Link>
            <Link href="/results" className="text-gray-700 hover:text-gray-900 transition-colors">
              Results
            </Link>
            <Link
              href="/pricing"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link href="/how-it-works" className="block text-gray-700 hover:text-gray-900">
              How It Works
            </Link>
            <Link href="/services" className="block text-gray-700 hover:text-gray-900">
              Services
            </Link>
            <Link href="/mentors" className="block text-gray-700 hover:text-gray-900">
              Mentors
            </Link>
            <Link href="/results" className="block text-gray-700 hover:text-gray-900">
              Results
            </Link>
            <Link
              href="/pricing"
              className="block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center font-medium"
            >
              Get Started
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}



