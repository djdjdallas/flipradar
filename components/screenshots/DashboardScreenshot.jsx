'use client'

export function DashboardScreenshot() {
  return (
    <div className="relative w-full bg-[#09090B] border-2 border-[#09090B] hard-shadow-lg rounded-xl overflow-hidden" style={{ aspectRatio: '16/10' }}>
      {/* Browser chrome */}
      <div className="h-12 bg-[#F8F4E8] border-b-2 border-[#09090B] flex items-center px-4 gap-3">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="flex-1 max-w-md mx-auto">
          <div className="bg-white border-2 border-[#09090B] rounded-md px-3 py-0.5 flex items-center gap-2">
            <svg className="w-3 h-3 text-[#D2E823]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <span className="text-[10px] text-[#09090B]/50 font-bold">flipchecker.io/dashboard</span>
          </div>
        </div>
      </div>

      {/* App layout */}
      <div className="flex" style={{ height: 'calc(100% - 48px)' }}>
        {/* Sidebar */}
        <div className="w-52 bg-[#09090B] border-r border-white/[0.08] p-4 hidden md:flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-[#D2E823] border-2 border-[#09090B] flex items-center justify-center">
              <svg className="w-4 h-4 text-[#09090B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
              </svg>
            </div>
            <span className="heading-font text-lg text-[#D2E823] tracking-tighter">FLIPCHECKER</span>
          </div>

          <nav className="space-y-1">
            <div className="flex items-center gap-2 px-3 py-2 bg-[#D2E823]/10 text-[#D2E823] text-sm font-bold">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              My Deals
            </div>
            <div className="flex items-center gap-2 px-3 py-2 text-white/60 text-sm hover:text-white hover:bg-white/5">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              Price Alerts
            </div>
            <div className="flex items-center gap-2 px-3 py-2 text-white/60 text-sm hover:text-white hover:bg-white/5">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
              Analytics
            </div>
          </nav>

          <div className="mt-auto p-3 bg-[#D2E823]/10 border border-[#D2E823]/20">
            <div className="text-[10px] text-white/50 mb-1">Today&apos;s Lookups</div>
            <div className="h-1.5 bg-white/10 overflow-hidden mb-1">
              <div className="h-full w-[30%] bg-[#D2E823]" />
            </div>
            <div className="text-xs text-white font-medium">3 of 10 <span className="text-white/50">used</span></div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-6 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">My Deals</h1>
            <div className="flex gap-2">
              <button className="flex items-center gap-1 px-3 py-2 bg-white/10 text-white text-xs font-bold border border-white/20">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Export
              </button>
              <button className="flex items-center gap-1 px-3 py-2 bg-[#D2E823] text-[#09090B] text-xs font-black border-2 border-[#09090B]">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Deal
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Total Deals', value: '24', change: '+3 this week' },
              { label: 'Potential Profit', value: '$1,847', change: 'From watching', accent: true },
              { label: 'Realized Profit', value: '$642', change: 'From 8 sold', accent: true },
              { label: 'Win Rate', value: '87%', change: 'Above $50 margin' },
            ].map((stat, i) => (
              <div key={i} className="bg-[#09090B] border border-white/[0.08] p-4">
                <div className="text-xs text-white/50 mb-1">{stat.label}</div>
                <div className={`text-xl font-bold ${stat.accent ? 'text-[#D2E823]' : 'text-white'}`}>{stat.value}</div>
                <div className="text-[10px] text-[#D2E823]">{stat.change}</div>
              </div>
            ))}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {['All (24)', 'Watching (12)', 'Contacted (4)', 'Purchased (5)', 'Sold (8)'].map((tab, i) => (
              <button
                key={i}
                className={`px-3 py-1.5 text-xs font-bold whitespace-nowrap uppercase ${
                  i === 0
                    ? 'bg-[#D2E823]/10 border-2 border-[#D2E823]/30 text-[#D2E823]'
                    : 'border border-white/10 text-white/60'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-[#09090B] border border-white/[0.08] overflow-hidden">
            <div className="grid grid-cols-7 gap-2 px-4 py-3 bg-white/[0.03] border-b border-white/[0.08] text-[10px] font-bold text-white/50 uppercase tracking-wide">
              <span></span>
              <span className="col-span-2">Item</span>
              <span>FB Price</span>
              <span>eBay Est.</span>
              <span>Profit</span>
              <span>Status</span>
            </div>

            {[
              { title: 'Nintendo Switch Pro Controller', location: 'Azusa, CA · 2 days ago', fb: '$45', ebay: '$127', profit: '+$82', status: 'watching' },
              { title: 'Vintage Pyrex Bowl Set', location: 'Glendale, CA · 5 days ago', fb: '$35', ebay: '$85', profit: '+$50', status: 'contacted' },
              { title: 'AirPods Pro 2nd Gen', location: 'Los Angeles, CA · 1 week ago', fb: '$65', ebay: '$145', profit: '+$80', status: 'sold' },
              { title: 'iPhone 13 Pro 128GB', location: 'Burbank, CA · 3 days ago', fb: '$200', ebay: '$480', profit: '+$280', status: 'purchased' },
            ].map((deal, i) => (
              <div key={i} className="grid grid-cols-7 gap-2 px-4 py-3 border-b border-white/[0.05] items-center hover:bg-white/[0.02]">
                <div className="w-10 h-10 bg-[#09090B] border border-white/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                  </svg>
                </div>
                <div className="col-span-2">
                  <div className="text-sm font-medium text-white truncate">{deal.title}</div>
                  <div className="text-[10px] text-white/40">{deal.location}</div>
                </div>
                <div className="text-sm font-bold text-white">{deal.fb}</div>
                <div className="text-sm font-bold text-[#D2E823]">{deal.ebay}</div>
                <div className="inline-flex items-center gap-1 bg-[#D2E823]/15 text-[#D2E823] px-2 py-1 text-xs font-bold w-fit">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M7 17l9.2-9.2M17 17V7H7"/>
                  </svg>
                  {deal.profit}
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 w-fit uppercase ${
                  deal.status === 'watching' ? 'bg-blue-500/15 text-blue-400' :
                  deal.status === 'contacted' ? 'bg-yellow-500/15 text-yellow-400' :
                  deal.status === 'purchased' ? 'bg-purple-500/15 text-purple-400' :
                  'bg-[#D2E823]/15 text-[#D2E823]'
                }`}>
                  {deal.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Caption badge */}
      <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-[#D2E823] border-2 border-[#09090B] text-[#09090B] font-black text-sm px-6 py-2 hard-shadow-sm z-10 uppercase">
        Track and manage all your deals
      </div>
    </div>
  )
}
