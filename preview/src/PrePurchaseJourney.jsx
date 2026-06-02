import { useState, useEffect, useRef } from 'react'
import {
  MessageCircle, ChevronRight, Plus, Radio, Crown, MessageSquare,
  Zap, Home, ShoppingCart, ClipboardList, CreditCard, Gift, FileText,
  BookOpen, LogOut, Lock, Check, ArrowLeft, Link2, Loader2, X,
  CheckCircle2, Unlock, Sparkles, UserCog, UserCheck, UserPlus,
  Settings, ChevronLeft, LogIn, Info,
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

const MOCK_CONNECTED_IDS = [
  { id: '@333aaaa',    name: 'LINE by Sellsuki', plan: 'Free'    },
  { id: '@mybrand-th', name: 'My Brand Store',   plan: 'Premium' },
]

const PACKAGES = [
  { name: 'BROADCAST PACKAGE', status: 'Free',  icon: Radio },
  { name: 'PREMIUM ID',        status: 'ไม่มี', icon: Crown },
  { name: 'OA CHAT PACKAGE',   status: 'Free',  icon: MessageSquare },
]

const SERVICES = [
  { id: 'broadcast', title: 'BROADCAST PACKAGE', icon: Radio,         desc: 'ส่งข้อความหา Follower',   color: 'text-blue-500',   bg: 'bg-blue-50',    price: '฿1,500', unit: '/เดือน' },
  { id: 'premium',   title: 'PREMIUM ID',        icon: Crown,         desc: 'Premium LINE Official ID', color: 'text-yellow-500', bg: 'bg-yellow-50',  price: '฿3,000', unit: '/ปี'    },
  { id: 'chat',      title: 'OA CHAT PACKAGE',   icon: MessageSquare, desc: 'Chat Package สำหรับ OA',  color: 'text-green-500',  bg: 'bg-green-50',   price: '฿990',   unit: '/เดือน' },
  { id: 'api',       title: 'MESSAGING API',     icon: Zap,           desc: 'API Integration',          color: 'text-purple-500', bg: 'bg-purple-50',  price: '฿2,500', unit: '/เดือน' },
]

const SIDEBAR_ITEMS = [
  { icon: Home,          label: 'หน้าหลัก',        locked: false },
  { icon: ShoppingCart,  label: 'ซื้อบริการ',       locked: false },
  { icon: ClipboardList, label: 'รายการสั่งซื้อ',   locked: true  },
  { icon: CreditCard,    label: 'แจ้งการชำระเงิน',  locked: true  },
  { icon: Gift,          label: 'สิทธิพิเศษ',       locked: true  },
  { icon: FileText,      label: 'เอกสาร',           locked: true  },
]

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, type = 'success', onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3200)
    return () => clearTimeout(t)
  }, [onDone])
  if (type === 'locked') {
    return (
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-amber-800 text-white text-sm px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 max-w-sm text-center">
        <Lock className="w-4 h-4 text-amber-300 shrink-0" />
        {message}
      </div>
    )
  }
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm px-5 py-3 rounded-xl shadow-xl flex items-center gap-2">
      <Check className="w-4 h-4 text-green-400 shrink-0" />
      {message}
    </div>
  )
}

// ─── Tooltip (Basic ID jargon helper) ────────────────────────────────────────

function BasicIdTooltip() {
  const [open, setOpen] = useState(false)
  return (
    <span className="relative inline-flex items-center ml-1">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}
        className="text-slate-400 hover:text-slate-600 transition-colors align-middle" aria-label="Basic ID คืออะไร?"
      >
        <Info size={13} />
      </button>
      {open && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 rounded-lg bg-slate-800 text-white text-xs p-3 leading-relaxed shadow-lg z-20 pointer-events-none">
          Basic ID คือรหัส @username ของ LINE OA เช่น @myshop — ใช้สำหรับค้นหาและจดจำบัญชีของคุณ
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
        </span>
      )}
    </span>
  )
}

// ─── LinkAccountModal ─────────────────────────────────────────────────────────

