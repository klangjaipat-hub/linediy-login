import { useState, useEffect } from 'react'
import {
  MessageCircle, ChevronRight, Plus, Radio, Crown, MessageSquare,
  Zap, Home, ShoppingCart, ClipboardList, CreditCard, Gift, FileText,
  BookOpen, LogOut, Lock, Check, ArrowLeft
} from 'lucide-react'
import PurchaseValidationHeader from './PurchaseValidationHeader'

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_USERS = {
  existing: {
    name: 'สมชาย',
    accounts: [
      { id: '@sellsuki-store', name: 'Sellsuki Store',  plan: 'Free',    avatar: 'SS' },
      { id: '@my-shop-th',    name: 'My Shop TH',      plan: 'Premium', avatar: 'MS' },
      { id: '@demo-oa-2024',  name: 'Demo OA 2024',    plan: 'Free',    avatar: 'DO' },
    ],
  },
  new: {
    name: 'ใหม่',
    accounts: [],
  },
}

const PACKAGES = [
  { name: 'BROADCAST PACKAGE', status: 'Free',  icon: Radio },
  { name: 'PREMIUM ID',        status: 'ไม่มี', icon: Crown },
  { name: 'OA CHAT PACKAGE',   status: 'Free',  icon: MessageSquare },
]

const SERVICES = [
  { id: 'broadcast', title: 'BROADCAST PACKAGE', icon: Radio,          desc: 'ส่งข้อความหา Follower',     color: 'text-blue-500',   bg: 'bg-blue-50' },
  { id: 'premium',   title: 'PREMIUM ID',        icon: Crown,          desc: 'Premium LINE Official ID',   color: 'text-yellow-500', bg: 'bg-yellow-50' },
  { id: 'chat',      title: 'OA CHAT PACKAGE',   icon: MessageSquare,  desc: 'Chat Package สำหรับ OA',    color: 'text-green-500',  bg: 'bg-green-50' },
  { id: 'api',       title: 'MESSAGING API',     icon: Zap,            desc: 'API Integration',            color: 'text-purple-500', bg: 'bg-purple-50' },
]

const SIDEBAR_ITEMS = [
  { icon: Home,          label: 'หน้าหลัก' },
  { icon: ShoppingCart,  label: 'ซื้อบริการ' },
  { icon: ClipboardList, label: 'รายการสั่งซื้อ' },
  { icon: CreditCard,    label: 'แจ้งการชำระเงิน' },
  { icon: Gift,          label: 'สิทธิพิเศษ' },
  { icon: FileText,      label: 'เอกสาร' },
]

// ─── Shared: Toast ────────────────────────────────────────────────────────────

function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3200)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm px-5 py-3 rounded-xl shadow-xl flex items-center gap-2">
      <Check className="w-4 h-4 text-green-400 shrink-0" />
      {message}
    </div>
  )
}

// ─── Screen 1: Login ──────────────────────────────────────────────────────────

function LoginScreen({ onLogin }) {
  const [scenario, setScenario] = useState('existing')
  const [loading,  setLoading]  = useState(false)

  const handleLogin = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onLogin(scenario)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-[#06C755] flex flex-col items-center justify-center p-6">
      {/* Brand */}
      <div className="mb-8 text-center">
        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <MessageCircle className="w-10 h-10 text-[#06C755]" />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-wide">LINE</h1>
        <p className="text-white/70 text-sm mt-1">Official Account Manager</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-1">ยินดีต้อนรับ</h2>
        <p className="text-gray-400 text-sm text-center mb-6">เข้าสู่ระบบด้วย LINE Account ของคุณ</p>

        {/* Demo toggle */}
        <div className="mb-6 bg-slate-50 rounded-xl p-3 border border-slate-100">
          <p className="text-xs text-slate-400 mb-2 font-semibold uppercase tracking-widest">Demo Scenario</p>
          <div className="flex gap-2">
            {[
              { value: 'existing', label: 'Existing User' },
              { value: 'new',      label: 'New User' },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setScenario(value)}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                  scenario === value
                    ? 'bg-[#06C755] text-white shadow-sm'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            {scenario === 'existing'
              ? 'จะแสดงหน้าเลือก Basic ID ก่อนเข้า Dashboard'
              : 'จะข้ามไป Dashboard (Locked Mode) โดยตรง'}
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-[#06C755] hover:bg-[#05b34c] active:bg-[#049a42] text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              กำลังเข้าสู่ระบบ…
            </>
          ) : (
            <>
              <MessageCircle className="w-5 h-5" />
              Login with LINE
            </>
          )}
        </button>

        <p className="text-xs text-gray-300 text-center mt-4">
          ระบบจะใช้ข้อมูล LINE Account ของคุณในการเข้าสู่ระบบ
        </p>
      </div>
    </div>
  )
}

