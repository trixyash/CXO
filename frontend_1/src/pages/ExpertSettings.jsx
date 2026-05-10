import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, User, Bell, CreditCard, Shield,
  Save, Check, X, Plus, Trash2, Edit3,
  Mail, Phone, Globe, Linkedin, Lock,
  Eye, EyeOff, LogOut, AlertCircle, Landmark,
  Building, CheckCircle, RefreshCw, Copy,
  Smartphone, Zap, Award, Star, Download,
  Key, ChevronDown, ToggleLeft, ToggleRight
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const ExpertSettings = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('Account');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [copied, setCopied] = useState(false);

  // ── ACCOUNT STATE ──
  const [account, setAccount] = useState({
    email: 'david.chen@email.com',
    phone: '+91 98765 43210',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactor: true,
    loginAlerts: true,
  });

  // ── NOTIFICATION STATE ──
  const [notifications, setNotifications] = useState({
    newInvitation: true,
    proposalUpdate: true,
    milestoneApproved: true,
    paymentReceived: true,
    contractReady: true,
    companyMessage: true,
    weeklyEarnings: true,
    newOpportunities: true,
    platformUpdates: false,
    marketingEmails: false,
    smsAlerts: true,
    whatsappAlerts: true,
    emailDigest: true,
  });

  // ── PAYOUT STATE ──
  const [payoutAccounts, setPayoutAccounts] = useState([
    {
      id: 1,
      type: 'bank',
      label: 'HDFC Bank',
      accountHolder: 'David Chen',
      accountNumber: '••••••4321',
      ifsc: 'HDFC0001234',
      branch: 'Mumbai — Bandra West',
      verified: true,
      default: true,
    },
    {
      id: 2,
      type: 'upi',
      label: 'UPI',
      upiId: 'david@hdfcbank',
      verified: true,
      default: false,
    },
  ]);

  const [newBank, setNewBank] = useState({
    accountHolder: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifsc: '',
    bankName: '',
  });

  // ── PRIVACY STATE ──
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showRate: true,
    showContactInfo: false,
    showLinkedIn: true,
    allowDirectMessages: true,
    showInSearch: true,
    anonymousMode: false,
  });

  const tabs = [
    { id: 'Account', icon: User },
    { id: 'Notifications', icon: Bell },
    { id: 'Payout Settings', icon: Landmark },
    { id: 'Privacy', icon: Shield },
  ];

  const notificationGroups = [
    {
      title: 'Engagement Alerts',
      desc: 'Updates on your active engagements',
      items: [
        { key: 'newInvitation', label: 'New Role Invitation', desc: 'When a company invites you to apply for a role' },
        { key: 'proposalUpdate', label: 'Proposal Status Update', desc: 'When a company responds to your proposal' },
        { key: 'milestoneApproved', label: 'Milestone Approved', desc: 'When a company approves your deliverable' },
        { key: 'paymentReceived', label: 'Payment Received', desc: 'When a payment is released to your account' },
        { key: 'contractReady', label: 'Contract Ready to Sign', desc: 'When a contract is ready for your signature' },
        { key: 'companyMessage', label: 'Company Messages', desc: 'When a client company sends you a message' },
      ],
    },
    {
      title: 'Opportunities',
      desc: 'New roles and matches',
      items: [
        { key: 'newOpportunities', label: 'New Role Matches', desc: 'When new roles match your profile and skills' },
        { key: 'weeklyEarnings', label: 'Weekly Earnings Summary', desc: 'Weekly digest of your earnings and activity' },
        { key: 'platformUpdates', label: 'Platform Updates', desc: 'New features and product improvements' },
        { key: 'marketingEmails', label: 'Marketing & Tips', desc: 'Expert tips, guides, and promotional content' },
      ],
    },
    {
      title: 'Mobile & Messaging',
      desc: 'SMS, WhatsApp, and email preferences',
      items: [
        { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Critical updates via SMS to your registered number' },
        { key: 'whatsappAlerts', label: 'WhatsApp Alerts', desc: 'Real-time updates via WhatsApp (recommended)' },
        { key: 'emailDigest', label: 'Daily Email Digest', desc: 'Daily summary of all activity in your account' },
      ],
    },
  ];

  const privacyItems = [
    { key: 'profileVisible', label: 'Profile Visible to Companies', desc: 'Allow companies to find and view your profile', icon: User },
    { key: 'showRate', label: 'Show Rate Card', desc: 'Display your monthly rates on your public profile', icon: CreditCard },
    { key: 'showContactInfo', label: 'Show Contact Info', desc: 'Allow companies to see your email and phone before hiring', icon: Mail },
    { key: 'showLinkedIn', label: 'Show LinkedIn Profile', desc: 'Display your LinkedIn URL on your profile', icon: Linkedin },
    { key: 'allowDirectMessages', label: 'Allow Direct Messages', desc: 'Let companies message you before you apply', icon: Mail },
    { key: 'showInSearch', label: 'Show in Search Results', desc: 'Appear in company searches and recommendations', icon: Globe },
    { key: 'anonymousMode', label: 'Anonymous Mode', desc: 'Hide your name and photo until you accept an invitation', icon: Eye },
  ];

  // ── HELPERS ──
  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePrivacy = (key) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const setDefaultPayout = (id) => {
    setPayoutAccounts(prev =>
      prev.map(acc => ({ ...acc, default: acc.id === id }))
    );
  };

  const removePayout = (id) => {
    setPayoutAccounts(prev => prev.filter(acc => acc.id !== id));
  };

  const copyReferralCode = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddBank = () => {
    if (newBank.accountHolder && newBank.accountNumber && newBank.ifsc) {
      setPayoutAccounts(prev => [...prev, {
        id: prev.length + 1,
        type: 'bank',
        label: newBank.bankName || 'Bank Account',
        accountHolder: newBank.accountHolder,
        accountNumber: `••••••${newBank.accountNumber.slice(-4)}`,
        ifsc: newBank.ifsc,
        branch: '—',
        verified: false,
        default: false,
      }]);
      setShowAddBankModal(false);
      setNewBank({ accountHolder: '', accountNumber: '', confirmAccountNumber: '', ifsc: '', bankName: '' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      <div className="fixed top-0 right-0 w-96 h-96 bg-teal-100/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-72 h-72 bg-blue-100/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 py-8 pb-16">

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => navigate('/expert-dashboard')}
                className="text-gray-400 hover:text-[#0eb59a] text-sm font-semibold transition-colors"
              >
                Dashboard
              </button>
              <ChevronRight size={14} className="text-gray-300" />
              <span className="text-sm font-bold text-gray-700">Settings</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              Settings
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Manage your account, notifications, and payout preferences
            </p>
          </div>

          <AnimatePresence>
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2.5 rounded-2xl shadow-lg text-sm font-bold"
              >
                <Check size={15} strokeWidth={3} /> Changes saved!
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── LAYOUT ── */}
        <div className="flex flex-col md:flex-row gap-6">

          {/* ── SIDEBAR ── */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:w-56 shrink-0"
          >
            <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm p-2 md:p-3 md:sticky md:top-6">
              {/* Mobile: horizontal scrolling tabs */}
              <div className="flex md:flex-col gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 px-3 md:px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl
                      text-xs md:text-sm font-bold transition-all whitespace-nowrap shrink-0
                      md:w-full md:text-left
                      ${activeTab === tab.id
                        ? 'bg-teal-50 text-[#134e40]'
                        : 'text-gray-500 hover:bg-gray-50'
                      }
                    `}
                  >
                    <tab.icon size={14} className={activeTab === tab.id ? 'text-[#0eb59a]' : 'text-gray-400'} />
                    {tab.id}
                  </motion.button>
                ))}
              </div>

              <div className="hidden md:block">
                <div className="h-px bg-gray-100 my-2" />
                <motion.button
                  whileHover={{ x: 3 }}
                  onClick={async () => {
                    await supabase.auth.signOut();
                    navigate('/signin?role=expert');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-400 hover:bg-red-50 hover:text-red-600 transition-all text-left"
                >
                  <LogOut size={16} />
                  Sign Out
                </motion.button>
              </div>
            </div>
          </motion.aside>

          {/* ── MAIN CONTENT ── */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">

              {/* ══ ACCOUNT TAB ══ */}
              {activeTab === 'Account' && (
                <motion.div
                  key="account"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  {/* Contact Info */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-black text-gray-900 text-base mb-5 flex items-center gap-2">
                      <User size={16} className="text-[#0eb59a]" /> Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                          Email Address
                        </label>
                        <div className="flex gap-3">
                          <div className="relative flex-1">
                            <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="email"
                              value={account.email}
                              onChange={e => setAccount(prev => ({ ...prev, email: e.target.value }))}
                              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all"
                            />
                          </div>
                          <div className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
                            <CheckCircle size={13} className="text-emerald-500" />
                            <span className="text-xs font-black text-emerald-600">Verified</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                          Phone Number
                        </label>
                        <div className="flex gap-3">
                          <div className="relative flex-1">
                            <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="tel"
                              value={account.phone}
                              onChange={e => setAccount(prev => ({ ...prev, phone: e.target.value }))}
                              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all"
                            />
                          </div>
                          <div className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
                            <CheckCircle size={13} className="text-emerald-500" />
                            <span className="text-xs font-black text-emerald-600">Verified</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Password & Security */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-black text-gray-900 text-base mb-5 flex items-center gap-2">
                      <Lock size={16} className="text-[#0eb59a]" /> Password & Security
                    </h3>

                    <div className="space-y-4">
                      {/* Change password button */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div>
                          <p className="font-bold text-gray-800 text-sm">Password</p>
                          <p className="text-xs text-gray-400 font-semibold mt-0.5">Last changed 3 months ago</p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setShowPasswordModal(true)}
                          className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm flex items-center gap-1.5"
                        >
                          <Key size={13} /> Change Password
                        </motion.button>
                      </div>

                      {/* Two-factor */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div>
                          <p className="font-bold text-gray-800 text-sm">Two-Factor Authentication</p>
                          <p className="text-xs text-gray-400 font-semibold mt-0.5">Extra security via OTP on login</p>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setAccount(prev => ({ ...prev, twoFactor: !prev.twoFactor }))}
                          className={`relative w-12 h-6 rounded-full transition-colors duration-300 shrink-0 ${account.twoFactor ? 'bg-[#0eb59a]' : 'bg-gray-200'
                            }`}
                        >
                          <motion.div
                            animate={{ x: account.twoFactor ? 24 : 2 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                          />
                        </motion.button>
                      </div>

                      {/* Login alerts */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div>
                          <p className="font-bold text-gray-800 text-sm">Login Alerts</p>
                          <p className="text-xs text-gray-400 font-semibold mt-0.5">Get notified of new logins to your account</p>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setAccount(prev => ({ ...prev, loginAlerts: !prev.loginAlerts }))}
                          className={`relative w-12 h-6 rounded-full transition-colors duration-300 shrink-0 ${account.loginAlerts ? 'bg-[#0eb59a]' : 'bg-gray-200'
                            }`}
                        >
                          <motion.div
                            animate={{ x: account.loginAlerts ? 24 : 2 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                          />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Referral */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-black text-gray-900 text-base mb-2 flex items-center gap-2">
                      <Zap size={16} className="text-[#0eb59a]" /> Referral Program
                    </h3>
                    <p className="text-xs text-gray-400 mb-4 font-semibold leading-relaxed">
                      Refer other experts to CXO Connect and earn <span className="font-black text-gray-700">₹5,000</span> for every expert who completes their first engagement.
                    </p>
                    <div className="flex items-center gap-3 p-4 bg-teal-50 rounded-2xl border border-teal-100">
                      <div className="flex-1">
                        <p className="text-xs font-black text-gray-500 mb-1 uppercase tracking-wider">Your Referral Code</p>
                        <p className="font-black text-[#134e40] text-lg tracking-widest">DAVID-CFO-2025</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={copyReferralCode}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${copied
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                      >
                        {copied ? <Check size={13} strokeWidth={3} /> : <Copy size={13} />}
                        {copied ? 'Copied!' : 'Copy'}
                      </motion.button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                      {[
                        { label: 'Referrals Sent', value: '3' },
                        { label: 'Joined', value: '2' },
                        { label: 'Earned', value: '₹10,000' },
                      ].map((item, idx) => (
                        <div key={idx} className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                          <p className="font-black text-gray-900 text-base">{item.value}</p>
                          <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{item.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Save */}
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(20,78,64,0.25)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="w-full py-4 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2"
                  >
                    <Save size={16} /> Save Account Settings
                  </motion.button>

                  {/* Danger Zone */}
                  <div className="bg-white rounded-3xl border border-red-100 shadow-sm p-6">
                    <h3 className="font-black text-red-600 text-base mb-3 flex items-center gap-2">
                      <AlertCircle size={16} /> Danger Zone
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                      Deleting your account is permanent. All your profile data, engagement history, and earnings records will be removed.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowDeleteModal(true)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-2xl transition-all shadow-md"
                    >
                      <Trash2 size={14} /> Delete Expert Account
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* ══ NOTIFICATIONS TAB ══ */}
              {activeTab === 'Notifications' && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  {notificationGroups.map((group, gIdx) => (
                    <motion.div
                      key={group.title}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: gIdx * 0.08 }}
                      className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6"
                    >
                      <div className="mb-5">
                        <h3 className="font-black text-gray-900 text-base">{group.title}</h3>
                        <p className="text-xs text-gray-400 mt-0.5 font-semibold">{group.desc}</p>
                      </div>

                      <div className="space-y-4">
                        {group.items.map((item, iIdx) => (
                          <motion.div
                            key={item.key}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: gIdx * 0.08 + iIdx * 0.04 }}
                            className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
                          >
                            <div className="flex-1 pr-4">
                              <p className="font-bold text-gray-800 text-sm">{item.label}</p>
                              <p className="text-xs text-gray-400 font-semibold mt-0.5">{item.desc}</p>
                            </div>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => toggleNotification(item.key)}
                              className={`relative w-12 h-6 rounded-full transition-colors duration-300 shrink-0 ${notifications[item.key] ? 'bg-[#0eb59a]' : 'bg-gray-200'
                                }`}
                            >
                              <motion.div
                                animate={{ x: notifications[item.key] ? 24 : 2 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                              />
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}

                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(20,78,64,0.25)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="w-full py-4 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2"
                  >
                    <Save size={16} /> Save Notification Preferences
                  </motion.button>
                </motion.div>
              )}

              {/* ══ PAYOUT SETTINGS TAB ══ */}
              {activeTab === 'Payout Settings' && (
                <motion.div
                  key="payout"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  {/* Payout accounts */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
                          <Landmark size={16} className="text-[#0eb59a]" /> Payout Accounts
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5 font-semibold">
                          Payments are released here after milestone approval
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setShowAddBankModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white text-xs font-black rounded-xl shadow-md"
                      >
                        <Plus size={14} /> Add Account
                      </motion.button>
                    </div>

                    <div className="space-y-3">
                      {payoutAccounts.map((account, idx) => (
                        <motion.div
                          key={account.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.08 }}
                          className={`p-5 rounded-2xl border-2 transition-all ${account.default
                              ? 'border-[#0eb59a] bg-teal-50/50'
                              : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'
                            }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${account.default ? 'bg-teal-100' : 'bg-gray-100'
                                }`}>
                                {account.type === 'bank' ? '🏦' : '🔵'}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-black text-gray-900 text-sm">{account.label}</p>
                                  {account.verified && (
                                    <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200 flex items-center gap-0.5">
                                      <Check size={8} strokeWidth={3} /> Verified
                                    </span>
                                  )}
                                  {account.default && (
                                    <span className="text-[9px] font-black text-[#134e40] bg-teal-100 px-1.5 py-0.5 rounded-md border border-teal-200">
                                      Default
                                    </span>
                                  )}
                                </div>
                                {account.type === 'bank' ? (
                                  <div className="text-xs text-gray-400 font-semibold mt-0.5 space-y-0.5">
                                    <p>{account.accountHolder} · {account.accountNumber}</p>
                                    <p>IFSC: {account.ifsc}</p>
                                  </div>
                                ) : (
                                  <p className="text-xs text-gray-400 font-semibold mt-0.5">{account.upiId}</p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {!account.default && (
                                <motion.button
                                  whileHover={{ scale: 1.03 }}
                                  onClick={() => setDefaultPayout(account.id)}
                                  className="text-xs font-bold text-[#0eb59a] hover:text-[#134e40] transition-colors px-3 py-1.5 bg-white rounded-xl border border-teal-100 hover:border-teal-200"
                                >
                                  Set Default
                                </motion.button>
                              )}
                              {!account.default && (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  onClick={() => removePayout(account.id)}
                                  className="p-2 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                                >
                                  <Trash2 size={14} />
                                </motion.button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Tax Info */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-black text-gray-900 text-base mb-5 flex items-center gap-2">
                      <Shield size={16} className="text-[#0eb59a]" /> Tax Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { label: 'PAN Number', placeholder: 'ABCDE1234F', value: 'ABCDE1234F' },
                        { label: 'GST Number (optional)', placeholder: '27ABCDE1234F1Z5', value: '' },
                        { label: 'TDS Category', placeholder: 'Individual / Sole Proprietor', value: 'Individual' },
                        { label: 'Declared Income Slab', placeholder: 'Select slab', value: '₹10L - ₹50L' },
                      ].map((field, idx) => (
                        <div key={idx}>
                          <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                            {field.label}
                          </label>
                          <input
                            type="text"
                            defaultValue={field.value}
                            placeholder={field.placeholder}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex items-start gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
                      <AlertCircle size={14} className="text-blue-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-700 font-semibold leading-relaxed">
                        TDS of <span className="font-black">10%</span> is deducted from each milestone payment as per Section 194J of the Income Tax Act. Form 16A is issued quarterly.
                      </p>
                    </div>
                  </div>

                  {/* Payout policy */}
                  <div className="bg-teal-50 rounded-2xl border border-teal-100 p-5">
                    <h4 className="font-black text-[#134e40] text-sm mb-3 flex items-center gap-2">
                      <Shield size={14} className="text-[#0eb59a]" /> Payout Policy
                    </h4>
                    <div className="space-y-2">
                      {[
                        { label: 'Processing Time', value: '1-2 business days' },
                        { label: 'Minimum Withdrawal', value: '₹10,000' },
                        { label: 'Platform Fee', value: '10% per milestone' },
                        { label: 'TDS Deduction', value: '10% (Form 16A issued)' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs">
                          <span className="text-teal-600 font-semibold">{item.label}</span>
                          <span className="font-black text-[#134e40]">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(20,78,64,0.25)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="w-full py-4 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2"
                  >
                    <Save size={16} /> Save Payout Settings
                  </motion.button>
                </motion.div>
              )}

              {/* ══ PRIVACY TAB ══ */}
              {activeTab === 'Privacy' && (
                <motion.div
                  key="privacy"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  {/* Privacy controls */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-black text-gray-900 text-base mb-2 flex items-center gap-2">
                      <Shield size={16} className="text-[#0eb59a]" /> Profile Visibility
                    </h3>
                    <p className="text-xs text-gray-400 mb-5 font-semibold">
                      Control what companies can see on your public profile
                    </p>

                    <div className="space-y-4">
                      {privacyItems.map((item, idx) => (
                        <motion.div
                          key={item.key}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${privacy[item.key]
                              ? 'bg-teal-50/50 border-teal-100'
                              : 'bg-gray-50 border-gray-100'
                            }`}
                        >
                          <div className="flex items-center gap-3 flex-1 pr-4">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${privacy[item.key] ? 'bg-teal-100' : 'bg-gray-100'
                              }`}>
                              <item.icon size={15} className={privacy[item.key] ? 'text-[#0eb59a]' : 'text-gray-400'} />
                            </div>
                            <div>
                              <p className="font-bold text-gray-800 text-sm">{item.label}</p>
                              <p className="text-xs text-gray-400 font-semibold mt-0.5">{item.desc}</p>
                            </div>
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => togglePrivacy(item.key)}
                            className={`relative w-12 h-6 rounded-full transition-colors duration-300 shrink-0 ${privacy[item.key] ? 'bg-[#0eb59a]' : 'bg-gray-200'
                              }`}
                          >
                            <motion.div
                              animate={{ x: privacy[item.key] ? 24 : 2 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                            />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Data & Privacy */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-black text-gray-900 text-base mb-5 flex items-center gap-2">
                      <Download size={16} className="text-[#0eb59a]" /> Your Data
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Download My Data', desc: 'Export all your profile, engagement, and earnings data as a CSV', icon: Download, action: 'Download' },
                        { label: 'View Data Usage Policy', desc: 'See how CXO Connect uses your personal information', icon: Eye, action: 'View' },
                        { label: 'Request Data Deletion', desc: 'Submit a request to permanently delete all your data', icon: Trash2, action: 'Request', danger: true },
                      ].map((item, idx) => (
                        <motion.div
                          key={idx}
                          whileHover={{ x: 3 }}
                          className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <item.icon size={16} className={item.danger ? 'text-red-400' : 'text-gray-400'} />
                            <div>
                              <p className={`font-bold text-sm ${item.danger ? 'text-red-500' : 'text-gray-800'}`}>
                                {item.label}
                              </p>
                              <p className="text-xs text-gray-400 font-semibold mt-0.5">{item.desc}</p>
                            </div>
                          </div>
                          <span className={`text-xs font-black px-3 py-1.5 rounded-xl border transition-all ${item.danger
                              ? 'text-red-500 bg-red-50 border-red-100'
                              : 'text-[#0eb59a] bg-teal-50 border-teal-100'
                            }`}>
                            {item.action}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(20,78,64,0.25)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="w-full py-4 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2"
                  >
                    <Save size={16} /> Save Privacy Settings
                  </motion.button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ══ CHANGE PASSWORD MODAL ══ */}
      <AnimatePresence>
        {showPasswordModal && (
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
              className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-gray-900">Change Password</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setShowPasswordModal(false)}
                  className="p-2 rounded-xl bg-gray-50 text-gray-400"
                >
                  <X size={16} />
                </motion.button>
              </div>

              <div className="space-y-4 mb-6">
                {[
                  { label: 'Current Password', key: 'currentPassword', show: showCurrentPassword, toggle: () => setShowCurrentPassword(p => !p) },
                  { label: 'New Password', key: 'newPassword', show: showNewPassword, toggle: () => setShowNewPassword(p => !p) },
                  { label: 'Confirm New Password', key: 'confirmPassword', show: showNewPassword, toggle: () => setShowNewPassword(p => !p) },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                      {field.label}
                    </label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={field.show ? 'text' : 'password'}
                        value={account[field.key]}
                        onChange={e => setAccount(prev => ({ ...prev, [field.key]: e.target.value }))}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all"
                      />
                      <button
                        onClick={field.toggle}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {field.show ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-bold rounded-2xl"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(20,78,64,0.25)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-3 bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white text-sm font-black rounded-2xl shadow-lg"
                >
                  Update Password
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ ADD BANK ACCOUNT MODAL ══ */}
      <AnimatePresence>
        {showAddBankModal && (
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
              className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-gray-900">Add Bank Account</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setShowAddBankModal(false)}
                  className="p-2 rounded-xl bg-gray-50 text-gray-400"
                >
                  <X size={16} />
                </motion.button>
              </div>

              <div className="space-y-4 mb-6">
                {[
                  { label: 'Account Holder Name', key: 'accountHolder', placeholder: 'As on bank records' },
                  { label: 'Bank Name', key: 'bankName', placeholder: 'e.g. HDFC Bank, SBI, Axis Bank' },
                  { label: 'Account Number', key: 'accountNumber', placeholder: 'Enter account number' },
                  { label: 'Confirm Account Number', key: 'confirmAccountNumber', placeholder: 'Re-enter account number' },
                  { label: 'IFSC Code', key: 'ifsc', placeholder: 'e.g. HDFC0001234' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      value={newBank[field.key]}
                      onChange={e => setNewBank(prev => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0eb59a]/20 focus:border-[#0eb59a]/40 transition-all"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100 mb-5">
                <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-700 leading-relaxed font-semibold">
                  Your bank account will be verified via a ₹1 penny deposit within 24 hours before it can be used for withdrawals.
                </p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setShowAddBankModal(false)}
                  className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-bold rounded-2xl"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: (newBank.accountHolder && newBank.accountNumber && newBank.ifsc) ? 1.02 : 1 }}
                  disabled={!newBank.accountHolder || !newBank.accountNumber || !newBank.ifsc}
                  onClick={handleAddBank}
                  className={`flex-1 py-3 text-sm font-black rounded-2xl transition-all ${newBank.accountHolder && newBank.accountNumber && newBank.ifsc
                      ? 'bg-gradient-to-r from-[#134e40] to-[#0eb59a] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  Add & Verify
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ DELETE ACCOUNT MODAL ══ */}
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
              className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 max-w-sm w-full max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden"
            >
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-red-100">
                <Trash2 size={28} className="text-red-500" />
              </div>
              <h3 className="text-xl font-black text-gray-900 text-center mb-2">
                Delete Account
              </h3>
              <p className="text-sm text-gray-400 text-center mb-5 leading-relaxed">
                This action is <span className="font-black text-red-500">permanent and irreversible</span>. All your data including profile, engagements, and earnings history will be deleted.
              </p>

              <div className="mb-5">
                <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                  Type <span className="text-red-500">DELETE</span> to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirm}
                  onChange={e => setDeleteConfirm(e.target.value)}
                  placeholder="Type DELETE here..."
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 focus:border-red-300 rounded-2xl text-sm font-semibold focus:outline-none transition-all"
                />
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => { setShowDeleteModal(false); setDeleteConfirm(''); }}
                  className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-600 text-sm font-bold rounded-2xl"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: deleteConfirm === 'DELETE' ? 1.02 : 1 }}
                  disabled={deleteConfirm !== 'DELETE'}
                  onClick={async () => {
                    await supabase.auth.signOut();
                    navigate('/signin?role=expert');
                  }}
                  className={`flex-1 py-3 text-sm font-black rounded-2xl transition-all ${deleteConfirm === 'DELETE'
                      ? 'bg-red-500 hover:bg-red-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  Delete Forever
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ExpertSettings;
