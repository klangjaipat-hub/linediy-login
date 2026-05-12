import { useState, useEffect, useRef } from 'react'
import {
  MessageCircle, ChevronRight, Plus, Radio, Crown, MessageSquare,
  Zap, Home, ShoppingCart, ClipboardList, CreditCard, Gift, FileText,
  BookOpen, LogOut, Lock, Check, ArrowLeft, Link2, Loader2, X,
  CheckCircle2, Unlock, Sparkles,
} from 'lucide-react'
import PurchaseValidationHeader from './PurchaseValidationHeader'

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_USERS = {
  existing: {
    name: 'สมชาย',
    accounts: [
      { id: '@sellsuki-store', name: 'Sellsuki Store', plan: 'Free',    avatar: 'SS' },
      { id: '@my-shop-th',    name: 'My Shop TH',     plan: 'Premium', avatar: 'MS' },
      { id: '@demo-oa-2024',  name: 'Demo OA 2024',   plan: 'Free',    avatar: 'DO' },
    ],
  },
  new: { name: 'ใหม่', accounts: [] },
}

const PACKAGES = [
  { name: 'BROADCAST PACKAGE', status: 'Free',  icon: Radio },
  { name: 'PREMIUM ID',        status: 'ไม่มี', icon: Crown },
  { name: 'OA CHAT PACKAGE',   status: 'Free',  icon: MessageSquare },
]

const SERVICES = [
  { id: 'broadcast', title: 'BROADCAST PACKAGE', icon: Radio,         desc: 'ส่งข้อความหา Follower',   color: 'text-blue-500',   bg: 'bg-blue-50' },
  { id: 'premium',   title: 'PREMIUM ID',        icon: Crown,         desc: 'Premium LINE Official ID', color: 'text-yellow-500', bg: 'bg-yellow-50' },
  { id: 'chat',      title: 'OA CHAT PACKAGE',   icon: MessageSquare, desc: 'Chat Package สำหรับ OA',  color: 'text-green-500',  bg: 'bg-green-50' },
  { id: 'api',       title: 'MESSAGING API',     icon: Zap,           desc: 'API Integration',          color: 'text-purple-500', bg: 'bg-purple-50' },
]

// locked:true items are hidden behind the lock in Locked Mode
const SIDEBAR_ITEMS = [
  { icon: Home,          label: 'หน้าหลัก',        locked: false },
  { icon: ShoppingCart,  label: 'ซื้อบริการ',       locked: false },
  { icon: ClipboardList, label: 'รายการสั่งซื้อ',   locked: true  },
  { icon: CreditCard,    label: 'แจ้งการชำระเงิน',  locked: true  },
  { icon: Gift,          label: 'สิทธิพิเศษ',       locked: true  },
  { icon: FileText,      label: 'เอกสาร',           locked: true  },
]

// ─── Toast ────────────────────────────────────────────────────────────────────

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

// ─── LinkAccountModal ─────────────────────────────────────────────────────────

