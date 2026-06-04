import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Core Public Views Imports
import Home from './pages/public/Home';
import Donation from './pages/public/Donation';
import Services from './pages/public/Services';
import Career from './pages/public/Career';
import Download from './pages/public/Download';
import Contact from './pages/public/Contact';
import About from './pages/public/About';

// Auth View Imports
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Dashboard and Role-Based Views Imports (Future Implementation)
import DashboardLayout from './pages/Dashboard/DashboardLayout';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Persistent Floating Header Layout */}
      <Navbar />

      {/* Dynamic Route Rendering Grid */}
      <main className="flex-grow">
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/donation" element={<Donation />} />
            <Route path="/services" element={<Services />} />
            <Route path="/career" element={<Career />} />
            <Route path="/download" element={<Download />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />

            {/* //dashboard route with role-based access control (future implementation) */}
            <Route path="/dashboard" element={<DashboardLayout />} />
            
            {/* Live Auth Endpoints Screen Routing */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

          
           
        </Routes>
      </main>
      <Footer/>
    </div>
  );
}