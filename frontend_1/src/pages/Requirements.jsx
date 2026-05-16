import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Filter, Briefcase, Clock, Users,
  ChevronRight, ChevronLeft, MoreVertical, Copy, X,
  CheckCircle, AlertCircle, Archive, Eye, Edit,
  Trash2, ArrowUpRight, Target, DollarSign, Calendar,
  MapPin, Zap, TrendingUp, LayoutDashboard, CreditCard,
  Bell, Settings, LogOut, Activity, FileText, Star,
  ShieldCheck, Menu, BarChart2, MessageSquare, Grid,
  Heart, Check
} from 'lucide-react';

const Requirements = () => {
  const navigate = useNavigate();
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Authentication Guard
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/signin?role=company');
      }
    };
    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/signin?role=company');
      }
    });

    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate]);

  // ── ENHANCED DATA ARRAY ──
  const requirements = [
    {
      id: 1,
      title: 'Interim CFO',
      type: 'Interim',
      status: 'Active',
      functionalArea: 'Finance',
      budget: '₹2L - ₹3.5L/mo',
      duration: '6 months',
      commitment: '40 hrs/wk',
      urgency: 'Immediate',
      location: 'Remote',
      postedDate: '3 days ago',
      matchedExperts: 12,
      shortlisted: 4,
      invited: 2,
      skills: ['Financial Modeling', 'Fundraising', 'M&A', 'Investor Relations'],
      description: 'Looking for an experienced CFO to lead our Series B fundraising and build financial infrastructure.',
      statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      urgencyColor: 'text-red-600 bg-red-50',
      matchBreakdown: { applied: 24, reviewed: 16, shortlisted: 4, interviewed: 2 },
      recentApplicants: [
        { initials: 'RK', name: 'Rajesh Kumar', role: 'Ex-CFO, Infosys', match: 96, color: 'bg-teal-500' },
        { initials: 'AD', name: 'Anita Desai', role: 'CFO, D2C Brand', match: 91, color: 'bg-purple-500' },
        { initials: 'VM', name: 'Vikram Menon', role: 'Board Advisor', match: 87, color: 'bg-blue-500' },
        { initials: 'PM', name: 'Priya Mathur', role: 'Interim CFO', match: 84, color: 'bg-rose-500' },
      ],
      timeline: [
        { label: 'Posted', date: '12 May 2026', done: true },
        { label: 'Matching', date: '13 May 2026', done: true },
        { label: 'Shortlisting', date: '15 May 2026', done: true },
        { label: 'Interview', date: 'Pending', done: false },
        { label: 'Placed', date: 'Pending', done: false },
      ],
    },
    {
      id: 2,
      title: 'Fractional CMO',
      type: 'Fractional',
      status: 'Shortlisting',
      functionalArea: 'Growth',
      budget: '₹1.2L - ₹2L/mo',
      duration: '3 months',
      commitment: '20 hrs/wk',
      urgency: 'Planned',
      location: 'Hybrid | Mumbai',
      postedDate: '1 week ago',
      matchedExperts: 8,
      shortlisted: 6,
      invited: 3,
      skills: ['Brand Strategy', 'Growth Marketing', 'B2B Marketing', 'Product Marketing'],
      description: 'Need a senior marketing leader to define our GTM strategy and build the marketing function.',
      statusColor: 'text-blue-600 bg-blue-50 border-blue-200',
      urgencyColor: 'text-amber-600 bg-amber-50',
      matchBreakdown: { applied: 18, reviewed: 12, shortlisted: 6, interviewed: 3 },
      recentApplicants: [
        { initials: 'SJ', name: 'Sarah Jenkins', role: 'Ex-CMO, TechCorp', match: 94, color: 'bg-pink-500' },
        { initials: 'NP', name: 'Neha Patel', role: 'CMO, SaaS Brand', match: 89, color: 'bg-orange-500' },
        { initials: 'AR', name: 'Arjun Rao', role: 'Growth Lead', match: 83, color: 'bg-indigo-500' },
      ],
      timeline: [
        { label: 'Posted', date: '9 May 2026', done: true },
        { label: 'Matching', date: '10 May 2026', done: true },
        { label: 'Shortlisting', date: '14 May 2026', done: true },
        { label: 'Interview', date: 'Pending', done: false },
        { label: 'Placed', date: 'Pending', done: false },
      ],
    },
    {
      id: 3,
      title: 'VP Engineering',
      type: 'Fractional',
      status: 'Draft',
      functionalArea: 'Technology',
      budget: '₹1.5L - ₹2.5L/mo',
      duration: '4 months',
      commitment: '15 hrs/wk',
      urgency: 'Planned',
      location: 'Remote',
      postedDate: '2 weeks ago',
      matchedExperts: 0,
      shortlisted: 0,
      invited: 0,
      skills: ['Engineering Leadership', 'System Architecture', 'Team Scaling'],
      description: 'Draft requirement for a VP Engineering to help scale our tech team and architecture.',
      statusColor: 'text-gray-500 bg-gray-50 border-gray-200',
      urgencyColor: 'text-gray-500 bg-gray-50',
      matchBreakdown: { applied: 0, reviewed: 0, shortlisted: 0, interviewed: 0 },
      recentApplicants: [],
      timeline: [
        { label: 'Posted', date: 'Pending', done: false },
        { label: 'Matching', date: 'Pending', done: false },
        { label: 'Shortlisting', date: 'Pending', done: false },
        { label: 'Interview', date: 'Pending', done: false },
        { label: 'Placed', date: 'Pending', done: false },
      ],
    },
    {
      id: 4,
      title: 'Advisory Board Member — Sales',
      type: 'Advisory',
      status: 'Active',
      functionalArea: 'Sales',
      budget: '₹40K - ₹80K/mo',
      duration: '12 months',
      commitment: '8 hrs/wk',
      urgency: 'Planned',
      location: 'Remote',
      postedDate: '2 weeks ago',
      matchedExperts: 15,
      shortlisted: 2,
      invited: 1,
      skills: ['Enterprise Sales', 'B2B SaaS', 'Revenue Strategy'],
      description: 'Seeking an experienced sales leader to advise on enterprise sales strategy and key account acquisition.',
      statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      urgencyColor: 'text-amber-600 bg-amber-50',
      matchBreakdown: { applied: 20, reviewed: 10, shortlisted: 2, interviewed: 1 },
      recentApplicants: [
        { initials: 'DC', name: 'David Chen', role: 'VP Sales, B2B SaaS', match: 93, color: 'bg-blue-500' },
        { initials: 'MS', name: 'Meera Shah', role: 'Revenue Advisor', match: 88, color: 'bg-green-500' },
      ],
      timeline: [
        { label: 'Posted', date: '2 May 2026', done: true },
        { label: 'Matching', date: '3 May 2026', done: true },
        { label: 'Shortlisting', date: 'Pending', done: false },
        { label: 'Interview', date: 'Pending', done: false },
        { label: 'Placed', date: 'Pending', done: false },
      ],
    },
    {
      id: 5,
      title: 'Interim COO',
      type: 'Interim',
      status: 'Closed',
      functionalArea: 'Operations',
      budget: '₹2.5L - ₹4L/mo',
      duration: '3 months',
      commitment: '40 hrs/wk',
      urgency: 'Immediate',
      location: 'In Office | Bangalore',
      postedDate: '2 months ago',
      matchedExperts: 20,
      shortlisted: 8,
      invited: 5,
      skills: ['Operations', 'Supply Chain', 'Process Optimization', 'OKRs'],
      description: 'Closed role — successfully placed Interim COO for 3-month engagement.',
      statusColor: 'text-gray-400 bg-gray-50 border-gray-200',
      urgencyColor: 'text-gray-400 bg-gray-50',
      matchBreakdown: { applied: 28, reviewed: 20, shortlisted: 8, interviewed: 5 },
      recentApplicants: [
        { initials: 'VN', name: 'Vikram Nair', role: 'COO, Logistics', match: 97, color: 'bg-teal-600' },
        { initials: 'KM', name: 'Kavita Mehta', role: 'Ops Director', match: 92, color: 'bg-indigo-500' },
      ],
      timeline: [
        { label: 'Posted', date: '1 Mar 2026', done: true },
        { label: 'Matching', date: '3 Mar 2026', done: true },
        { label: 'Shortlisting', date: '10 Mar 2026', done: true },
        { label: 'Interview', date: '20 Mar 2026', done: true },
        { label: 'Placed', date: '1 Apr 2026', done: true },
      ],
    },
  ];

  // ── HELPERS ──
  const filters = ['All', 'Active', 'Draft', 'Shortlisting', 'Closed'];

  const filteredRequirements = requirements.filter(req => {
    const matchesFilter = activeFilter === 'All' || req.status === activeFilter;
    const matchesSearch =
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.functionalArea.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: requirements.length,
    active: requirements.filter(r => r.status === 'Active').length,
    draft: requirements.filter(r => r.status === 'Draft').length,
    shortlisting: requirements.filter(r => r.status === 'Shortlisting').length,
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Interim': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'Fractional': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Advisory': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusBarColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-[#0eb59a]';
      case 'Shortlisting': return 'bg-blue-400';
      case 'Draft': return 'bg-amber-400';
      case 'Closed': return 'bg-gray-300';
      default: return 'bg-gray-200';
    }
  };

  const COLORS = {
    canvas: '#F4F7F5',        // page bg
    cardWarm: '#FAFBF9',      // stat cards + skill tags bg
    charcoal: '#1C3627',      // primary text, numbers
    accent: '#0eb59a',        // teal accent
    primary: '#134e40',       // dark forest green
    activeBar: '#0eb59a',     // Active status bar
    shortlistBar: '#F59E0B',  // Shortlisting bar — amber
    draftBar: '#94A3B8',      // Draft bar — slate
    closedBar: '#CBD5E1',     // Closed bar — light slate
  };

  const getCardStyle = (status) => {
    switch(status) {
      case 'Active':
        return {
          bg: 'bg-white',
          shadow: 'shadow-[0_8px_30px_rgba(0,0,0,0.06)]',
          border: 'border-gray-100',
          bar: 'bg-[#0eb59a]',
          barWidth: 'w-1.5',
        };
      case 'Shortlisting':
        return {
          bg: 'bg-white',
          shadow: 'shadow-[0_8px_30px_rgba(0,0,0,0.05)]',
          border: 'border-amber-100',
          bar: 'bg-amber-400',
          barWidth: 'w-1.5',
        };
      case 'Draft':
        return {
          bg: 'bg-[#FAFBF9]',
          shadow: 'shadow-none',
          border: 'border-gray-100',
          bar: 'bg-slate-300',
          barWidth: 'w-1',
        };
      case 'Closed':
        return {
          bg: 'bg-[#FAFBF9]',
          shadow: 'shadow-none',
          border: 'border-gray-100',
          bar: 'bg-slate-200',
          barWidth: 'w-1',
        };
      default:
        return {
          bg: 'bg-white',
          shadow: 'shadow-sm',
          border: 'border-gray-100',
          bar: 'bg-gray-200',
          barWidth: 'w-1',
        };
    }
  };

  const getTypeBadge = (type) => {
    switch(type) {
      case 'Interim':
        return 'bg-purple-50 text-purple-700 border border-purple-200 ring-0';
      case 'Fractional':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'Advisory':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'Project':
        return 'bg-teal-50 text-teal-700 border border-teal-200';
      default:
        return 'bg-gray-50 text-gray-600 border border-gray-200';
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'Shortlisting':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'Draft':
        return 'bg-slate-50 text-slate-500 border border-slate-200';
      case 'Closed':
        return 'bg-gray-50 text-gray-400 border border-gray-200';
      default:
        return 'bg-gray-50 text-gray-500 border border-gray-200';
    }
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/company-dashboard' },
    { icon: FileText, label: 'My Requirements', path: '/requirements', active: true },
    { icon: Users, label: 'Experts', path: '/experts' },
    { icon: CreditCard, label: 'Payments', path: '/payments' },
    { icon: BarChart2, label: 'Analytics', path: '/analytics' },
    { icon: ShieldCheck, label: 'PMO Services', path: '/pmo' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-[#f4f7f5] flex overflow-hidden">

      {/* ── SIDEBAR ── */}
      <motion.aside
        animate={{ width: isSidebarOpen ? 260 : 68 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white border-r border-gray-100 flex flex-col z-50 overflow-hidden shrink-0 shadow-sm fixed left-0 top-0 h-screen"
        style={{ zIndex: 50 }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-50">
          <div className="w-9 h-9 bg-[#134e40] rounded-xl flex items-center justify-center shrink-0">
            <span className="text-white font-black text-sm">C</span>
          </div>
          <motion.div
            animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden whitespace-nowrap"
          >
            <p className="text-[#134e40] font-black text-sm leading-none">CXO Connect</p>
            <p className="text-gray-400 text-[10px] mt-0.5">Company Portal</p>
          </motion.div>
          <motion.button
            animate={{ marginLeft: isSidebarOpen ? 'auto' : 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#134e40] hover:bg-gray-100 transition-all shrink-0"
          >
            {isSidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </motion.button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-hidden">
          {isSidebarOpen && (
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-3">Main Menu</p>
          )}
          {navItems.map((item) => (
            <motion.button
              key={item.path}
              whileHover={{ x: 2 }}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative ${
                item.active
                  ? 'bg-[#134e40] text-white shadow-md'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-[#134e40]'
              }`}
            >
              {item.active && (
                <motion.div
                  layoutId="activeNavBar"
                  className="absolute left-0 top-1 bottom-1 w-0.5 bg-[#0eb59a] rounded-r-full"
                />
              )}
              <item.icon size={17} className="shrink-0" />
              <motion.span
                animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap text-sm font-bold"
              >
                {item.label}
              </motion.span>
              {item.label === 'My Requirements' && isSidebarOpen && (
                <span className="ml-auto bg-[#0eb59a] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                  {stats.active}
                </span>
              )}
            </motion.button>
          ))}
        </nav>
        <div className="flex-1" /> {/* spacer to push nav to top */}

      </motion.aside>

      {/* ── MAIN CONTENT AREA ── */}
      <div
        className="flex-1 flex flex-col min-h-screen overflow-hidden"
        style={{ marginLeft: isSidebarOpen ? 260 : 68, transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)' }}
      >

        {/* ── TOP HEADER ── */}
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4 shrink-0 shadow-sm">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search requirements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#0eb59a] focus:ring-2 focus:ring-[#0eb59a]/15 transition-all"
            />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/requirements/create')}
              className="flex items-center gap-2 px-4 py-2 bg-[#134e40] text-white text-sm font-bold rounded-xl shadow-md shadow-[#134e40]/20 hover:bg-[#1a6b57] transition-all"
            >
              <Plus size={15} /> New Requirement
            </motion.button>

            <div className="relative">
              <button className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 hover:text-[#134e40] hover:bg-gray-100 transition-all">
                <Bell size={17} />
              </button>
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">3</span>
            </div>

            <button className="w-9 h-9 bg-[#134e40] rounded-xl flex items-center justify-center text-white text-xs font-black hover:ring-2 hover:ring-[#0eb59a] hover:ring-offset-2 transition-all">
              AC
            </button>
          </div>
        </header>

        {/* ── CONTENT BODY ── */}
        <div className="flex-1 flex overflow-hidden">

          {/* ── LEFT MASTER LIST ── */}
          <motion.div
            animate={{ width: selectedRequirement ? '62%' : '100%' }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col overflow-y-auto h-full"
          >

            {/* Page Header */}
            <div className="px-8 pt-7 pb-5">
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                <button
                  onClick={() => navigate('/company-dashboard')}
                  className="hover:text-[#134e40] font-semibold transition-colors duration-150"
                >
                  Dashboard
                </button>
                <ChevronRight size={12} className="text-gray-300" />
                <span className="text-[#134e40] font-bold">My Requirements</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <h1 className="text-[28px] font-black text-[#1C3627] tracking-tight leading-none">
                    My Requirements
                  </h1>
                  <p className="text-sm text-gray-400 mt-1.5 font-medium">
                    {requirements.length} roles · {stats.active} active · {stats.draft} draft
                  </p>
                </div>
              </div>
            </div>

            {/* ── STATS CARDS ── */}
            <div className="px-8 pb-6 grid grid-cols-4 gap-3">
              {[
                {
                  label: 'Total Posted',
                  value: stats.total,
                  icon: Briefcase,
                  iconBg: 'bg-gray-100',
                  iconColor: 'text-gray-500',
                  numColor: 'text-[#1C3627]',
                  border: 'border-l-4 border-l-gray-300',
                  trend: 'All time',
                  trendColor: 'text-gray-400',
                },
                {
                  label: 'Active Roles',
                  value: stats.active,
                  icon: Zap,
                  iconBg: 'bg-teal-100',
                  iconColor: 'text-[#0eb59a]',
                  numColor: 'text-[#134e40]',
                  border: 'border-l-4 border-l-[#0eb59a]',
                  trend: 'Live now',
                  trendColor: 'text-[#0eb59a]',
                },
                {
                  label: 'Shortlisting',
                  value: stats.shortlisting,
                  icon: Users,
                  iconBg: 'bg-amber-100',
                  iconColor: 'text-amber-600',
                  numColor: 'text-amber-700',
                  border: 'border-l-4 border-l-amber-400',
                  trend: 'In progress',
                  trendColor: 'text-amber-500',
                },
                {
                  label: 'Drafts',
                  value: stats.draft,
                  icon: Edit,
                  iconBg: 'bg-slate-100',
                  iconColor: 'text-slate-500',
                  numColor: 'text-slate-600',
                  border: 'border-l-4 border-l-slate-300',
                  trend: 'Incomplete',
                  trendColor: 'text-slate-400',
                },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  style={{ backgroundColor: '#FAFBF9' }}
                  className={`rounded-2xl p-5 border border-gray-100 ${stat.border} hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-200 cursor-default`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-8 h-8 ${stat.iconBg} rounded-xl flex items-center justify-center`}>
                      <stat.icon size={15} className={stat.iconColor} />
                    </div>
                    <span className={`text-[10px] font-bold ${stat.trendColor} bg-white px-2 py-1 rounded-lg border border-gray-100`}>
                      {stat.trend}
                    </span>
                  </div>
                  <p className={`text-4xl font-black ${stat.numColor} tracking-tight leading-none mb-1`}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-400 font-semibold">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* ── FILTER ROW ── */}
            <div className="px-8 pb-5 flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-[#FAFBF9] border border-gray-100 rounded-xl p-1">
                {filters.map(f => (
                  <motion.button
                    key={f}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setActiveFilter(f)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
                      activeFilter === f
                        ? 'bg-[#134e40] text-white shadow-sm'
                        : 'text-gray-500 hover:text-[#134e40] hover:bg-white'
                    }`}
                  >
                    {f}
                    {f !== 'All' && requirements.filter(r => r.status === f).length > 0 && (
                      <span className={`ml-1.5 text-[9px] font-black px-1 py-0.5 rounded ${
                        activeFilter === f ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {requirements.filter(r => r.status === f).length}
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Live count */}
              <span className="ml-auto text-xs text-gray-400 font-medium">
                {filteredRequirements.length} result{filteredRequirements.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* ── REQUIREMENTS LIST ── */}
            <div className="px-8 pb-12 space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredRequirements.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-[#FAFBF9] rounded-2xl border border-gray-100 p-16 text-center"
                  >
                    <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <Search size={20} className="text-gray-300" />
                    </div>
                    <h3 className="font-black text-[#1C3627] text-base mb-1">No requirements found</h3>
                    <p className="text-gray-400 text-sm mb-5 font-medium">
                      {searchQuery ? `No results for "${searchQuery}"` : `No ${activeFilter.toLowerCase()} requirements yet`}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate('/requirements/create')}
                      className="px-5 py-2.5 bg-[#134e40] text-white text-sm font-bold rounded-xl shadow-md shadow-[#134e40]/20"
                    >
                      + Post a Requirement
                    </motion.button>
                  </motion.div>
                ) : (
                  filteredRequirements.map((req, idx) => {
                    const isSelected = selectedRequirement?.id === req.id;
                    const cardStyle = getCardStyle(req.status);
                    const isDimmed = req.status === 'Draft' || req.status === 'Closed';

                    return (
                      <motion.div
                        key={req.id}
                        layout
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ delay: idx * 0.05, duration: 0.28 }}
                        whileHover={{ y: -3, transition: { duration: 0.2 } }}
                        whileTap={{ scale: 0.995 }}
                        onClick={() => req.status !== 'Draft' && setSelectedRequirement(isSelected ? null : req)}
                        className={`
                          relative rounded-2xl border overflow-hidden cursor-pointer
                          transition-all duration-200
                          ${cardStyle.bg} ${cardStyle.shadow} ${cardStyle.border}
                          ${isSelected ? 'ring-2 ring-[#0eb59a]/30 border-[#0eb59a]/40 shadow-[0_8px_40px_rgba(14,181,154,0.10)]' : ''}
                          ${isDimmed ? 'opacity-75' : ''}
                        `}
                      >
                        {/* Status accent bar — thick, left edge */}
                        <div className={`absolute left-0 top-0 bottom-0 ${cardStyle.barWidth} ${cardStyle.bar} rounded-l-2xl`} />

                        {/* Card content */}
                        <div className="pl-6 pr-5 py-5">
                          <div className="flex items-start gap-5">

                            {/* ── LEFT — Main Info ── */}
                            <div className="flex-1 min-w-0">

                              {/* Badge row — tight, above title */}
                              <div className="flex items-center gap-2 mb-2.5 flex-wrap pl-2">
                                <span className={`text-[9px] font-black uppercase tracking-[0.12em] px-2.5 py-1 rounded-lg ${getTypeBadge(req.type)}`}>
                                  {req.type}
                                </span>
                                <span className={`text-[9px] font-black uppercase tracking-[0.12em] px-2.5 py-1 rounded-lg flex items-center gap-1.5 ${getStatusBadge(req.status)}`}>
                                  {req.status === 'Active' && (
                                    <motion.span
                                      animate={{ opacity: [1, 0.4, 1] }}
                                      transition={{ duration: 1.8, repeat: Infinity }}
                                      className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"
                                    />
                                  )}
                                  {req.status}
                                </span>
                                {req.urgency === 'Immediate' && (
                                  <span className="text-[9px] font-black uppercase tracking-[0.1em] px-2.5 py-1 rounded-lg bg-red-50 text-red-500 border border-red-100 flex items-center gap-1">
                                    <Zap size={8} fill="currentColor" />
                                    Immediate
                                  </span>
                                )}
                              </div>

                              {/* Role title — dominant, left-heavy */}
                              <h3 className={`text-[17px] font-black tracking-tight leading-snug mb-1.5 text-left transition-colors duration-150
                                ${isSelected ? 'text-[#0eb59a]' : 'text-[#1C3627]'}
                                ${isDimmed ? 'text-gray-500' : ''}
                              `}>
                                {req.title}
                              </h3>

                              {/* Description — single line, muted */}
                              <p className="text-[13px] text-gray-400 font-medium leading-relaxed mb-3.5 line-clamp-1 text-left">
                                {req.description}
                              </p>

                              {/* Meta row — icons + values, single line */}
                              <div className="flex items-center gap-5 mb-4 pl-2 justify-start">
                                <span className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-700">
                                  <DollarSign size={13} className="text-[#0eb59a] shrink-0" />
                                  {req.budget}
                                </span>
                                <span className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-500">
                                  <Clock size={13} className="text-blue-400 shrink-0" />
                                  {req.duration}
                                </span>
                                <span className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-500">
                                  <Target size={13} className="text-purple-400 shrink-0" />
                                  {req.commitment}
                                </span>
                                <span className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-500">
                                  <MapPin size={13} className="text-rose-400 shrink-0" />
                                  {req.location}
                                </span>
                                <span className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400 ml-auto">
                                  <Calendar size={11} className="text-gray-300 shrink-0" />
                                  {req.postedDate}
                                </span>
                              </div>

                              {/* Skill tags — high contrast, cream bg */}
                              <div className="flex flex-wrap gap-1.5 pl-2">
                                {req.skills.map((skill, si) => (
                                  <span
                                    key={si}
                                    className="text-[11px] font-semibold bg-[#FAFBF9] text-[#1C3627] border border-gray-200 px-2.5 py-1 rounded-lg"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>

                            </div>

                            {/* ── RIGHT — Metrics + CTA ── */}
                            <div className="flex flex-col items-end gap-4 shrink-0 self-stretch justify-between">

                              {/* Match metrics — top right */}
                              {req.status !== 'Draft' && (
                                <div className="flex flex-col gap-1.5">
                                  {[
                                    { val: req.matchedExperts, label: 'Matched', dot: 'bg-[#0eb59a]' },
                                    { val: req.shortlisted, label: 'Shortlisted', dot: 'bg-blue-400' },
                                    { val: req.invited, label: 'Invited', dot: 'bg-purple-400' },
                                  ].map((m, mi) => (
                                    <div key={mi} className="flex items-center justify-end gap-2">
                                      <span className="text-[11px] text-gray-400 font-medium">{m.label}</span>
                                      <div className="flex items-center gap-1.5 bg-[#FAFBF9] border border-gray-100 px-2.5 py-1 rounded-lg min-w-[44px] justify-center">
                                        <div className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
                                        <span className="text-[12px] font-black text-[#1C3627]">{m.val}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* CTA — bottom right */}
                              <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  req.status === 'Draft'
                                    ? navigate(`/requirements/create?draft=${req.id}`)
                                    : setSelectedRequirement(isSelected ? null : req);
                                }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold transition-all duration-150 shadow-sm
                                  ${req.status === 'Draft'
                                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                                    : req.status === 'Closed'
                                    ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-default'
                                    : 'bg-[#134e40] text-white hover:bg-[#0eb59a] shadow-[#134e40]/20'
                                  }
                                `}
                              >
                                {req.status === 'Draft'
                                  ? <><Edit size={12} /> Continue Draft</>
                                  : <><Eye size={12} /> View Details</>
                                }
                              </motion.button>

                            </div>
                          </div>

                          {/* Shortlisting progress — bottom of card */}
                          {req.status === 'Shortlisting' && (
                            <div className="mt-4 pt-4 border-t border-gray-50">
                              <div className="flex justify-between items-center mb-1.5">
                                <span className="text-[11px] font-semibold text-gray-400">Shortlisting Progress</span>
                                <span className="text-[11px] font-black text-amber-600">
                                  {Math.round((req.shortlisted / req.matchedExperts) * 100)}%
                                </span>
                              </div>
                              <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(req.shortlisted / req.matchedExperts) * 100}%` }}
                                  transition={{ duration: 1.2, delay: 0.2 + idx * 0.1, ease: 'easeOut' }}
                                  className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full"
                                />
                              </div>
                            </div>
                          )}

                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>

          </motion.div>

          {/* ── RIGHT SLIDE-OVER DRAWER ── */}
          <AnimatePresence>
            {selectedRequirement && (
              <motion.div
                key="drawer"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '38%', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                className="bg-white border-l border-gray-100 shadow-2xl flex flex-col overflow-hidden shrink-0 h-full"
              >
                <div className="flex flex-col h-full overflow-y-auto">

                  {/* Drawer Header */}
                  <div className="sticky top-0 bg-white border-b border-gray-50 px-6 py-4 flex items-start justify-between z-10 shrink-0">
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg ${getTypeBadge(selectedRequirement.type)}`}>
                          {selectedRequirement.type}
                        </span>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg ${getStatusBadge(selectedRequirement.status)}`}>
                          {selectedRequirement.status}
                        </span>
                      </div>
                      <h2 className="text-base font-black text-[#1C3627] tracking-tight leading-tight">
                        {selectedRequirement.title}
                      </h2>
                      <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                        Posted {selectedRequirement.postedDate}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.15 }}
                      onClick={() => setSelectedRequirement(null)}
                      className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all shrink-0"
                    >
                      <X size={14} />
                    </motion.button>
                  </div>

                  {/* Drawer Body */}
                  <div className="flex-1 px-6 py-5 space-y-6">

                    {/* Description */}
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">About This Role</p>
                      <p className="text-sm text-gray-600 leading-relaxed font-medium">
                        {selectedRequirement.description}
                      </p>
                    </div>

                    {/* Meta grid */}
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Budget', value: selectedRequirement.budget, icon: DollarSign, iconColor: 'text-[#0eb59a]', bg: 'bg-teal-50' },
                        { label: 'Duration', value: selectedRequirement.duration, icon: Calendar, iconColor: 'text-blue-500', bg: 'bg-blue-50' },
                        { label: 'Commitment', value: selectedRequirement.commitment, icon: Clock, iconColor: 'text-purple-500', bg: 'bg-purple-50' },
                        { label: 'Location', value: selectedRequirement.location, icon: MapPin, iconColor: 'text-rose-500', bg: 'bg-rose-50' },
                      ].map((m, mi) => (
                        <div key={mi} className="bg-[#FAFBF9] rounded-xl p-3 border border-gray-100">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <div className={`w-5 h-5 ${m.bg} rounded-md flex items-center justify-center`}>
                              <m.icon size={10} className={m.iconColor} />
                            </div>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">{m.label}</span>
                          </div>
                          <p className="text-xs font-black text-[#1C3627]">{m.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Match Funnel */}
                    {selectedRequirement.status !== 'Draft' && selectedRequirement.matchBreakdown && (
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Match Funnel</p>
                        <div className="space-y-2.5">
                          {[
                            { label: 'Applied', value: selectedRequirement.matchBreakdown.applied, color: 'bg-gray-200' },
                            { label: 'Reviewed', value: selectedRequirement.matchBreakdown.reviewed, color: 'bg-blue-300' },
                            { label: 'Shortlisted', value: selectedRequirement.matchBreakdown.shortlisted, color: 'bg-[#0eb59a]' },
                            { label: 'Interviewed', value: selectedRequirement.matchBreakdown.interviewed, color: 'bg-[#134e40]' },
                          ].map((bar, bi) => (
                            <div key={bi}>
                              <div className="flex justify-between text-[10px] font-semibold text-gray-500 mb-1">
                                <span>{bar.label}</span>
                                <span className="font-black text-[#1C3627]">{bar.value}</span>
                              </div>
                              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.max((bar.value / (selectedRequirement.matchBreakdown.applied || 1)) * 100, bar.value > 0 ? 5 : 0)}%` }}
                                  transition={{ duration: 0.7, delay: bi * 0.1, ease: 'easeOut' }}
                                  className={`h-full rounded-full ${bar.color}`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Top Matched Experts */}
                    {selectedRequirement.recentApplicants?.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Top Matched Experts</p>
                        <div className="space-y-2">
                          {selectedRequirement.recentApplicants.map((applicant, ai) => (
                            <motion.div
                              key={ai}
                              initial={{ opacity: 0, x: 12 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: ai * 0.07 }}
                              whileHover={{ x: 2, transition: { duration: 0.15 } }}
                              className="flex items-center gap-3 p-3 bg-[#FAFBF9] rounded-xl border border-gray-100 hover:border-[#0eb59a]/20 hover:bg-teal-50/20 transition-all cursor-pointer"
                            >
                              <div className={`w-8 h-8 ${applicant.color} rounded-full flex items-center justify-center text-white text-[10px] font-black shrink-0`}>
                                {applicant.initials}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-[#1C3627] leading-none mb-0.5">{applicant.name}</p>
                                <p className="text-[10px] text-gray-400 font-medium truncate">{applicant.role}</p>
                              </div>
                              <div className="bg-[#134e40] px-2 py-1 rounded-lg shrink-0">
                                <span className="text-[10px] font-black text-white">{applicant.match}%</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Timeline */}
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Engagement Timeline</p>
                      <div>
                        {selectedRequirement.timeline.map((t, ti) => (
                          <div key={ti} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className={`w-2.5 h-2.5 rounded-full border-2 shrink-0 mt-1 transition-colors ${
                                t.done ? 'bg-[#0eb59a] border-[#0eb59a]' : 'bg-white border-gray-300'
                              }`} />
                              {ti < selectedRequirement.timeline.length - 1 && (
                                <div className={`w-0.5 flex-1 my-1 ${t.done ? 'bg-[#0eb59a]' : 'bg-gray-200'}`} style={{ minHeight: 16 }} />
                              )}
                            </div>
                            <div className="pb-3">
                              <p className={`text-xs font-bold ${t.done ? 'text-[#1C3627]' : 'text-gray-400'}`}>{t.label}</p>
                              <p className="text-[10px] text-gray-400 font-medium">{t.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Required Skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedRequirement.skills.map((skill, si) => (
                          <span key={si} className="text-[11px] font-semibold bg-[#FAFBF9] text-[#1C3627] border border-gray-200 px-2.5 py-1 rounded-lg">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Drawer Footer */}
                  <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3 shrink-0">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/requirements/${selectedRequirement.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#134e40] text-white text-xs font-bold rounded-xl hover:bg-[#1a6b57] transition-all shadow-md shadow-[#134e40]/20"
                    >
                      <Users size={13} /> Review Matches
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/requirements/create?edit=${selectedRequirement.id}`)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FAFBF9] border border-gray-200 text-gray-600 text-xs font-bold rounded-xl hover:border-[#0eb59a]/40 hover:text-[#134e40] transition-all"
                    >
                      <Edit size={13} /> Edit Scope
                    </motion.button>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── DELETE MODAL ── */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-md p-0 sm:p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 max-w-sm w-full"
            >
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h3 className="text-xl font-black text-gray-900 text-center mb-2">Delete Requirement?</h3>
              <p className="text-sm text-gray-400 text-center mb-6 leading-relaxed">
                This will permanently delete this requirement and all associated data. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-bold rounded-2xl hover:bg-gray-100 transition-all"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-2xl transition-all shadow-lg"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {activeDropdown && (
        <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
      )}
    </div>
  );
};

export default Requirements;