function LinkAccountModal({ onClose, onUnlock }) {
  const [basicId, setBasicId] = useState('')
  const [phase,   setPhase]   = useState('input') // 'input' | 'loading' | 'success'
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleVerify = async () => {
    if (!basicId.trim()) return
    setPhase('loading')
    await new Promise(r => setTimeout(r, 1200))
    setPhase('success')
    // Auto-close and unlock after 1.5 s
    setTimeout(() => onUnlock(basicId.trim()), 1500)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="link-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={phase === 'input' ? onClose : undefined}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-200">

        {/* Close (hidden during success) */}
        {phase !== 'success' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        )}

        {/* Icon */}
        <div className="flex justify-center mb-5">
          <span className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${
            phase === 'success' ? 'bg-green-100' : 'bg-[#06C755]/10'
          }`}>
            {phase === 'success'
              ? <CheckCircle2 size={28} className="text-green-600" />
              : <Link2 size={26} className="text-[#06C755]" />
            }
          </span>
        </div>

        {/* Title */}
        <h2
          id="link-modal-title"
          className="text-xl font-bold text-center text-slate-800 mb-1"
        >
          {phase === 'success' ? '🎉 เชื่อมต่อสำเร็จ!' : 'เชื่อมต่อ Basic ID'}
        </h2>
        <p className="text-sm text-center text-slate-500 mb-6">
          {phase === 'success'
            ? `เชื่อมต่อ Basic ID: ${basicId} สำเร็จ!`
            : 'ระบุ Basic ID เพื่อปลดล็อคฟีเจอร์ทั้งหมดและเข้าสู่ Full Mode'}
        </p>

        {/* ── Success state ── */}
        {phase === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center space-y-2">
            <p className="text-green-700 font-semibold text-sm flex items-center justify-center gap-2">
              <Sparkles size={15} />
              กำลังเปิดใช้งาน Full Mode…
            </p>
            {/* Progress bar */}
            <div className="h-1.5 bg-green-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-[1400ms] ease-linear"
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}

        {/* ── Input / Loading state ── */}
        {phase !== 'success' && (
          <>
            <input
              ref={inputRef}
              type="text"
              value={basicId}
              onChange={e => setBasicId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleVerify()}
              placeholder="@shop123"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition mb-3"
            />
            <button
              onClick={handleVerify}
              disabled={phase === 'loading' || !basicId.trim()}
              className="w-full py-3 rounded-xl bg-[#06C755] hover:bg-[#05b34c] active:bg-[#049a42] disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-md shadow-green-100"
            >
              {phase === 'loading' ? (
                <><Loader2 size={16} className="animate-spin" /> กำลังตรวจสอบ…</>
              ) : (
                <><Link2 size={16} /> ตรวจสอบและใช้งาน</>
              )}
            </button>
            <p className="text-xs text-slate-400 text-center mt-3">
              Basic ID ที่ Active จะได้รับ Full Mode ทันที — ไม่ต้องยืนยัน OTP
            </p>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Screen 1: Login ──────────────────────────────────────────────────────────

function LoginScreen({ onLogin }) {
  const [scenario, setScenario] = useState('existing')
  const [loading,  setLoading]  = useState(false)

  const handleLogin = () => {
    setLoading(true)
    setTimeout(() => { setLoading(false); onLogin(scenario) }, 1200)
  }

  return (
    <div className="min-h-screen bg-[#06C755] flex flex-col items-center justify-center p-6">
      <div className="mb-8 text-center">
        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <MessageCircle className="w-10 h-10 text-[#06C755]" />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-wide">LINE</h1>
        <p className="text-white/70 text-sm mt-1">Official Account Manager</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-1">ยินดีต้อนรับ</h2>
        <p className="text-gray-400 text-sm text-center mb-6">เข้าสู่ระบบด้วย LINE Account ของคุณ</p>

        <div className="mb-6 bg-slate-50 rounded-xl p-3 border border-slate-100">
          <p className="text-xs text-slate-400 mb-2 font-semibold uppercase tracking-widest">Demo Scenario</p>
          <div className="flex gap-2">
            {[{ value: 'existing', label: 'Existing User' }, { value: 'new', label: 'New User' }].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setScenario(value)}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                  scenario === value
                    ? 'bg-[#06C755] text-white shadow-sm'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
                }`}
              >{label}</button>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            {scenario === 'existing'
              ? 'จะแสดงหน้าเลือก Basic ID ก่อนเข้า Dashboard'
              : 'จะข้ามไป Dashboard (Locked Mode) — ลอง Link Account Modal'}
          </p>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-[#06C755] hover:bg-[#05b34c] active:bg-[#049a42] text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
        >
          {loading ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> กำลังเข้าสู่ระบบ…</>
          ) : (
            <><MessageCircle className="w-5 h-5" /> Login with LINE</>
          )}
        </button>

        <p className="text-xs text-gray-300 text-center mt-4">ระบบจะใช้ข้อมูล LINE Account ของคุณในการเข้าสู่ระบบ</p>
      </div>
    </div>
  )
}

// ─── Screen 2: Account Selection ─────────────────────────────────────────────

