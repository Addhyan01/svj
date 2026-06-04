import React, { useState } from 'react';

export default function Career() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Field Associate',
    district: '',
    block: '',
    experience: 'Fresher',
    message: ''
  });

  const [loading, setLoading] = useState(false);

  // Active Openings List for testing before backend dynamic fetch
  const openings = [
    {
      title: 'Field Associate (District Operations)',
      location: 'Bihar (All Districts)',
      type: 'Full-Time / Block Level',
      desc: 'Sanitary pads distribution aur tree plantation schemes ko ground level par execute karna aur members data track karna.'
    },
    {
      title: 'Social Media & Awareness Volunteer',
      location: 'Remote / Work from Home',
      type: 'Volunteer (Part-Time)',
      desc: 'NGO ke campaigns, "गाँव गाँव खुशी, देश खुशहाल" ke vision aur health protection awareness ko digital platforms par promote karna.'
    }
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCareerSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // 🚀 FUTURE MILESTONE: Backend Career Application API Endpoint
    console.log('Submitting Career Application:', formData);

    setTimeout(() => {
      setLoading(false);
      alert(`Thank you ${formData.name}! Aapka application [${formData.role}] role ke liye successfully submit ho gaya hai.`);
      // Reset Form
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'Field Associate',
        district: '',
        block: '',
        experience: 'Fresher',
        message: ''
      });
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-purple-100 text-[#5A2D82] uppercase tracking-widest">
          Join Our Mission
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Work With Sabka Vikas Jyoti
        </h2>
        <p className="text-gray-500 text-sm sm:text-base font-medium">
          Hum Bihar ke har gaon aur block tak badlav pahunchane ke liye naye talents aur volunteers ki talaash mein hain. Niche di gayi openings dekhein aur apply karein.
        </p>
      </div>

      {/* ─── CURRENT OPENINGS GRID ─── */}
      <div className="space-y-6">
        <h3 className="text-xl font-black text-gray-900 border-l-4 border-[#3A7D44] pl-3">
          Current Open Positions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {openings.map((job, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-lg font-black text-gray-950">{job.title}</h4>
                  <span className="text-[10px] font-extrabold px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-[#3A7D44] rounded-md tracking-wider uppercase">
                    {job.type}
                  </span>
                </div>
                <p className="text-xs font-bold text-gray-400">📍 {job.location}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{job.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── APPLICATION FORM WINDOW ─── */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-[#5A2D82] to-purple-800 py-5 px-6 sm:px-8 text-center text-white">
          <h3 className="text-xl font-black tracking-tight">Apply Online Form</h3>
          <p className="text-purple-100 text-xs mt-0.5 font-medium">Apni details bharein, hamari team aapse jald hi sampark karegi</p>
        </div>

        <form onSubmit={handleCareerSubmit} className="p-6 sm:p-8 space-y-4">
          
          {/* Name & Role Selection Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Apna poora naam likhein"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/10 focus:border-[#5A2D82] text-sm font-semibold text-gray-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">Position Applying For</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/10 focus:border-[#5A2D82] text-sm font-bold text-gray-700"
              >
                <option value="Field Associate">Field Associate (District Level)</option>
                <option value="Social Media Volunteer">Social Media Volunteer</option>
                <option value="General Volunteer">General Volunteer</option>
              </select>
            </div>
          </div>

          {/* Email & Phone Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">Email ID</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@gmail.com"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/10 focus:border-[#5A2D82] text-sm font-semibold text-gray-800"
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
                placeholder="10-digit mobile number"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/10 focus:border-[#5A2D82] text-sm font-semibold text-gray-800"
              />
            </div>
          </div>

          {/* District & Block Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">District (ज़िला)</label>
              <input
                type="text"
                name="district"
                required
                value={formData.district}
                onChange={handleInputChange}
                placeholder="e.g. Patna"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/10 focus:border-[#5A2D82] text-sm font-semibold text-gray-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">Block (प्रखंड)</label>
              <input
                type="text"
                name="block"
                required
                value={formData.block}
                onChange={handleInputChange}
                placeholder="Block ka naam"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/10 focus:border-[#5A2D82] text-sm font-semibold text-gray-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">Experience</label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/10 focus:border-[#5A2D82] text-sm font-bold text-gray-700"
              >
                <option value="Fresher">Fresher (कोई अनुभव नहीं)</option>
                <option value="1 Year">1 Year</option>
                <option value="2+ Years">2+ Years</option>
              </select>
            </div>
          </div>

          {/* Message / Cover Letter Textbox */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">Why do you want to join us? (Optional)</label>
            <textarea
              name="message"
              rows="3"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Aap is NGO ke sath kyun kaam karna chahte hain, thoda likhein..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/10 focus:border-[#5A2D82] text-sm font-semibold text-gray-800 placeholder-gray-400"
            ></textarea>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition duration-150 transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 flex justify-center items-center text-sm"
            style={{ backgroundColor: '#5A2D82' }} // Branded Purple background for career flow
          >
            {loading ? 'Submitting Application Draft...' : 'Submit Application'}
          </button>

        </form>
      </div>

    </div>
  );
}