// ─── Screen 2: Account Selection ─────────────────────────────────────────────

function AccountSelectionScreen({ user, onSelect, onAddNew }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#06C755] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
            <MessageCircle className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">เลือก Basic ID</h1>
          <p className="text-gray-400 text-sm mt-1">
            สวัสดีครับ คุณ{user.name} — เลือก Basic ID ที่ต้องการจัดการ
          </p>
        </div>

        {/* Account list */}
        <div className="space-y-3 mb-4">
          {user.accounts.map((acc) => (
            <button
              key={acc.id}
              onClick={() => onSelect(acc)}
              className="w-full bg-white rounded-xl border border-gray-200 hover:border-[#06C755] hover:shadow-md p-4 flex items-center gap-4 transition-all group text-left"
            >
              <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center shrink-0 font-bold text-green-700 text-sm">
                {acc.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm">{acc.name}</p>
                <p className="text-gray-400 text-xs mt-0.5">{acc.id}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                  acc.plan === 'Premium'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {acc.plan}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#06C755] transition-colors" />
              </div>
            </button>
          ))}
        </div>

        {/* Add new */}
        <button
          onClick={onAddNew}
          className="w-full bg-white border-2 border-dashed border-gray-300 hover:border-[#06C755] rounded-xl p-4 flex items-center justify-center gap-2 text-gray-400 hover:text-[#06C755] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="font-semibold text-sm">Add New / Buy Service</span>
        </button>
      </div>
    </div>
  )
}

// ─── Screen 3: Dashboard ──────────────────────────────────────────────────────

