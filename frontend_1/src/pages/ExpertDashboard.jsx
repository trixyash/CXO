import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import {
  Search, LayoutDashboard, Bell, Settings, Activity,
  FileText, Star, DollarSign, ArrowUpRight, AlertCircle,
  ChevronRight, ChevronLeft, Clock, Briefcase, Eye, Zap,
  Award, MessageSquare, User, Check, TrendingUp, Shield,
  BarChart2, CreditCard, Users, Target, Grid, Plus,
  UserCircle, LogOut, X, Menu, MapPin
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
      whileHover={{ scale: 1.03, boxShadow: '0 20px 50px rgba(14,181,154,0.08)' }}
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

  // Auto-play Carousel State
  const [carouselDirection, setCarouselDirection] = useState(1);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const [autoPlayProgress, setAutoPlayProgress] = useState(0);
  const autoPlayRef = useRef(null);
  const progressRef = useRef(null);
  const progressStartRef = useRef(null);
  const AUTO_PLAY_INTERVAL = 3500;
  const [searchFocused, setSearchFocused] = useState(false);
  const [gridOpen, setGridOpen] = useState(false);
  const gridRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (gridRef.current && !gridRef.current.contains(e.target))
        setGridOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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
    { name: 'Dashboard',      icon: LayoutDashboard, path: '/expert-dashboard'    },
    { name: 'Opportunities',  icon: Briefcase,       path: '/expert-opportunities', badge: '3' },
    { name: 'My Engagements', icon: Activity,        path: '/expert-engagements'  },
    { name: 'Contracts',      icon: FileText,        path: '/expert-contracts'    },
    { name: 'Earnings',       icon: DollarSign,      path: '/expert-earnings'     },
    { name: 'Profile',        icon: UserCircle,      path: '/expert-profile'      },
    { name: 'Analytics',      icon: BarChart2,       path: '/expert-analytics'    },
    { name: 'Settings',       icon: Settings,        path: '/expert-settings'     },
  ];

  const kpis = [
    {
      title: 'Active Engagements', value: '2', trend: '+1 this month',
      icon: Activity, iconBg: 'bg-teal-50', iconColor: 'text-[#0eb59a]',
      border: 'border-l-[#0eb59a]', numColor: 'text-[#0eb59a]',
      path: '/expert-engagements',
    },
    {
      title: 'Proposals Sent', value: '8', trend: '3 pending review',
      icon: FileText, iconBg: 'bg-[#f0fdf4]', iconColor: 'text-[#134e40]',
      border: 'border-l-[#134e40]', numColor: 'text-[#134e40]',
      path: '/expert-opportunities',
    },
    {
      title: 'Total Earned', value: '₹12.4L', trend: '+₹3.5L this month',
      icon: DollarSign, iconBg: 'bg-amber-50', iconColor: 'text-amber-500',
      border: 'border-l-amber-400', numColor: 'text-amber-500',
      path: '/expert-earnings',
    },
    {
      title: 'Profile Views', value: '234', trend: '+48 this week',
      icon: Eye, iconBg: 'bg-teal-50/50', iconColor: 'text-[#0eb59a]',
      border: 'border-l-[#0eb59a]/70', numColor: 'text-[#134e40]',
      path: '/expert-profile',
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
      logoColor: 'from-teal-800 to-teal-500',
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
      logoColor: 'from-[#134e40] to-[#0eb59a]',
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
      logoColor: 'from-[#0eb59a] to-emerald-400',
    },
  ];

  const activeEngagements = [
    {
      id: 1,
      title: 'Series B Funding Strategy',
      company: 'Acme Corp',
      companyLogo: 'AC',
      logoColor: 'from-[#134e40] to-[#0eb59a]',
      status: 'IN PROGRESS',
      statusColor: 'text-blue-600 bg-blue-50',
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
      logoColor: 'from-emerald-700 to-teal-500',
      status: 'ON TRACK',
      statusColor: 'text-emerald-600 bg-emerald-50',
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
    { label: 'Browse Roles',    icon: Briefcase,     bg: 'bg-teal-50',   iconColor: 'text-[#0eb59a]',   path: '/expert-opportunities' },
    { label: 'My Engagements', icon: Activity,       bg: 'bg-emerald-50',iconColor: 'text-emerald-600', path: '/expert-engagements'   },
    { label: 'Earnings',        icon: DollarSign,    bg: 'bg-teal-50/50',iconColor: 'text-[#134e40]',   path: '/expert-earnings'      },
    { label: 'Edit Profile',    icon: UserCircle,    bg: 'bg-teal-50',   iconColor: 'text-teal-600',    path: '/expert-profile'       },
    { label: 'Messages',        icon: MessageSquare, bg: 'bg-emerald-50/60',iconColor: 'text-emerald-700',path: '/expert-engagements'  },
    { label: 'Reviews',         icon: Star,          bg: 'bg-amber-50',  iconColor: 'text-amber-500',  path: '/expert-profile'       },
  ];

  const notifications = [
    { title: 'New Role Match', desc: 'Fractional CFO role at HealthTech — 96% match', time: '10 min ago', unread: true, color: 'bg-[#0eb59a]' },
    { title: 'Milestone Approved', desc: 'Acme Corp approved Financial Model Development', time: '2 hours ago', unread: true, color: 'bg-emerald-500' },
    { title: 'Payment Received', desc: '₹2,00,000 credited for milestone completion', time: '3 hours ago', unread: true, color: 'bg-teal-600' },
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

  // ── AUTO-PLAY CAROUSEL LOGIC ──
  const startProgress = useCallback(() => {
    if (progressRef.current) {
      cancelAnimationFrame(progressRef.current);
    }
    setAutoPlayProgress(0);
    progressStartRef.current = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - progressStartRef.current;
      const progress = Math.min((elapsed / AUTO_PLAY_INTERVAL) * 100, 100);
      setAutoPlayProgress(progress);

      if (elapsed < AUTO_PLAY_INTERVAL) {
        progressRef.current = requestAnimationFrame(updateProgress);
      }
    };

    progressRef.current = requestAnimationFrame(updateProgress);
  }, []);

  const stopProgress = useCallback(() => {
    if (progressRef.current) {
      cancelAnimationFrame(progressRef.current);
      progressRef.current = null;
    }
    setAutoPlayProgress(0);
  }, []);

  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    startProgress();

    autoPlayRef.current = setInterval(() => {
      setOpportunityCarouselIndex((prevIndex) => {
        const nextIndex = prevIndex + 1 >= recommendedOpportunities.length - itemsPerView + 1 ? 0 : prevIndex + 1;
        const dir = nextIndex === 0 && prevIndex !== 0 ? -1 : 1;
        setCarouselDirection(dir);
        return nextIndex;
      });
      startProgress();
    }, AUTO_PLAY_INTERVAL);
  }, [itemsPerView, recommendedOpportunities.length, startProgress]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
    stopProgress();
  }, [stopProgress]);

  useEffect(() => {
    if (!isCarouselHovered) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }
    return () => stopAutoPlay();
  }, [isCarouselHovered, startAutoPlay, stopAutoPlay]);

  const handleManualNav = (newIndex) => {
    const dir = newIndex > opportunityCarouselIndex ? 1 : -1;
    setCarouselDirection(dir);
    setOpportunityCarouselIndex(newIndex);
    stopAutoPlay();
    if (!isCarouselHovered) startAutoPlay();
  };

  const canGoLeft = opportunityCarouselIndex > 0;
  const canGoRight = opportunityCarouselIndex + itemsPerView < recommendedOpportunities.length;

  const nextOpportunity = () => {
    if (canGoRight) {
      handleManualNav(opportunityCarouselIndex + 1);
    }
  };

  const prevOpportunity = () => {
    if (canGoLeft) {
      handleManualNav(opportunityCarouselIndex - 1);
    }
  };

  return (
    <div className="flex h-screen bg-[#f4f7f5] font-sans text-slate-900 overflow-hidden">

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

      {/* ══ SIDEBAR ══ */}
      <motion.aside
        initial={{ width: 260 }}
        animate={{ width: isSidebarOpen ? 260 : 68 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white border-r border-gray-100 flex flex-col z-50 overflow-hidden shrink-0 shadow-sm fixed left-0 top-0 h-screen"
      >
        {/* LOGO AREA */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-50">
          <div
            style={{ background: 'linear-gradient(135deg, #134e40 0%, #0eb59a 100%)' }}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
          >
            <span className="text-white font-black text-xs tracking-tight">CX</span>
          </div>
          <motion.div
            animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden whitespace-nowrap"
          >
            <p className="text-[#134e40] font-black text-sm leading-none">CXO Connect</p>
            <p className="text-gray-400 text-[10px] mt-0.5">Expert Portal</p>
          </motion.div>
          <motion.button
            animate={{ marginLeft: isSidebarOpen ? 'auto' : 0 }}
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => setIsSidebarOpen(s => !s)}
            className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#134e40] hover:bg-gray-100 transition-all shrink-0 cursor-pointer text-center"
          >
            {isSidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </motion.button>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-hidden">
          {isSidebarOpen && (
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">Main Menu</p>
          )}
          {sidebarMenu.map((item) => {
            const isActive = activeMenu === item.name;
            return (
              <motion.button
                key={item.path}
                whileHover={{ x: 2, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setActiveMenu(item.name);
                  navigate(item.path);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 relative cursor-pointer text-center ${
                  isActive
                    ? 'bg-[#134e40] text-white shadow-md'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-[#134e40]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavExpert"
                    className="absolute left-0 top-1 bottom-1 w-0.5 bg-[#0eb59a] rounded-r-full"
                  />
                )}
                <div className="relative shrink-0">
                  <item.icon size={17} />
                  {item.badge && (
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-[#0eb59a] text-white text-[8px] font-black rounded-full flex items-center justify-center text-center"
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </div>
                <motion.span
                  animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden whitespace-nowrap text-sm font-bold text-left"
                >
                  {item.name}
                </motion.span>
              </motion.button>
            );
          })}
        </nav>

        {/* BOTTOM — availability status pill */}
        <motion.div
          animate={{ opacity: isSidebarOpen ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="px-4 pb-4 overflow-hidden"
        >
          <div className="flex items-center gap-2 p-3 rounded-xl bg-[#f0fdf4] border border-[#0eb59a]/20">
            <div className="w-2 h-2 rounded-full bg-[#0eb59a] animate-pulse shrink-0" />
            <div className="overflow-hidden">
              <p className="text-[10px] font-black text-[#134e40] leading-none">
                Available for Work
              </p>
              <p className="text-[9px] text-gray-400 mt-0.5">
                Profile: {profileStrength}% complete
              </p>
            </div>
          </div>
        </motion.div>
      </motion.aside>

      {/* ══ MAIN CONTENT WRAPPER ══ */}
      <div
        className="flex flex-col min-h-screen overflow-x-hidden flex-grow"
        style={{
          marginLeft: isSidebarOpen ? 260 : 68,
          transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* ── HEADER ── */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 shrink-0 z-40 sticky top-0 shadow-sm">
          {/* Left spacer / mobile toggle */}
          <div className="flex items-center gap-3">
            {isMobile && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-all shrink-0 cursor-pointer text-center justify-center flex"
              >
                <Menu size={20} />
              </motion.button>
            )}
          </div>

          {/* Center search */}
          <div className="flex-1 max-w-xl mx-4 sm:mx-6 hidden md:block">
            <div className="relative group">
              <Search size={15} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                searchFocused ? 'text-[#0eb59a]' : 'text-gray-300'
              }`} />
              <input
                type="text"
                placeholder="Search opportunities, companies, skills..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className={`w-full pl-11 pr-12 py-2.5 bg-gray-50 border rounded-full text-sm text-gray-700 placeholder-gray-400 focus:bg-white focus:outline-none transition-all duration-200 ${
                  searchFocused
                    ? 'border-[#0eb59a] ring-2 ring-[#0eb59a]/20'
                    : 'border-gray-200'
                }`}
              />
              {!searchFocused && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <span className="text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded font-mono">⌘K</span>
                </div>
              )}
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Browse Roles CTA */}
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/expert-opportunities')}
              className="hidden sm:flex items-center justify-center gap-2 px-4 py-2 bg-[#134e40] hover:bg-[#0eb59a] text-white text-sm font-bold rounded-full shadow-md overflow-hidden relative group transition-colors duration-200 cursor-pointer text-center"
            >
              <Briefcase size={14} />
              Browse Roles
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
            </motion.button>

            {/* Grid quick-nav dropdown — same as company dashboard */}
            <div className="relative" ref={gridRef}>
              <motion.button
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                onClick={() => { setGridOpen(!gridOpen); setShowNotifications(false); }}
                className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all duration-200 cursor-pointer text-center ${
                  gridOpen
                    ? 'bg-teal-50 border-[#0eb59a] text-[#134e40]'
                    : 'bg-gray-50 border-gray-200 text-gray-500'
                }`}
              >
                <Grid size={17} />
              </motion.button>

              <AnimatePresence>
                {gridOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-[360px] bg-white rounded-2xl z-50 overflow-hidden"
                    style={{
                      boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
                      border: '1px solid #F1F5F2'
                    }}
                  >
                    <div className="p-3 space-y-1">
                      {[
                        { icon: Briefcase,   label: 'Opportunities',  badge: '3 new',        badgeStyle: 'text-teal-700 bg-teal-50 border-teal-200',   border: '#0eb59a', path: '/expert-opportunities' },
                        { icon: Activity,    label: 'My Engagements', badge: '2 active',      badgeStyle: 'text-emerald-700 bg-emerald-50 border-emerald-200', border: '#0eb59a', path: '/expert-engagements'   },
                        { icon: FileText,    label: 'Contracts',      badge: '1 pending',     badgeStyle: 'text-amber-700 bg-amber-50 border-amber-200', border: '#F59E0B', path: '/expert-contracts'     },
                        { icon: DollarSign,  label: 'Earnings',       badge: '₹3.5L pending', badgeStyle: 'text-emerald-700 bg-emerald-50 border-emerald-200', border: '#0eb59a', path: '/expert-earnings' },
                        { icon: UserCircle,  label: 'Profile',        badge: '78% complete',  badgeStyle: 'text-teal-700 bg-teal-50 border-teal-200', border: '#0eb59a', path: '/expert-profile'   },
                        { icon: Settings,    label: 'Settings',       badge: 'Preferences',   badgeStyle: 'text-gray-600 bg-gray-50 border-gray-200',    border: '#9CA3AF', path: '/expert-settings'     },
                      ].map((item, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ x: 3, backgroundColor: '#FAFBF9' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => { navigate(item.path); setGridOpen(false); }}
                          className="w-full flex items-center justify-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer text-center"
                          style={{ borderLeft: `3px solid ${item.border}` }}
                        >
                          <div className="w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                            <item.icon size={13} className="text-[#134e40]" />
                          </div>
                          <span className="flex-1 text-sm font-bold text-[#1C3627] text-left">
                            {item.label}
                          </span>
                          <div className="w-px h-4 bg-gray-100 shrink-0" />
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border shrink-0 text-left ${item.badgeStyle}`}>
                            {item.badge}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bell notification */}
            <div className="relative">
              <motion.button
                animate={{ rotate: [0, -8, 8, -8, 0] }}
                transition={{ duration: 0.5, delay: 4, repeat: Infinity, repeatDelay: 10 }}
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                onClick={() => { setShowNotifications(!showNotifications); setGridOpen(false); }}
                className={`relative w-9 h-9 flex items-center justify-center rounded-xl border transition-all duration-200 cursor-pointer text-center ${
                  showNotifications
                    ? 'bg-teal-50 border-[#0eb59a]'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <Bell size={16} className={showNotifications ? 'text-[#134e40]' : 'text-gray-500'} />
                <motion.span
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white px-0.5 animate-pulse text-center"
                >
                  {notifications.filter(n => n.unread).length}
                </motion.span>
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
                      transition={{ duration: 0.3, type: 'tween' }}
                      className="fixed right-0 top-16 bottom-0 w-80 bg-white shadow-2xl border-l border-gray-100 z-50 overflow-hidden flex flex-col"
                    >
                      <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between bg-gradient-to-r from-teal-50/50 to-white">
                        <h3 className="font-black text-[#1C3627] text-sm text-left">Notifications</h3>
                        <button className="text-xs font-bold text-[#0eb59a] hover:text-[#134e40] transition-colors cursor-pointer text-center justify-center flex">
                          Mark all read
                        </button>
                      </div>
                      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                        {notifications.map((notif, idx) => (
                          <motion.div key={idx}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`px-5 py-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer flex gap-3 transition-colors ${
                              notif.unread ? 'bg-teal-50/20' : ''
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full ${notif.color} mt-1.5 shrink-0`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-[#1C3627] leading-tight text-left">
                                {notif.title}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5 leading-relaxed text-left">
                                {notif.desc}
                              </p>
                              <p className="text-[10px] text-gray-300 font-semibold mt-1 text-left">
                                {notif.time}
                              </p>
                            </div>
                            {notif.unread && (
                              <div className="w-1.5 h-1.5 rounded-full bg-[#0eb59a] mt-1.5 shrink-0" />
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-xs cursor-pointer shadow-md"
              style={{ background: 'linear-gradient(135deg, #134e40, #0eb59a)' }}
            >
              DC
            </motion.div>
          </div>
        </header>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 overflow-y-auto bg-[#f4f7f5] [&::-webkit-scrollbar]:hidden relative">

          {/* ── HERO BANNER ── */}
          <div
            className="relative overflow-hidden border-b border-teal-100/60"
            style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #e8f5f1 50%, #f8fafc 100%)' }}
          >
            <div className="absolute top-0 right-0 w-64 h-32 bg-[#0eb59a]/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-48 h-20 bg-[#134e40]/6 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                  
                  {/* Verified Badge Upgrade */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <motion.div key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + i * 0.08, type: 'spring' }}>
                          <Star size={11} fill="#FBBF24" className="text-amber-400" />
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#134e40]/8 border border-[#0eb59a]/20 rounded-full px-3 py-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0eb59a] animate-pulse" />
                      <span className="text-[10px] font-black text-[#134e40] uppercase tracking-[0.15em] text-left">
                        Verified Expert · Top 5%
                      </span>
                    </div>
                  </div>

                  <h1
                    className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    Good morning,{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#134e40] to-[#0eb59a]">
                      David.
                    </span>{' '}
                    <motion.span
                      animate={{ rotate: [0, 20, -10, 20, 0] }}
                      transition={{ duration: 1.5, delay: 1, repeat: Infinity, repeatDelay: 4 }}
                      className="inline-block"
                    >
                      👋
                    </motion.span>
                  </h1>

                  <p className="text-slate-500 text-sm mt-2 font-medium">
                    You have{' '}
                    <span className="text-amber-500 font-black">3 pending actions</span>
                    {' '}and{' '}
                    <span className="text-[#134e40] font-black">3 new role matches</span>
                    {' '}waiting for your review today.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex gap-3 shrink-0"
                >
                  <motion.button
                    whileHover={{ scale: 1.04, boxShadow: '0 8px 25px rgba(19,78,64,0.2)' }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => navigate('/expert-opportunities')}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#134e40] hover:bg-[#0eb59a] text-white text-sm font-bold rounded-xl shadow-lg transition-all whitespace-nowrap cursor-pointer text-center flex"
                  >
                    <Briefcase size={15} /> Browse Roles
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    onClick={() => navigate('/expert-profile')}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm whitespace-nowrap cursor-pointer text-center flex"
                  >
                    <UserCircle size={15} /> My Profile
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 pb-20">

            {/* ── KPI CARDS ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {kpis.map((kpi, idx) => (
                <MagneticCard
                  key={idx}
                  onClick={() => navigate(kpi.path)}
                  className={`bg-white rounded-xl p-6 border border-gray-100 border-l-4 ${kpi.border} cursor-pointer relative group transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
                >
                  <div 
                    className="absolute top-0 right-0 w-20 h-20 rounded-bl-[2rem] opacity-[0.03]"
                    style={{ background: '#0eb59a' }}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * idx }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight pr-2 text-left">{kpi.title}</span>
                      <div className={`w-8 h-8 ${kpi.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
                        <kpi.icon size={15} className={kpi.iconColor} />
                      </div>
                    </div>
                    <p className={`text-2xl sm:text-3xl font-black mb-2 tracking-tight ${kpi.numColor}`}>
                      {mounted ? <AnimatedCounter value={kpi.value} /> : kpi.value}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 w-fit px-2 py-1 rounded-lg mt-2">
                      <ArrowUpRight size={9} /> {kpi.trend}
                    </div>
                  </motion.div>
                </MagneticCard>
              ))}
            </div>

            {/* Divider Overview */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest px-2">Overview</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            </div>

            {/* ── QUICK ACTIONS ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-3 md:grid-cols-6 gap-4"
            >
              {quickActions.map((action, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ 
                    y: -4, 
                    boxShadow: '0 12px 30px rgba(19,78,64,0.08)' 
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(action.path)}
                  className="relative group flex flex-col items-center gap-2.5 p-4 sm:p-5 rounded-2xl bg-white border border-gray-100 hover:border-[#0eb59a]/30 cursor-pointer transition-all duration-200 shadow-sm"
                >
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 ${action.bg} rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm`}>
                    <action.icon size={19} className={action.iconColor} />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 group-hover:text-[#134e40] text-center leading-tight transition-colors">
                    {action.label}
                  </span>
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-[#134e40] text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-150 whitespace-nowrap pointer-events-none z-50 shadow-lg">
                    {action.label}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#134e40]" />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* ── ZONE 1 — Middle row (60/40 split) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-7">

              {/* LEFT 60% — Opportunities carousel */}
              <div className="lg:col-span-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  onMouseEnter={() => setIsCarouselHovered(true)}
                  onMouseLeave={() => setIsCarouselHovered(false)}
                  className="bg-[#FAFBF9] rounded-3xl border border-gray-100 p-6 sm:p-7 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-sm sm:text-base font-black text-gray-900 flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: [0, 15, -15, 0] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                        >
                          <Zap size={16} fill="#0eb59a" className="text-[#0eb59a]" />
                        </motion.div>
                        Matched Opportunities
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={prevOpportunity}
                        disabled={!canGoLeft}
                        className={`w-8 h-8 rounded-full border bg-white shadow-sm flex items-center justify-center flex-shrink-0 transition-all duration-200 text-center cursor-pointer ${
                          canGoLeft
                            ? 'border-gray-200 text-gray-600 hover:bg-[#0eb59a] hover:text-white hover:border-[#0eb59a] hover:shadow-md'
                            : 'border-gray-100 text-gray-300 cursor-not-allowed opacity-40'
                        }`}
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        onClick={nextOpportunity}
                        disabled={!canGoRight}
                        className={`w-8 h-8 rounded-full border bg-white shadow-sm flex items-center justify-center flex-shrink-0 transition-all duration-200 text-center cursor-pointer ${
                          canGoRight
                            ? 'border-gray-200 text-gray-600 hover:bg-[#0eb59a] hover:text-white hover:border-[#0eb59a] hover:shadow-md'
                            : 'border-gray-100 text-gray-300 cursor-not-allowed opacity-40'
                        }`}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="overflow-hidden w-full">
                    <motion.div
                      animate={{ x: `-${opportunityCarouselIndex * (100 / itemsPerView)}%` }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className="flex gap-4 w-full"
                    >
                      {recommendedOpportunities.map((opp, idx) => (
                        <motion.div
                          key={opp.id}
                          whileHover={{ y: -5 }}
                          style={{
                            minWidth: itemsPerView === 1 ? '100%'
                              : itemsPerView === 2 ? 'calc((100% - 16px) / 2)'
                              : 'calc((100% - 32px) / 3)'
                          }}
                          className="bg-[#FAFBF9] rounded-2xl border-2 border-gray-200 p-6 hover:border-[#0eb59a]/40 hover:shadow-lg transition-all duration-300 group cursor-pointer shrink-0 relative"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#134e40] to-[#0eb59a] flex items-center justify-center shadow-md shrink-0">
                              <span className="text-white font-black text-lg">{opp.logo}</span>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span 
                                style={{ background: 'linear-gradient(135deg, #134e40, #0eb59a)' }}
                                className="text-[10px] font-black text-white px-2.5 py-1 rounded-full shadow-sm"
                              >
                                {opp.match}% Match
                              </span>
                              <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-lg">
                                {opp.duration}
                              </span>
                            </div>
                          </div>

                          <h3 className="font-black text-gray-900 text-base leading-tight mb-1">
                            {opp.title}
                          </h3>
                          <p className="text-xs text-slate-500 font-bold mb-1">{opp.company}</p>
                          <p className="text-[10px] text-gray-400 font-medium mb-3">{opp.companySize}</p>

                          <div className="space-y-2 mb-5">
                            <div className="flex items-center gap-2 text-xs font-black text-[#134e40]">
                              <DollarSign size={12} className="text-[#0eb59a]" /> {opp.budget}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                              <Clock size={12} /> {opp.commitment}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                              <MapPin size={12} /> {opp.location}
                            </div>
                          </div>

                          {/* Skill Tags */}
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {opp.skills.slice(0, 2).map((skill, i) => (
                              <span key={i}
                                className="text-[9px] font-black px-2 py-0.5 rounded-lg bg-[#f0fdf4] text-[#134e40] border border-[#0eb59a]/20 text-left"
                              >
                                {skill}
                              </span>
                            ))}
                            {opp.skills.length > 2 && (
                              <span className="text-[9px] font-black px-2 py-0.5 rounded-lg bg-gray-100 text-gray-400 text-left">
                                +{opp.skills.length - 2}
                              </span>
                            )}
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(`/expert-opportunities/${opp.id}`)}
                            className="w-full py-2.5 bg-[#134e40] hover:bg-[#0eb59a] text-white text-xs font-black rounded-xl transition-all shadow-sm cursor-pointer text-center justify-center flex"
                          >
                            View Details
                          </motion.button>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>

                  {/* dot indicators + progress bar */}
                  <div className="flex flex-col items-center gap-2 mt-4">
                    <div className="flex gap-1.5">
                      {recommendedOpportunities.map((_, i) => (
                        <button key={i}
                          onClick={() => handleManualNav(i)}
                          className={`rounded-full transition-all duration-200 cursor-pointer ${
                            opportunityCarouselIndex === i
                              ? 'w-4 h-2 bg-[#0eb59a]'
                              : 'w-2 h-2 bg-gray-200 hover:bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="h-4 flex items-center justify-center">
                      {isCarouselHovered ? (
                        <span className="text-[10px] text-gray-400 font-black tracking-wider uppercase">Paused</span>
                      ) : (
                        <div className="bg-gray-100 rounded-full w-32 h-0.5 overflow-hidden">
                          <div
                            className="bg-[#0eb59a] rounded-full h-full"
                            style={{ width: `${autoPlayProgress}%`, transition: 'none' }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* RIGHT 40% — Pending Actions with more room */}
              <div className="lg:col-span-2">
                <motion.div
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  {/* Upgrade Pending Actions Header */}
                  <div className="p-4 sm:p-5 border-b border-gray-50 bg-gradient-to-b from-amber-50/40 to-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: [0, 6, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2.5 }}
                      >
                        <AlertCircle size={16} className="text-amber-500" />
                      </motion.div>
                      <h2 className="text-sm font-black text-gray-900">
                        Pending Actions
                      </h2>
                    </div>
                    <div className="flex items-center gap-1">
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                        className="bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm text-center"
                      >
                        {pendingActions.length}
                      </motion.span>
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse inline-block ml-0.5" />
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 space-y-3">
                    {pendingActions.map((action, idx) => {
                      const isUrgent = action.urgent;
                      const type = action.type;
                      let leftBorder = 'border-l-blue-400';
                      if (type === 'SIGN') leftBorder = 'border-l-red-400';
                      else if (isUrgent) leftBorder = 'border-l-amber-400';

                      return (
                        <div
                          key={idx}
                          className={`p-4 sm:p-5 rounded-2xl border border-slate-50 bg-slate-50/30 border-l-4 ${leftBorder} hover:bg-white hover:shadow-sm hover:border-[#0eb59a]/30 transition-all cursor-pointer group`}
                          onClick={() => navigate(action.path)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md text-left ${action.typeColor}`}>
                              {action.type}
                            </span>
                            <span className="text-[10px] text-slate-300 font-bold">{action.time}</span>
                          </div>
                          <h4 className="font-black text-slate-700 text-xs mb-3 group-hover:text-slate-900 leading-snug">
                            {action.title}
                          </h4>

                          {/* Fix 2: Take Action button with stopPropagation and correct navigate */}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              navigate(action.path); 
                            }}
                            className="w-full py-2 bg-white border border-gray-200 rounded-xl text-[11px] font-black text-gray-500 hover:bg-[#134e40] hover:text-white transition-colors duration-200 shadow-sm cursor-pointer text-center justify-center flex"
                          >
                            Take Action
                          </motion.button>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>

            </div>

            {/* ── ZONE 2 — Bottom row (60/40 split) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-7">

              {/* LEFT 60% — Active Engagements */}
              <div className="lg:col-span-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-7 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
                      <Activity size={16} className="text-[#0eb59a]" /> Active Engagements
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeEngagements.map((eng, idx) => (
                      <div
                        key={idx}
                        className="bg-[#FAFBF9] rounded-2xl border border-gray-200 p-6 hover:border-[#0eb59a]/30 hover:shadow-md transition-all duration-300 cursor-pointer group"
                        onClick={() => navigate(eng.path)}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className={`text-[10px] font-black px-3 py-1 rounded-full ${
                            eng.status === 'ON TRACK' ? 'text-emerald-600 bg-emerald-50' : 'text-blue-600 bg-blue-50'
                          }`}>
                            {eng.status}
                          </span>
                        </div>

                        <h4 className="font-black text-gray-900 text-sm mb-2 group-hover:text-[#134e40] transition-colors">
                          {eng.title}
                        </h4>
                        <p className="text-xs text-slate-400 font-bold mb-3">{eng.company}</p>

                        {/* Fix 4: Data Density - Milestone & Rate info */}
                        <div className="flex items-center justify-between mb-3 p-2.5 bg-[#f0fdf4] rounded-xl border border-[#0eb59a]/10">
                          <div>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider text-left">Next Milestone</p>
                            <p className="text-[10px] font-black text-[#134e40] leading-tight mt-0.5 text-left">{eng.nextMilestone}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider text-left">Rate</p>
                            <p className="text-[10px] font-black text-[#0eb59a] mt-0.5 text-left">{eng.monthlyRate}</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-slate-400 font-bold text-left">Progress</span>
                            <span className="font-black text-[#134e40] text-left">{eng.progress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${eng.progress}%` }}
                              style={{ background: 'linear-gradient(90deg, #134e40, #0eb59a)' }}
                              className="h-full rounded-full"
                            />
                          </div>
                        </div>

                        {/* Fix 4: Data Density - Due Date */}
                        <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-400 font-medium">
                          <Clock size={9} /> Due: {eng.dueDate}
                        </div>

                        <div className="flex items-center gap-2 mt-4 justify-center">
                          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={(e) => { e.stopPropagation(); navigate(eng.path); }}
                            className="flex-grow py-2 bg-[#134e40] hover:bg-[#0eb59a] text-white text-xs font-black rounded-xl transition-all cursor-pointer text-center justify-center flex"
                          >
                            Open Workspace
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={(e) => { e.stopPropagation(); navigate(`${eng.path}?tab=messages`); }}
                            className="px-3 py-2 border border-gray-200 rounded-xl hover:border-[#0eb59a] transition-all cursor-pointer flex items-center justify-center text-center"
                          >
                            <MessageSquare size={12} className="text-gray-400" />
                          </motion.button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* RIGHT 40% — Profile Strength + Earnings stacked */}
              <div className="lg:col-span-2 flex flex-col gap-6">

                {/* PROFILE STRENGTH */}
                <motion.div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
                  <h2 className="text-sm font-black text-gray-900 flex items-center gap-2 mb-6">
                    <Award size={16} className="text-[#0eb59a]" /> Profile Strength
                  </h2>

                  {/* Circular ring */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="relative w-20 h-20 shrink-0">
                      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="34" fill="none" stroke="#f0fdf4" strokeWidth="8" />
                        <motion.circle
                          cx="40" cy="40" r="34" fill="none"
                          stroke="url(#expertGradient)" strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 34}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                          animate={{
                            strokeDashoffset: 2 * Math.PI * 34 * (1 - profileStrength / 100)
                          }}
                          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                        />
                        <defs>
                          <linearGradient id="expertGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#134e40" />
                            <stop offset="100%" stopColor="#0eb59a" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-lg font-black text-[#134e40] leading-none text-left">
                          {profileStrength}%
                        </span>
                        <span className="text-[9px] text-gray-400 font-bold text-left">Strong</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-700 mb-1">Almost there!</p>
                      <p className="text-[11px] text-gray-400 leading-relaxed">Complete your profile to get more matched opportunities.</p>
                    </div>
                  </div>

                  {/* Checklist */}
                  <div className="space-y-2.5">
                    {profileTips.map((tip, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                          tip.done
                            ? 'bg-[#134e40] shadow-sm'
                            : 'bg-gray-100 border border-gray-200'
                        }`}
                        >
                          {tip.done && <Check size={11} className="text-white" />}
                        </div>
                        <span className={`text-xs font-bold transition-colors text-left ${
                          tip.done ? 'text-gray-300 line-through' : 'text-gray-600'
                        }`}>
                          {tip.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/expert-profile')}
                    className="w-full mt-5 py-2.5 bg-[#134e40] hover:bg-[#0eb59a] text-white text-xs font-black rounded-xl transition-all shadow-sm cursor-pointer text-center justify-center flex"
                  >
                    Complete Profile →
                  </motion.button>
                </motion.div>

                {/* EARNINGS WIDGET */}
                <motion.div
                  className="rounded-3xl overflow-hidden shadow-xl relative"
                >
                  <div 
                    className="h-1 w-full"
                    style={{ background: 'linear-gradient(90deg, #134e40, #0eb59a)' }}
                  />
                  <div 
                    className="p-6 text-white relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #134e40 0%, #0eb59a 100%)' }}
                  >
                    <Shield size={60} className="absolute -right-4 -bottom-4 text-white/10" />
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-2 text-left">Earnings Balance</p>
                    <p className="text-3xl font-black mb-1">₹3,50,000</p>
                    <p className="text-xs text-white/60 font-bold mb-6">Next payout: Apr 30, 2025</p>

                    {/* Escrow balance row */}
                    <div className="flex items-center justify-between mb-4 bg-white/10 rounded-xl p-3">
                      <div>
                        <p className="text-[9px] text-white/60 font-black uppercase tracking-widest text-left">In Escrow</p>
                        <p className="text-sm font-black text-white text-left">₹1,20,000</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-white/60 font-black uppercase tracking-widest text-left">Pending</p>
                        <p className="text-sm font-black text-white text-left">₹80,000</p>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate('/expert-earnings')}
                      className="w-full py-3 bg-white/20 hover:bg-white hover:text-[#134e40] text-white text-xs font-black rounded-xl transition-all backdrop-blur-sm cursor-pointer text-center justify-center flex"
                    >
                      View Earnings →
                    </button>
                  </div>
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
