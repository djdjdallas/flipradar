'use client'

export function OverlayScreenshot() {
  return (
    <div className="relative w-full bg-[#18191a] rounded-xl overflow-hidden shadow-2xl" style={{ aspectRatio: '16/10' }}>
      {/* Browser chrome */}
      <div className="h-14 bg-[#3a3b3c] flex flex-col px-3 py-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          <div className="ml-12 flex gap-0.5">
            <div className="bg-[#242526] rounded-t-lg px-3 py-1.5 text-xs text-white/80 flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#1877f2]" />
              Marketplace
            </div>
          </div>
        </div>
        <div className="flex items-center bg-[#242526] rounded-full px-3 py-1.5 mx-12">
          <svg className="w-3 h-3 text-white/40 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span className="text-xs text-white/70 truncate">facebook.com/marketplace/item/nintendo-switch-pro-controller</span>
        </div>
      </div>

      {/* FB Content */}
      <div className="flex" style={{ height: 'calc(100% - 56px)' }}>
        {/* Sidebar */}
        <div className="w-1/4 bg-[#242526] p-3 border-r border-[#3a3b3c] hidden md:block">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#1877f2] rounded-full flex items-center justify-center text-white font-bold">f</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-[#1877f2]/20 text-[#1877f2] text-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              </svg>
              Browse all
            </div>
          </div>
          <div className="mt-3 bg-[#3a3b3c] rounded-full px-3 py-2 flex items-center gap-2">
            <svg className="w-3 h-3 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
            <span className="text-xs text-white/50">Search Marketplace</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            <span className="bg-[#3a3b3c] rounded-full px-2 py-1 text-[10px] text-white">Electronics</span>
            <span className="bg-[#3a3b3c] rounded-full px-2 py-1 text-[10px] text-white">Local pickup</span>
          </div>
        </div>

        {/* Main area with grid */}
        <div className="flex-1 flex">
          {/* Grid */}
          <div className="flex-1 p-3 grid grid-cols-2 lg:grid-cols-3 gap-2 content-start overflow-hidden">
            {[
              { price: '$65', title: 'AirPods Pro 2nd Gen', location: 'Los Angeles, CA', image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=200&h=200&fit=crop' },
              { price: '$120', title: 'PS5 DualSense Controller', location: 'Pasadena, CA', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=200&h=200&fit=crop' },
              { price: '$35', title: 'Vintage Pyrex Bowls', location: 'Glendale, CA', image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=200&h=200&fit=crop' },
              { price: '$200', title: 'iPhone 13 Pro 128GB', location: 'Burbank, CA', image: 'https://images.unsplash.com/photo-1632633173522-47456de71b76?w=200&h=200&fit=crop' },
              { price: '$80', title: 'KitchenAid Mixer', location: 'Santa Monica, CA', image: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=200&h=200&fit=crop' },
              { price: '$150', title: 'Nike Dunk Low Panda', location: 'Long Beach, CA', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200&h=200&fit=crop' },
            ].map((item, i) => (
              <div key={i} className="bg-[#242526] rounded-lg overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-[#374151] to-[#1f2937] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2">
                  <div className="text-sm font-bold text-white">{item.price}</div>
                  <div className="text-[10px] text-white/60 truncate">{item.title}</div>
                  <div className="text-[8px] text-white/40">{item.location}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Detail panel */}
          <div className="w-1/3 bg-[#242526] border-l border-[#3a3b3c] hidden lg:flex flex-col">
            <div className="aspect-video bg-gradient-to-br from-[#4b5563] to-[#374151] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=300&fit=crop"
                alt="Nintendo Switch Pro Controller"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 flex-1">
              <div className="text-2xl font-bold text-white">$45</div>
              <div className="text-sm text-white mt-1">Nintendo Switch Pro Controller - Like New</div>
              <div className="flex gap-3 mt-2 text-[10px] text-white/50">
                <span>Azusa, CA</span>
                <span>Listed 2 days ago</span>
              </div>
              <button className="w-full bg-[#1877f2] text-white rounded-lg py-2 mt-4 text-sm font-semibold">
                Message Seller
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FlipChecker Overlay */}
      <div className="absolute bottom-4 right-4 w-72 bg-[#0a0a0f]/95 backdrop-blur-xl border border-green-500/40 rounded-2xl p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/30">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
              </svg>
            </div>
            <span className="font-bold text-white">Flip<span className="text-green-500">Checker</span></span>
          </div>
          <div className="bg-green-500/20 text-green-500 text-sm font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M7 17l9.2-9.2M17 17V7H7"/>
            </svg>
            +$82
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[10px] text-white/50 uppercase tracking-wide">FB Price</div>
            <div className="text-2xl font-bold text-white">$45</div>
          </div>
          <svg className="w-6 h-6 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
          <div className="text-right">
            <div className="text-[10px] text-white/50 uppercase tracking-wide">eBay Sold</div>
            <div className="text-2xl font-bold text-green-500">$127</div>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl px-3 py-2 mb-4 flex justify-between items-center">
          <span className="text-xs text-white/60">Based on 47 sold listings</span>
          <span className="text-xs font-semibold text-green-500">High confidence</span>
        </div>

        <div className="flex gap-2">
          <button className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-green-500/30">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
            Save Deal
          </button>
          <button className="flex-1 bg-white/10 text-white rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            eBay
          </button>
        </div>
      </div>

      {/* Caption badge */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-sm px-6 py-2 rounded-full shadow-lg shadow-green-500/40 z-10">
        See profit potential on every listing
      </div>
    </div>
  )
}
