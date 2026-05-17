import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import {
  Search, Briefcase, LayoutDashboard, CreditCard,
  Bell, Settings, ChevronRight, ChevronLeft,
  Clock, LogOut, Plus, Users, Activity, FileText,
  Star, DollarSign, Target, ArrowUpRight,
  ShieldCheck, Menu, AlertCircle, MapPin, X,
  BarChart2, MessageSquare, CheckCircle,
  Zap, TrendingUp, Eye, Heart, Grid
} from 'lucide-react';

// ── ANIMATED COUNTER ──
const AnimatedCounter = ({ value }) => {
  const [display, setDisplay] = useState('0');
  useEffect(() => {
    const raw = value.replace(/[₹L,+\s]/g, '');
    const isNum = !isNaN(parseFloat(raw));
    if (!isNum) { setDisplay(value); return; }
    const end = parseFloat(raw);
    const step = end / (1000 / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= end) { setDisplay(value); clearInterval(timer); return; }
      setDisplay(value.includes('₹') ? `₹${Math.floor(current)}` : `${Math.floor(current)}`);
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{display}</span>;
};

// ── EXPERT CARD ──
const ExpertCard = ({ expert }) => {
  return (
    <div className="flex-1 min-w-0 bg-white rounded-xl border border-gray-100 p-3 shadow-sm group">
      <div className="flex items-start justify-between mb-2">
        <div className={`w-10 h-10 rounded-full text-white text-sm font-bold flex items-center justify-center ${expert.color}`}>
          {expert.initials}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs px-2 py-0.5 bg-[#134e40] text-white rounded-full font-semibold">
            {expert.match}% MATCH
          </span>
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={10}
                fill={i < Math.floor(parseFloat(expert.rating)) ? '#F59E0B' : 'none'}
                className={i < Math.floor(parseFloat(expert.rating)) ? 'text-amber-400' : 'text-gray-200'}
              />
            ))}
            <span className="text-xs font-black text-gray-600 ml-1">{expert.rating}</span>
          </div>
        </div>
      </div>
      <h3 className="text-sm font-semibold text-gray-800 mt-1">{expert.name}</h3>
      <p className="text-xs text-gray-500 mb-3">{expert.role}</p>
      <div className="flex flex-col mb-3">
        <div className="text-xs py-1 flex justify-between border-b border-gray-50">
          <span className="text-gray-400 font-semibold">Rate</span>
          <span className="font-bold text-[#134e40]">{expert.rate}</span>
        </div>
        <div className="text-xs py-1 flex justify-between border-b border-gray-50">
          <span className="text-gray-400 font-semibold">Availability</span>
          <span className="font-bold text-gray-600">{expert.availability}</span>
        </div>
        <div className="text-xs py-1 flex justify-between border-b border-gray-50">
          <span className="text-gray-400 font-semibold">Location</span>
          <span className="font-bold text-gray-600 truncate max-w-[80px] text-right">{expert.location}</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <button className="flex-1 text-xs py-1.5 px-3 bg-[#134e40] text-white rounded-lg hover:bg-[#0eb59a] transition-colors duration-200">
          View Profile
        </button>
        <button className="flex-1 text-xs py-1.5 px-3 border border-gray-200 text-gray-600 rounded-lg hover:border-[#0eb59a] hover:text-[#0eb59a] transition-colors duration-200">
          Invite
        </button>
        <button className="w-7 h-7 flex-shrink-0 border border-gray-200 rounded-lg flex items-center justify-center hover:border-rose-400 hover:text-rose-400 text-gray-400 transition-colors duration-200">
          <Heart size={14} />
        </button>
      </div>
    </div>
  );
};

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [mounted, setMounted] = useState(false);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [requirementsCount, setRequirementsCount] = useState(2); // default fallback
  const [activeEngagementsCount, setActiveEngagementsCount] = useState(3); // default fallback

  // Carousel State
  const [currentIndex, setCurrentIndex] = useState(0);
  const CARDS_PER_VIEW = 4;

  // Header States
  const [searchFocused, setSearchFocused] = useState(false);
  const [gridOpen, setGridOpen] = useState(false);

  // Click outside listener for Mega Dropdown
  const gridRef = useRef(null);
  useEffect(() => {
    const isDemo = localStorage.getItem('demo_company') === 'true';

    const checkAuthAndFetchProfile = async () => {
      if (isDemo) {
        setCompanyProfile({ company_name: 'Acme Corp.', admin_email: 'demo@cxo.com' });
        setLoadingProfile(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/signin?role=company');
        return;
      }
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/company/profile`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setCompanyProfile(data);
        } else {
          console.error("Failed to fetch company profile");
        }

        // Fetch requirements for counts
        const { data: reqData, error: reqError } = await supabase
          .from('company_requirements')
          .select('*');
        
        if (!reqError && reqData) {
          setRequirementsCount(reqData.filter(r => r.status === 'Active').length || 0);
          setActiveEngagementsCount(reqData.filter(r => r.status === 'Active').length || 0);
        } else if (reqError) {
          console.error("Supabase fetch error:", reqError);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingProfile(false);
      }
    };
    checkAuthAndFetchProfile();
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session && !isDemo) {
        navigate('/signin?role=company');
      }
    });
    return () => { if (authListener?.subscription) authListener.subscription.unsubscribe(); };
  }, [navigate]);

  const sidebarMenu = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/company-dashboard' },
    { name: 'My Requirements', icon: Briefcase, path: '/requirements', badge: requirementsCount.toString() },
    { name: 'Experts', icon: Users, path: '/experts' },
    { name: 'Payments', icon: CreditCard, path: '/payments' },
    { name: 'Analytics', icon: BarChart2, path: '/analytics' },
    { name: 'PMO Services', icon: ShieldCheck, path: '/pmo' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const notifications = [
    { title: 'New Expert Match', desc: 'Sarah Jenkins matches your Interim CFO requirement at 98%', time: '5 min ago', unread: true, color: 'bg-teal-500' },
    { title: 'Milestone Approved', desc: 'Phase 1 of Marketing Strategy has been completed', time: '1 hour ago', unread: true, color: 'bg-blue-500' },
    { title: 'Contract Ready', desc: 'Tech Advisory contract is ready for your signature', time: '3 hours ago', unread: true, color: 'bg-purple-500' },
    { title: 'Payment Released', desc: '₹85,000 released to David Chen for milestone completion', time: '1 day ago', unread: false, color: 'bg-emerald-500' },
  ];

  const experts = [
    { id: 1, name: "Sarah Jenkins", role: "Ex-CMO at TechCorp", initials: "SJ", color: "bg-purple-500", match: 98, rating: 4.9, rate: "₹15K–20K/Mo", availability: "20 hrs/week", location: "Remote" },
    { id: 2, name: "David Chen", role: "Interim CFO", initials: "DC", color: "bg-blue-500", match: 95, rating: 5.0, rate: "₹33K/Month", availability: "Full-time", location: "New Delhi" },
    { id: 3, name: "Priya Patel", role: "VP Engineering", initials: "PP", color: "bg-teal-600", match: 92, rating: 4.8, rate: "₹10K/Month", availability: "10 hrs/week", location: "Remote" },
    { id: 4, name: "Rajesh Sharma", role: "Ex-CHRO, Infosys", initials: "RS", color: "bg-orange-500", match: 90, rating: 4.7, rate: "₹18K/Month", availability: "15 hrs/week", location: "Bengaluru" },
    { id: 5, name: "Anita Desai", role: "COO, D2C Brand", initials: "AD", color: "bg-rose-500", match: 88, rating: 4.6, rate: "₹22K/Month", availability: "Full-time", location: "Mumbai" },
    { id: 6, name: "Vikram Nair", role: "Board Advisor", initials: "VN", color: "bg-indigo-500", match: 86, rating: 4.8, rate: "₹12K/Month", availability: "8 hrs/week", location: "Remote" },
    { id: 7, name: "Meera Iyer", role: "Ex-CMO, Flipkart", initials: "MI", color: "bg-pink-500", match: 84, rating: 4.5, rate: "₹25K/Month", availability: "20 hrs/week", location: "Hyderabad" },
    { id: 8, name: "Suresh Menon", role: "CFO & Board Member", initials: "SM", color: "bg-green-600", match: 82, rating: 4.7, rate: "₹30K/Month", availability: "Full-time", location: "Chennai" },
  ];
  const visibleExperts = experts.slice(currentIndex, currentIndex + CARDS_PER_VIEW);
  const canGoLeft = currentIndex > 0;
  const canGoRight = currentIndex + CARDS_PER_VIEW < experts.length;

  const kpiCards = [
    { title: 'Active Engagements', value: activeEngagementsCount.toString(), trend: '+1 this month', icon: Activity, iconBg: 'bg-teal-50', iconColor: 'text-[#0eb59a]', border: 'border-l-[#0eb59a]', numColor: 'text-[#0eb59a]', path: '/engagements' },
    { title: 'Experts Shortlisted', value: '12', trend: '4 new this week', icon: Users, iconBg: 'bg-blue-50', iconColor: 'text-blue-500', border: 'border-l-purple-400', numColor: 'text-purple-500', path: '/experts?filter=shortlisted' },
    { title: 'Total Spend', value: '₹4.2L', trend: 'On budget', icon: DollarSign, iconBg: 'bg-purple-50', iconColor: 'text-purple-500', border: 'border-l-blue-400', numColor: 'text-blue-500', path: '/payments' },
    { title: 'Milestones Due', value: '2', trend: 'Next in 3 days', icon: Target, iconBg: 'bg-amber-50', iconColor: 'text-amber-500', border: 'border-l-amber-400', numColor: 'text-amber-500', path: '/engagements?filter=milestones' },
  ];

  const activeEngagements = [
    { title: 'Series B Funding Strategy', expert: 'David Chen', initials: 'DC', expertColor: 'from-blue-600 to-cyan-500', status: 'IN PROGRESS', statusColor: 'text-blue-600 bg-blue-50', progress: 65, nextMilestone: 'Financial Model Draft', deadline: '15 Sep 2024', risk: 'Low', riskColor: 'text-green-700 bg-green-100', path: '/engagements/1' },
    { title: 'Go-to-Market Expansion', expert: 'Sarah Jenkins', initials: 'SJ', expertColor: 'from-purple-500 to-pink-500', status: 'ON TRACK', statusColor: 'text-emerald-600 bg-emerald-50', progress: 40, nextMilestone: 'Campaign Launch', deadline: '2 Oct 2024', risk: 'Low', riskColor: 'text-green-700 bg-green-100', path: '/engagements/2' },
    { title: 'AI Product Scoping', expert: 'Priya Patel', initials: 'PP', expertColor: 'from-[#134e40] to-[#0eb59a]', status: 'REVIEW', statusColor: 'text-amber-600 bg-amber-50', progress: 90, nextMilestone: 'Market Research', deadline: '19 Aug 2024', risk: 'Medium', riskColor: 'text-amber-700 bg-amber-100', path: '/engagements/3' },
  ];

  const pendingActions = [
    { title: 'Approve Milestone: Phase 1', project: 'Marketing Strategy', type: 'APPROVAL', time: '2 hours ago', urgent: true, typeColor: 'bg-amber-100 text-amber-700 border-amber-200', dotColor: 'bg-amber-500', path: '/engagements/1?tab=milestones' },
    { title: 'Review New Candidates', project: 'Interim CFO', type: 'REVIEW', time: '5 hours ago', urgent: false, typeColor: 'bg-blue-100 text-blue-700 border-blue-200', dotColor: 'bg-blue-500', path: '/requirements/1?tab=candidates' },
    { title: 'Sign Contract', project: 'Tech Advisory', type: 'ACTION', time: '1 day ago', urgent: false, typeColor: 'bg-rose-100 text-rose-700 border-rose-200', dotColor: 'bg-purple-500', path: '/contracts/1' },
    { title: 'Escrow Pending', project: 'Project Scoping', type: 'ESCROW', time: '1 day ago', urgent: true, typeColor: 'bg-rose-100 text-rose-700 border-rose-200', dotColor: 'bg-rose-500', path: '/payments' },
    { title: 'Meeting Reminder', project: '1-on-1 with David', type: 'MEETING', time: 'Today 3PM', urgent: false, typeColor: 'bg-teal-100 text-teal-700 border-teal-200', dotColor: 'bg-teal-500', path: '/engagements/1' },
    { title: 'Risk Alert', project: 'Budget Variance detected', type: 'RISK', time: 'Just now', urgent: true, typeColor: 'bg-red-100 text-red-700 border-red-200', dotColor: 'bg-red-500', path: '/analytics' },
  ];

  const quickActions = [
    { label: 'Post a Role', icon: Plus, bg: 'bg-teal-50', iconColor: 'text-teal-600', path: '/requirements/create' },
    { label: 'Find Experts', icon: Users, bg: 'bg-purple-50', iconColor: 'text-purple-600', path: '/experts' },
    { label: 'Contracts', icon: FileText, bg: 'bg-blue-50', iconColor: 'text-blue-600', path: '/contracts' },
    { label: 'Payments', icon: CreditCard, bg: 'bg-green-50', iconColor: 'text-green-600', path: '/payments' },
    { label: 'Milestones', icon: Target, bg: 'bg-amber-50', iconColor: 'text-amber-600', path: '/engagements' },
    { label: 'Analytics', icon: BarChart2, bg: 'bg-rose-50', iconColor: 'text-rose-600', path: '/analytics' },
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-900 overflow-hidden">

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden" />
        )}
      </AnimatePresence>

      {/* ══ SIDEBAR — white premium ══ */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 68 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={`
          bg-white border-r border-gray-100 flex flex-col z-50 overflow-hidden shrink-0 shadow-sm
          fixed md:relative inset-y-0 left-0 transition-transform duration-300
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{ width: typeof window !== 'undefined' && window.innerWidth < 768 ? 260 : undefined }}
      >
        <button onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-gray-100 text-gray-500 md:hidden z-50">
          <X size={14} />
        </button>

        {/* Logo */}
        <div className={`flex items-center border-b border-gray-100 overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'px-5 py-5 gap-3' : 'px-0 py-5 justify-center'}`}>
          <div className="relative w-9 h-9 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#134e40] to-[#0eb59a] flex items-center justify-center shadow-md overflow-hidden">
              {companyProfile?.logo_url ? (
                <img src={companyProfile.logo_url} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-black text-sm">
                  {companyProfile?.company_name ? companyProfile.company_name.charAt(0).toUpperCase() : 'C'}
                </span>
              )}
            </div>
          </div>
          <motion.div animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0 }} transition={{ duration: 0.2 }}
            className="overflow-hidden whitespace-nowrap">
            <p className="text-sm font-black text-[#134e40] leading-tight">{companyProfile?.company_name || 'CXO Connect'}</p>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Company Portal</p>
          </motion.div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 flex flex-col gap-0.5 [&::-webkit-scrollbar]:hidden overflow-y-auto">
          <motion.p animate={{ opacity: isSidebarOpen ? 1 : 0, height: isSidebarOpen ? 'auto' : 0 }} transition={{ duration: 0.2 }}
            className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2 overflow-hidden">
            Main Menu
          </motion.p>

          {sidebarMenu.map((item, idx) => {
            const isActive = activeMenu === item.name;
            return (
              <div key={item.name} className="relative group">
                <motion.button
                  initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ x: isSidebarOpen ? 3 : 0 }} whileTap={{ scale: 0.95 }}
                  onClick={() => { setActiveMenu(item.name); navigate(item.path); if (window.innerWidth < 768) setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center transition-colors duration-150 rounded-xl relative
                    ${isSidebarOpen ? 'gap-3 px-4 py-3' : 'justify-center px-0 py-3'}
                    ${isActive ? 'bg-teal-50 text-[#134e40]' : 'text-gray-400 hover:bg-[#134e40]/10 hover:text-gray-700'}`}
                >
                  {isActive && (
                    <motion.div layoutId="activeBar"
                      className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#0eb59a] rounded-r" />
                  )}
                  <div className={`relative shrink-0 ${isActive ? 'text-[#0eb59a]' : 'text-gray-400 group-hover:text-gray-600'}`}>
                    <item.icon size={19} />
                    {item.badge && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#0eb59a] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <motion.span animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0 }} transition={{ duration: 0.2 }}
                    className="text-sm font-semibold overflow-hidden whitespace-nowrap">
                    {item.name}
                  </motion.span>
                </motion.button>
                {!isSidebarOpen && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-[#0d1f2d] text-white text-xs font-bold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 shadow-xl">
                    {item.name}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#0d1f2d]" />
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-2 pb-4 flex flex-col gap-2">
          {isSidebarOpen ? (
            <motion.div whileHover={{ scale: 1.02 }}
              className="mx-1 p-4 rounded-2xl bg-gradient-to-br from-[#0d1f2d] to-[#134e40] text-white relative overflow-hidden cursor-pointer">
              <div className="absolute -right-3 -top-3 w-16 h-16 bg-white/5 rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck size={13} className="text-[#0eb59a]" />
                  <h4 className="font-black text-xs">CXO Concierge</h4>
                </div>
                <p className="text-[10px] text-white/60 mb-3">Need help scoping a role?</p>
                <button className="w-full bg-[#0eb59a] hover:bg-[#0ca88e] text-white text-[11px] font-bold py-2 rounded-xl transition-all">
                  Talk to Advisor
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="relative group flex justify-center">
              <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0d1f2d] to-[#134e40] flex items-center justify-center shadow-md">
                <ShieldCheck size={17} className="text-[#0eb59a]" />
              </motion.button>
            </div>
          )}
          <div className="h-px bg-gray-100 mx-1" />
          <div className="relative group">
            <motion.button whileHover={{ x: isSidebarOpen ? 3 : 0 }} whileTap={{ scale: 0.95 }}
              onClick={async () => { await supabase.auth.signOut(); navigate('/signin?role=company'); }}
              className={`w-full flex items-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all
                ${isSidebarOpen ? 'gap-3 px-4 py-3' : 'justify-center px-0 py-3'}`}>
              <LogOut size={17} className="shrink-0" />
              <motion.span animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0 }} transition={{ duration: 0.2 }}
                className="text-sm font-semibold overflow-hidden whitespace-nowrap">
                Logout
              </motion.span>
            </motion.button>
            {!isSidebarOpen && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 shadow-xl">
                Logout
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-red-600" />
              </div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* ══ MAIN ══ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden md:ml-0">

        {/* ── HEADER ── */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 shrink-0 z-40 sticky top-0 shadow-sm">
          {/* Left — hamburger */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.08, backgroundColor: '#f0fdf4' }}
              whileTap={{ scale: 0.92 }}
              onClick={() => { if (window.innerWidth < 768) setIsMobileMenuOpen(!isMobileMenuOpen); else setIsSidebarOpen(!isSidebarOpen); }}
              className="p-2 rounded-xl border border-transparent hover:border-gray-200 text-gray-500 hover:text-[#134e40] transition-all duration-200"
            >
              <motion.div animate={{ rotate: isSidebarOpen ? 0 : 180 }} transition={{ duration: 0.3 }}>
                <Menu size={20} />
              </motion.div>
            </motion.button>
          </div>

          {/* Center — search */}
          <div className="flex-1 max-w-xl mx-4 sm:mx-6 hidden md:block">
            <div className="relative group">
              <Search size={15} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${searchFocused ? 'text-[#0eb59a]' : 'text-gray-300'}`} />
              <input
                type="text"
                placeholder="Search experts, skills, or projects..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className={`w-full pl-11 pr-12 py-2.5 bg-gray-50 border rounded-full text-sm text-gray-700 placeholder-gray-400 focus:bg-white focus:outline-none transition-all duration-200 ${searchFocused ? 'border-[#0eb59a] ring-2 ring-[#0eb59a]/20' : 'border-gray-200'}`}
              />
              {!searchFocused && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <span className="text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded font-mono">⌘K</span>
                </div>
              )}
            </div>
          </div>

          {/* Right — actions */}
          <div className="flex items-center gap-2">

            {/* Post Requirement */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/requirements/create')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#134e40] hover:bg-[#0eb59a] text-white text-sm font-bold rounded-full shadow-md overflow-hidden relative group transition-transform duration-150"
            >
              <Plus size={14} />
              Post Requirement
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </motion.button>

            {/* 9-dot grid with mega dropdown */}
            <div className="relative" ref={gridRef}>
              <motion.button
                whileHover={{ scale: 1.08, backgroundColor: '#f0fdf4', borderColor: '#0eb59a' }}
                whileTap={{ scale: 0.92 }}
                onClick={() => { setGridOpen(!gridOpen); setShowNotifications(false); }}
                className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all duration-200 ${gridOpen ? 'bg-teal-50 border-[#0eb59a] text-[#134e40]' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                title="Quick Navigation"
              >
                <Grid size={17} />
              </motion.button>

              <AnimatePresence>
                {gridOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-[520px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50"
                  >
                    <div className="grid grid-cols-2 gap-6">
                      {/* Left — Quick Actions */}
                      <div>
                        <p className="text-xs text-gray-400 font-semibold tracking-widest mb-3">QUICK ACTIONS</p>
                        {[
                          { icon: "🔍", bg: "bg-teal-50", label: "Find Experts", sub: "Browse CXO-level talent" },
                          { icon: "📋", bg: "bg-green-50", label: "Post a Role", sub: "Create a new requirement" },
                          { icon: "📁", bg: "bg-purple-50", label: "Contracts", sub: "Manage NDAs and agreements" },
                          { icon: "💳", bg: "bg-orange-50", label: "Payments", sub: "Escrow and invoices" },
                          { icon: "📊", bg: "bg-blue-50", label: "Analytics", sub: "Spend and ROI reports" },
                          { icon: "🛡️", bg: "bg-indigo-50", label: "PMO Services", sub: "Governance and oversight" },
                        ].map(item => (
                          <div key={item.label} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-150">
                            <div className={`w-9 h-9 ${item.bg} rounded-lg flex items-center justify-center text-base`}>{item.icon}</div>
                            <div>
                              <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                              <p className="text-xs text-gray-500">{item.sub}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Right — Platform Highlights */}
                      <div>
                        <p className="text-xs text-gray-400 font-semibold tracking-widest mb-3">PLATFORM</p>
                        {[
                          { label: "AI Expert Matching", sub: "Find the right CXO in minutes" },
                          { label: "Verified Profiles", sub: "All experts are background-checked" },
                          { label: "Escrow Payments", sub: "Secure milestone-based releases" },
                          { label: "E-Sign Contracts", sub: "Sign NDAs and agreements online" },
                          { label: "PMO Oversight", sub: "Track all engagements in one place" },
                          { label: "Dedicated Advisor", sub: "Get help scoping your requirements" },
                        ].map(item => (
                          <div key={item.label} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-150">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#0eb59a] flex-shrink-0" />
                            <div>
                              <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                              <p className="text-xs text-gray-500">{item.sub}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bell */}
            <div className="relative">
              <motion.button
                animate={{ rotate: [0, -8, 8, -8, 0] }}
                transition={{ duration: 0.5, delay: 4, repeat: Infinity, repeatDelay: 10 }}
                whileHover={{ scale: 1.08, backgroundColor: '#f0fdf4', borderColor: '#0eb59a' }}
                whileTap={{ scale: 0.92 }}
                onClick={() => { setShowNotifications(!showNotifications); setGridOpen(false); }}
                className={`relative w-9 h-9 flex items-center justify-center rounded-xl border transition-all duration-200 ${showNotifications ? 'bg-teal-50 border-[#0eb59a]' : 'bg-gray-50 border-gray-200'}`}
                title="Notifications"
              >
                <Bell size={16} className={showNotifications ? 'text-[#134e40]' : 'text-gray-500'} />
                {notificationCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white px-0.5 animate-pulse"
                  >
                    {notificationCount}
                  </motion.span>
                )}
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      onClick={() => setShowNotifications(false)} className="fixed inset-0 z-40" />
                    <motion.div
                      initial={{ opacity: 0, x: '100%' }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: '100%' }}
                      transition={{ duration: 0.3, type: "tween" }}
                      className="fixed right-0 top-16 bottom-0 w-80 bg-white shadow-2xl border-l border-gray-100 z-50 overflow-hidden flex flex-col"
                    >
                      <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between bg-gradient-to-r from-teal-50/50 to-white">
                        <h3 className="font-black text-gray-900 text-sm">Notifications</h3>
                        <button onClick={() => setNotificationCount(0)} className="text-xs font-bold text-[#0eb59a] hover:text-[#134e40] transition-colors">
                          Mark all read
                        </button>
                      </div>
                      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                        {notifications.map((notif, idx) => (
                          <motion.div key={idx}
                            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`px-5 py-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer flex gap-3 transition-colors ${notif.unread ? 'bg-teal-50/20' : ''}`}
                          >
                            <div className={`w-2 h-2 rounded-full ${notif.color} mt-1.5 shrink-0`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-900 leading-tight">{notif.title}</p>
                              <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{notif.desc}</p>
                              <p className="text-[10px] text-gray-300 font-semibold mt-1">{notif.time}</p>
                            </div>
                            {notif.unread && <div className="w-1.5 h-1.5 rounded-full bg-[#0eb59a] mt-1.5 shrink-0" />}
                          </motion.div>
                        ))}
                      </div>
                      <div className="px-5 py-3 text-center border-t border-gray-50">
                        <button
                          onClick={() => { navigate('/notifications'); setShowNotifications(false); }}
                          className="text-xs font-bold text-[#0eb59a] hover:text-[#134e40] transition-colors"
                        >
                          View all notifications →
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.08, ringWidth: 2, ringColor: '#0eb59a', ringOffsetWidth: 2 }}
              whileTap={{ scale: 0.94 }}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-[#134e40] to-[#0eb59a] flex items-center justify-center text-white font-black text-xs cursor-pointer shadow-md transition-all duration-200 overflow-hidden"
              title="Account"
            >
              {companyProfile?.logo_url ? (
                <img src={companyProfile.logo_url} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                companyProfile?.company_name ? companyProfile.company_name.substring(0, 2).toUpperCase() : 'AC'
              )}
            </motion.div>
          </div>
        </header>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc] [&::-webkit-scrollbar]:hidden">

          {/* LIGHT HERO BANNER */}
          <div className="relative overflow-hidden border-b border-teal-100/60"
            style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #e8f5f1 50%, #f8fafc 100%)' }}>
            <div className="absolute top-0 right-0 w-64 h-32 bg-[#0eb59a]/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-48 h-20 bg-[#134e40]/6 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0 }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + i * 0.08, type: 'spring', stiffness: 300 }}>
                          <Star size={11} fill="#FBBF24" className="text-amber-400" />
                        </motion.div>
                      ))}
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Company · Premium</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                    Good morning,{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#134e40] to-[#0eb59a]">
                      {loadingProfile ? '...' : (companyProfile?.company_name || 'Acme Corp.')}
                    </span>{' '}
                    <motion.span animate={{ rotate: [0, 20, -10, 20, 0] }}
                      transition={{ duration: 1.5, delay: 1, repeat: Infinity, repeatDelay: 4 }} className="inline-block">
                      👋
                    </motion.span>
                  </h1>

                  <p className="text-slate-500 text-sm mt-2 font-medium">
                    You have{' '}
                    <span className="text-amber-500 font-black">3 pending actions</span>{' '}and{' '}
                    <span className="text-[#134e40] font-black">3 expert matches</span> today.
                  </p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="flex gap-3 shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.04, boxShadow: '0 8px 25px rgba(19,78,64,0.2)' }} whileTap={{ scale: 0.96 }}
                    onClick={() => navigate('/requirements/create')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#134e40] hover:bg-[#0eb59a] text-white text-sm font-bold rounded-xl shadow-lg transition-all whitespace-nowrap">
                    <Plus size={15} /> Post a Role
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm whitespace-nowrap">
                    <TrendingUp size={15} /> Download Report
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-6 space-y-5 pb-16">

            {/* KPI CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {kpiCards.map((kpi, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 * idx }}>
                  <div onClick={() => navigate(kpi.path)}
                    className={`bg-white rounded-xl p-4 sm:p-5 border border-gray-100 border-l-4 ${kpi.border} cursor-pointer relative group transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}>
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight pr-2">{kpi.title}</span>
                      <div className={`w-8 h-8 ${kpi.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
                        <kpi.icon size={15} className={kpi.iconColor} />
                      </div>
                    </div>
                    <p className={`text-2xl sm:text-3xl font-black mb-2 tracking-tight ${kpi.numColor}`}>
                      {mounted ? <AnimatedCounter value={kpi.value} /> : kpi.value}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-lg">
                      <ArrowUpRight size={9} /> {kpi.trend}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* QUICK ACTIONS */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="grid grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
              {quickActions.map((action, idx) => (
                <div key={idx} onClick={() => navigate(action.path)}
                  className="relative group flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5">
                  <div className={`w-9 h-9 sm:w-11 sm:h-11 ${action.bg} rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <action.icon size={17} className={action.iconColor} />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 group-hover:text-gray-900 text-center leading-tight transition-colors">
                    {action.label}
                  </span>
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap pointer-events-none z-50">
                    {action.label}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* RECOMMENDED EXPERTS CAROUSEL */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }} className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-sm sm:text-base font-black text-gray-900 flex items-center gap-2">
                    <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}>
                      <Zap size={16} fill="#0eb59a" className="text-[#0eb59a]" />
                    </motion.div>
                    Recommended Experts
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">Based on your "Interim CFO" requirement</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* LEFT ARROW */}
                <button
                  onClick={() => setCurrentIndex(i => i - 1)}
                  disabled={!canGoLeft}
                  className={`w-8 h-8 rounded-full border bg-white shadow-sm flex items-center justify-center flex-shrink-0 transition-all duration-200
                    ${canGoLeft
                      ? 'border-gray-200 text-gray-600 hover:bg-[#0eb59a] hover:text-white hover:border-[#0eb59a] hover:shadow-md cursor-pointer'
                      : 'border-gray-100 text-gray-300 cursor-not-allowed opacity-40'
                    }`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>

                {/* CARDS AREA */}
                <div className="flex-1 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, x: canGoRight ? 40 : -40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: canGoRight ? -40 : 40 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="flex gap-3"
                    >
                      {visibleExperts.map(expert => (
                        <ExpertCard key={expert.id} expert={expert} />
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* RIGHT ARROW */}
                <button
                  onClick={() => setCurrentIndex(i => i + 1)}
                  disabled={!canGoRight}
                  className={`w-8 h-8 rounded-full border bg-white shadow-sm flex items-center justify-center flex-shrink-0 transition-all duration-200
                    ${canGoRight
                      ? 'border-gray-200 text-gray-600 hover:bg-[#0eb59a] hover:text-white hover:border-[#0eb59a] hover:shadow-md cursor-pointer'
                      : 'border-gray-100 text-gray-300 cursor-not-allowed opacity-40'
                    }`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>

              {/* Dot indicators + View All */}
              <div className="flex flex-col items-center gap-2 mt-4">
                <div className="flex gap-1.5">
                  {Array.from({ length: experts.length - CARDS_PER_VIEW + 1 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`rounded-full transition-all duration-200 ${currentIndex === i
                        ? 'w-4 h-2 bg-[#0eb59a]'
                        : 'w-2 h-2 bg-gray-200 hover:bg-gray-300'
                        }`}
                    />
                  ))}
                </div>
                <a href="/experts" className="text-sm text-[#0eb59a] font-medium hover:underline mt-1">
                  View All Experts →
                </a>
              </div>
            </motion.div>

            {/* BOTTOM GRID — Engagements + Pending Actions side by side */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }} className="grid grid-cols-1 lg:grid-cols-3 gap-5">

              {/* Active Engagements — left 2/3 */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-sm sm:text-base font-black text-gray-900 flex items-center gap-2">
                    <Activity size={16} className="text-[#0eb59a]" /> Active Engagements
                  </h2>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    <span className="text-[10px] text-gray-400 italic">Auto-saved · Last updated 2 min ago</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[520px]">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {['Project', 'Milestone', 'Progress', 'Deadline', 'Risk', 'Actions'].map(h => (
                          <th key={h} className="text-left pb-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {activeEngagements.map((eng, idx) => (
                        <motion.tr key={idx}
                          onClick={() => navigate(eng.path)}
                          className="cursor-pointer transition-colors duration-150 hover:bg-gray-50 group">
                          <td className="py-4 pr-3">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${eng.expertColor} flex items-center justify-center shrink-0`}>
                                <span className="text-white text-[9px] font-black">{eng.initials}</span>
                              </div>
                              <div>
                                <p className="font-bold text-gray-800 text-xs group-hover:text-[#134e40] transition-colors leading-tight">{eng.title}</p>
                                <p className="text-[10px] text-gray-400 font-medium">Expert: {eng.expert}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 pr-3">
                            <span className={`text-[10px] font-black px-2 py-1 rounded-full ${eng.statusColor}`}>{eng.nextMilestone}</span>
                          </td>
                          <td className="py-4 pr-3">
                            <div className="flex items-center gap-2 min-w-[80px]">
                              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${eng.progress}%` }}
                                  transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
                                  className="h-full rounded-full relative overflow-hidden"
                                  style={{ background: 'linear-gradient(90deg, #134e40, #0eb59a)' }}>
                                  <motion.div animate={{ x: ['-100%', '200%'] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                    className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                                </motion.div>
                              </div>
                              <span className="text-[10px] font-black text-[#134e40] shrink-0">{eng.progress}%</span>
                            </div>
                          </td>
                          <td className="py-4 pr-3">
                            <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
                              <Clock size={9} /> {eng.deadline}
                            </div>
                          </td>
                          <td className="py-4 pr-3">
                            <span className={`text-[10px] font-black px-2 py-1 rounded-full ${eng.riskColor}`}>{eng.risk}</span>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-1.5">
                              {[
                                { icon: Eye, bg: 'bg-teal-50 hover:bg-teal-100', color: 'text-[#0eb59a]', title: 'Workspace', fn: (e) => { e.stopPropagation(); navigate(eng.path); } },
                                { icon: MessageSquare, bg: 'bg-blue-50 hover:bg-blue-100', color: 'text-blue-500', title: 'Message', fn: (e) => { e.stopPropagation(); navigate(`${eng.path}?tab=messages`); } },
                                { icon: CheckCircle, bg: 'bg-emerald-50 hover:bg-emerald-100', color: 'text-emerald-500', title: 'Approve', fn: (e) => { e.stopPropagation(); navigate(`${eng.path}?tab=milestones`); } },
                                { icon: FileText, bg: 'bg-amber-50 hover:bg-amber-100', color: 'text-amber-500', title: 'Invoices', fn: (e) => { e.stopPropagation(); navigate('/payments'); } },
                              ].map(({ icon: Icon, bg, color, title, fn }, i) => (
                                <motion.button key={i} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                                  onClick={fn} title={title}
                                  className={`p-1.5 rounded-lg ${bg} ${color} transition-all`}>
                                  <Icon size={12} />
                                </motion.button>
                              ))}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pending Actions — right 1/3 */}
              <div className="flex flex-col">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col max-h-[520px]">
                  <div className="p-4 sm:p-5 border-b border-gray-50 bg-gradient-to-b from-amber-50/40 to-white">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-black text-gray-900 flex items-center gap-2">
                        <motion.div animate={{ rotate: [0, 6, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2.5 }}>
                          <AlertCircle size={16} className="text-amber-500" />
                        </motion.div>
                        Pending Actions
                      </h2>
                      <div className="flex items-center">
                        <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                          className="bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                          {pendingActions.length}
                        </motion.span>
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse ml-1 inline-block" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 font-medium">{pendingActions.length} items requiring attention</p>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3 space-y-2.5 [&::-webkit-scrollbar]:hidden">
                    {pendingActions.map((action, idx) => (
                      <div key={idx} onClick={() => navigate(action.path)}
                        className="p-3.5 rounded-2xl border border-gray-100 bg-gray-50/40 hover:bg-white hover:shadow-sm hover:border-[#0eb59a]/30 transition-all duration-150 cursor-pointer group">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${action.typeColor}`}>
                              {action.type}
                            </span>
                            {action.urgent && (
                              <motion.div animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                                transition={{ duration: 1.2, repeat: Infinity }}
                                className={`w-1.5 h-1.5 rounded-full ${action.dotColor}`} />
                            )}
                          </div>
                          <span className="text-[10px] text-gray-300 flex items-center gap-1">
                            <Clock size={9} /> {action.time}
                          </span>
                        </div>
                        <h4 className="font-black text-gray-700 text-xs mb-1 group-hover:text-gray-900 transition-colors leading-snug">
                          {action.title}
                        </h4>
                        <p className="text-[10px] text-gray-400 flex items-center gap-1.5 mb-3">
                          <Briefcase size={9} /> {action.project}
                        </p>
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(action.path); }}
                          className="w-full py-2 bg-white border border-gray-200 rounded-xl text-[11px] font-black text-gray-500 hover:bg-[#134e40] hover:text-white transition-colors duration-200 shadow-sm">
                          Take Action
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t border-gray-50 bg-gray-50/30 text-center">
                    <motion.button whileHover={{ scale: 1.02 }} onClick={() => navigate('/notifications')}
                      className="text-xs font-bold text-[#0eb59a] hover:text-[#134e40] transition-colors flex items-center gap-1 mx-auto">
                      View All History <ChevronRight size={12} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default CompanyDashboard;