function AccountSelectionScreen({ user, onSelect, onAddNew }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#06C755] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
            <MessageCircle className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">เลือก Basic ID</h1>
          <p className="text-gray-400 text-sm mt-1">สวัสดีครับ คุณ{user.name} — เลือก Basic ID ที่ต้องการจัดการ</p>
        </div>

        <div className="space-y-3 mb-4">
          {user.accounts.map(acc => (
            <button
              key={acc.id}
              onClick={() => onSelect(acc)}
              className="w-full bg-white rounded-xl border border-gray-200 hover:border-[#06C755] hover:shadow-md p-4 flex items-center gap-4 transition-all group text-left"
            >
              <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center shrink-0 font-bold text-green-700 text-sm">{acc.avatar}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm">{acc.name}</p>
                <p className="text-gray-400 text-xs mt-0.5">{acc.id}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${acc.plan === 'Premium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{acc.plan}</span>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#06C755] transition-colors" />
              </div>
            </button>
          ))}
        </div>

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

function DashboardScreen({ user, selectedAccount: initAccount, isLocked: initLocked, onLogout }) {
  const [activeMenu,    setActiveMenu]    = useState('หน้าหลัก')
  const [toast,         setToast]         = useState(null)
  const [showPurchase,  setShowPurchase]  = useState(false)
  const [showLinkModal, setShowLinkModal] = useState(false)
  // Local locked / account state so Dashboard can unlock itself
  const [locked,        setLocked]        = useState(initLocked)
  const [account,       setAccount]       = useState(initAccount)
  const [justUnlocked,  setJustUnlocked]  = useState(false)

  const handlePurchase = () => {
    setToast('กำลังไปยังหน้าตรวจสอบ Basic ID…')
    setTimeout(() => setShowPurchase(true), 900)
  }

  const handleUnlock = (linkedId) => {
    const initials = linkedId.replace('@', '').slice(0, 2).toUpperCase()
    setAccount({ id: linkedId, name: linkedId, avatar: initials, plan: 'Free' })
    setLocked(false)
    setShowLinkModal(false)
    setJustUnlocked(true)
    setToast(`✅ ปลดล็อค Full Mode สำเร็จ! บัญชี: ${linkedId}`)
    setTimeout(() => setJustUnlocked(false), 2500)
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      {showLinkModal && <LinkAccountModal onClose={() => setShowLinkModal(false)} onUnlock={handleUnlock} />}

      {/* ── Sidebar ── */}
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col shrink-0 shadow-sm">

        {/* Logo + mode badge */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-[#06C755] rounded-lg flex items-center justify-center shrink-0">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-800 text-sm">LINE OA Manager</span>
          </div>

          {/* Mode indicator */}
          {locked ? (
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
              <Lock className="w-3 h-3 text-amber-600 shrink-0" />
              <span className="text-xs text-amber-700 font-semibold">Locked Mode</span>
            </div>
          ) : (
            <div className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all duration-700 ${
              justUnlocked ? 'bg-green-100 border border-green-300' : 'bg-green-50 border border-green-100'
            }`}>
              <Unlock className={`w-3 h-3 shrink-0 ${justUnlocked ? 'text-green-600' : 'text-green-500'}`} />
              <span className={`text-xs font-semibold ${justUnlocked ? 'text-green-700' : 'text-green-600'}`}>Full Mode</span>
              {justUnlocked && <Sparkles className="w-3 h-3 text-green-500 animate-pulse" />}
            </div>
          )}
        </div>

        {/* Account pill */}
        {account ? (
          <div className="px-3 py-2.5 border-b border-gray-100">
            <div className="flex items-center gap-2 bg-green-50 rounded-lg px-2.5 py-2">
              <div className="w-7 h-7 rounded-md bg-green-200 flex items-center justify-center text-xs font-bold text-green-800 shrink-0">
                {account.avatar}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-700 truncate">{account.name}</p>
                <p className="text-xs text-gray-400 truncate">{account.id}</p>
              </div>
            </div>
          </div>
        ) : null}

        {/* ── Link Account trigger (Locked Mode only) ── */}
        {locked && (
          <div className="px-3 py-2.5 border-b border-gray-100">
            <button
              onClick={() => setShowLinkModal(true)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-[#06C755]/10 hover:bg-[#06C755]/20 border border-[#06C755]/30 text-[#06C755] text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">เพิ่ม/เชื่อมต่อ Basic ID เดิม</span>
            </button>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {SIDEBAR_ITEMS.map(({ icon: Icon, label, locked: itemLocked }) => {
            const isItemLocked = locked && itemLocked
            const isJustOpened = justUnlocked && itemLocked
            return (
              <button
                key={label}
                onClick={() => !isItemLocked && setActiveMenu(label)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-500 ${
                  isJustOpened
                    ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
                    : isItemLocked
                    ? 'opacity-40 cursor-not-allowed text-gray-400'
                    : activeMenu === label
                    ? 'bg-green-50 text-[#06C755]'
                    : 'text-gray-600 hover:bg-slate-50 hover:text-gray-800'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1 text-left">{label}</span>
                {isItemLocked
                  ? <Lock className="w-3 h-3 text-gray-300 shrink-0" />
                  : isJustOpened
                  ? <Unlock className="w-3 h-3 text-green-500 shrink-0 animate-pulse" />
                  : null
                }
              </button>
            )
          })}
        </nav>

        {/* Bottom links */}
        <div className="px-2 py-3 border-t border-gray-100 space-y-0.5">
          {[{ icon: BookOpen, label: 'คู่มือการใช้งาน' }, { icon: MessageCircle, label: 'ติดต่อเรา' }].map(({ icon: Icon, label }) => (
            <button key={label} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-slate-50 hover:text-gray-700 transition-colors">
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          ))}
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors">
            <LogOut className="w-4 h-4 shrink-0" />
            ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">

          {showPurchase ? (
            <div>
              <button onClick={() => setShowPurchase(false)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-5 transition-colors">
                <ArrowLeft className="w-4 h-4" /> กลับหน้า Dashboard
              </button>
              <h2 className="text-xl font-bold text-gray-800 mb-5">ซื้อบริการ — ระบุ Basic ID</h2>
              <PurchaseValidationHeader onProceed={(p) => alert('Order payload:\n' + JSON.stringify(p, null, 2))} />
            </div>
          ) : (
            <>
              {/* Greeting */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">สวัสดีครับ คุณ{user.name}</h1>
                <p className="text-gray-400 text-sm mt-1">
                  {locked ? 'กรุณาซื้อบริการหรือเชื่อมต่อ Basic ID เพื่อเริ่มใช้งาน' : 'ยินดีต้อนรับกลับมาสู่ LINE OA Manager'}
                </p>
              </div>

              {/* ── Locked Mode Banner ── */}
              {locked && (
                <div className="mb-7 bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Lock className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-bold text-amber-800 text-sm">คุณอยู่ใน Locked Mode</p>
                      <p className="text-xs text-amber-600 mt-0.5 leading-relaxed">
                        เชื่อมต่อ Basic ID เพื่อปลดล็อคเมนู รายการสั่งซื้อ, แจ้งชำระเงิน, สิทธิพิเศษ และ เอกสาร
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowLinkModal(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#06C755] hover:bg-[#05b34c] active:bg-[#049a42] text-white font-semibold text-sm transition-colors shadow-md shadow-green-100 whitespace-nowrap shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    เพิ่ม/เชื่อมต่อ Basic ID เดิม
                  </button>
                </div>
              )}

              {/* ── Full Mode unlock celebration ── */}
              {justUnlocked && !locked && (
                <div className="mb-7 bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-3 animate-in fade-in duration-500">
                  <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                    <Unlock className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-green-800 text-sm flex items-center gap-1.5">
                      <Sparkles size={14} /> Full Mode เปิดใช้งานแล้ว!
                    </p>
                    <p className="text-xs text-green-600 mt-0.5">เมนูทั้งหมดพร้อมใช้งานเรียบร้อยแล้ว</p>
                  </div>
                </div>
              )}

              {/* Package Status */}
              <section className="mb-8">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">สถานะแพ็กเกจปัจจุบัน</h2>
                <div className="space-y-3">
                  {PACKAGES.map(({ name, status, icon: Icon }) => (
                    <div key={name} className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between">
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

              {/* Service Grid */}
              <section>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">กรุณาเลือกบริการที่ต้องการ</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {SERVICES.map(({ id, title, icon: Icon, desc, color, bg }) => (
                    <div key={id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col items-center text-center gap-3">
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
  if (step === 'account-routing') return <AccountSelectionScreen user={user} onSelect={handleAccountSelect} onAddNew={handleAddNew} />
  if (step === 'dashboard')       return (
    <DashboardScreen
      user={user}
      selectedAccount={selectedAccount}
      isLocked={isLocked}
      onLogout={handleLogout}
    />
  )
  return null
}
