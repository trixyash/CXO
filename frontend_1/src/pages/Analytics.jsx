import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, BarChart2, TrendingUp, Users, Briefcase,
  CreditCard, FileText, CheckCircle, Clock, AlertCircle,
  ArrowUpRight, ArrowDownRight, Bell, Settings, ShieldCheck,
  ChevronLeft, LayoutDashboard, Calendar, Target, Zap,
  Star, Lock, Unlock, DollarSign, Activity, Filter,
  Download, RefreshCw, Eye, Award, Layers
} from 'lucide-react';

// ── MINI BAR CHART ──
const MiniBar = ({ value, max, color = '#0eb59a', delay = 0 }) => {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay, ease: 'easeOut' }}
          style={{ backgroundColor: color, height: '100%', borderRadius: '999px' }}
        />
      </div>
      <span className="text-[10px] font-black text-gray-500 w-6 text-right">{pct}%</span>
    </div>
  );
};

// ── DONUT CHART (SVG) ──
const DonutChart = ({ segments, size = 80, strokeWidth = 10 }) => {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const center = size / 2;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={center} cy={center} r={r} fill="none" stroke="#F3F4F6" strokeWidth={strokeWidth} />
      {segments.map((seg, i) => {
        const dash = (seg.value / 100) * circ;
        const gap = circ - dash;
        const el = (
          <motion.circle
            key={i}
            cx={center} cy={center} r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset * circ / 100}
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${circ}` }}
            animate={{ strokeDasharray: `${dash} ${gap}` }}
            transition={{ duration: 1, delay: i * 0.2, ease: 'easeOut' }}
          />
        );
        offset += seg.value;
        return el;
      })}
    </svg>
  );
};

// ── SPARKLINE (SVG) ──
const Sparkline = ({ data, color = '#0eb59a', width = 80, height = 32 }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={width} height={height} className="overflow-visible">
      <motion.polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
    </svg>
  );
};

const Analytics = () => {
  const navigate = useNavigate();

  // ── Auth Guard ──
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) navigate('/signin?role=company');
    };
    checkAuth();
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) navigate('/signin?role=company');
    });
    return () => authListener?.subscription?.unsubscribe();
  }, [navigate]);

  const [activeTab, setActiveTab] = useState('Overview');
  const [activePeriod, setActivePeriod] = useState('3M');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  const tabs = ['Overview', 'Engagements', 'Experts', 'Payments', 'Requirements'];
  const periods = ['1M', '3M', '6M', '1Y'];

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/company-dashboard' },
    { icon: FileText, label: 'My Requirements', path: '/requirements' },
    { icon: Users, label: 'Experts', path: '/experts' },
    { icon: CreditCard, label: 'Payments', path: '/payments' },
    { icon: BarChart2, label: 'Analytics', path: '/analytics', active: true },
    { icon: ShieldCheck, label: 'PMO Services', path: '/pmo' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const notifications = [
    { id: 1, title: 'Analytics Report Ready', desc: 'Your Q1 2025 engagement report is available', time: '10 min ago', unread: true, color: 'bg-teal-500' },
    { id: 2, title: 'Spend Alert', desc: 'Monthly spend is 80% of your budget', time: '2 hours ago', unread: true, color: 'bg-amber-500' },
    { id: 3, title: 'Expert Match Rate Up', desc: 'Your match rate improved by 12% this month', time: '1 day ago', unread: false, color: 'bg-blue-505 font-bold' },
  ];
  const unreadCount = notifications.filter(n => n.unread).length;

  // ── MOCK DATA ──
  const kpis = [
    { label: 'Active Engagements', value: '2', sub: '↑ 1 from last month', icon: Briefcase, iconBg: 'bg-teal-50', iconColor: 'text-[#0eb59a]', numColor: 'text-[#134e40]', border: 'border-l-[#0eb59a]', trend: 'up', spark: [1, 1, 2, 2, 2] },
    { label: 'Experts Hired', value: '5', sub: '↑ 2 this quarter', icon: Users, iconBg: 'bg-blue-50', iconColor: 'text-blue-500', numColor: 'text-blue-700', border: 'border-l-blue-400', trend: 'up', spark: [2, 3, 3, 4, 5] },
    { label: 'Total Spent', value: '₹11.5L', sub: '₹27L committed', icon: DollarSign, iconBg: 'bg-purple-50', iconColor: 'text-purple-500', numColor: 'text-purple-700', border: 'border-l-purple-400', trend: 'up', spark: [2, 4, 6, 9, 11.5] },
    { label: 'Milestones Cleared', value: '4/8', sub: '50% completion rate', icon: CheckCircle, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500', numColor: 'text-emerald-700', border: 'border-l-emerald-400', trend: 'up', spark: [1, 1, 2, 3, 4] },
    { label: 'Avg Expert Rating', value: '4.9', sub: 'Across all engagements', icon: Star, iconBg: 'bg-amber-50', iconColor: 'text-amber-500', numColor: 'text-amber-700', border: 'border-l-amber-400', trend: 'stable', spark: [4.5, 4.7, 4.8, 4.9, 4.9] },
    { label: 'Open Requirements', value: '3', sub: '1 pending review', icon: FileText, iconBg: 'bg-rose-50', iconColor: 'text-rose-500', numColor: 'text-rose-700', border: 'border-l-rose-400', trend: 'stable', spark: [2, 3, 3, 4, 3] },
  ];

  const engagementData = [
    { month: 'Jan', value: 0 },
    { month: 'Feb', value: 1 },
    { month: 'Mar', value: 1 },
    { month: 'Apr', value: 2 },
    { month: 'May', value: 2 },
    { month: 'Jun', value: 2 },
  ];
  const maxEng = 3;

  const spendData = [
    { month: 'Feb', amount: 350, label: '₹3.5L' },
    { month: 'Mar', amount: 200, label: '₹2L' },
    { month: 'Apr', amount: 400, label: '₹4L' },
    { month: 'May', amount: 200, label: '₹2L' },
    { month: 'Jun', amount: 0, label: '—' },
  ];
  const maxSpend = 500;

  const expertsByRole = [
    { role: 'Interim CFO', count: 1, color: '#0eb59a' },
    { role: 'Fractional CMO', count: 1, color: '#3B82F6' },
    { role: 'VP Engineering', count: 1, color: '#8B5CF6' },
    { role: 'Advisory COO', count: 1, color: '#F59E0B' },
    { role: 'Fractional CTO', count: 1, color: '#EF4444' },
  ];

  const requirementsFunnel = [
    { stage: 'Posted', value: 6, color: '#134e40' },
    { stage: 'Shortlisted', value: 4, color: '#0eb59a' },
    { stage: 'Interviewed', value: 3, color: '#3B82F6' },
    { stage: 'Engaged', value: 2, color: '#8B5CF6' },
    { stage: 'Completed', value: 1, color: '#F59E0B' },
  ];

  const paymentBreakdown = [
    { label: 'Released', value: 43, color: '#10b981' },
    { label: 'In Escrow', value: 22, color: '#f59e0b' },
    { label: 'Committed', value: 35, color: '#6366f1' },
  ];

  const engagementsList = [
    { title: 'Series B Funding Strategy', expert: 'David Chen', role: 'Interim CFO', progress: 65, status: 'In Progress', spend: '₹9L', budget: '₹18L', rating: 5.0, milestones: '3/5', color: '#0eb59a' },
    { title: 'Go-to-Market Expansion', expert: 'Sarah Jenkins', role: 'Fractional CMO', progress: 75, status: 'In Progress', spend: '₹5.5L', budget: '₹9L', rating: 4.9, milestones: '2/3', color: '#3B82F6' },
    { title: 'Tech Infrastructure Scale', expert: 'Priya Patel', role: 'VP Engineering', progress: 0, status: 'Under Review', spend: '₹0', budget: '₹7.2L', rating: null, milestones: '0/4', color: '#8B5CF6' },
  ];

  const expertsList = [
    { name: 'David Chen', role: 'Interim CFO', avatar: 'https://i.pravatar.cc/150?u=david', rating: 5.0, engagements: 1, spend: '₹9L', status: 'Active', match: 95 },
    { name: 'Sarah Jenkins', role: 'Fractional CMO', avatar: 'https://i.pravatar.cc/150?u=sarah', rating: 4.9, engagements: 1, spend: '₹5.5L', status: 'Active', match: 98 },
    { name: 'Priya Patel', role: 'VP Engineering', avatar: 'https://i.pravatar.cc/150?u=priya', rating: 4.8, engagements: 0, spend: '₹0', status: 'Shortlisted', match: 92 },
    { name: 'Marcus Johnson', role: 'Interim COO', avatar: 'https://i.pravatar.cc/150?u=marcus', rating: 4.7, engagements: 1, spend: '₹4.5L', status: 'Completed', match: 88 },
  ];

  const requirementsList = [
    { title: 'Interim CFO — Series B', type: 'Interim', status: 'Active', experts: 12, shortlisted: 3, engaged: 1, posted: 'Feb 1, 2025', budget: '₹3L/mo' },
    { title: 'Fractional CMO', type: 'Fractional', status: 'Active', experts: 8, shortlisted: 2, engaged: 1, posted: 'Feb 25, 2025', budget: '₹2.5L/mo' },
    { title: 'VP Engineering', type: 'Fractional', status: 'Under Review', experts: 5, shortlisted: 1, engaged: 0, posted: 'Apr 20, 2025', budget: '₹1.8L/mo' },
    { title: 'Advisory Board — Sales', type: 'Advisory', status: 'Draft', experts: 0, shortlisted: 0, engaged: 0, posted: 'Draft', budget: '₹80K/mo' },
  ];

  const paymentsList = [
    { milestone: 'Discovery & Assessment', engagement: 'Series B', amount: '₹1,50,000', date: 'Feb 25, 2025', status: 'Released' },
    { milestone: 'Financial Model Dev', engagement: 'Series B', amount: '₹2,00,000', date: 'Mar 28, 2025', status: 'Released' },
    { milestone: 'Campaign Strategy', engagement: 'GTM Expansion', amount: '₹1,50,000', date: 'Apr 1, 2025', status: 'Released' },
    { milestone: 'Investor Deck', engagement: 'Series B', amount: '₹2,50,000', date: '—', status: 'In Escrow' },
    { milestone: 'Campaign Launch', engagement: 'GTM Expansion', amount: '₹3,50,000', date: '—', status: 'Locked' },
  ];

  const statusColor = (s) => {
    if (s === 'Released' || s === 'Active' || s === 'Completed') return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (s === 'In Escrow' || s === 'In Progress' || s === 'Shortlisted') return 'text-amber-600 bg-amber-50 border-amber-200';
    if (s === 'Locked' || s === 'Under Review' || s === 'Draft') return 'text-gray-400 bg-gray-50 border-gray-200';
    return 'text-gray-400 bg-gray-50 border-gray-200';
  };

  const handleExport = () => {
    const content = `CXO CONNECT — ANALYTICS REPORT\n${'='.repeat(40)}\nGenerated: ${new Date().toLocaleDateString()}\n\nKEY METRICS\nActive Engagements: 2\nExperts Hired: 5\nTotal Spent: ₹11.5L\nMilestones Cleared: 4/8\nAvg Expert Rating: 4.9\n\n${'='.repeat(40)}\nGenerated by CXO Connect Platform`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CXOConnect_Analytics.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f4f7f5]">

      {/* ── SIDEBAR ── */}
      <motion.aside
        initial={{ width: 260 }}
        animate={{ width: isSidebarOpen ? 260 : 68 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white border-r border-gray-100 flex flex-col z-50 overflow-hidden shrink-0 shadow-sm fixed left-0 top-0 h-screen"
      >
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-50">
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
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#134e40] hover:bg-gray-100 transition-all shrink-0"
          >
            {isSidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </motion.button>
        </div>
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-hidden">
          {isSidebarOpen && (
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">Main Menu</p>
          )}
          {navItems.map((item) => (
            <motion.button
              key={item.path}
              whileHover={{ x: 2, transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 relative ${
                item.active
                  ? 'bg-[#134e40] text-white shadow-md'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-[#134e40]'
              }`}
            >
              {item.active && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 top-1 bottom-1 w-0.5 bg-[#0eb59a] rounded-r-full"
                />
              )}
              <item.icon size={17} className="shrink-0" />
              <motion.span
                animate={{ 
                  opacity: isSidebarOpen ? 1 : 0, 
                  width: isSidebarOpen ? 'auto' : 0 
                }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap text-sm font-bold"
              >
                {item.label}
              </motion.span>
            </motion.button>
          ))}
        </nav>
      </motion.aside>

      {/* ── MAIN CONTENT ── */}
      <div
        className="flex flex-col min-h-screen overflow-x-hidden"
        style={{
          marginLeft: isSidebarOpen ? 260 : 68,
          transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
      >

        {/* ── HEADER ── */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm px-6 py-3 flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 flex-1">
            <button onClick={() => navigate('/company-dashboard')} className="hover:text-[#134e40] font-semibold transition-colors">Dashboard</button>
            <ChevronRight size={12} className="text-gray-300" />
            <span className="text-[#134e40] font-bold">Analytics</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Period selector */}
            <div className="hidden md:flex gap-1 bg-gray-50 rounded-xl p-1 border border-gray-200">
              {periods.map(p => (
                <motion.button
                  key={p}
                  whileHover={{ scale: 1.08, transition: { duration: 0.15 } }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setActivePeriod(p)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                    activePeriod === p ? 'bg-[#134e40] text-white shadow-sm' : 'text-gray-500 hover:text-[#134e40] hover:bg-white'
                  }`}
                >
                  {p}
                </motion.button>
              ))}
            </div>

            {/* Export */}
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
              whileTap={{ scale: 0.96 }}
              onClick={handleExport}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-50 hover:text-[#0eb59a] hover:border-[#0eb59a]/30 transition-all"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            >
              <Download size={13} /> Export
            </motion.button>

            {/* Bell */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 hover:text-[#134e40] hover:bg-gray-100 transition-all relative"
              >
                <Bell size={17} />
                {unreadCount > 0 && (
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </motion.button>
              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                    >
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                        <h4 className="font-black text-[#1C3627] text-sm text-left">Notifications</h4>
                        <span className="text-[10px] font-bold text-[#0eb59a] cursor-pointer">Mark all read</span>
                      </div>
                      {notifications.map((notif, idx) => (
                        <motion.div
                          key={notif.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`flex items-start gap-3 px-4 py-3 cursor-pointer border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${notif.unread ? 'bg-teal-50/20' : ''}`}
                        >
                          <div className={`w-8 h-8 bg-teal-500 rounded-xl flex items-center justify-center shrink-0`}>
                            <Bell size={13} className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-[#1C3627] mb-0.5 text-left">{notif.title}</p>
                            <p className="text-[11px] text-gray-500 text-left">{notif.desc}</p>
                            <p className="text-[10px] text-gray-400 mt-1 text-left">{notif.time}</p>
                          </div>
                          {notif.unread && <div className="w-2 h-2 bg-[#0eb59a] rounded-full shrink-0 mt-1" />}
                        </motion.div>
                      ))}
                      <div className="px-4 py-3 border-t border-gray-50 text-center">
                        <button className="text-xs font-bold text-[#0eb59a] hover:text-[#134e40] transition-colors">View all notifications →</button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button className="w-9 h-9 bg-[#134e40] rounded-xl flex items-center justify-center text-white text-xs font-black hover:ring-2 hover:ring-[#0eb59a] hover:ring-offset-2 transition-all">
              AC
            </button>
          </div>
        </header>

        {/* ── PAGE BODY ── */}
        <div className="flex-1 px-6 py-5 pb-16 overflow-x-hidden space-y-5">

          {/* ── TABS ── */}
          <div className="flex gap-1 bg-white rounded-2xl p-1 w-fit overflow-x-auto [&::-webkit-scrollbar]:hidden"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            {tabs.map(tab => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.03, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === tab
                    ? 'bg-[#134e40] text-white shadow-md'
                    : 'text-gray-500 hover:text-[#134e40] hover:bg-gray-50'
                }`}
              >
                {tab}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* ══════════════════════════════════════════
                TAB 1: OVERVIEW
            ══════════════════════════════════════════ */}
            {activeTab === 'Overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >

                {/* KPI CARDS */}
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                  {kpis.map((kpi, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.08)', transition: { duration: 0.2 } }}
                      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
                      className={`bg-white rounded-2xl p-4 border-l-4 ${kpi.border} cursor-default`}
                    >
                      {/* Icon + label inline */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-6 h-6 ${kpi.iconBg} rounded-md flex items-center justify-center shrink-0`}>
                          <kpi.icon size={12} className={kpi.iconColor} />
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate text-left">{kpi.label}</span>
                      </div>
                      {/* Value */}
                      <p className={`text-[22px] font-black ${kpi.numColor} leading-none mb-2 text-left`}>{kpi.value}</p>
                      {/* Sparkline */}
                      <div className="mb-1.5">
                        <Sparkline data={kpi.spark} color="#0eb59a" width={60} height={24} />
                      </div>
                      {/* Sub text */}
                      <p className="text-[10px] text-gray-400 font-medium leading-tight text-left">{kpi.sub}</p>
                    </motion.div>
                  ))}
                </div>

                {/* MAIN CHARTS ROW */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                  {/* Engagement Activity — bar chart */}
                  <div className="lg:col-span-2 bg-white rounded-2xl p-5" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="font-black text-[#1C3627] text-sm flex items-center gap-2 text-left">
                        <Activity size={14} className="text-[#0eb59a]" /> Active Engagements Over Time
                      </h3>
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">{activePeriod}</span>
                    </div>
                    <div className="flex items-end gap-3 h-32">
                      {engagementData.map((bar, idx) => (
                        <div key={bar.month} className="flex-1 flex flex-col items-center gap-2">
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 + idx * 0.1 }}
                            className="text-[10px] font-black text-[#134e40] text-center"
                          >
                            {bar.value > 0 ? bar.value : '—'}
                          </motion.span>
                          <div className="w-full flex flex-col justify-end" style={{ height: '90px' }}>
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: bar.value > 0 ? `${(bar.value / maxEng) * 90}px` : '4px' }}
                              transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
                              whileHover={{ filter: 'brightness(1.15)', transition: { duration: 0.15 } }}
                              style={{ borderRadius: '8px 8px 4px 4px' }}
                              className={`w-full ${bar.value > 0 ? 'bg-gradient-to-t from-[#134e40] to-[#0eb59a]' : 'bg-gray-100'}`}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-gray-400 text-center">{bar.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Spend Breakdown — donut */}
                  <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                    <h3 className="font-black text-[#1C3627] text-sm flex items-center gap-2 mb-4 text-left">
                      <DollarSign size={14} className="text-[#0eb59a]" /> Spend Breakdown
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="relative shrink-0">
                        <DonutChart segments={paymentBreakdown} size={100} strokeWidth={14} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-[12px] font-black text-[#134e40] text-center">₹27L</p>
                            <p className="text-[9px] text-gray-400 font-medium text-center">total</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        {paymentBreakdown.map((seg, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                            className="flex items-center gap-2"
                          >
                            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                            <span className="text-[11px] text-gray-600 font-semibold flex-1 text-left">{seg.label}</span>
                            <span className="text-[11px] font-black text-[#1C3627] text-right">{seg.value}%</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECOND ROW */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                  {/* Monthly Spend */}
                  <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                    <h3 className="font-black text-[#1C3627] text-sm flex items-center gap-2 mb-5 text-left">
                      <BarChart2 size={14} className="text-[#0eb59a]" /> Monthly Spend
                    </h3>
                    <div className="flex items-end gap-3 h-28">
                      {spendData.map((bar, idx) => (
                        <div key={bar.month} className="flex-1 flex flex-col items-center gap-1.5">
                          <span className={`text-[10px] font-bold text-center ${bar.amount > 0 ? 'text-[#134e40]' : 'text-gray-300'}`}>{bar.label}</span>
                          <div className="w-full flex flex-col justify-end" style={{ height: '72px' }}>
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: bar.amount > 0 ? `${(bar.amount / maxSpend) * 72}px` : '4px' }}
                              transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
                              whileHover={{ filter: 'brightness(1.15)', transition: { duration: 0.15 } }}
                              style={{ borderRadius: '6px 6px 3px 3px' }}
                              className={`w-full ${bar.amount > 0 ? 'bg-gradient-to-t from-purple-600 to-purple-400' : 'bg-gray-100'}`}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-gray-400 text-center">{bar.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Requirements Funnel */}
                  <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                    <h3 className="font-black text-[#1C3627] text-sm flex items-center gap-2 mb-4 text-left">
                      <Layers size={14} className="text-[#0eb59a]" /> Requirements Funnel
                    </h3>
                    <div className="space-y-2.5">
                      {requirementsFunnel.map((stage, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.08 }}
                          className="flex items-center gap-3"
                        >
                          <span className="text-[11px] font-bold text-gray-500 w-20 text-left">{stage.stage}</span>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(stage.value / requirementsFunnel[0].value) * 100}%` }}
                              transition={{ duration: 0.8, delay: 0.2 + idx * 0.1, ease: 'easeOut' }}
                              style={{ height: '100%', backgroundColor: stage.color, borderRadius: '999px' }}
                            />
                          </div>
                          <span className="text-[11px] font-black text-[#1C3627] w-4 text-right">{stage.value}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Expert Distribution */}
                  <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                    <h3 className="font-black text-[#1C3627] text-sm flex items-center gap-2 mb-4 text-left">
                      <Users size={14} className="text-[#0eb59a]" /> Experts by Role
                    </h3>
                    <div className="space-y-3">
                      {expertsByRole.map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.07 }}
                          whileHover={{ x: 3, transition: { duration: 0.15 } }}
                          className="cursor-default"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] font-bold text-gray-600 text-left">{item.role}</span>
                            <span className="text-[11px] font-black text-[#1C3627] text-right">{item.count}</span>
                          </div>
                          <MiniBar value={item.count} max={5} color={item.color} delay={0.3 + idx * 0.07} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SUMMARY ROW */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: 'Avg Time to Hire', value: '12 days', icon: Clock, bg: 'bg-teal-50', color: 'text-[#0eb59a]', border: 'border-l-[#0eb59a]', sub: '↓ 3 days vs last quarter' },
                    { label: 'Expert Retention', value: '100%', icon: Award, bg: 'bg-emerald-50', color: 'text-emerald-500', border: 'border-l-emerald-400', sub: 'All experts re-engaged' },
                    { label: 'Milestone Hit Rate', value: '88%', icon: Target, bg: 'bg-blue-50', color: 'text-blue-500', border: 'border-l-blue-400', sub: '7 of 8 on time' },
                    { label: 'Platform NPS', value: '72', icon: Zap, bg: 'bg-amber-50', color: 'text-amber-500', border: 'border-l-amber-400', sub: 'Industry avg: 45' },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.07 }}
                      whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.08)', transition: { duration: 0.2 } }}
                      className={`bg-white rounded-2xl p-5 border-l-4 ${item.border} cursor-default`}
                      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
                    >
                      <div className={`w-9 h-9 ${item.bg} rounded-xl flex items-center justify-center mb-3`}>
                        <item.icon size={17} className={item.color} />
                      </div>
                      <p className="text-2xl font-black text-[#1C3627] mb-0.5 text-left">{item.value}</p>
                      <p className="text-xs font-bold text-gray-500 mb-1 text-left">{item.label}</p>
                      <p className="text-[10px] text-gray-400 text-left">{item.sub}</p>
                    </motion.div>
                  ))}
                </div>

              </motion.div>
            )}

            {/* ══════════════════════════════════════════
                TAB 2: ENGAGEMENTS
            ══════════════════════════════════════════ */}
            {activeTab === 'Engagements' && (
              <motion.div
                key="engagements"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {/* Summary KPIs */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: 'Total Engagements', value: '3', border: 'border-l-[#0eb59a]', numColor: 'text-[#134e40]' },
                    { label: 'Active', value: '2', border: 'border-l-blue-400', numColor: 'text-blue-700' },
                    { label: 'Completed', value: '1', border: 'border-l-emerald-400', numColor: 'text-emerald-700' },
                    { label: 'Avg Progress', value: '47%', border: 'border-l-purple-400', numColor: 'text-purple-700' },
                  ].map((s, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      whileHover={{ y: -3, transition: { duration: 0.15 } }}
                      className={`bg-white rounded-2xl p-4 border-l-4 ${s.border} cursor-default`}
                      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
                    >
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 text-left">{s.label}</p>
                      <p className={`text-3xl font-black ${s.numColor} text-left`}>{s.value}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Engagement Cards */}
                <div className="space-y-3">
                  {engagementsList.map((eng, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0,0,0,0.08)', transition: { duration: 0.2 } }}
                      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
                      className="bg-white rounded-2xl p-5 cursor-default"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${eng.color}20` }}>
                            <Briefcase size={18} style={{ color: eng.color }} />
                          </div>
                          <div className="text-left">
                            <h4 className="font-black text-[#1C3627] text-sm text-left">{eng.title}</h4>
                            <p className="text-xs text-gray-400 text-left">{eng.expert} · {eng.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border shrink-0 ${statusColor(eng.status)}`}>
                            {eng.status}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1, backgroundColor: '#F0FDF4' }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigate('/engagements/1')}
                            className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:text-[#0eb59a] transition-all"
                          >
                            <Eye size={13} />
                          </motion.button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {[
                          { label: 'Spend', value: eng.spend },
                          { label: 'Budget', value: eng.budget },
                          { label: 'Milestones', value: eng.milestones },
                          { label: 'Rating', value: eng.rating ? `★ ${eng.rating}` : '—' },
                        ].map((item, iIdx) => (
                          <div key={iIdx} className="text-left">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 text-left">{item.label}</p>
                            <p className="text-sm font-black text-[#1C3627] text-left">{item.value}</p>
                          </div>
                        ))}
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-1.5">
                          <span className="text-gray-400 font-semibold text-left">Progress</span>
                          <span className="font-black text-[#134e40] text-right">{eng.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${eng.progress}%` }}
                            transition={{ duration: 1, delay: 0.3 + idx * 0.1 }}
                            style={{
                              height: '100%',
                              background: `linear-gradient(90deg, #134e40, ${eng.color})`,
                              borderRadius: '999px'
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════
                TAB 3: EXPERTS
            ══════════════════════════════════════════ */}
            {activeTab === 'Experts' && (
              <motion.div
                key="experts"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {/* Summary */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: 'Total Experts', value: '5', border: 'border-l-[#0eb59a]', numColor: 'text-[#134e40]' },
                    { label: 'Currently Active', value: '2', border: 'border-l-blue-400', numColor: 'text-blue-700' },
                    { label: 'Avg Match Score', value: '93%', border: 'border-l-amber-400', numColor: 'text-amber-700' },
                    { label: 'Avg Rating', value: '4.9★', border: 'border-l-emerald-400', numColor: 'text-emerald-700' },
                  ].map((s, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      whileHover={{ y: -3, transition: { duration: 0.15 } }}
                      className={`bg-white rounded-2xl p-4 border-l-4 ${s.border} cursor-default`}
                      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
                    >
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 text-left">{s.label}</p>
                      <p className={`text-3xl font-black ${s.numColor} text-left`}>{s.value}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Expert Table */}
                <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                  <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="font-black text-[#1C3627] text-sm text-left">All Experts</h3>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => navigate('/experts')}
                      className="text-xs font-bold text-[#0eb59a] hover:text-[#134e40] transition-colors flex items-center gap-1"
                    >
                      View All <ChevronRight size={12} />
                    </motion.button>
                  </div>
                  {expertsList.map((expert, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.07 }}
                      whileHover={{ backgroundColor: '#FAFBF9', transition: { duration: 0.15 } }}
                      className={`flex items-center gap-4 px-5 py-4 cursor-default ${idx < expertsList.length - 1 ? 'border-b border-gray-50' : ''}`}
                    >
                      <div className="relative shrink-0">
                        <img src={expert.avatar} className="w-10 h-10 rounded-xl object-cover shadow-sm" alt={expert.name} />
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                          expert.status === 'Active' ? 'bg-emerald-500' :
                          expert.status === 'Shortlisted' ? 'bg-amber-400' : 'bg-gray-300'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="font-black text-[#1C3627] text-sm text-left">{expert.name}</p>
                        <p className="text-xs text-gray-400 font-medium text-left">{expert.role}</p>
                      </div>
                      <div className="hidden md:flex items-center gap-6 text-xs">
                        <div className="text-center">
                          <p className="font-black text-[#1C3627] text-center">{expert.rating}★</p>
                          <p className="text-[10px] text-gray-400 text-center">Rating</p>
                        </div>
                        <div className="text-center">
                          <p className="font-black text-[#1C3627] text-center">{expert.spend}</p>
                          <p className="text-[10px] text-gray-400 text-center">Spend</p>
                        </div>
                        <div className="text-center">
                          <p className="font-black text-[#134e40] text-center">{expert.match}%</p>
                          <p className="text-[10px] text-gray-400 text-center">Match</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border shrink-0 ${statusColor(expert.status)}`}>
                        {expert.status}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: '#F0FDF4' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(`/experts/${idx + 1}`)}
                        className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:text-[#0eb59a] transition-all shrink-0"
                      >
                        <Eye size={13} />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>

                {/* Match Score Distribution */}
                <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                  <h3 className="font-black text-[#1C3627] text-sm flex items-center gap-2 mb-4 text-left">
                    <Target size={14} className="text-[#0eb59a]" /> AI Match Score Distribution
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {expertsList.map((expert, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.08 }}
                        whileHover={{ scale: 1.04, transition: { duration: 0.15 } }}
                        className="bg-[#FAFBF9] rounded-xl p-4 border border-gray-100 text-center cursor-default"
                      >
                        <div className="relative w-14 h-14 mx-auto mb-2">
                          <DonutChart
                            segments={[
                              { value: expert.match, color: '#0eb59a' },
                              { value: 100 - expert.match, color: '#F3F4F6' }
                            ]}
                            size={56}
                            strokeWidth={8}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[11px] font-black text-[#134e40] text-center">{expert.match}%</span>
                          </div>
                        </div>
                        <p className="text-[11px] font-black text-[#1C3627] text-center">{expert.name.split(' ')[0]}</p>
                        <p className="text-[10px] text-gray-400 text-center">{expert.role.split(' ').slice(-1)[0]}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════
                TAB 4: PAYMENTS
            ══════════════════════════════════════════ */}
            {activeTab === 'Payments' && (
              <motion.div
                key="payments-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {/* KPIs */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: 'Total Committed', value: '₹27L', border: 'border-l-[#0eb59a]', numColor: 'text-[#134e40]' },
                    { label: 'Released', value: '₹11.5L', border: 'border-l-emerald-400', numColor: 'text-emerald-700' },
                    { label: 'In Escrow', value: '₹6L', border: 'border-l-amber-400', numColor: 'text-amber-700' },
                    { label: 'Pending', value: '₹9.5L', border: 'border-l-purple-400', numColor: 'text-purple-700' },
                  ].map((s, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      whileHover={{ y: -3, transition: { duration: 0.15 } }}
                      className={`bg-white rounded-2xl p-4 border-l-4 ${s.border} cursor-default`}
                      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
                    >
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 text-left">{s.label}</p>
                      <p className={`text-2xl font-black ${s.numColor} text-left`}>{s.value}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Spend by Engagement */}
                <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                  <h3 className="font-black text-[#1C3627] text-sm flex items-center gap-2 mb-4 text-left">
                    <BarChart2 size={14} className="text-[#0eb59a]" /> Spend by Engagement
                  </h3>
                  <div className="space-y-4">
                    {[
                      { title: 'Series B Funding Strategy', spent: 9, budget: 18, color: '#0eb59a' },
                      { title: 'Go-to-Market Expansion', spent: 5.5, budget: 9, color: '#3B82F6' },
                      { title: 'Operations Restructuring', spent: 4.5, budget: 4.5, color: '#8B5CF6' },
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ x: 3, transition: { duration: 0.15 } }}
                        className="cursor-default"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-gray-600 text-left">{item.title}</span>
                          <span className="text-xs font-black text-[#1C3627] text-right">₹{item.spent}L / ₹{item.budget}L</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.spent / item.budget) * 100}%` }}
                            transition={{ duration: 1, delay: 0.2 + idx * 0.1, ease: 'easeOut' }}
                            style={{ height: '100%', backgroundColor: item.color, borderRadius: '999px' }}
                          />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1 text-left">{Math.round((item.spent / item.budget) * 100)}% of budget used</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Payment Table */}
                <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                  <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="font-black text-[#1C3627] text-sm text-left">Payment History</h3>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => navigate('/payments')}
                      className="text-xs font-bold text-[#0eb59a] hover:text-[#134e40] transition-colors flex items-center gap-1"
                    >
                      View All <ChevronRight size={12} />
                    </motion.button>
                  </div>
                  {paymentsList.map((p, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      whileHover={{ backgroundColor: '#FAFBF9', transition: { duration: 0.15 } }}
                      className={`flex items-center gap-4 px-5 py-3.5 cursor-default ${idx < paymentsList.length - 1 ? 'border-b border-gray-50' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        p.status === 'Released' ? 'bg-emerald-50' : p.status === 'In Escrow' ? 'bg-amber-50' : 'bg-gray-50'
                      }`}>
                        {p.status === 'Released' ? <Unlock size={13} className="text-emerald-500" /> :
                         p.status === 'In Escrow' ? <Lock size={13} className="text-amber-500" /> :
                         <Lock size={13} className="text-gray-300" />}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="font-bold text-[#1C3627] text-sm truncate text-left">{p.milestone}</p>
                        <p className="text-[10px] text-gray-400 text-left">{p.engagement} · {p.date}</p>
                      </div>
                      <p className="font-black text-[#1C3627] text-sm shrink-0">{p.amount}</p>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border shrink-0 ${statusColor(p.status)}`}>
                        {p.status}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════
                TAB 5: REQUIREMENTS
            ══════════════════════════════════════════ */}
            {activeTab === 'Requirements' && (
              <motion.div
                key="requirements-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {/* KPIs */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: 'Total Posted', value: '4', border: 'border-l-[#0eb59a]', numColor: 'text-[#134e40]' },
                    { label: 'Active', value: '2', border: 'border-l-blue-400', numColor: 'text-blue-700' },
                    { label: 'Total Experts Matched', value: '25', border: 'border-l-amber-400', numColor: 'text-amber-700' },
                    { label: 'Conversion Rate', value: '50%', border: 'border-l-emerald-400', numColor: 'text-emerald-700' },
                  ].map((s, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      whileHover={{ y: -3, transition: { duration: 0.15 } }}
                      className={`bg-white rounded-2xl p-4 border-l-4 ${s.border} cursor-default`}
                      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
                    >
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 text-left">{s.label}</p>
                      <p className={`text-3xl font-black ${s.numColor} text-left`}>{s.value}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Requirements List */}
                <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                  <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="font-black text-[#1C3627] text-sm text-left">All Requirements</h3>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => navigate('/requirements')}
                      className="text-xs font-bold text-[#0eb59a] hover:text-[#134e40] transition-colors flex items-center gap-1"
                    >
                      Manage <ChevronRight size={12} />
                    </motion.button>
                  </div>
                  {requirementsList.map((req, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.07 }}
                      whileHover={{ backgroundColor: '#FAFBF9', transition: { duration: 0.15 } }}
                      className={`px-5 py-4 cursor-default ${idx < requirementsList.length - 1 ? 'border-b border-gray-50' : ''}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-left">
                          <h4 className="font-black text-[#1C3627] text-sm text-left">{req.title}</h4>
                          <p className="text-xs text-gray-400 mt-0.5 text-left">{req.type} · {req.budget} · Posted {req.posted}</p>
                        </div>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border shrink-0 ${statusColor(req.status)}`}>
                          {req.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-6">
                        {[
                          { label: 'Matched', value: req.experts, color: 'text-[#134e40]' },
                          { label: 'Shortlisted', value: req.shortlisted, color: 'text-blue-600' },
                          { label: 'Engaged', value: req.engaged, color: 'text-emerald-600' },
                        ].map((item, iIdx) => (
                          <div key={iIdx} className="flex items-center gap-1.5">
                            <span className={`text-sm font-black ${item.color} text-left`}>{item.value}</span>
                            <span className="text-[10px] text-gray-400 font-medium text-left">{item.label}</span>
                          </div>
                        ))}
                        {req.experts > 0 && (
                          <div className="flex-1 ml-2">
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(req.engaged / req.experts) * 100}%` }}
                                transition={{ duration: 0.8, delay: 0.3 + idx * 0.1 }}
                                className="h-full bg-[#0eb59a] rounded-full"
                              />
                            </div>
                            <p className="text-[9px] text-gray-400 mt-0.5 text-left">{Math.round((req.engaged / req.experts) * 100)}% conversion</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Funnel Visualization */}
                <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                  <h3 className="font-black text-[#1C3627] text-sm flex items-center gap-2 mb-5 text-left">
                    <Layers size={14} className="text-[#0eb59a]" /> Hiring Funnel — All Requirements
                  </h3>
                  <div className="flex items-end gap-4 justify-center h-40">
                    {requirementsFunnel.map((stage, idx) => {
                      const maxVal = requirementsFunnel[0].value;
                      const heightPct = (stage.value / maxVal) * 120;
                      return (
                        <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 + idx * 0.1 }}
                            className="text-[11px] font-black text-center"
                            style={{ color: stage.color }}
                          >
                            {stage.value}
                          </motion.span>
                          <div className="w-full flex flex-col justify-end" style={{ height: '120px' }}>
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${heightPct}px` }}
                              transition={{ duration: 0.8, delay: idx * 0.12, ease: 'easeOut' }}
                              whileHover={{ filter: 'brightness(1.15)', transition: { duration: 0.15 } }}
                              style={{ borderRadius: '8px 8px 4px 4px', backgroundColor: stage.color, opacity: 0.85 }}
                              className="w-full"
                            />
                          </div>
                          <span className="text-[10px] font-bold text-gray-500 text-center">{stage.stage}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