function LinkAccountModal({ onClose, onUnlock }) {
  const [basicId, setBasicId] = useState('')
  const [phase,   setPhase]   = useState('input')
  const inputRef = useRef(null)
  useEffect(() => { inputRef.current?.focus() }, [])

  const handleVerify = async () => {
    if (!basicId.trim()) return
    setPhase('loading')
    await new Promise(r => setTimeout(r, 1200))
    setPhase('success')
    setTimeout(() => onUnlock(basicId.trim()), 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={phase === 'input' ? onClose : undefined} />
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        {phase !== 'success' && (
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
        )}
        <div className="flex justify-center mb-5">
          <span className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${phase === 'success' ? 'bg-green-100' : 'bg-[#06C755]/10'}`}>
            {phase === 'success' ? <CheckCircle2 size={28} className="text-green-600" /> : <Link2 size={26} className="text-[#06C755]" />}
          </span>
        </div>
        <h2 className="text-xl font-bold text-center text-slate-800 mb-1 flex items-center justify-center gap-1">
          {phase === 'success' ? '🎉 เชื่อมต่อสำเร็จ!' : <><span>เชื่อมต่อ Basic ID</span><BasicIdTooltip /></>}
        </h2>
        <p className="text-sm text-center text-slate-500 mb-6">
          {phase === 'success' ? `เชื่อมต่อ Basic ID: ${basicId} สำเร็จ!` : 'ระบุ Basic ID เพื่อปลดล็อคฟีเจอร์ทั้งหมดและเข้าสู่ Full Mode'}
        </p>
        {phase === 'success' ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center space-y-2">
            <p className="text-green-700 font-semibold text-sm flex items-center justify-center gap-2"><Sparkles size={15} /> กำลังเปิดใช้งาน Full Mode…</p>
            <div className="h-1.5 bg-green-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full transition-all duration-[1400ms] ease-linear" style={{ width: '100%' }} />
            </div>
          </div>
        ) : (
          <>
            <input ref={inputRef} type="text" value={basicId} onChange={e => setBasicId(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleVerify()} placeholder="@shop123"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition mb-3" />
            <button onClick={handleVerify} disabled={phase === 'loading' || !basicId.trim()}
              className="w-full py-3 rounded-xl bg-[#06C755] hover:bg-[#05b34c] disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-md shadow-green-100">
              {phase === 'loading' ? <><Loader2 size={16} className="animate-spin" /> กำลังตรวจสอบ…</> : <><Link2 size={16} /> ตรวจสอบและใช้งาน</>}
            </button>
            <p className="text-xs text-slate-400 text-center mt-3">Basic ID ที่ Active จะได้รับ Full Mode ทันที — ไม่ต้องยืนยัน OTP</p>
          </>
        )}
      </div>
    </div>
  )
}

// ─── ManageBasicIdCard — centered card with 4 internal steps ─────────────────
//
// Steps: ACCOUNT_LIST → TYPE_SELECTION → VALIDATION_FORM
//                                      → LOADING (→ auto-redirect)
// New users skip ACCOUNT_LIST and start at TYPE_SELECTION.

function ManageBasicIdCard({ hasIds, initialStep, onExit, onUnlockFullMode, onRedirectToPurchase }) {
  const [step,       setStep]       = useState(initialStep ?? (hasIds ? 'ACCOUNT_LIST' : 'TYPE_SELECTION'))
  const [selectedId, setSelectedId] = useState(hasIds ? MOCK_CONNECTED_IDS[0].id : null)
  const [basicId,    setBasicId]    = useState('')
  const [verify,     setVerify]     = useState(null) // null | 'loading' | 'success'
  const [fading,     setFading]     = useState(false)
  const [stepKey,    setStepKey]    = useState(0)

  // Auto-redirect when LOADING
  useEffect(() => {
    if (step !== 'LOADING') return
    const t = setTimeout(() => onRedirectToPurchase?.(), 2200)
    return () => clearTimeout(t)
  }, [step, onRedirectToPurchase])

  // Animated step transition
  const goto = (next) => {
    setFading(true)
    setTimeout(() => {
      setStep(next)
      setStepKey(k => k + 1)
      setFading(false)
    }, 180)
  }

  const handleLogin = () => {
    // "เข้าสู่บัญชี" — treat selected ID as account login
    const acc = MOCK_CONNECTED_IDS.find(a => a.id === selectedId)
    onUnlockFullMode?.(selectedId, acc?.name)
    onExit?.()
  }

  const handleVerify = async () => {
    if (!basicId.trim()) return
    setVerify('loading')
    await new Promise(r => setTimeout(r, 1200))
    setVerify('success')
    setTimeout(() => {
      onUnlockFullMode?.(basicId.trim())
      onExit?.()
    }, 1600)
  }

  return (
    <div className="w-full max-w-xl">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10">
        {/* ── Fading content wrapper ── */}
        <div
          key={stepKey}
          className={`transition-all duration-200 ease-in-out ${fading ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'}`}
        >

          {/* ══ ACCOUNT_LIST ══ */}
          {step === 'ACCOUNT_LIST' && (
            <>
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <span className="w-14 h-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center">
                  <UserCog size={26} className="text-[#06C755]" />
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-800 text-center mb-1">เลือก Basic ID</h2>
              <p className="text-sm text-slate-500 text-center mb-7">กรุณาเลือก Basic ID ของท่าน</p>

              {/* Radio list */}
              <div className="space-y-3 mb-7">
                {MOCK_CONNECTED_IDS.map(acc => (
                  <label
                    key={acc.id}
                    htmlFor={`radio-${acc.id}`}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedId === acc.id
                        ? 'border-[#06C755] bg-green-50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      id={`radio-${acc.id}`}
                      type="radio"
                      name="selectedBasicId"
                      value={acc.id}
                      checked={selectedId === acc.id}
                      onChange={() => setSelectedId(acc.id)}
                      className="accent-green-500 w-4 h-4 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm">{acc.id}</p>
                      <p className="text-xs text-slate-400 mt-0.5">({acc.name})</p>
                    </div>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold shrink-0 ${
                      acc.plan === 'Premium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {acc.plan}
                    </span>
                  </label>
                ))}
              </div>

              {/* Primary CTA */}
              <button
                onClick={handleLogin}
                disabled={!selectedId}
                className="w-full py-3.5 rounded-xl bg-[#06C755] hover:bg-[#05b34c] active:bg-[#049a42] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-md shadow-green-100 mb-3"
              >
                <LogIn size={16} />
                เข้าสู่บัญชี
              </button>

              {/* Secondary CTA */}
              <button
                onClick={() => goto('TYPE_SELECTION')}
                className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 font-semibold text-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus size={15} />
                เพิ่ม/เชื่อมต่อ LINE OA
              </button>
            </>
          )}

          {/* ══ TYPE_SELECTION ══ */}
          {step === 'TYPE_SELECTION' && (
            <>
              {/* Back (only if came from ACCOUNT_LIST) */}
              {hasIds && step === 'TYPE_SELECTION' && (
                <button onClick={() => goto('ACCOUNT_LIST')} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 mb-5 transition-colors">
                  <ChevronLeft size={15} /> กลับ
                </button>
              )}

              <h2 className="text-xl font-bold text-slate-800 mb-1">กรุณาเลือกประเภทบัญชี</h2>
              <p className="text-sm text-slate-500 mb-7">Select Account Type</p>

              <div className="grid grid-cols-2 gap-4">
                {/* Card 1 — ลูกค้าปัจจุบัน */}
                <button
                  onClick={() => goto('VALIDATION_FORM')}
                  className="group text-left bg-white border-2 border-slate-200 hover:border-[#06C755] rounded-2xl p-5 transition-all hover:shadow-md cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-xl bg-green-50 group-hover:bg-green-100 flex items-center justify-center mb-4 transition-colors">
                    <UserCheck size={22} className="text-[#06C755]" />
                  </div>
                  <p className="font-bold text-slate-800 text-sm leading-tight mb-1">บัญชีเดิม</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    สำหรับบัญชีที่เคยซื้อแพ็กเกจกับ Sellsuki แล้ว
                  </p>
                </button>

                {/* Card 2 — เปิดบัญชีใหม่/ย้ายบัญชี */}
                <button
                  onClick={() => goto('LOADING')}
                  className="group text-left bg-white border-2 border-slate-200 hover:border-blue-400 rounded-2xl p-5 transition-all hover:shadow-md cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center mb-4 transition-colors">
                    <UserPlus size={22} className="text-blue-500" />
                  </div>
                  <p className="font-bold text-slate-800 text-sm leading-tight mb-1">เปิดบัญชีใหม่/ย้ายบัญชี</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    สำหรับผู้ที่ต้องการเปิดบัญชีหรือย้ายเข้า Sellsuki
                  </p>
                </button>
              </div>
            </>
          )}

          {/* ══ VALIDATION_FORM ══ */}
          {step === 'VALIDATION_FORM' && (
            <>
              <button onClick={() => goto('TYPE_SELECTION')} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 mb-5 transition-colors">
                <ChevronLeft size={15} /> กลับ
              </button>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1 mb-4">
                <UserCheck size={13} className="text-green-600" />
                <span className="text-xs font-semibold text-green-700">ลูกค้าปัจจุบัน</span>
              </div>

              <h2 className="text-xl font-bold text-slate-800 mb-1 flex items-center gap-1">ตรวจสอบ Basic ID <BasicIdTooltip /></h2>
              <p className="text-sm text-slate-500 mb-7">กรอก Basic ID เพื่อยืนยันบัญชีและเชื่อมต่อ</p>

              <div className="space-y-3">
                <div>
                  <label className="flex items-center gap-1 text-sm font-semibold text-slate-700 mb-2">
                    Basic ID <BasicIdTooltip /> <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-3">
                    <input
                      autoFocus
                      type="text"
                      value={basicId}
                      onChange={e => { setBasicId(e.target.value); if (verify) setVerify(null) }}
                      onKeyDown={e => e.key === 'Enter' && handleVerify()}
                      placeholder="@your-id"
                      disabled={verify === 'success'}
                      className={`flex-1 rounded-xl border px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 transition bg-white ${
                        verify === 'success'
                          ? 'border-green-500 bg-green-50 focus:ring-green-100'
                          : 'border-slate-300 focus:border-green-500 focus:ring-green-200'
                      }`}
                    />
                    <button
                      onClick={handleVerify}
                      disabled={verify === 'loading' || verify === 'success' || !basicId.trim()}
                      className="px-5 py-3 rounded-xl bg-[#06C755] hover:bg-[#05b34c] disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-sm transition-colors whitespace-nowrap"
                    >
                      {verify === 'loading'
                        ? <Loader2 size={16} className="animate-spin" />
                        : 'ตรวจสอบ'
                      }
                    </button>
                  </div>
                </div>

                {/* Success state */}
                {verify === 'success' && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-green-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-green-800">✅ เชื่อมต่อสำเร็จ</p>
                      <p className="text-xs text-green-600 mt-0.5 flex items-center gap-1">
                        <Sparkles size={11} /> กำลังกลับสู่ Full Mode Dashboard…
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ══ LOADING ══ */}
          {step === 'LOADING' && (
            <div className="py-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                <Loader2 size={30} className="text-blue-500 animate-spin" />
              </div>
              <p className="font-bold text-slate-800 text-lg mb-2">กำลังนำทาง…</p>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                กำลังพาคุณไปยังหน้า "ซื้อบริการ"<br />
                เพื่อดำเนินการเปิดบัญชีใหม่ / ย้ายค่าย…
              </p>
              <p className="text-xs text-slate-300 mt-3">Redirecting to Buy Service page...</p>
            </div>
          )}

        </div>
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
              <button key={value} onClick={() => setScenario(value)}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${scenario === value ? 'bg-[#06C755] text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'}`}>
                {label}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            {scenario === 'existing' ? 'จะแสดงหน้าเลือก Basic ID ก่อนเข้า Dashboard' : 'จะข้ามไป Dashboard (Locked Mode) — ลอง Link Account Modal'}
          </p>
        </div>
        <button onClick={handleLogin} disabled={loading}
          className="w-full bg-[#06C755] hover:bg-[#05b34c] text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-70">
          {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> กำลังเข้าสู่ระบบ…</> : <><MessageCircle className="w-5 h-5" /> Login with LINE</>}
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
            <button key={acc.id} onClick={() => onSelect(acc)}
              className="w-full bg-white rounded-xl border border-gray-200 hover:border-[#06C755] hover:shadow-md p-4 flex items-center gap-4 transition-all group text-left">
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
        <button onClick={onAddNew} className="w-full bg-white border-2 border-dashed border-gray-300 hover:border-[#06C755] rounded-xl p-4 flex items-center justify-center gap-2 text-gray-400 hover:text-[#06C755] transition-all">
          <Plus className="w-4 h-4" />
          <span className="font-semibold text-sm">Add New / Buy Service</span>
        </button>
      </div>
    </div>
  )
}

// ─── Purchase Step 2: Order Summary ──────────────────────────────────────────

function OrderSummaryStep({ service, accountData, onBack, onConfirm }) {
  const Icon = service?.icon ?? Radio
  return (
    <section className="max-w-5xl mx-auto bg-slate-50 rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-green-600 mb-1">Step 2 of 2</p>
        <h1 className="text-xl md:text-2xl font-bold text-slate-800 leading-snug">สรุปคำสั่งซื้อ</h1>
        <p className="text-sm text-slate-500 mt-1">Order Summary — กรุณาตรวจสอบรายละเอียดก่อนยืนยัน</p>
      </div>

      <div className="space-y-4 max-w-2xl">
        {/* Service card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl ${service?.bg ?? 'bg-slate-100'} flex items-center justify-center shrink-0`}>
            <Icon className={`w-6 h-6 ${service?.color ?? 'text-slate-500'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-800 text-sm">{service?.title ?? '—'}</p>
            <p className="text-xs text-slate-400 mt-0.5">{service?.desc ?? ''}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-bold text-slate-800 text-lg">{service?.price ?? '—'}</p>
            <p className="text-xs text-slate-400">{service?.unit ?? ''}</p>
          </div>
        </div>

        {/* Account info */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">ข้อมูลบัญชี</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">ประเภทบัญชี</span>
              <span className="font-semibold text-slate-800">
                {accountData?.type === 'new' ? 'เปิดบัญชีใหม่' : 'ระบุ Basic ID เดิม'}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">ชื่อแสดงผล</span>
              <span className="font-semibold text-slate-800">{accountData?.displayName || '—'}</span>
            </div>
            {accountData?.type === 'existing' && (
              <>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Basic ID</span>
                  <span className="font-semibold text-slate-800">{accountData?.basicId || '—'}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">ช่องทางชำระเงินเดิม</span>
                  <span className="font-semibold text-slate-800">
                    {accountData?.paymentChannel === 'line_thailand' ? 'LINE Thailand' : accountData?.agencyName || '—'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Total row */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
          <span className="font-semibold text-slate-700 text-sm">ยอดรวม</span>
          <span className="font-bold text-green-700 text-xl">{service?.price ?? '—'}<span className="text-sm font-normal text-green-600 ml-1">{service?.unit ?? ''}</span></span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={onBack}
            className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-100 transition-colors"
          >
            ← แก้ไขข้อมูล
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#06C755] hover:bg-[#05b34c] active:bg-[#049a42] text-white font-bold text-sm transition-colors shadow-md shadow-green-100"
          >
            <CheckCircle2 size={16} />
            ยืนยันคำสั่งซื้อ
          </button>
        </div>
      </div>
    </section>
  )
}

// ─── Purchase Step 3: Success ────────────────────────────────────────────────

function PurchaseSuccessScreen({ service, onBackToDashboard }) {
  const orderRef = `ORD-${Date.now().toString().slice(-6)}`
  return (
    <div className="max-w-lg mx-auto py-10 text-center">
      {/* Icon */}
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 size={40} className="text-[#06C755]" />
      </div>

      <h1 className="text-2xl font-bold text-slate-800 mb-2">ส่งคำสั่งซื้อสำเร็จ!</h1>
      <p className="text-slate-500 text-sm mb-1">ทีมงานได้รับคำสั่งซื้อของคุณแล้ว</p>
      <p className="text-slate-400 text-sm mb-6">และจะติดต่อกลับภายใน 1–2 วันทำการ</p>

      {/* Order ref */}
      <div className="inline-flex items-center gap-2 bg-slate-100 rounded-xl px-5 py-2.5 mb-8">
        <span className="text-xs text-slate-400 font-medium">เลขที่อ้างอิง</span>
        <span className="font-bold text-slate-700 text-sm tracking-wider">{orderRef}</span>
      </div>

      {/* Service summary pill */}
      {service && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 mb-8 text-left">
          <div className={`w-10 h-10 rounded-xl ${service.bg} flex items-center justify-center shrink-0`}>
            <service.icon className={`w-5 h-5 ${service.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-800 text-sm">{service.title}</p>
            <p className="text-xs text-slate-400 mt-0.5">{service.desc}</p>
          </div>
          <p className="font-bold text-slate-700 text-sm shrink-0">{service.price}<span className="font-normal text-slate-400">{service.unit}</span></p>
        </div>
      )}

      <button
        onClick={onBackToDashboard}
        className="w-full py-3.5 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white font-bold text-sm transition-colors shadow-md shadow-green-100"
      >
        กลับหน้าหลัก
      </button>
    </div>
  )
}

// ─── Screen 3: Dashboard ──────────────────────────────────────────────────────

function DashboardScreen({ user, selectedAccount: initAccount, isLocked: initLocked, onLogout }) {
  const [activeMenu,    setActiveMenu]    = useState('หน้าหลัก')
  const [toast,         setToast]         = useState(null)
  const [showPurchase,  setShowPurchase]  = useState(false)
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [locked,        setLocked]        = useState(initLocked)
  const [account,       setAccount]       = useState(initAccount)
  const [justUnlocked,  setJustUnlocked]  = useState(false)
  // Demo toggle for ManageBasicId (simulate 0 or 2 connected IDs)
  const [manageHasIds,  setManageHasIds]  = useState(true)
  // Force-entry step when navigating from dashboard CTA (null = use default)
  const [manageEntryStep, setManageEntryStep] = useState(null)
  // Purchase flow state
  const [purchaseStep,    setPurchaseStep]    = useState(1)   // 1 | 2 | 'success'
  const [orderPayload,    setOrderPayload]    = useState(null)
  const [selectedService, setSelectedService] = useState(null)
  const [cameFromPicker,      setCameFromPicker]      = useState(false)
  const [blockedServiceModal, setBlockedServiceModal] = useState(false)
  const [requiresAccountType, setRequiresAccountType] = useState(false) // full-mode user adding new OA

  const isManageView = activeMenu === 'จัดการ Basic ID' && !showPurchase

  const handlePurchase = (service) => {
    if (locked && service.id === 'api') {
      setBlockedServiceModal(true)
      return
    }
    setSelectedService(service)
    setCameFromPicker(false)
    setPurchaseStep(1)
    setOrderPayload(null)
    setToast({ message: 'กำลังไปยังหน้าสั่งซื้อ…', type: 'success' })
    setTimeout(() => { setShowPurchase(true); setActiveMenu('ซื้อบริการ') }, 900)
  }

  const handleUnlock = (linkedId, name) => {
    const label    = name ?? linkedId
    const initials = linkedId.replace('@', '').slice(0, 2).toUpperCase()
    setAccount({ id: linkedId, name: label, avatar: initials, plan: 'Free' })
    setLocked(false)
    setShowLinkModal(false)
    setJustUnlocked(true)
    setToast({ message: `✅ ปลดล็อค Full Mode สำเร็จ! บัญชี: ${linkedId}`, type: 'success' })
    setTimeout(() => setJustUnlocked(false), 2500)
  }

  const handleNavClick = (label) => {
    setActiveMenu(label)
    setShowPurchase(false)
    setManageEntryStep(null)
    setPurchaseStep(1)
    setOrderPayload(null)
    setRequiresAccountType(false)
  }

  const handleGoManageNewUser = () => {
    setActiveMenu('จัดการ Basic ID')
    setShowPurchase(false)
    setManageEntryStep('TYPE_SELECTION')
  }

  const handleRedirectToPurchase = () => {
    setSelectedService(null)
    setCameFromPicker(false)
    setPurchaseStep(1)
    setOrderPayload(null)
    setRequiresAccountType(true)
    setShowPurchase(true)
    setActiveMenu('ซื้อบริการ')
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
      {showLinkModal && <LinkAccountModal onClose={() => setShowLinkModal(false)} onUnlock={handleUnlock} />}

      {/* Blocked service modal — Messaging API requires Broadcast first */}
      {blockedServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setBlockedServiceModal(false)} />
          <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl p-7 text-center">
            <button onClick={() => setBlockedServiceModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"><X size={18} /></button>
            <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-orange-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">ต้องซื้อ Broadcast ก่อน</h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-5">
              Messaging API จำเป็นต้องใช้งานร่วมกับ Broadcast Package<br />
              กรุณาซื้อ <span className="font-semibold text-slate-700">Broadcast Package</span> ก่อนเพื่อเปิดใช้งานบริการนี้
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setBlockedServiceModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                ปิด
              </button>
              <button
                onClick={() => {
                  setBlockedServiceModal(false)
                  const broadcast = SERVICES.find(s => s.id === 'broadcast')
                  handlePurchase(broadcast)
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white font-semibold text-sm transition-colors shadow-md shadow-green-100"
              >
                ซื้อ Broadcast
              </button>
            </div>
          </div>
        </div>
      )}

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
        </div>

        {/* Account pill */}
        {account && (
          <div className="px-3 py-2.5 border-b border-gray-100">
            <div className="flex items-center gap-2 bg-green-50 rounded-lg px-2.5 py-2">
              <div className="w-7 h-7 rounded-md bg-green-200 flex items-center justify-center text-xs font-bold text-green-800 shrink-0">{account.avatar}</div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-700 truncate">{account.name}</p>
                <p className="text-xs text-gray-400 truncate">{account.id}</p>
              </div>
            </div>
          </div>
        )}


        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {SIDEBAR_ITEMS.map(({ icon: Icon, label, locked: itemLocked }) => {
            const isItemLocked = locked && itemLocked
            const isJustOpened = justUnlocked && itemLocked
            return (
              <button key={label} onClick={() => {
                if (isItemLocked) {
                  setToast({ message: `เชื่อมต่อ Basic ID เพื่อเข้าใช้งาน "${label}"`, type: 'locked' })
                } else {
                  handleNavClick(label)
                }
              }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-500 ${
                  isJustOpened   ? 'bg-green-50 text-green-700 ring-1 ring-green-200' :
                  isItemLocked   ? 'opacity-40 cursor-not-allowed text-gray-400' :
                  activeMenu === label && !showPurchase ? 'bg-green-50 text-[#06C755]' :
                  'text-gray-600 hover:bg-slate-50 hover:text-gray-800'
                }`}>
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1 text-left">{label}</span>
                {isItemLocked ? <Lock className="w-3 h-3 text-gray-300 shrink-0" /> : isJustOpened ? <Unlock className="w-3 h-3 text-green-500 shrink-0 animate-pulse" /> : null}
              </button>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="px-2 py-3 border-t border-gray-100 space-y-0.5">
          <button onClick={() => handleNavClick('จัดการ Basic ID')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isManageView ? 'bg-green-50 text-[#06C755]' : 'text-gray-600 hover:bg-slate-50 hover:text-gray-800'
            }`}>
            <UserCog className="w-4 h-4 shrink-0" />
            จัดการ Basic ID
          </button>
          {[{ icon: BookOpen, label: 'คู่มือการใช้งาน' }, { icon: MessageCircle, label: 'ติดต่อเรา' }].map(({ icon: Icon, label }) => (
            <button key={label} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-slate-50 hover:text-gray-700 transition-colors">
              <Icon className="w-4 h-4 shrink-0" /> {label}
            </button>
          ))}
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors">
            <LogOut className="w-4 h-4 shrink-0" /> ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════════════
           MANAGE BASIC ID — exclusive centered-card layout
      ══════════════════════════════════════════════════════════════ */}
      {isManageView ? (
        <main className="flex-1 bg-[#f8f9fa] flex flex-col items-center justify-center p-8 min-h-screen">
          {/* The centered card */}
          <ManageBasicIdCard
            key={`${locked ? 'locked' : manageHasIds ? 'has' : 'none'}-${manageEntryStep ?? 'default'}`}
            hasIds={locked ? false : manageHasIds}
            initialStep={locked ? 'TYPE_SELECTION' : manageEntryStep}
            onExit={() => handleNavClick('หน้าหลัก')}
            onUnlockFullMode={handleUnlock}
            onRedirectToPurchase={handleRedirectToPurchase}
          />
        </main>

      ) : (
      /* ══════════════════════════════════════════════════════════════
           ALL OTHER ROUTES — normal scrollable layout
      ══════════════════════════════════════════════════════════════ */
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-8">

            {/* Purchase sub-page */}
            {showPurchase ? (
              <div>
                {/* Back button — hidden on success screen */}
                {purchaseStep !== 'success' && (
                  <button
                    onClick={() => {
                      if (selectedService && cameFromPicker) { setSelectedService(null); setCameFromPicker(false) }
                      else { setShowPurchase(false); setActiveMenu('หน้าหลัก'); setPurchaseStep(1) }
                    }}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-5 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    {selectedService && cameFromPicker ? 'เปลี่ยนบริการ' : 'กลับหน้า Dashboard'}
                  </button>
                )}

                {/* Service picker — shown when no service has been chosen yet */}
                {purchaseStep === 1 && !selectedService && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-1">เลือกบริการที่ต้องการสั่งซื้อ</h2>
                    <p className="text-sm text-gray-400 mb-6">Select a service to continue</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {SERVICES.map(({ id, title, icon: Icon, desc, color, bg, price, unit }) => (
                        <button
                          key={id}
                          onClick={() => { setSelectedService({ id, title, icon: Icon, desc, color, bg, price, unit }); setCameFromPicker(true) }}
                          className="group text-left bg-white border-2 border-slate-200 hover:border-[#06C755] rounded-2xl p-5 transition-all hover:shadow-md cursor-pointer flex items-center gap-4"
                        >
                          <div className={`w-14 h-14 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                            <Icon className={`w-7 h-7 ${color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-800 text-sm leading-tight">{title}</p>
                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{desc}</p>
                            <p className="text-xs font-semibold text-slate-700 mt-1.5">
                              เริ่มต้น {price}<span className="font-normal text-slate-400">{unit}</span>
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#06C755] transition-colors shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Service form */}
                {purchaseStep === 1 && selectedService && (
                  <>
                    <h2 className="text-xl font-bold text-gray-800 mb-5">
                      ซื้อบริการ — {selectedService.title}
                    </h2>
                    <PurchaseValidationHeader
                      service={selectedService}
                      isLocked={locked || requiresAccountType}
                      onProceed={(p) => { setOrderPayload(p); setPurchaseStep('success') }}
                    />
                  </>
                )}

                {/* Success */}
                {purchaseStep === 'success' && (
                  <PurchaseSuccessScreen
                    service={selectedService}
                    onBackToDashboard={() => { setShowPurchase(false); setActiveMenu('หน้าหลัก'); setPurchaseStep(1); setSelectedService(null) }}
                  />
                )}
              </div>

            ) : (
              /* Dashboard home (and any other non-purchase route) */
              <>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-800">สวัสดีครับ คุณ{user.name}</h1>
                  <p className="text-gray-400 text-sm mt-1">
                    {locked ? 'กรุณาซื้อบริการหรือเชื่อมต่อ Basic ID เพื่อเริ่มใช้งาน' : 'ยินดีต้อนรับกลับมาสู่ LINE OA Manager'}
                  </p>
                </div>

                {/* Locked banner */}
                {locked && (
                  <div className="mb-7 bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0"><Lock className="w-4 h-4 text-amber-600" /></div>
                      <div>
                        <p className="font-bold text-amber-800 text-sm">ปลดล็อกประสบการณ์เต็มรูปแบบ</p>
                        <p className="text-xs text-amber-600 mt-0.5">ปลดล็อกการใช้งานทุกฟีเจอร์ในระบบ เพียงเชื่อมต่อ Basic ID</p>
                      </div>
                    </div>
                    <button onClick={handleGoManageNewUser}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white font-semibold text-sm transition-colors shadow-md shadow-green-100 whitespace-nowrap shrink-0">
                      <Plus className="w-4 h-4" /> เพิ่ม/เชื่อมต่อ Basic ID
                    </button>
                  </div>
                )}

                {/* Full Mode celebration */}
                {justUnlocked && !locked && (
                  <div className="mb-7 bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center shrink-0"><Unlock className="w-4 h-4 text-green-600" /></div>
                    <div>
                      <p className="font-bold text-green-800 text-sm flex items-center gap-1.5"><Sparkles size={14} /> Full Mode เปิดใช้งานแล้ว!</p>
                      <p className="text-xs text-green-600 mt-0.5">เมนูทั้งหมดพร้อมใช้งานเรียบร้อยแล้ว</p>
                    </div>
                  </div>
                )}

                {/* Packages */}
                <section className="mb-8">
                  <div className="mb-3">
                    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">แพ็กเกจที่คุณใช้งานอยู่</h2>
                    <p className="text-xs text-gray-400 mt-0.5">บริการที่เปิดใช้งานภายใต้บัญชีของคุณ</p>
                  </div>
                  <div className="space-y-3">
                    {PACKAGES.map(({ name, status, icon: Icon }) => (
                      <div key={name} className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center shrink-0"><Icon className="w-4 h-4 text-green-600" /></div>
                          <span className="font-medium text-gray-700 text-sm">{name}</span>
                        </div>
                        <span className="text-[#06C755] font-semibold text-sm">{status}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Services */}
                <section>
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">กรุณาเลือกบริการที่ต้องการ</h2>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {SERVICES.map(({ id, title, icon: Icon, desc, color, bg, price, unit }) => (
                      <div key={id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col items-center text-center gap-3">
                        <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}><Icon className={`w-6 h-6 ${color}`} /></div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 text-xs leading-tight">{title}</p>
                          <p className="text-gray-400 text-xs mt-1">{desc}</p>
                        </div>
                        <button onClick={() => handlePurchase({ id, title, icon: Icon, desc, color, bg, price, unit })} className="w-full bg-[#06C755] hover:bg-[#05b34c] text-white text-xs font-semibold py-2 rounded-lg transition-colors">สั่งซื้อ</button>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>
        </main>
      )}
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
    if (userData.accounts.length === 0) { setIsLocked(true); setStep('dashboard') }
    else setStep('account-routing')
  }

  const handleAccountSelect = (acc) => { setSelectedAccount(acc); setIsLocked(false); setStep('dashboard') }
  const handleAddNew        = ()    => { setSelectedAccount(null); setIsLocked(true); setStep('dashboard') }
  const handleLogout        = ()    => { setStep('login'); setUser(null); setSelectedAccount(null); setIsLocked(false) }

  if (step === 'login')           return <LoginScreen onLogin={handleLogin} />
  if (step === 'account-routing') return <AccountSelectionScreen user={user} onSelect={handleAccountSelect} onAddNew={handleAddNew} />
  if (step === 'dashboard')       return <DashboardScreen user={user} selectedAccount={selectedAccount} isLocked={isLocked} onLogout={handleLogout} />
  return null
}
