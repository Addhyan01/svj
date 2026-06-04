import React from 'react';
// import { Link } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom'; // 🚀 useLocation add kiya

export default function Footer() {
  const location = useLocation(); // 🚀 Current path track karne ke liye
  const currentYear = new Date().getFullYear();
  
// 🚀 BLOCKER GUARD: Dashboard par footer ko render nahi karna hai
  if (location.pathname.startsWith('/dashboard')) {
    return null;
  }


  const footerLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Our Services', path: '/services' },
    { name: 'Careers', path: '/career' },
    { name: 'Download Center', path: '/download' },
    { name: 'Contact Us', path: '/contact' }
  ];

  return (
    <footer className="bg-gray-900 text-gray-400 pt-12 pb-6 mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ─── MAIN 3-COLUMN RESPONSIVE GRID ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-gray-800">
          
          {/* Column 1: NGO Branding Message */}
          <div className="space-y-3">
            <div className="flex flex-col select-none">
              <div className="text-xl font-black tracking-wide leading-tight flex space-x-1">
                <span className="text-purple-400">सबका</span>
                <span className="text-emerald-400">वि<span className="text-purple-400">का</span>स</span>
                <span className="text-purple-400">ज्यति</span>
              </div>
              <span className="text-xs font-bold leading-none mt-1 text-emerald-400 tracking-wider">
                “गाँव गाँव खुशी, देश खुशहाल”
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm pt-1">
              Bihar ke har jile aur block mein ground-level par badlav lana. Mahilaon ke swasthya suraksha aur paryavaran sanrakshan hamara sankalp hai.
            </p>
          </div>

          {/* Column 2: Interactive Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider border-l-2 border-emerald-500 pl-2">
              Quick Navigation
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {footerLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className="hover:text-emerald-400 transition duration-150 font-medium"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Contact & Support Coordinates */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider border-l-2 border-emerald-500 pl-2">
              Connect With Us
            </h4>
            <ul className="space-y-2 text-sm font-medium">
              <li className="flex items-center space-x-2">
                <span className="text-gray-500">📍</span>
                <span>Registered Head Office: Patna, Bihar</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-gray-500">✉️</span>
                <a href="mailto:info@sabkavikasjyoti.org" className="hover:text-emerald-400 transition">
                  info@sabkavikasjyoti.org
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* ─── BOTTOM COPYRIGHT COMPONENT ─── */}
        <div className="pt-6 text-center text-xs space-y-1">
          <p className="font-semibold text-gray-500">
            © {currentYear} Sabka Vikas Jyoti NGO. All Rights Reserved.
          </p>
          <p className="text-gray-600 font-medium">
            Designed & Developed for Automated Rural Empowerment Matrix.
          </p>
        </div>

      </div>
    </footer>
  );
}