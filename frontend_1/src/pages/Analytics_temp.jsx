import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  ChevronRight, BarChart2, Users, Briefcase,
  CreditCard, FileText, CheckCircle, Clock,
  Bell, Settings, ShieldCheck,
  ChevronLeft, LayoutDashboard, Target, Zap,
  Star, Lock, Unlock, DollarSign, Activity,
  Download, Eye, Award, Layers, TrendingUp, TrendingDown
} from 'lucide-react';

const AnimatedNumber = ({ value, prefix = '', suffix = '' }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const num = parseFloat(String(value).replace(/[^0-9.]/g, ''));
    if (isNaN(num)) { setDisplay(value); return; }
    let start = 0; const duration = 1200; const step = 16;
    const inc = num / (duration / step);
    const timer = setInterval(() => {
      start += inc;
      if (start >= num) { setDisplay(num); clearInterval(timer); }
      else setDisplay(start);
    }, step);
    return () => clearInterval(timer);
  }, [inView, value]);
  const fmt = typeof display === 'number' ? (display % 1 === 0 ? Math.round(display) : display.toFixed(1)) : display;
  return <span ref={ref}>{prefix}{fmt}{suffix}</span>;
};

const Sparkline = ({ data, color = '#0eb59a', width = 64, height = 28 }) => {
  const max = Math.max(...data); const min = Math.min(...data); const range = max - min || 1;
  const pts = data.map((v, i) => { const x = (i / (data.length - 1)) * width; const y = height - ((v - min) / range) * (height - 6) - 3; return `${x},${y}`; }).join(' ');
  const lastPt = pts.split(' ').pop().split(',');
  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs><linearGradient id={`sg${color.replace(/[^a-z0-9]/gi,'')}`} x1="0" y1="0" x2="0" y2="1"><stop of
<truncated 45215 bytes>
Payments' && (
              <motion.div key="payments-tab" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="space-y-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[{ label: 'Total Committed', value: 'â‚¹27L', border: 'border-l-[#0eb59a]', numColor: 'text-[#134e40]' },{ label: 'Released', value: 'â‚¹11.5L', border: 'border-l-emerald-400', numColor: 'text-emerald-700' },{ label: 'In Escrow', value: 'â‚¹6L', border: 'border-l-amber-400', numColor: 'text-amber-700' },{ label: 'Pending', value: 'â‚¹9.5L', border: 'border-l-purple-400', numColor: 'text-purple-700' }].map((s, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }} whileHover={{ y: -4, transition: { duration: 0.2 } }} className={`bg-white rounded-2xl p-5 border-l-4 ${s.border} cursor-default`} style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{s.label}</p>
                      <p className={`text-2xl font-black ${s.numColor}`}>{s.value}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                  <h3 className="font-black text-[#1C3627] text-sm flex items-center gap-2 mb-5">
                    <div className="w-6 h-6 bg-teal-50 rounded-lg flex items-center justify-center"><BarChart2 size={13} className="text-[#0eb59a]" /></div>
                    Spend by Engagement
                  </h3>
                  <div className="space-y-5">
                    {[{ title: 'Series B Funding Strategy', spent: 9, budget: 18, 
<truncated 10816 bytes>

NOTE: The output was truncated because it was too long. Use a more targeted query or a smaller range to get the information you need.
