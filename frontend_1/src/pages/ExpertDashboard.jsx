import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Briefcase, LayoutDashboard, CreditCard, 
  Bell, MessageSquare, Settings, User, Zap, 
  ChevronRight, ChevronLeft, Clock, Building, 
  MapPin, CheckCircle, ArrowRight, LogOut, Trophy, Plus,
  Users, Activity, FileText, Star, X, TrendingUp, DollarSign
} from 'lucide-react';

const ExpertDashboard = () => {
  const navigate = useNavigate();
  // State
  const [activeMenu, setActiveMenu] = useState('My Projects');
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [activeSubMenu, setActiveSubMenu] = useState('Active Projects');
  const [searchFocused, setSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('Ongoing');

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
    'Find Work': { icon: Search, subs: ['Recommended Roles', 'Saved Jobs', 'My Proposals', 'Direct Invitations'] },
    'My Projects': { icon: Briefcase, subs: ['Active Projects', 'Completed', 'Milestones', 'Deliverables'] },
    'Earnings': { icon: CreditCard, subs: ['Overview', 'Withdrawals', 'Invoices', 'Tax Forms'] },
    'Profile': { icon: User, subs: ['Public View', 'Edit Profile', 'Verification', 'Settings'] }
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

  const stats = [
    { label: 'Active Projects', value: '4', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Total Earnings', value: '$12,450', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Open Proposals', value: '8', icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Success Score', value: '98%', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50' }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans text-gray-800">
      
      {/* 1. Far-Left Icon Rail */}
      <aside className="w-16 bg-[#0B1437] flex flex-col justify-between shrink-0 z-50 py-4 shadow-xl">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center mb-4 border-b border-white/10 pb-4 flex items-center shrink-0">
             <img 
                src="/assets/images/LOGO_WHITE.png" 
                alt="CXO Connect" 
                className="h-9 md:h-11 w-auto object-contain"
             />
          </div>

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

        <div className="flex flex-col items-center gap-4">
          <div onClick={() => setShowNotifications(true)} className="relative w-12 h-12 flex items-center justify-center cursor-pointer group">
            <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-200 scale-90 group-hover:scale-100"></div>
            <div className="relative">
              <Bell size={20} className="relative z-10 text-gray-400 group-hover:text-white transition-colors" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0B1437]"></span>
            </div>
          </div>
          
          <div className="relative w-12 h-12 flex items-center justify-center cursor-pointer group">
            <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-200 scale-90 group-hover:scale-100"></div>
            <Settings size={20} className="relative z-10 text-gray-400 group-hover:text-white transition-colors" />
          </div>

          <div className="relative mt-2">
            <div 
              onClick={() => setShowProfile(!showProfile)}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#134e40] to-[#0eb59a] flex items-center justify-center text-white font-bold text-sm cursor-pointer border-2 border-transparent hover:border-[#0eb59a] transition-all"
            >
              JD
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Expanded Navigation Panel */}
      <div className={`bg-white border-r border-gray-100 shrink-0 transition-all duration-200 ease-out flex flex-col z-40 ${isPanelOpen ? 'w-64 translate-x-0 opacity-100' : 'w-0 -translate-x-full opacity-0 overflow-hidden'}`}>
        <div className="p-6 pb-2 w-64 shrink-0">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-[#0eb59a]">
                    <Zap size={20} fill="currentColor" />
                </div>
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Profile Status</p>
                    <p className="text-sm font-bold text-gray-800">Verified Expert</p>
                </div>
            </div>
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
                        {sub}
                    </div>
                );
            })}
        </div>
        
        <div className="p-4 w-64 shrink-0 border-t border-gray-100">
            <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs font-bold text-gray-500 mb-2">EARNINGS GOAL</p>
                <div className="flex justify-between text-xs mb-1 font-bold">
                    <span>$12,450</span>
                    <span className="text-[#0eb59a]">$20k</span>
                </div>
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0eb59a] rounded-full" style={{ width: '62%' }}></div>
                </div>
            </div>
        </div>
      </div>

      {/* 3. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50/50 relative">
        
        {/* Top Navigation Bar */}
        <nav className={`sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-white transition-all duration-200 ${isScrolled ? 'shadow-sm border-b border-gray-100' : 'border-b border-transparent'}`}>
            <div className="flex items-center gap-4">
                <button onClick={() => setIsPanelOpen(!isPanelOpen)} className="text-gray-500 hover:text-[#0B1437]">
                    <LayoutDashboard size={20} />
                </button>
                <h2 className="text-lg font-bold text-[#0B1437] hidden sm:block">Expert Console</h2>
            </div>

            <div className="flex-1 flex justify-center px-4 max-w-xl">
                <div className={`relative flex items-center w-full transition-all duration-300 ${searchFocused ? 'scale-105' : ''}`}>
                    <Search className={`absolute left-4 transition-colors duration-200 ${searchFocused ? 'text-[#0eb59a]' : 'text-gray-400'}`} size={18} />
                    <input 
                        type="text" 
                        placeholder="Search for projects, companies, or tasks..." 
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        className="w-full pl-12 pr-4 py-2 bg-gray-100/80 border border-transparent rounded-full text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/40 transition-all duration-300"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/company-dashboard')}
                  className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full bg-[#134e40] text-white text-sm font-bold hover:bg-[#0eb59a] transition-all shadow-md active:scale-95"
                >
                    I am a Company
                </button>
            </div>
        </nav>

        {/* Scrollable Content */}
        <main id="main-scroll-area" className="flex-1 overflow-y-auto p-8 scrollbar-hide">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Hero / Welcome */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-[fadeInUp_0.6s_ease-out_forwards]">
                    <div>
                        <p className="text-[#0eb59a] font-bold text-sm uppercase tracking-widest mb-1">Welcome back, John</p>
                        <h1 className="text-4xl font-bold text-[#0B1437] tracking-tight">Your Dashboard<span className="text-[#0eb59a]">.</span></h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-bold overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                                </div>
                            ))}
                        </div>
                        <p className="text-xs font-bold text-gray-500">3 new project invitations</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <div 
                          key={i} 
                          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 group animate-[fadeInUp_0.5s_ease-out_forwards]"
                          style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={20} />
                                </div>
                                <TrendingUp size={16} className="text-emerald-500" />
                            </div>
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            <p className="text-2xl font-bold text-[#0B1437]">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Projects Section */}
                <div className="animate-[fadeInUp_0.5s_ease-out_forwards]" style={{ animationDelay: '400ms' }}>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 border-l-4 border-[#0eb59a] pl-3">
                            <h2 className="text-xl font-bold text-[#0B1437]">Active Projects</h2>
                        </div>
                        <div className="flex gap-2">
                            {['Ongoing', 'Pending', 'Past'].map(t => (
                                <button 
                                  key={t}
                                  onClick={() => setActiveTab(t)}
                                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeTab === t ? 'bg-[#0B1437] text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {[
                            { title: 'Series B Strategy Prep', company: 'TechFlow Systems', rate: '$150/hr', progress: 75, deadline: '3 days left', status: 'In Review' },
                            { title: 'Fractional CTO Advisory', company: 'Nova Health', rate: '$200/hr', progress: 40, deadline: '12 days left', status: 'Active' }
                        ].map((proj, i) => (
                            <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Briefcase size={80} />
                                </div>
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 font-bold border border-gray-100">
                                            {proj.company.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 group-hover:text-[#0eb59a] transition-colors">{proj.title}</h3>
                                            <p className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                                <Building size={12} /> {proj.company}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-[#0B1437]">{proj.rate}</span>
                                </div>

                                <div className="space-y-4 relative z-10">
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        <div className="flex justify-between text-xs mb-2 font-bold text-gray-500">
                                            <span>PROGRESS</span>
                                            <span className="text-[#0B1437]">{proj.progress}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-[#134e40] to-[#0eb59a] rounded-full transition-all duration-1000" style={{ width: `${proj.progress}%` }}></div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                            <Clock size={14} /> {proj.deadline}
                                        </div>
                                        <button className="flex items-center gap-1 text-xs font-bold text-[#0eb59a] hover:gap-2 transition-all">
                                            GO TO WORKSPACE <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Opportunities Section */}
                <div className="animate-[fadeInUp_0.5s_ease-out_forwards]" style={{ animationDelay: '500ms' }}>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 border-l-4 border-purple-500 pl-3">
                            <h2 className="text-xl font-bold text-[#0B1437]">New Opportunities</h2>
                        </div>
                        <button className="text-sm font-bold text-purple-600 hover:text-purple-800 transition-colors">View All Match</button>
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="divide-y divide-gray-50">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors cursor-pointer group">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 shrink-0">
                                            <Zap size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">Interim VP of Engineering</h4>
                                            <p className="text-sm text-gray-500 mb-1">SaaS Startup • $180/hr • 10-15 hrs/week</p>
                                            <div className="flex gap-2">
                                                <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase">React</span>
                                                <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase">Node.js</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="w-full sm:w-auto px-6 py-2 rounded-full bg-white border border-purple-200 text-purple-600 text-sm font-bold hover:bg-purple-600 hover:text-white transition-all shadow-sm">
                                        View Role
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </main>

        {/* Notifications Drawer */}
        {showNotifications && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity" onClick={() => setShowNotifications(false)}></div>
        )}

        <div className={`absolute top-0 right-0 h-full w-80 sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${showNotifications ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0">
                <h3 className="text-xl font-bold text-[#0B1437]">Notifications</h3>
                <button onClick={() => setShowNotifications(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                    <X size={18} />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-md transition-all cursor-pointer">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                                <MessageSquare size={14} />
                            </div>
                            <p className="text-sm font-bold text-gray-900">New Message</p>
                            <span className="text-[10px] font-bold text-gray-400 ml-auto">2h ago</span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">TechFlow Systems sent you a message regarding the Series B Strategy Prep project.</p>
                    </div>
                ))}
            </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}} />
    </div>
  );
};

export default ExpertDashboard;
