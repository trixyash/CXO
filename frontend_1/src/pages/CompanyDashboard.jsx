import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Briefcase, LayoutDashboard, CreditCard, 
  Bell, MessageSquare, Settings, User, Zap, 
  ChevronRight, ChevronLeft, Clock, Building, 
  MapPin, CheckCircle, ArrowRight, LogOut, Trophy, Plus,
  Users, Activity, FileText, Star, X
} from 'lucide-react';

const CompanyDashboard = () => {
  const navigate = useNavigate();
  // State
  const [activeMenu, setActiveMenu] = useState('Search Experts');
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [activeSubMenu, setActiveSubMenu] = useState('Home');
  const [searchFocused, setSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [activeActivityTab, setActiveActivityTab] = useState('Applications');
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Carousel auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Scroll effect for Top Nav
  useEffect(() => {
    const handleScroll = (e) => setIsScrolled(e.target.scrollTop > 10);
    const mainArea = document.getElementById('main-scroll-area');
    if (mainArea) {
        mainArea.addEventListener('scroll', handleScroll);
        return () => mainArea.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Data Structures
  const menuData = {
    'Search Experts': { icon: Search, subs: ['Home', 'Recommended Experts', 'Previous Experts', 'Filter Experts'] },
    'Post Role': { icon: Briefcase, subs: ['Add New Role', 'Previous Roles', 'Current Roles'] },
    'Dashboard': { icon: LayoutDashboard, subs: ['Pending Actions', 'Active Projects'] },
    'Payments': { icon: CreditCard, subs: ['Payment History', 'Pending Payments', 'Active Contracts', 'Invoice Management'] }
  };

  const handleRailClick = (menu) => {
    if (activeMenu === menu && isPanelOpen) {
        setIsPanelOpen(false);
    } else {
        setActiveMenu(menu);
        setIsPanelOpen(true);
        setActiveSubMenu(menuData[menu].subs[0]);
    }
  };

  const categories = [
    { icon: Users, label: 'Browse Experts', color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: Plus, label: 'Post a Role', color: 'text-teal-500', bg: 'bg-teal-50' },
    { icon: Activity, label: 'Active Projects', color: 'text-purple-500', bg: 'bg-purple-50' },
    { icon: CreditCard, label: 'Payments', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { icon: FileText, label: 'Shortlisted', color: 'text-amber-500', bg: 'bg-amber-50' },
    { icon: MessageSquare, label: 'Interview Stage', color: 'text-indigo-500', bg: 'bg-indigo-50' }
  ];

  const featuredCards = [
    { title: 'Top 50 Interim CFOs of 2026', subtitle: 'View the curated list of vetted finance leaders.', bg: 'bg-gradient-to-br from-slate-800 to-slate-900' },
    { title: 'The Future of Fractional CMOs', subtitle: 'Why fast-growing startups are hiring part-time marketing chiefs.', bg: 'bg-gradient-to-br from-teal-800 to-teal-900' },
    { title: 'Success Story: Acumen Corp', subtitle: 'How they scaled operations with a CXO Connect COO.', bg: 'bg-gradient-to-br from-indigo-800 to-indigo-900' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans text-gray-800">
      
      {/* 1. Far-Left Icon Rail (Narrow Sidebar) */}
      <aside className="w-16 bg-[#0B1437] flex flex-col justify-between shrink-0 z-50 py-4 shadow-xl">
        <div className="flex flex-col items-center gap-4">
          {/* Logo Mark */}
          <div className="w-10 h-10 flex items-center justify-center mb-4 border-b border-white/10 pb-4 flex items-center shrink-0">
             <img 
                src="/assets/images/LOGO_WHITE.png" 
                alt="CXO Connect" 
                className="h-9 md:h-11 w-auto object-contain"
             />
          </div>

          {/* Top Icons */}
          {Object.keys(menuData).map((menu) => {
            const Icon = menuData[menu].icon;
            const isActive = activeMenu === menu;
            return (
              <div 
                key={menu} 
                onClick={() => handleRailClick(menu)}
                className="relative w-12 h-12 flex items-center justify-center cursor-pointer group"
                title={menu}
              >
                <div className={`absolute inset-0 rounded-xl transition-all duration-200 ${isActive ? 'bg-[#0eb59a] scale-100' : 'bg-white/10 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100'}`}></div>
                <Icon size={20} className={`relative z-10 transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
              </div>
            );
          })}
        </div>

        {/* Bottom Icons */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-px bg-white/10 my-2"></div>
          
          <div onClick={() => setShowNotifications(true)} className="relative w-12 h-12 flex items-center justify-center cursor-pointer group">
            <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-200 scale-90 group-hover:scale-100"></div>
            <div className="relative">
              <Bell size={20} className="relative z-10 text-gray-400 group-hover:text-white transition-colors" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0B1437] animate-bounce"></span>
            </div>
          </div>
          
          <div className="relative w-12 h-12 flex items-center justify-center cursor-pointer group">
            <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-200 scale-90 group-hover:scale-100"></div>
            <MessageSquare size={20} className="relative z-10 text-gray-400 group-hover:text-white transition-colors" />
          </div>

          <div className="relative w-12 h-12 flex items-center justify-center cursor-pointer group">
            <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-200 scale-90 group-hover:scale-100"></div>
            <Settings size={20} className="relative z-10 text-gray-400 group-hover:text-white transition-colors" />
          </div>

          {/* Avatar Profile */}
          <div className="relative mt-2">
            <div 
              onClick={() => setShowProfile(!showProfile)}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#134e40] to-[#0eb59a] flex items-center justify-center text-white font-bold text-sm cursor-pointer border-2 border-transparent hover:border-[#0eb59a] transition-all shadow-md"
            >
              CI
            </div>

            {/* Profile Popup */}
            <div className={`absolute bottom-2 left-16 ml-4 w-72 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-100 p-5 z-50 origin-bottom-left transition-all duration-200 ease-out ${showProfile ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#134e40] to-[#0eb59a] flex items-center justify-center text-white font-bold text-lg shadow-sm">
                      CI
                  </div>
                  <div className="flex-1">
                      <h4 className="font-semibold text-lg text-[#0B1437] leading-tight">Company Inc.</h4>
                      <p className="text-sm text-gray-500">admin@company.com</p>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors shrink-0">
                      <ChevronRight size={16} className="text-gray-500" />
                  </button>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-3 mb-4 flex justify-between items-center border border-gray-100">
                  <div className="flex items-center gap-2">
                      <Trophy size={16} className="text-amber-500" />
                      <span className="text-sm font-medium text-gray-700">Reputation</span>
                  </div>
                  <div className="flex items-center gap-1">
                      <Star size={14} className="text-amber-500 fill-amber-500" />
                      <span className="font-bold text-[#0B1437]">9.8</span>
                      <span className="text-xs text-gray-500">/ 10</span>
                  </div>
                </div>

                <button className="w-full py-2 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-[#0B1437] hover:text-white hover:border-[#0B1437] transition-colors duration-200 mb-4 flex items-center justify-center gap-2">
                  Edit Profile
                </button>

                <div className="h-px w-full bg-gray-100 mb-3"></div>

                <button className="w-full py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-red-600 transition-colors duration-200 flex items-center justify-center gap-2">
                  <LogOut size={16} /> Logout
                </button>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Expanded Navigation Panel */}
      <div className={`bg-white border-r border-gray-100 shrink-0 transition-all duration-200 ease-out flex flex-col z-40 ${isPanelOpen ? 'w-64 translate-x-0 opacity-100' : 'w-0 -translate-x-full opacity-0 overflow-hidden'}`}>
        <div className="p-6 pb-2 w-64 shrink-0">
            <button className="w-full py-2.5 px-4 rounded-full border border-[#0eb59a] text-[#0eb59a] font-semibold bg-white hover:bg-[#0eb59a] hover:text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow group">
                <Plus size={18} className="group-hover:rotate-90 transition-transform duration-200" /> Post Role
            </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 w-64 shrink-0 space-y-1 scrollbar-hide">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-3">{activeMenu}</div>
            
            {menuData[activeMenu]?.subs.map((sub) => {
                const isActive = activeSubMenu === sub;
                return (
                    <div 
                        key={sub}
                        onClick={() => setActiveSubMenu(sub)}
                        className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-150 text-sm font-medium ${isActive ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                    >
                        {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-teal-600 rounded-r-md transition-all"></div>}
                        <div className="w-2 h-2 rounded-full border-2 border-current opacity-50 hidden"></div>
                        {sub}
                    </div>
                );
            })}
        </div>
      </div>

      {/* 3. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50/50 relative">
        
        {/* Top Navigation Bar */}
        <nav className={`sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-white transition-all duration-200 ${isScrolled ? 'shadow-sm border-b border-gray-100' : 'border-b border-transparent'}`}>
            <div className="flex items-center gap-4">
                {/* Mobile Menu Toggle (optional for desktop but requested responsiveness) */}
                <button onClick={() => setIsPanelOpen(!isPanelOpen)} className="md:hidden text-gray-500 hover:text-[#0B1437]">
                    <LayoutDashboard size={24} />
                </button>
                <div className="flex items-center md:hidden flex items-center shrink-0">
                    <img 
                        src="/assets/images/LOGO_WHITE.png" 
                        alt="CXO Connect" 
                        className="h-10 w-auto object-contain"
                    />
                </div>
            </div>

            <div className="flex-1 flex justify-center px-4">
                <div className={`relative flex items-center transition-all duration-300 ${searchFocused ? 'w-full max-w-2xl' : 'w-full max-w-lg'}`}>
                    <Search className={`absolute left-4 transition-colors duration-200 ${searchFocused ? 'text-[#0eb59a]' : 'text-gray-400'}`} size={18} />
                    <input 
                        type="text" 
                        placeholder="Search experts, roles, or projects..." 
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        className="w-full pl-12 pr-4 py-2.5 bg-gray-100/80 border border-transparent rounded-full text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/40 transition-all duration-300 placeholder:text-gray-400 text-gray-900 shadow-inner"
                    />
                </div>
            </div>

            <button 
                onClick={() => navigate('/expert-dashboard')}
                className="hidden sm:flex relative overflow-hidden items-center gap-2 text-white font-semibold transition-transform duration-150 text-[14px] group px-6 py-2.5 rounded-full bg-[#134e40] hover:bg-[#0eb59a] hover:scale-105 active:scale-95 shadow-md"
            >
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></span>
                <span className="relative z-10 tracking-wide">I am an Expert</span>
            </button>
        </nav>

        {/* Scrollable Dashboard View */}
        <main id="main-scroll-area" className="flex-1 overflow-y-auto p-8 relative scrollbar-hide">
            <div className="max-w-6xl mx-auto space-y-10">
                
                {/* Hero Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-[fadeInUp_0.6s_ease-out_forwards]" style={{ animationDelay: '0ms', opacity: 0 }}>
                    <div>
                        <h1 className="text-4xl font-bold text-[#0B1437] mb-2 tracking-tight">Find Your Next CXO<span className="text-[#0eb59a]">.</span></h1>
                        <p className="text-gray-500 text-lg">Browse expert profiles, post leadership roles, and build your executive team.</p>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-full border border-teal-100 shadow-sm">
                        <Zap size={16} className="text-teal-500 fill-teal-500" />
                        <span className="text-sm font-bold">500+ CXO-level experts available</span>
                    </div>
                </div>

                {/* Quick Access Categories */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((cat, i) => (
                        <div 
                            key={i} 
                            className="bg-white rounded-2xl p-5 flex flex-col items-center justify-center gap-3 text-center cursor-pointer shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200 group animate-[fadeInUp_0.5s_ease-out_forwards]"
                            style={{ animationDelay: `${(i + 1) * 50}ms`, opacity: 0 }}
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${cat.bg} ${cat.color} group-hover:scale-110 transition-transform duration-200`}>
                                <cat.icon size={28} />
                            </div>
                            <span className="text-sm font-semibold text-gray-700 group-hover:text-[#0B1437] transition-colors">{cat.label}</span>
                        </div>
                    ))}
                </div>

                {/* Featured Carousel */}
                <div className="relative group animate-[fadeInUp_0.5s_ease-out_forwards]" style={{ animationDelay: '300ms', opacity: 0 }}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 border-l-4 border-[#0eb59a] pl-3">
                            <h2 className="text-xl font-bold text-[#0B1437]">Featured Insights</h2>
                        </div>
                    </div>
                    
                    <div className="relative overflow-hidden rounded-3xl h-64 shadow-md bg-slate-900">
                        <div className="flex h-full transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${carouselIndex * 100}%)` }}>
                            {featuredCards.map((card, i) => (
                                <div key={i} className={`w-full h-full flex-shrink-0 ${card.bg} p-10 flex flex-col justify-end relative overflow-hidden`}>
                                    <div className="absolute inset-0 bg-black/20 mix-blend-multiply"></div>
                                    <div className="relative z-10 max-w-2xl">
                                        <h3 className="text-3xl font-bold text-white mb-2 leading-tight">{card.title}</h3>
                                        <p className="text-white/80 text-lg">{card.subtitle}</p>
                                    </div>
                                    <div className="absolute top-0 right-0 p-8 opacity-20">
                                        <Zap size={120} className="text-white" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Carousel Controls */}
                        <button onClick={() => setCarouselIndex((prev) => (prev === 0 ? 2 : prev - 1))} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:bg-white/40 transition-all duration-200">
                            <ChevronLeft size={24} />
                        </button>
                        <button onClick={() => setCarouselIndex((prev) => (prev + 1) % 3)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:bg-white/40 transition-all duration-200">
                            <ChevronRight size={24} />
                        </button>

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {[0, 1, 2].map((dot) => (
                                <div key={dot} className={`h-1.5 rounded-full transition-all duration-300 ${carouselIndex === dot ? 'w-6 bg-[#0eb59a]' : 'w-1.5 bg-white/50'}`}></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Active Roles */}
                <div className="animate-[fadeInUp_0.5s_ease-out_forwards]" style={{ animationDelay: '400ms', opacity: 0 }}>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 border-l-4 border-[#0eb59a] pl-3">
                            <h2 className="text-xl font-bold text-[#0B1437]">Active Roles</h2>
                            <span className="text-sm font-medium text-gray-500 hidden sm:inline ml-2">Find the right talent for your open positions.</span>
                        </div>
                        <button className="text-sm font-semibold text-[#0eb59a] hover:text-[#134e40] transition-colors flex items-center gap-1 group">
                            View All <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer group flex flex-col h-full relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gray-50 to-transparent rounded-bl-3xl -z-0"></div>
                                
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                                        <MapPin size={12} /> Remote
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-[#0B1437] flex items-center justify-center text-white font-bold shadow-sm">
                                        C
                                    </div>
                                </div>
                                
                                <div className="mt-auto relative z-10">
                                    <p className="text-xs text-[#0eb59a] font-bold uppercase tracking-wider mb-1">Interim</p>
                                    <h3 className="text-lg font-bold text-[#0B1437] group-hover:text-[#0eb59a] transition-colors line-clamp-2">Chief Financial Officer (CFO)</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Active Projects */}
                <div className="animate-[fadeInUp_0.5s_ease-out_forwards]" style={{ animationDelay: '500ms', opacity: 0 }}>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 border-l-4 border-[#0eb59a] pl-3">
                            <h2 className="text-xl font-bold text-[#0B1437]">Active Projects</h2>
                        </div>
                        <button className="text-sm font-semibold text-[#0eb59a] hover:text-[#134e40] transition-colors flex items-center gap-1 group">
                            View All <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-base font-bold text-[#0B1437] leading-tight max-w-[70%]">Series B Funding Strategy Prep</h3>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-100">
                                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
                                        Active
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">MJ</div>
                                    <span className="font-medium text-gray-700">Michael Jordan</span> • Finance
                                </div>
                                
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-3">
                                    <div className="flex justify-between text-xs mb-1.5 font-medium">
                                        <span className="text-gray-500">Phase 3</span>
                                        <span className="text-[#0B1437]">75%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#0eb59a] rounded-full" style={{ width: '75%' }}></div>
                                    </div>
                                </div>

                                <div className="flex items-center text-xs font-medium text-gray-400">
                                    <Clock size={12} className="mr-1" /> Updated 2 hrs ago
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trusted Marquee */}
                <div className="py-6 animate-[fadeInUp_0.5s_ease-out_forwards]" style={{ animationDelay: '600ms', opacity: 0 }}>
                    <div className="text-center mb-6">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest"><span className="text-[#0eb59a]">Trusted</span> by Industry Leaders</h3>
                    </div>
                    <div className="relative flex overflow-hidden w-full group mask-image-linear">
                        <div className="flex animate-[scroll_30s_linear_infinite] whitespace-nowrap group-hover:[animation-play-state:paused]">
                            {[...Array(2)].map((_, idx) => (
                                <div key={idx} className="flex items-center justify-center gap-16 px-8">
                                    {['Google', 'Amazon', 'Microsoft', 'Tesla', 'Netflix', 'Meta'].map((brand) => (
                                        <div key={brand} className="text-2xl font-bold text-gray-300 font-serif opacity-50 hover:opacity-100 transition-opacity cursor-default">
                                            {brand}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="pb-12 animate-[fadeInUp_0.5s_ease-out_forwards]" style={{ animationDelay: '700ms', opacity: 0 }}>
                    <div className="flex items-center gap-2 border-l-4 border-[#0eb59a] pl-3 mb-6">
                        <h2 className="text-xl font-bold text-[#0B1437]">Recent Activity</h2>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-100 pb-2">
                        {['Applications', 'Shortlisted', 'Interviewed', 'Hired'].map((tab) => (
                            <button 
                                key={tab}
                                onClick={() => setActiveActivityTab(tab)}
                                className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${activeActivityTab === tab ? 'bg-[#0B1437] text-white shadow-md' : 'text-gray-500 hover:text-[#0B1437] hover:bg-gray-100'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-opacity duration-300">
                        <div className="divide-y divide-gray-100">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/80 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-600 border border-gray-200 group-hover:border-teal-200 transition-colors">
                                            SR
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#0B1437] group-hover:text-[#0eb59a] transition-colors">Sarah Rogers</h4>
                                            <p className="text-sm text-gray-500">Applied for <span className="font-semibold text-gray-700">VP of Engineering</span></p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                                        <span className="text-xs font-medium text-gray-400">2 days ago</span>
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                                            Under Review
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-gray-50 text-center border-t border-gray-100">
                            <button className="text-sm font-semibold text-[#0eb59a] hover:text-[#134e40] transition-colors">View all activity</button>
                        </div>
                    </div>
                </div>

            </div>
        </main>

        {/* 4. Notifications Drawer */}
        {showNotifications && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity" onClick={() => setShowNotifications(false)}></div>
        )}

        <div className={`absolute top-0 right-0 h-full w-80 sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${showNotifications ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0">
                <h3 className="text-xl font-bold text-[#0B1437]">Notifications</h3>
                <div className="flex items-center gap-4">
                    <button className="text-xs font-bold text-[#0eb59a] hover:text-[#134e40] transition-colors">Mark all as read</button>
                    <button onClick={() => setShowNotifications(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <X size={18} />
                    </button>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-0 bg-white">
                <div className="p-4 border-b border-gray-100 bg-teal-50/50 hover:bg-teal-50 transition-colors cursor-pointer flex gap-4">
                    <div className="mt-1 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 border border-blue-200">
                        <User size={18} className="text-blue-600" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-[#0B1437] mb-0.5">Expert Applied to Role</h4>
                        <p className="text-xs text-gray-600 leading-relaxed mb-2">Michael Chen applied for "Interim CFO" position. Please review their profile.</p>
                        <span className="text-[10px] font-bold text-teal-700 bg-teal-100/50 px-2 py-0.5 rounded-full">New • 10 mins ago</span>
                    </div>
                </div>

                <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer flex gap-4">
                    <div className="mt-1 w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center shrink-0 border border-teal-200">
                        <Briefcase size={18} className="text-teal-600" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-[#0B1437] mb-0.5">Role Gaining Traction</h4>
                        <p className="text-xs text-gray-500 leading-relaxed mb-2">Your "Strategic Growth Advisor" posting was viewed by 15 top-tier experts today.</p>
                        <span className="text-[10px] font-medium text-gray-400">2 hours ago</span>
                    </div>
                </div>

                <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer flex gap-4">
                    <div className="mt-1 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0 border border-amber-200">
                        <CreditCard size={18} className="text-amber-600" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-[#0B1437] mb-0.5">Payment Due Reminder</h4>
                        <p className="text-xs text-gray-500 leading-relaxed mb-2">Invoice INV-2026-005 is due in 3 days. Please clear pending dues to avoid interruption.</p>
                        <span className="text-[10px] font-medium text-gray-400">1 day ago</span>
                    </div>
                </div>
                
                <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer flex gap-4">
                    <div className="mt-1 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 border border-red-200">
                        <Bell size={18} className="text-red-600" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-[#0B1437] mb-0.5">Action Required</h4>
                        <p className="text-xs text-gray-500 leading-relaxed mb-2">Contract sign-off pending for the CTO role. Expert is waiting for final approval.</p>
                        <span className="text-[10px] font-medium text-gray-400">2 days ago</span>
                    </div>
                </div>
            </div>
            <div className="p-4 text-center border-t border-gray-100">
                <button className="text-sm font-semibold text-gray-500 hover:text-[#0B1437] transition-colors">View All Notifications</button>
            </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        .mask-image-linear {
            -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}} />
    </div>
  );
};

export default CompanyDashboard;
