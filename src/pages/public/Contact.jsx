import React, { useState } from 'react';
import { enquiryAPI } from '../../api/services';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Enquiry',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await enquiryAPI.submit(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: 'General Enquiry', message: '' });
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      
      {/* Left Column: NGO Office Info (40% space on desktop) */}
      <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Get in Touch</h2>
          <p className="text-gray-500 font-medium text-sm sm:text-base">
            Sabka Vikas Jyoti NGO se judi kisi bhi jankari ya shikayat ke liye aap humse direct sampark kar sakte hain.
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-50 text-[#3A7D44] rounded-xl border border-emerald-100 shrink-0">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0x" />
              </svg>
            </div>
            <div>
              <h4 className="font-black text-gray-900 text-sm sm:text-base">Registered Head Office</h4>
              <p className="text-sm text-gray-600 font-medium mt-0.5">Patna, Bihar, India</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-50 text-[#5A2D82] rounded-xl border border-purple-100 shrink-0">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h4 className="font-black text-gray-900 text-sm sm:text-base">Email Support</h4>
              <p className="text-sm text-gray-600 font-medium mt-0.5">info@sabkavikasjyoti.org</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Contact Interactive Form (70% space on desktop) */}
      <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100">

        {/* Success message */}
        {success && (
          <div className="mb-5 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-bold text-emerald-800">Message sent successfully!</p>
              <p className="text-xs text-emerald-600 mt-0.5">Hamari team jald hi aapse sampark karegi.</p>
            </div>
            <button onClick={() => setSuccess(false)} className="ml-auto text-emerald-400 hover:text-emerald-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 rounded-2xl px-5 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleContactSubmit} className="space-y-4">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">Your Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Apna naam darj karein"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-gray-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@gmail.com"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-gray-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">Mobile Number</label>
              <input
                type="tel"
                name="phone"
                required
                maxLength="10"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="10-digit mobile no"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-gray-800"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">Subject (विषय)</label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-bold text-gray-700"
            >
              <option value="General Enquiry">General Enquiry (सामान्य पूछताछ)</option>
              <option value="Scheme Related">Scheme Related (योजना सम्बंधित)</option>
              <option value="Technical Support">Technical Support (तकनीकी सहायता)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">Your Message</label>
            <textarea
              name="message"
              required
              rows="4"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Apna sandesh ya pooch-taach yahan detail me likhein..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-gray-800 placeholder-gray-400"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition duration-150 transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 flex justify-center items-center text-sm"
            style={{ backgroundColor: '#3A7D44' }}
          >
            {loading ? 'Sending Message Vector...' : 'Send Message'}
          </button>

        </form>
      </div>

    </div>
  );
}