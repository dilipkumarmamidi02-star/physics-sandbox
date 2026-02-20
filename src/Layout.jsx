import React from 'react';
import Navbar from '@/components/physics/Navbar';

export default function Layout({ children, currentPageName }) {
  // Don't show navbar on home page (it has its own hero)
  const showNavbar = currentPageName !== 'Home';

  return (
    <div className="min-h-screen bg-slate-950">
      <style>{`
        :root {
          --bg: #020617;
          --primary: #00d4ff;
          --secondary: #7928ca;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: var(--bg);
          color: #e2e8f0;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(0, 212, 255, 0.3);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 212, 255, 0.5);
        }

        /* Slider styling */
        .slider-thumb {
          background: linear-gradient(135deg, #00d4ff, #7928ca);
        }
      `}</style>
      
      {showNavbar && <Navbar />}
      
      <main>
        {children}
      </main>
    </div>
  );
}
