import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import {
  Search, LayoutDashboard, Bell,
  Settings, LogOut, Activity,
  FileText, Star, DollarSign,
  ArrowUpRight, Menu, AlertCircle,
  ChevronRight, ChevronLeft, Clock, MapPin,
  Briefcase, Eye, Zap, Award, MessageSquare,
  User, Check, X, TrendingUp, Shield
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

// ── ANIMATED COUNTER ──
const AnimatedCounter = ({ value }) => {
  const [display, setDisplay] = useState('0');
  useEffect(() => {
    const raw = value.replace(/[₹L,+\s]/g, '');
    const isNum = !isNaN(parseFloat(raw));
    if (!isNum) { setDisplay(value); return; }
    const end = parseFloat(raw);
    const duration = 1200;
    const step = end / (duration / 16);
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

// ── MAGNETIC TILT CARD ──
const MagneticCard = ({ children, className, onClick }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-30, 30], [3, -3]);
  const rotateY = useTransform(x, [-30, 30], [-3, 3]);
  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };
  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.03, boxShadow: '0 20px 50px rgba(79,70,229,0.08)' }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const ExpertDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) navigate('/signin?role=expert');
    };
    checkAuth();
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) navigate('/signin?role=expert');
    });
    return () => authListener?.subscription?.unsubscribe();
  }, [navigate]);

  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [opportunityCarouselIndex, setOpportunityCarouselIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(t);
  }, []);

  const sidebarMenu = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/expert-dashboard' },
    { name: 'Opportunities', icon: Briefcase, path: '/expert-opportunities', badge: '3' },
    { name: 'My Engagements', icon: Activity, path: '/expert-engagements' },
    { name: 'Earnings', icon: DollarSign, path: '/expert-earnings' },
    { name: 'Profile Builder', icon: User, path: '/expert-profile' },
    { name: 'Settings', icon: Settings, path: '/expert-settings' },
  ];

  const kpis = [
    {
      title: 'Active Engagements',
      value: '2',
      trend: '+1 this month',
      icon: Activity,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      borderColor: 'border-t-indigo-500',
      accent: '#4f46e5',
      path: '/expert-engagements',
      gold: false,
    },
    {
      title: 'Proposals Sent',
      value: '8',
      trend: '3 pending review',
      icon: FileText,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      borderColor: 'border-t-blue-400',
      accent: '#3b82f6',
      path: '/expert-opportunities',
      gold: false,
    },
    {
      title: 'Total Earned',
      value: '₹12.4L',
      trend: '+₹3.5L this month',
      icon: DollarSign,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
      borderColor: 'border-t-amber-400',
      accent: '#f59e0b',
      path: '/expert-earnings',
      gold: true,
    },
    {
      title: 'Profile Views',
      value: '234',
      trend: '+48 this week',
      icon: Eye,
      iconBg: 'bg-slate-50',
      iconColor: 'text-slate-600',
      borderColor: 'border-t-slate-400',
      accent: '#64748b',
      path: '/expert-profile',
      gold: false,
    },
  ];

  const recommendedOpportunities = [
    {
      id: 1,
      title: 'Fractional CFO',
      company: 'HealthTech Startup',
      companySize: 'Series A · 50-200 employees',
      match: 96,
      budget: '₹2L - ₹3L/mo',
      commitment: '20 hrs/wk',
      duration: '6 months',
      location: 'Remote',
      skills: ['Financial Modeling', 'Fundraising', 'M&A'],
      logo: 'HT',
      logoColor: 'from-blue-600 to-cyan-500',
    },
    {
      id: 2,
      title: 'Interim CFO',
      company: 'D2C Brand',
      companySize: 'Series B · 200-500 employees',
      match: 91,
      budget: '₹2.5L - ₹4L/mo',
      commitment: '40 hrs/wk',
      duration: '3 months',
      location: 'Hybrid | Mumbai',
      skills: ['P&L Management', 'Investor Relations', 'IPO Readiness'],
      logo: 'DC',
      logoColor: 'from-slate-700 to-slate-500',
    },
    {
      id: 3,
      title: 'Advisory Board — Finance',
      company: 'Logistics Startup',
      companySize: 'Seed · 10-50 employees',
      match: 88,
      budget: '₹60K - ₹1L/mo',
      commitment: '8 hrs/wk',
      duration: '12 months',
      location: 'Remote',
      skills: ['Supply Chain Finance', 'Working Capital'],
      logo: 'LS',
      logoColor: 'from-amber-500 to-orange-400',
    },
  ];

  const activeEngagements = [
    {
      id: 1,
      title: 'Series B Funding Strategy',
      company: 'Acme Corp',
      companyLogo: 'AC',
      logoColor: 'from-slate-800 to-slate-600',
      status: 'IN PROGRESS',
      statusColor: 'text-indigo-600 bg-indigo-50',
      progress: 65,
      nextMilestone: 'Investor Deck & Data Room',
      dueDate: 'Apr 30, 2025',
      monthlyRate: '₹3L/mo',
      path: '/expert-engagements/1',
    },
    {
      id: 2,
      title: 'Financial Due Diligence',
      company: 'TechScale Ventures',
      companyLogo: 'TV',
      logoColor: 'from-blue-700 to-blue-500',
      status: 'ON TRACK',
      statusColor: 'text-emerald-700 bg-emerald-50',
      progress: 40,
      nextMilestone: 'Due Diligence Report',
      dueDate: 'May 15, 2025',
      monthlyRate: '₹2.5L/mo',
      path: '/expert-engagements/2',
    },
  ];

  const pendingActions = [
    {
      title: 'Submit Milestone Deliverable',
      project: 'Series B Funding Strategy',
      type: 'SUBMIT',
      time: 'Due in 3 days',
      urgent: true,
      typeColor: 'text-amber-700 bg-amber-50 border-amber-100',
      path: '/expert-engagements/1?tab=milestones',
    },
    {
      title: 'Review & Sign Contract',
      project: 'Financial Due Diligence',
      type: 'SIGN',
      time: 'Expires tomorrow',
      urgent: true,
      typeColor: 'text-red-700 bg-red-50 border-red-100',
      path: '/expert-engagements/2?tab=contracts',
    },
    {
      title: 'New Message from Acme Corp',
      project: 'Series B Funding Strategy',
      type: 'MESSAGE',
      time: '2 hours ago',
      urgent: false,
      typeColor: 'text-blue-700 bg-blue-50 border-blue-100',
      path: '/expert-engagements/1?tab=messages',
    },
  ];

  const quickActions = [
    { label: 'Browse Roles', icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'group-hover:border-indigo-200', path: '/expert-opportunities' },
    { label: 'My Engagements', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50', border: 'group-hover:border-blue-200', path: '/expert-engagements' },
    { label: 'Earnings', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'group-hover:border-emerald-200', path: '/expert-earnings' },
    { label: 'Edit Profile', icon: User, color: 'text-purple-600', bg: 'bg-purple-50', border: 'group-hover:border-purple-200', path: '/expert-profile' },
    { label: 'Messages', icon: MessageSquare, color: 'text-rose-500', bg: 'bg-rose-50', border: 'group-hover:border-rose-200', path: '/expert-engagements' },
    { label: 'Reviews', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50', border: 'group-hover:border-amber-200', path: '/expert-profile' },
  ];

  const notifications = [
    { title: 'New Role Match', desc: 'Fractional CFO role at HealthTech — 96% match', time: '10 min ago', unread: true, color: 'bg-indigo-500' },
    { title: 'Milestone Approved', desc: 'Acme Corp approved Financial Model Development', time: '2 hours ago', unread: true, color: 'bg-emerald-500' },
    { title: 'Payment Received', desc: '₹2,00,000 credited for milestone completion', time: '3 hours ago', unread: true, color: 'bg-blue-500' },
    { title: 'New Message', desc: 'Acme Corp sent you a message about the investor deck', time: '1 day ago', unread: false, color: 'bg-slate-400' },
  ];

  const profileStrength = 78;
  const profileTips = [
    { label: 'Add a profile photo', done: true },
    { label: 'Complete work experience', done: true },
    { label: 'Add case studies', done: true },
    { label: 'Set your rate card', done: false },
    { label: 'Add 3 client testimonials', done: false },
  ];

  const nextOpportunity = () => {
    setOpportunityCarouselIndex(prev =>
      prev >= recommendedOpportunities.length - itemsPerView ? 0 : prev + 1
    );
  };

  const prevOpportunity = () => {
    setOpportunityCarouselIndex(prev =>
      prev === 0 ? Math.max(0, recommendedOpportunities.length - itemsPerView) : prev - 1
    );
  };

  const sidebarExpanded = isMobile ? true : isSidebarOpen;

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-900 overflow-hidden">

      {/* ── MOBILE BACKDROP ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* ══ SIDEBAR — Switched to Light Theme for a cleaner look ══ */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 68 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={`
          bg-white border-r border-slate-100 flex flex-col z-50 overflow-hidden shrink-0 shadow-lg
          fixed md:relative inset-y-0 left-0
          transition-transform duration-300
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{ width: typeof window !== 'undefined' && window.innerWidth < 768 ? 260 : undefined }}
      >
        {/* Close — mobile only */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-50 text-slate-400 md:hidden z-50"
        >
          <X size={14} />
        </button>

        {/* Logo */}
        <div className={`flex items-center border-b border-slate-50 overflow-hidden transition-all duration-300 ${sidebarExpanded ? 'px-5 py-5 gap-3' : 'px-0 py-5 justify-center'}`}>
          <div className="relative w-9 h-9 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <span className="text-white font-black text-sm">C</span>
            </div>
          </div>
          <motion.div
            animate={{ opacity: sidebarExpanded ? 1 : 0, width: sidebarExpanded ? 'auto' : 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden whitespace-nowrap"
          >
            <p className="text-sm font-black text-slate-900 leading-tight">CXO Connect</p>
            <p className="text-[10px] font-bold text-indigo-600/50 uppercase tracking-widest">Expert Portal</p>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 flex flex-col gap-0.5 [&::-webkit-scrollbar]:hidden overflow-y-auto">
          <motion.p
            animate={{ opacity: sidebarExpanded ? 1 : 0, height: sidebarExpanded ? 'auto' : 0 }}
            transition={{ duration: 0.2 }}
            className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] px-3 mb-2 overflow-hidden"
          >
            Main Menu
          </motion.p>

          {sidebarMenu.map((item, idx) => {
            const isActive = activeMenu === item.name;
            return (
              <div key={item.name} className="relative group">
                <motion.button
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ x: sidebarExpanded ? 4 : 0, scale: sidebarExpanded ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setActiveMenu(item.name);
                    navigate(item.path);
                    if (isMobile) setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center transition-all duration-200 rounded-xl relative
                    ${sidebarExpanded ? 'gap-3 px-4 py-3' : 'justify-center px-0 py-3'}
                    ${isActive
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="expertActiveBar"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-600 rounded-r-full shadow-lg shadow-indigo-600/40"
                    />
                  )}

                  <div className={`relative shrink-0 ${isActive ? 'text-indigo-600' : ''}`}>
                    <item.icon size={18} />
                    {item.badge && (
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-indigo-600 text-white text-[8px] font-black rounded-full flex items-center justify-center"
                      >
                        {item.badge}
                      </motion.span>
                    )}
                  </div>

                  <motion.span
                    animate={{ opacity: sidebarExpanded ? 1 : 0, width: sidebarExpanded ? 'auto' : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-bold overflow-hidden whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                </motion.button>
              </div>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-2 pb-4 flex flex-col gap-2">
          {sidebarExpanded ? (
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => { navigate('/expert-profile'); if (isMobile) setIsMobileMenuOpen(false); }}
              className="mx-1 p-4 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Award size={13} className="text-indigo-600" />
                    <p className="font-black text-xs text-slate-900">Profile Strength</p>
                  </div>
                  <span className="text-sm font-black text-indigo-600">{profileStrength}%</span>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${profileStrength}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
                    className="h-full bg-indigo-600 rounded-full"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-semibold">Complete profile → more matches</p>
              </div>
            </motion.div>
          ) : (
            <div className="relative group flex justify-center">
              <motion.button
                whileHover={{ scale: 1.15 }}
                onClick={() => navigate('/expert-profile')}
                className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center"
              >
                <Award size={17} className="text-indigo-600" />
              </motion.button>
            </div>
          )}

          <div className="h-px bg-slate-100 mx-1" />

          <motion.button
            whileHover={{ x: sidebarExpanded ? 4 : 0, backgroundColor: '#fef2f2', color: '#dc2626' }}
            whileTap={{ scale: 0.95 }}
            onClick={async () => { await supabase.auth.signOut(); navigate('/signin?role=expert'); }}
            className={`w-full flex items-center rounded-xl text-slate-400 transition-all
              ${sidebarExpanded ? 'gap-3 px-4 py-3' : 'justify-center px-0 py-3'}`}
          >
            <LogOut size={17} className="shrink-0" />
            <motion.span
              animate={{ opacity: sidebarExpanded ? 1 : 0, width: sidebarExpanded ? 'auto' : 0 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-bold overflow-hidden whitespace-nowrap"
            >
              Logout
            </motion.span>
          </motion.button>
        </div>
      </motion.aside>

      {/* ══ MAIN AREA ══ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden md:ml-0">

        {/* ── HEADER — clean white ── */}
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 sm:px-6 shrink-0 z-40 sticky top-0">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (window.innerWidth < 768) setIsMobileMenuOpen(!isMobileMenuOpen);
                else setIsSidebarOpen(!isSidebarOpen);
              }}
              className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all"
            >
              <Menu size={20} />
            </motion.button>
          </div>

          <div className="flex-1 max-w-xl mx-4 sm:mx-6 hidden md:block">
            <div className="relative group">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                placeholder="Search opportunities, companies, skills..."
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-full text-sm placeholder-slate-400 focus:bg-white focus:border-indigo-600/40 focus:ring-4 focus:ring-indigo-600/8 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 8px 25px rgba(79,70,229,0.2)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/expert-opportunities')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-full transition-all shadow-md"
            >
              <Briefcase size={14} /> Browse Roles
            </motion.button>

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-all"
              >
                <Bell size={16} className="text-slate-400" />
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white"
                >
                  {notifications.filter(n => n.unread).length}
                </motion.span>
              </motion.button>
            </div>

            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-xs cursor-pointer shadow-md ring-2 ring-white"
              >
                DC
              </motion.div>
            </div>
          </div>
        </header>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc] [&::-webkit-scrollbar]:hidden relative">

          {/* ── HERO BANNER — Replaced dark banner with light premium section ── */}
          <div className="relative overflow-hidden bg-white border-b border-slate-100 shadow-sm">
            {/* Extremely subtle grid */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)',
                backgroundSize: '48px 48px',
              }}
            />
            {/* Soft Indigo glow */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-50/30 to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-2xl">
                  {/* Status row */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-2 mb-4"
                  >
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill="#FBBF24" className="text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-black text-indigo-600/50 uppercase tracking-[0.2em] border-l border-slate-200 pl-3 ml-1">
                      Verified Expert · Top 5%
                    </span>
                  </motion.div>

                  {/* Serif headline */}
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                  >
                    Good morning,{' '}
                    <span className="text-indigo-600">
                      David.
                    </span>{' '}
                    <motion.span
                      animate={{ rotate: [0, 20, -10, 20, 0] }}
                      transition={{ duration: 1.5, delay: 1, repeat: Infinity, repeatDelay: 4 }}
                      className="inline-block"
                    >
                      👋
                    </motion.span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-slate-500 text-base sm:text-lg mt-4 font-medium"
                  >
                    You have{' '}
                    <span className="text-amber-600 font-bold">3 pending actions</span>
                    {' '}and{' '}
                    <span className="text-indigo-600 font-bold">3 new role matches</span>
                    {' '}waiting for your review today.
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex gap-3 shrink-0 w-full md:w-auto mt-2 md:mt-0"
                >
                  <motion.button
                    whileHover={{ scale: 1.04, boxShadow: '0 10px 30px rgba(79,70,229,0.2)' }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => navigate('/expert-opportunities')}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-7 py-3.5 bg-indigo-600 text-white text-sm font-bold rounded-2xl shadow-xl transition-all whitespace-nowrap"
                  >
                    <Briefcase size={16} /> Browse Roles
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.04, backgroundColor: '#f8fafc' }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => navigate('/expert-profile')}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-7 py-3.5 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-2xl shadow-sm transition-all whitespace-nowrap"
                  >
                    <User size={16} /> My Profile
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 pb-16">

            {/* ── KPI CARDS ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {kpis.map((kpi, idx) => (
                <MagneticCard
                  key={idx}
                  onClick={() => navigate(kpi.path)}
                  className={`bg-white rounded-2xl p-5 border border-slate-100 border-t-4 ${kpi.borderColor} cursor-pointer relative overflow-hidden group shadow-sm`}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + idx * 0.08 }}
                  >
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-tight">
                          {kpi.title}
                        </span>
                        <div className={`w-10 h-10 ${kpi.iconBg} rounded-2xl flex items-center justify-center shrink-0`}>
                          <kpi.icon size={18} className={kpi.iconColor} />
                        </div>
                      </div>
                      <p className={`text-3xl font-black mb-3 tracking-tight ${kpi.gold ? 'text-amber-500' : 'text-slate-900'}`}>
                        {mounted ? <AnimatedCounter value={kpi.value} /> : kpi.value}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 w-fit px-3 py-1 rounded-full">
                        <TrendingUp size={10} />
                        {kpi.trend}
                      </div>
                    </div>
                  </motion.div>
                </MagneticCard>
              ))}
            </div>

            {/* ── QUICK ACTIONS ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {quickActions.map((action, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 + idx * 0.06 }}
                  whileHover={{ y: -8, backgroundColor: '#ffffff', boxShadow: '0 15px 35px rgba(0,0,0,0.05)' }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => navigate(action.path)}
                  className={`flex flex-col items-center gap-3 p-5 rounded-2xl bg-white/50 border border-slate-100 cursor-pointer group transition-all duration-300 shadow-sm`}
                >
                  <div className={`w-12 h-12 ${action.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <action.icon size={20} className={action.color} />
                  </div>
                  <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-600 text-center leading-tight">
                    {action.label}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* ── MAIN GRID ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* LEFT — 2/3 */}
              <div className="lg:col-span-2 flex flex-col gap-6">

                {/* OPPORTUNITIES CAROUSEL */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                        <Zap size={18} fill="#4f46e5" className="text-indigo-600" /> Matched Opportunities
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      {[prevOpportunity, nextOpportunity].map((fn, i) => (
                        <button
                          key={i}
                          onClick={fn}
                          className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                        >
                          {i === 0 ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="overflow-hidden">
                    <motion.div
                      animate={{ x: `-${opportunityCarouselIndex * (100 / itemsPerView)}%` }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className="flex gap-4"
                    >
                      {recommendedOpportunities.map((opp, idx) => (
                        <motion.div
                          key={idx}
                          whileHover={{ y: -5 }}
                          style={{
                            minWidth: itemsPerView === 1 ? '100%'
                              : itemsPerView === 2 ? 'calc((100% - 16px) / 2)'
                              : 'calc((100% - 32px) / 3)'
                          }}
                          className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-300 group cursor-pointer shrink-0"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${opp.logoColor} flex items-center justify-center shadow-md shrink-0`}>
                              <span className="text-white font-black text-lg">{opp.logo}</span>
                            </div>
                            <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                              {opp.match}% Match
                            </span>
                          </div>

                          <h3 className="font-black text-slate-900 text-base leading-tight mb-1">
                            {opp.title}
                          </h3>
                          <p className="text-xs text-slate-500 font-bold mb-4">{opp.company}</p>

                          <div className="space-y-2 mb-5">
                            <div className="flex items-center gap-2 text-xs font-black text-slate-900">
                              <DollarSign size={12} className="text-indigo-600" /> {opp.budget}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                              <Clock size={12} /> {opp.commitment}
                            </div>
                          </div>

                          <motion.button
                            whileHover={{ backgroundColor: '#4f46e5', color: '#ffffff' }}
                            onClick={() => navigate(`/expert-opportunities/${opp.id}`)}
                            className="w-full py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 transition-all shadow-sm"
                          >
                            View Details
                          </motion.button>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </motion.div>

                {/* ACTIVE ENGAGEMENTS */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                      <Activity size={18} className="text-indigo-600" /> Active Engagements
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {activeEngagements.map((eng, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 hover:bg-white hover:shadow-lg transition-all duration-300 cursor-pointer group"
                        onClick={() => navigate(eng.path)}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className={`text-[10px] font-black px-3 py-1 rounded-full ${eng.statusColor}`}>
                            {eng.status}
                          </span>
                        </div>

                        <h4 className="font-black text-slate-900 text-sm mb-2 group-hover:text-indigo-600 transition-colors">
                          {eng.title}
                        </h4>
                        <p className="text-xs text-slate-400 font-bold mb-5">{eng.company}</p>

                        <div className="space-y-3">
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-slate-400 font-bold">Progress</span>
                            <span className="font-black text-indigo-600">{eng.progress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${eng.progress}%` }}
                              className="h-full bg-indigo-600 rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* RIGHT — 1/3 */}
              <div className="flex flex-col gap-6">

                {/* PENDING ACTIONS */}
                <motion.div
                  className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm"
                >
                  <div className="p-5 border-b border-slate-50">
                    <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <AlertCircle size={16} className="text-amber-500" /> Pending Actions
                    </h2>
                  </div>
                  <div className="p-4 space-y-3">
                    {pendingActions.map((action, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl border border-slate-50 bg-slate-50/30 hover:bg-white hover:shadow-md transition-all cursor-pointer group"
                        onClick={() => navigate(action.path)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${action.typeColor}`}>
                            {action.type}
                          </span>
                          <span className="text-[10px] text-slate-300 font-bold">{action.time}</span>
                        </div>
                        <h4 className="font-black text-slate-700 text-xs mb-3 group-hover:text-slate-900 leading-snug">
                          {action.title}
                        </h4>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* PROFILE STRENGTH */}
                <motion.div
                  className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <Award size={16} className="text-indigo-600" /> Profile
                    </h2>
                    <span className="text-lg font-black text-indigo-600">{profileStrength}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-5">
                    <motion.div
                      animate={{ width: `${profileStrength}%` }}
                      className="h-full bg-indigo-600 rounded-full"
                    />
                  </div>
                  <div className="space-y-3">
                    {profileTips.map((tip, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${tip.done ? 'bg-indigo-600' : 'bg-slate-100'}`}>
                          {tip.done && <Check size={10} className="text-white" />}
                        </div>
                        <span className={`text-xs font-bold ${tip.done ? 'text-slate-300' : 'text-slate-600'}`}>
                          {tip.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* EARNINGS */}
                <motion.div
                  className="rounded-3xl p-6 text-white shadow-xl relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)' }}
                >
                  <Shield size={60} className="absolute -right-4 -bottom-4 text-white/10" />
                  <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-2">Earnings Balance</p>
                  <p className="text-3xl font-black mb-1">₹3,50,000</p>
                  <p className="text-xs text-white/60 font-bold mb-6">Next payout: Apr 30, 2025</p>
                  <button
                    onClick={() => navigate('/expert-earnings')}
                    className="w-full py-3 bg-white/20 hover:bg-white hover:text-indigo-600 text-white text-xs font-black rounded-xl transition-all"
                  >
                    View Earnings →
                  </button>
                </motion.div>

              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExpertDashboard;
