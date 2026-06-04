import React from 'react';

export default function About() {
  const corePillars = [
    {
      title: 'Swasthya Suraksha (Health)',
      desc: 'Rural areas ki mahilaon aur betiyon tak sanitary pads ki doorstep access pahunchana aur hygiene awareness badhana.',
      icon: '🩺',
      bgColor: 'bg-purple-50 border-purple-100 text-purple-700'
    },
    {
      title: 'Paryavaran (Environment)',
      desc: 'Multi-slab pricing model ke tahat kisaano ke sath milkar fruit-bearing aur commercial trees lagana taaki dharti bhi hari ho aur kamai bhi badhe.',
      icon: '🌱',
      bgColor: 'bg-emerald-50 border-emerald-100 text-emerald-700'
    },
    {
      title: 'Graameen Vikas (Rural Growth)',
      desc: 'Block aur District level par Field Associates ke zariye youth ko jodna aur social welfare schemes ko transparent banana.',
      icon: '🏡',
      bgColor: 'bg-amber-50 border-amber-100 text-amber-700'
    }
  ];

  return (
    <div className="space-y-16 pb-20">
      
      {/* ─── SECTION 1: HERO STORY BANNER ─── */}
      <section className="bg-gradient-to-br from-purple-50 via-white to-emerald-50 py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-[#3A7D44] uppercase tracking-widest">
            Hamari Kahani
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-950 tracking-tight leading-tight">
            Sabka Vikas Jyoti NGO <br />
            <span style={{ color: '#3A7D44' }}>“गाँव गाँव खुशी, देश खुशहाल”</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-3xl mx-auto pt-2">
            Hum ek aisi vichardhara hain jo Bihar ke graameen kshetron mein ground-level par badlav lane ke liye sankalpit hai. Hamara manna hai ki jab tak hamare gaon swasth, hare-bhare aur aatmanirbhar nahi honge, tab tak desh ka sahi vikas nahi ho sakta.
          </p>
        </div>
      </section>

      {/* ─── SECTION 2: VISION & MISSION GRID ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Mission Box */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-3">
            <div className="text-2xl">🎯</div>
            <h3 className="text-xl font-black text-gray-950">Our Mission (हमारा लक्ष्य)</h3>
            <p className="text-sm sm:text-base text-gray-600 font-medium leading-relaxed">
              Bihar ke har ek block aur parivar tak swasthya suraksha (Sanitary Pads Subscription) aur paryavaran sanrakshan (Tree Plantation Matrix) ka automated model pahunchana, taaki transparency aur service dono seedhe labharthi tak pahunche.
            </p>
          </div>

          {/* Vision Box */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-3">
            <div className="text-2xl">👁️</div>
            <h3 className="text-xl font-black text-gray-950">Our Vision (हमारा दृष्टिकोण)</h3>
            <p className="text-sm sm:text-base text-gray-600 font-medium leading-relaxed">
              Ek aisa sashakt samaj banana jahan swasthya ke prati koi jhijhak na ho, kisaano ki aamdani ke naye srot hon, aur ek mazboot digital framework ho jo rural empowerment ko naye mukam par le jaye.
            </p>
          </div>

        </div>
      </section>

      {/* ─── SECTION 3: CORE PILLARS MATRIX ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Hamare Teen Mukhya Stambha</h3>
          <p className="text-gray-500 max-w-md mx-auto text-xs sm:text-sm font-medium">Inhi teen muddon par hamari poori operational team din-raat ground par kaam karti hai.</p>
        </div>

        {/* Responsive Layout Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {corePillars.map((pillar, index) => (
            <div key={index} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between transform hover:scale-[1.02] transition duration-200">
              <div className="space-y-2">
                <div className={`h-12 w-12 rounded-xl border flex items-center justify-center text-xl ${pillar.bgColor}`}>
                  {pillar.icon}
                </div>
                <h4 className="text-lg font-black text-gray-950 pt-2">{pillar.title}</h4>
                <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">{pillar.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}