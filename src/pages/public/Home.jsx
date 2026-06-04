import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  // Static Data for testing before backend connection
  const stats = [
    { id: 1, name: 'Active Premium Members', value: '1,250+' },
    { id: 2, name: 'Trees Planted across Bihar', value: '29,000+' },
    { id: 3, name: 'Sanitary Pads Distributed', value: '15,000+' },
  ];

  const services = [
    {
      id: 'pad-sub',
      title: 'Sanitary Pad Distribution',
      type: 'SUBSCRIPTION',
      priceText: '₹300 / Year',
      desc: 'Rural areas ki mahilaon ke liye saal bhar ka sanitary pads quota aur swasthya suraksha bundle.',
      bgColor: 'border-purple-100 bg-purple-50/50 hover:border-purple-300'
    },
    {
      id: 'tree-slab',
      title: 'Tree Plantation & Distribution',
      type: 'ON_DEMAND',
      priceText: 'Slab Pricing model based',
      desc: 'Pehla tree ₹625 mein aur uske baad har ek tree par ₹300 ka bada discount. Paryavaran aur kisaano ki kamai ka sahara.',
      bgColor: 'border-emerald-100 bg-emerald-50/50 hover:border-emerald-300'
    }
  ];

  return (
    <div className="space-y-16 pb-20">
      
      {/* ─── HERO BANNER SECTION (RESPONSIVE) ─── */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-white to-purple-50 py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-[#3A7D44] uppercase tracking-widest animate-pulse">
            Sabka Vikas Jyoti NGO
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-gray-950 leading-tight">
            गाँव गाँव खुशी, <br className="sm:hidden" />
            <span style={{ color: '#3A7D44' }}>देश खुशहाल</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-600 text-base sm:text-lg md:text-xl font-medium leading-relaxed">
            Bihar ke har ek jile aur block mein ground-level par badlav lana. Mahilaon ke swasthya suraksha aur paryavaran sanrakshan ke sath graameen vikas ko aage badhana hamara sankalp hai.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              to="/services" 
              className="w-full sm:w-auto text-center text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition duration-150 transform hover:-translate-y-0.5"
              style={{ backgroundColor: '#3A7D44' }}
            >
              Our Services Catalog
            </Link>
            <Link 
              to="/donation" 
              className="w-full sm:w-auto text-center bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 font-bold px-8 py-4 rounded-xl shadow-sm transition duration-150"
            >
              Direct Donation
            </Link>
          </div>
        </div>
      </section>

      {/* ─── DYNAMIC IMPACT STATS BLOCK ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div key={stat.id} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 text-center space-y-2 transform hover:scale-[1.02] transition duration-200">
              <p className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">{stat.value}</p>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">{stat.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SERVICES MASTER CATALOG PREVIEW ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Our Core Operational Services</h2>
          <p className="text-gray-500 max-w-lg mx-auto text-sm sm:text-base">MERN stack backend rules dwara fully automated aur security validated services.</p>
        </div>

        {/* Responsive Grid Setup: Mobile=1, Tablet=2, Laptop=2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => (
            <div key={service.id} className={`p-6 sm:p-8 rounded-2xl border transition duration-200 shadow-sm flex flex-col justify-between space-y-6 ${service.bgColor}`}>
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">{service.title}</h3>
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md tracking-wider border ${
                    service.type === 'SUBSCRIPTION' 
                      ? 'bg-purple-100 border-purple-200 text-purple-700' 
                      : 'bg-emerald-100 border-emerald-200 text-emerald-700'
                  }`}>
                    {service.type}
                  </span>
                </div>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{service.desc}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pricing Plan</p>
                  <p className="text-lg font-extrabold text-gray-950">{service.priceText}</p>
                </div>
                <Link 
                  to={`/services`} 
                  className="bg-white hover:bg-gray-900 hover:text-white border border-gray-300 text-gray-800 font-bold px-4 py-2.5 rounded-xl text-sm transition duration-150 shadow-sm"
                >
                  View Full Logic
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}