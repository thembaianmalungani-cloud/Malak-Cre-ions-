import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';

type PageId = 'home' | 'about' | 'services' | 'gallery' | 'contact';

function getInitialPage(): PageId {
  if (typeof window === 'undefined') return 'home';

  // Check URL pathname
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  if (path === 'about') return 'about';
  if (path === 'services') return 'services';
  if (path === 'gallery') return 'gallery';
  if (path === 'contact') return 'contact';

  // Check Hash
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  if (hash === 'about') return 'about';
  if (hash === 'services') return 'services';
  if (hash === 'gallery') return 'gallery';
  if (hash === 'contact') return 'contact';

  // Check search query parameter
  const searchParams = new URLSearchParams(window.location.search);
  const pageParam = searchParams.get('page')?.toLowerCase();
  if (pageParam === 'about') return 'about';
  if (pageParam === 'services') return 'services';
  if (pageParam === 'gallery') return 'gallery';
  if (pageParam === 'contact') return 'contact';

  return 'home';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>(getInitialPage());

  // Update browser document title based on current page
  useEffect(() => {
    const titles: Record<PageId, string> = {
      home: 'Malak Cre@ions | Beauty & Nail Studio in Giyani',
      about: 'About Us | Malak Cre@ions – Giyani Beauty & Nail Studio',
      services: 'Services & Treatments | Malak Cre@ions Giyani',
      gallery: 'Studio Gallery & Nail Art | Malak Cre@ions Giyani',
      contact: 'Book Appointment | Malak Cre@ions Giyani',
    };
    document.title = titles[currentPage] || titles.home;
  }, [currentPage]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getInitialPage());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = useCallback((page: string) => {
    const validPage: PageId =
      page === 'about' || page === 'services' || page === 'gallery' || page === 'contact'
        ? page
        : 'home';

    setCurrentPage(validPage);

    // Update URL without page reload
    const newPath = validPage === 'home' ? '/' : `/${validPage}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState({ page: validPage }, '', newPath);
    }

    // Scroll to top cleanly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F5] text-[#261D1D] selection:bg-[#EBDCD3] selection:text-[#261D1D]">
      {/* Top Navigation */}
      <Navbar currentPage={currentPage} onNavigate={navigateTo} />

      {/* Main Content Page Container */}
      <main className="flex-1">
        {currentPage === 'home' && <HomePage onNavigate={navigateTo} />}
        {currentPage === 'about' && <AboutPage onNavigate={navigateTo} />}
        {currentPage === 'services' && <ServicesPage onNavigate={navigateTo} />}
        {currentPage === 'gallery' && <GalleryPage />}
        {currentPage === 'contact' && <ContactPage />}
      </main>

      {/* Universal Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp />
    </div>
  );
}