function DashboardScreen({ user, selectedAccount, isLocked, onLogout }) {
  const [activeMenu,   setActiveMenu]   = useState('หน้าหลัก')
  const [toast,        setToast]        = useState(null)
  const [showPurchase, setShowPurchase] = useState(false)

  const handlePurchase = () => {
    setToast('Navigating to Sandwich Validation Page for ID classification')
    setTimeout(() => setShowPurchase(true), 900)
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {/* ── Sidebar ── */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0 shadow-sm">
        {/* Logo */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-[#06C755] rounded-lg flex items-center justify-center shrink-0">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-800 text-sm">LINE OA Manager</span>
          </div>
          {isLocked && (
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
              <Lock className="w-3 h-3 text-amber-600 shrink-0" />
              <span className="text-xs text-amber-700 font-semibold">Locked Mode</span>
            </div>
          )}
        </div>

        {/* Selected account pill */}
        {selectedAccount && (
          <div className="px-3 py-2.5 border-b border-gray-100">
            <div className="flex items-center gap-2 bg-green-50 rounded-lg px-2.5 py-2">
              <div className="w-7 h-7 rounded-md bg-green-200 flex items-center justify-center text-xs font-bold text-green-800 shrink-0">
                {selectedAccount.avatar}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-700 truncate">{selectedAccount.name}</p>
                <p className="text-xs text-gray-400 truncate">{selectedAccount.id}</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {SIDEBAR_ITEMS.map(({ icon: Icon, label }) => (
            <button
              key={label}
              onClick={() => setActiveMenu(label)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeMenu === label
                  ? 'bg-green-50 text-[#06C755]'
                  : 'text-gray-600 hover:bg-slate-50 hover:text-gray-800'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        {/* Bottom links */}
        <div className="px-2 py-3 border-t border-gray-100 space-y-0.5">
          {[
            { icon: BookOpen,      label: 'คู่มือการใช้งาน' },
            { icon: MessageCircle, label: 'ติดต่อเรา' },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-slate-50 hover:text-gray-700 transition-colors"
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          ))}
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">

          {showPurchase ? (
            /* Purchase sub-page */
            <div>
              <button
                onClick={() => setShowPurchase(false)}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                กลับหน้า Dashboard
              </button>
              <h2 className="text-xl font-bold text-gray-800 mb-5">ซื้อบริการ — ระบุ Basic ID</h2>
              <PurchaseValidationHeader
                onProceed={(payload) => alert('Order payload:\n' + JSON.stringify(payload, null, 2))}
              />
            </div>
          ) : (
            <>
              {/* Greeting */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">
                  สวัสดีครับ คุณ{user.name}
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  {isLocked
                    ? 'กรุณาซื้อบริการเพื่อเริ่มใช้งาน LINE Official Account'
                    : 'ยินดีต้อนรับกลับมาสู่ LINE OA Manager'}
                </p>
              </div>

              {/* Section 1: Package Status */}
              <section className="mb-8">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  ส่วนแสดงสถานะแพ็กเกจปัจจุบัน
                </h2>
                <div className="space-y-3">
                  {PACKAGES.map(({ name, status, icon: Icon }) => (
                    <div
                      key={name}
                      className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="font-medium text-gray-700 text-sm">{name}</span>
                      </div>
                      <span className="text-[#06C755] font-semibold text-sm">{status}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 2: Service Grid */}
              <section>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  กรุณาเลือกบริการที่ต้องการ
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {SERVICES.map(({ id, title, icon: Icon, desc, color, bg }) => (
                    <div
                      key={id}
                      className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col items-center text-center gap-3"
                    >
                      <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-xs leading-tight">{title}</p>
                        <p className="text-gray-400 text-xs mt-1">{desc}</p>
                      </div>
                      <button
                        onClick={handlePurchase}
                        className="w-full bg-[#06C755] hover:bg-[#05b34c] active:bg-[#049a42] text-white text-xs font-semibold py-2 rounded-lg transition-colors"
                      >
                        สั่งซื้อ
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

// ─── Orchestrator ─────────────────────────────────────────────────────────────

export default function PrePurchaseJourney() {
  const [step,            setStep]            = useState('login')
  const [user,            setUser]            = useState(null)
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [isLocked,        setIsLocked]        = useState(false)

  const handleLogin = (scenario) => {
    const userData = MOCK_USERS[scenario]
    setUser(userData)
    if (userData.accounts.length === 0) {
      setIsLocked(true)
      setStep('dashboard')
    } else {
      setStep('account-routing')
    }
  }

  const handleAccountSelect = (account) => {
    setSelectedAccount(account)
    setIsLocked(false)
    setStep('dashboard')
  }

  const handleAddNew = () => {
    setSelectedAccount(null)
    setIsLocked(true)
    setStep('dashboard')
  }

  const handleLogout = () => {
    setStep('login')
    setUser(null)
    setSelectedAccount(null)
    setIsLocked(false)
  }

  if (step === 'login')           return <LoginScreen onLogin={handleLogin} />
  if (step === 'account-routing') return (
    <AccountSelectionScreen user={user} onSelect={handleAccountSelect} onAddNew={handleAddNew} />
  )
  if (step === 'dashboard') return (
    <DashboardScreen
      user={user}
      selectedAccount={selectedAccount}
      isLocked={isLocked}
      onLogout={handleLogout}
    />
  )
  return null
}
