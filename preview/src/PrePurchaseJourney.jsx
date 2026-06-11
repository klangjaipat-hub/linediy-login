import { useState, useEffect, useRef } from 'react'
import {
  MessageCircle, ChevronRight, Plus, Radio, Crown, MessageSquare,
  Zap, Home, ShoppingCart, ClipboardList, CreditCard, Gift, FileText,
  BookOpen, LogOut, Lock, Check, ArrowLeft, Link2, Loader2, X,
  CheckCircle2, Unlock, Sparkles, UserCog, UserCheck, UserPlus,
  Settings, ChevronLeft, LogIn, Info,
} from 'lucide-react'
import PurchaseValidationHeader from './PurchaseValidationHeader'
import imgBroadcast        from './assets/image/icon-broadcast-package.svg'
import imgAdditional       from './assets/image/Icon-additional message.svg'
import imgPremium          from './assets/image/Icon-premium id.svg'
import imgOaChat           from './assets/image/Icon-OA chat.svg'

// ─── Mock Customer Info (existing users — data already on file) ───────────────

const MOCK_EXISTING_CUSTOMER_INFO = {
  customerType: 'corporate',
  nationalId: '0105565012345',
  firstName: 'สมชาย',
  lastName: 'ใจดี',
  emailTax: 'somchai.jaidee@sellsuki-store.co.th',
  emailQuote: 'purchase@sellsuki-store.co.th',
  phone: '02-123-4567',
  address: '123/45 อาคารสยามสแควร์วัน ชั้น 8',
  street: 'ถนนพระรามที่ 1',
  subdistrict: 'ปทุมวัน',
  district: 'ปทุมวัน',
  province: 'กรุงเทพมหานคร',
  postalCode: '10330',
}

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
  { name: 'BROADCAST PACKAGE', statusLabel: 'แพ็กเกจปัจจุบันของคุณ: ', status: 'Free',  icon: Radio },
  { name: 'PREMIUM ID',        statusLabel: 'Premium ID ของคุณ: ',      status: 'ไม่มี', icon: Crown },
  { name: 'OA CHAT PACKAGE',   statusLabel: 'แพ็กเกจปัจจุบันของคุณ: ', status: 'Free',  icon: MessageSquare },
]

const SERVICES = [
  { id: 'broadcast', title: 'BROADCAST PACKAGE', icon: Radio,         img: imgBroadcast,  desc: 'ส่งข้อความหา Follower',      color: 'text-blue-500',   bg: 'bg-blue-50',   price: '฿1,500', unit: '/เดือน' },
  { id: 'api',       title: 'ADDITIONAL MESSAGE', icon: Zap,           img: imgAdditional, desc: 'ข้อความเพิ่มเติมสำหรับ OA', color: 'text-purple-500', bg: 'bg-purple-50', price: '฿2,500', unit: '/เดือน' },
  { id: 'premium',   title: 'PREMIUM ID',         icon: Crown,         img: imgPremium,    desc: 'Premium LINE Official ID',   color: 'text-yellow-500', bg: 'bg-yellow-50', price: '฿3,000', unit: '/ปี'    },
  { id: 'chat',      title: 'OA CHAT',            icon: MessageSquare, img: imgOaChat,     desc: 'Chat Package สำหรับ OA',    color: 'text-green-500',  bg: 'bg-green-50',  price: '฿990',   unit: '/เดือน' },
]

const SIDEBAR_ITEMS = [
  { icon: Home,          label: 'หน้าหลัก',        locked: false },
  { icon: ShoppingCart,  label: 'ซื้อบริการ',       locked: false },
  { icon: UserCheck,     label: 'จัดการบัญชี',      locked: false },
  { icon: ClipboardList, label: 'รายการสั่งซื้อ',   locked: false },
  { icon: CreditCard,    label: 'แจ้งการชำระเงิน',  locked: false },
  { icon: Gift,          label: 'สิทธิพิเศษ',       locked: false },
  { icon: FileText,      label: 'เอกสาร',           locked: false },
]

// ─── Mock verification (shared across ManageBasicId + purchase forms) ─────────

const VERIFY_MOCK = {
  '@happyshop':    'success',
  '@demo':         'success',
  '@mycoolshop':   'success',
  '@sellsukishop': 'success',
  '@333aaaa':      'success',
  '@mybrand-th':   'success',
  '@notfound':          'not_found',
  '@notfound/transfer': 'not_found',
  '@unknown':           'not_found',
  '@banned':       'banned',
  '@suspended':    'banned',
  '@duplicate':    'duplicate',
  '@existing':     'duplicate',
}

const MANAGE_DEMO_CHIPS = [
  { id: '@happyshop', label: 'สำเร็จ',      color: 'bg-green-100 text-green-700 hover:bg-green-200'    },
  { id: '@notfound/transfer', label: 'ไม่พบ/โอนย้าย', color: 'bg-red-100 text-red-700 hover:bg-red-200' },
  { id: '@banned',    label: 'ถูกแบน',      color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
  { id: '@duplicate', label: 'มีแล้ว',      color: 'bg-purple-100 text-purple-700 hover:bg-purple-200' },
]

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, type = 'success', onAction, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3200)
    return () => clearTimeout(t)
  }, [onDone])
  if (type === 'locked') {
    return (
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-amber-800 text-white text-xs px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 max-w-sm">
        <Lock className="w-4 h-4 text-amber-300 shrink-0" />
        <span className="flex-1">{message}</span>
        {onAction && (
          <button
            onClick={() => { onAction(); onDone() }}
            className="shrink-0 whitespace-nowrap bg-white/20 hover:bg-white/30 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors"
          >
            เชื่อมต่อเลย →
          </button>
        )}
      </div>
    )
  }
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs px-5 py-3 rounded-xl shadow-xl flex items-center gap-2">
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
          <span className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${phase === 'success' ? 'bg-green-100' : 'bg-[#00BB03]/10'}`}>
            {phase === 'success' ? <CheckCircle2 size={28} className="text-green-600" /> : <Link2 size={26} className="text-[#00BB03]" />}
          </span>
        </div>
        <h2 className="text-[18px] font-bold text-center text-slate-800 mb-1 flex items-center justify-center gap-1">
          {phase === 'success' ? '🎉 เชื่อมต่อสำเร็จ!' : <><span>เชื่อมต่อ Basic ID</span><BasicIdTooltip /></>}
        </h2>
        <p className="text-xs text-center text-slate-500 mb-6">
          {phase === 'success' ? `เชื่อมต่อ Basic ID: ${basicId} สำเร็จ!` : 'ระบุ Basic ID เพื่อปลดล็อคฟีเจอร์ทั้งหมดและเข้าสู่ Full Mode'}
        </p>
        {phase === 'success' ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center space-y-2">
            <p className="text-green-700 font-semibold text-xs flex items-center justify-center gap-2"><Sparkles size={15} /> กำลังเปิดใช้งาน Full Mode…</p>
            <div className="h-1.5 bg-green-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full transition-all duration-[1400ms] ease-linear" style={{ width: '100%' }} />
            </div>
          </div>
        ) : (
          <>
            <input ref={inputRef} type="text" value={basicId} onChange={e => setBasicId(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleVerify()} placeholder="@shop123"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition mb-3" />
            <button onClick={handleVerify} disabled={phase === 'loading' || !basicId.trim()}
              className="w-full py-3 rounded-xl bg-[#00BB03] hover:bg-[#009a02] disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-green-100">
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

function ManageBasicIdCard({ hasIds, initialStep, transferBasicId, onExit, onUnlockFullMode, onRedirectToPurchase, onGoToPurchaseAsTransfer, onGoNewUserPath, onTransferMode }) {
  const [step,          setStep]          = useState(initialStep ?? (hasIds ? 'ACCOUNT_LIST' : 'TYPE_SELECTION'))
  const [selectedId,    setSelectedId]    = useState(hasIds ? MOCK_CONNECTED_IDS[0].id : null)
  const [basicId,       setBasicId]       = useState('')
  const [verify,        setVerify]        = useState(null) // null | 'loading' | 'success' | 'not_found' | 'banned' | 'duplicate'
  const [verifyModal,   setVerifyModal]   = useState(false)
  const [fading,        setFading]        = useState(false)
  const [stepKey,       setStepKey]       = useState(0)

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
    const id = basicId.trim().toLowerCase()
    const result = VERIFY_MOCK[id] ?? (id.startsWith('@') ? 'success' : 'not_found')
    setVerify(result)
    setVerifyModal(true)
  }

  const MANAGE_MODAL_CONFIG = {
    success: {
      iconBg: 'bg-green-100', icon: <CheckCircle2 size={28} className="text-green-600" />,
      title: 'เชื่อมต่อสำเร็จ!',
      body: `พบ Basic ID ${basicId} ในระบบแล้ว\nกำลังเข้าสู่ Full Mode Dashboard…`,
      primaryLabel: 'เข้าใช้งาน Full Mode',
      primaryClass: 'bg-[#00BB03] hover:bg-[#009a02] text-white shadow-md shadow-green-100',
      onPrimary: () => { setVerifyModal(false); onUnlockFullMode?.(basicId.trim()); onExit?.() },
      showContact: false,
    },
    not_found: {
      iconBg: 'bg-blue-100', icon: <UserPlus size={28} className="text-blue-500" />,
      title: 'ไม่พบข้อมูลบัญชีเดิม',
      body: `ไม่พบ Basic ID ${basicId} ในระบบ\nระบบจะดำเนินการให้คุณเป็นลูกค้าโอนย้ายเข้า Sellsuki`,
      primaryLabel: 'ดำเนินการต่อ (โอนย้าย)',
      primaryClass: 'bg-[#00BB03] hover:bg-[#009a02] text-white shadow-md shadow-green-100',
      onPrimary: () => { setVerifyModal(false); onTransferMode?.(basicId.trim()) },
      showContact: false,
    },
    banned: {
      iconBg: 'bg-orange-100', icon: <Lock size={28} className="text-orange-500" />,
      title: 'บัญชีนี้ถูกระงับการใช้งาน',
      body: 'ติดต่อทีมงานเพื่อตรวจสอบสถานะบัญชีและขอคืนสิทธิ์การใช้งาน',
      primaryLabel: 'ปิด',
      primaryClass: 'bg-slate-800 hover:bg-slate-900 text-white',
      onPrimary: () => { setVerify(null); setVerifyModal(false) },
      showContact: true,
    },
    duplicate: {
      iconBg: 'bg-purple-100', icon: <CheckCircle2 size={28} className="text-purple-500" />,
      title: 'Basic ID นี้มีในระบบ Sellsuki แล้ว',
      body: 'หากคุณเป็นเจ้าของบัญชีนี้ ติดต่อ Admin เพื่อเข้าถึงบัญชีของคุณ',
      primaryLabel: 'ลองอีกครั้ง',
      primaryClass: 'bg-slate-800 hover:bg-slate-900 text-white',
      onPrimary: () => { setVerify(null); setVerifyModal(false) },
      showContact: true,
    },
  }

  return (
    <>
    {verifyModal && verify && MANAGE_MODAL_CONFIG[verify] && (() => {
      const cfg = MANAGE_MODAL_CONFIG[verify]
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl p-7 text-center">
            <div className={`w-14 h-14 rounded-full ${cfg.iconBg} flex items-center justify-center mx-auto mb-4`}>{cfg.icon}</div>
            <h2 className="text-xs font-bold text-slate-800 mb-2">{cfg.title}</h2>
            <p className="text-xs text-slate-500 leading-relaxed mb-6 whitespace-pre-line">{cfg.body}</p>
            <div className="flex gap-3">
              {cfg.showContact && (
                <a href="https://lin.ee/sellsuki-support" target="_blank" rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5">
                  <MessageCircle size={14} /> ติดต่อ Admin
                </a>
              )}
              <button onClick={cfg.onPrimary}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-xs transition-colors ${cfg.primaryClass}`}>
                {cfg.primaryLabel}
              </button>
            </div>
          </div>
        </div>
      )
    })()}
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
                  <UserCog size={26} className="text-[#00BB03]" />
                </span>
              </div>

              <h2 className="text-[18px] font-bold text-slate-800 text-center mb-1">เลือก Basic ID</h2>
              <p className="text-xs text-slate-500 text-center mb-7">กรุณาเลือก Basic ID ของท่าน</p>

              {transferBasicId ? (
                /* ── Transfer user: show their pending ID ── */
                <>
                  <div className="space-y-3 mb-7">
                    <div className="flex items-center gap-4 px-4 py-3.5 rounded-xl border-2 border-orange-300 bg-orange-50">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-xs">{transferBasicId}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Basic ID ที่ขอโอนย้าย</p>
                      </div>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold shrink-0 bg-orange-100 text-orange-700">
                        รอดำเนินการ
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 text-center mb-7 leading-relaxed">
                    Basic ID นี้อยู่ระหว่างดำเนินการโอนย้ายเข้าระบบ Sellsuki<br />
                    กรุณาซื้อบริการเพื่อเริ่มกระบวนการโอนย้าย
                  </p>
                  <button
                    onClick={() => onGoToPurchaseAsTransfer?.()}
                    className="w-full py-3.5 rounded-xl bg-[#00BB03] hover:bg-[#009a02] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-green-100 mb-3"
                  >
                    <ShoppingCart size={16} />
                    ไปที่หน้าซื้อบริการ
                  </button>
                  <button
                    onClick={() => onGoNewUserPath?.()}
                    className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Plus size={15} /> เพิ่ม/เชื่อมต่อ Basic ID
                  </button>
                </>
              ) : (
                /* ── Existing user: pick from connected IDs ── */
                <>
                  <div className="space-y-3 mb-7">
                    {MOCK_CONNECTED_IDS.map(acc => (
                      <label
                        key={acc.id}
                        htmlFor={`radio-${acc.id}`}
                        className={`flex items-center gap-4 px-4 py-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedId === acc.id
                            ? 'border-[#00BB03] bg-green-50'
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
                          <p className="font-semibold text-slate-800 text-xs">{acc.id}</p>
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

                  <button
                    onClick={handleLogin}
                    disabled={!selectedId}
                    className="w-full py-3.5 rounded-xl bg-[#00BB03] hover:bg-[#009a02] active:bg-[#049a42] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-green-100 mb-3"
                  >
                    <LogIn size={16} />
                    เข้าสู่บัญชี
                  </button>

                  <button
                    onClick={() => onGoNewUserPath?.()}
                    className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Plus size={15} />
                    เพิ่ม/เชื่อมต่อ LINE OA
                  </button>
                </>
              )}
            </>
          )}

          {/* ══ TYPE_SELECTION ══ */}
          {step === 'TYPE_SELECTION' && (
            <>
              {/* Back (only if came from ACCOUNT_LIST) */}
              {hasIds && step === 'TYPE_SELECTION' && (
                <button onClick={() => goto('ACCOUNT_LIST')} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 mb-5 transition-colors">
                  <ChevronLeft size={15} /> กลับ
                </button>
              )}

              <h2 className="text-[18px] font-bold text-slate-800 mb-1">กรุณาเลือกประเภทบัญชี</h2>
              <p className="text-xs text-slate-500 mb-7">Select Account Type</p>

              <div className="grid grid-cols-2 gap-4">
                {/* Card 1 — ลูกค้าปัจจุบัน */}
                <button
                  onClick={() => goto('VALIDATION_FORM')}
                  className="group text-left bg-white border-2 border-slate-200 hover:border-[#00BB03] rounded-2xl p-5 transition-all hover:shadow-md cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-xl bg-green-50 group-hover:bg-green-100 flex items-center justify-center mb-4 transition-colors">
                    <UserCheck size={22} className="text-[#00BB03]" />
                  </div>
                  <p className="font-bold text-slate-800 text-xs leading-tight mb-1">บัญชีเดิม</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    สำหรับผู้ที่มี Basic ID เดิมอยู่แล้ว
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
                  <p className="font-bold text-slate-800 text-xs leading-tight mb-1">เปิดบัญชีใหม่</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    สำหรับผู้ที่ยังไม่มี Basic ID และต้องการเปิดบัญชีใหม่กับ Sellsuki
                  </p>
                </button>
              </div>
            </>
          )}

          {/* ══ VALIDATION_FORM ══ */}
          {step === 'VALIDATION_FORM' && (
            <>
              <button onClick={() => goto('TYPE_SELECTION')} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 mb-5 transition-colors">
                <ChevronLeft size={15} /> กลับ
              </button>

<h2 className="text-[18px] font-bold text-slate-800 mb-1 flex items-center gap-1">ตรวจสอบ Basic ID <BasicIdTooltip /></h2>
              <p className="text-xs text-slate-500 mb-7">กรอก Basic ID เพื่อยืนยันบัญชีและเชื่อมต่อ</p>

              <div className="space-y-3">
                <div>
                  <label className="flex items-center gap-1 text-xs font-semibold text-slate-700 mb-2">
                    Basic ID <BasicIdTooltip /> <span className="text-red-400">*</span>
                  </label>

                  {/* Demo chips */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {MANAGE_DEMO_CHIPS.map(({ id, label, color }) => (
                      <button key={id} type="button"
                        onClick={() => { setBasicId(id); setVerify(null) }}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${color}`}>
                        {id} · {label}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <input
                      autoFocus
                      type="text"
                      value={basicId}
                      onChange={e => { setBasicId(e.target.value); if (verify) setVerify(null) }}
                      onKeyDown={e => e.key === 'Enter' && handleVerify()}
                      placeholder="@your-id"
                      disabled={verify === 'success'}
                      className={`flex-1 rounded-xl border px-4 py-3 text-xs text-slate-800 placeholder-slate-400 outline-none focus:ring-2 transition bg-white ${
                        verify === 'success'
                          ? 'border-green-500 bg-green-50 focus:ring-green-100'
                          : 'border-slate-300 focus:border-green-500 focus:ring-green-200'
                      }`}
                    />
                    <button
                      onClick={handleVerify}
                      disabled={verify === 'loading' || verify === 'success' || !basicId.trim()}
                      className="px-5 py-3 rounded-xl bg-[#00BB03] hover:bg-[#009a02] disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-xs transition-colors whitespace-nowrap"
                    >
                      {verify === 'loading'
                        ? <Loader2 size={16} className="animate-spin" />
                        : 'ตรวจสอบ'}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ══ LOADING ══ */}
          {step === 'LOADING' && (
            <div className="py-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                <Loader2 size={30} className="text-blue-500 animate-spin" />
              </div>
              <p className="font-bold text-slate-800 text-xs mb-2">กำลังนำทาง…</p>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                กำลังพาคุณไปยังหน้า "ซื้อบริการ"<br />
                เพื่อดำเนินการเปิดบัญชีใหม่…
              </p>
              <p className="text-xs text-slate-300 mt-3">Redirecting to Buy Service page...</p>
            </div>
          )}

        </div>
      </div>
    </div>
    </>
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
    <div className="min-h-screen bg-[#00BB03] flex flex-col items-center justify-center p-6">
      <div className="mb-8 text-center">
        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <MessageCircle className="w-10 h-10 text-[#00BB03]" />
        </div>
        <h1 className="text-[28px] font-bold text-white tracking-wide">LINE</h1>
        <p className="text-white/70 text-xs mt-1">Official Account Manager</p>
      </div>
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
        <h2 className="text-[18px] font-semibold text-gray-800 text-center mb-1">ยินดีต้อนรับ</h2>
        <p className="text-gray-400 text-xs text-center mb-6">เข้าสู่ระบบด้วย LINE Account ของคุณ</p>
        <div className="mb-6 bg-slate-50 rounded-xl p-3 border border-slate-100">
          <p className="text-xs text-slate-400 mb-2 font-semibold uppercase tracking-widest">Demo Scenario</p>
          <div className="flex gap-2">
            {[{ value: 'existing', label: 'Existing User' }, { value: 'new', label: 'New User' }].map(({ value, label }) => (
              <button key={value} onClick={() => setScenario(value)}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${scenario === value ? 'bg-[#00BB03] text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'}`}>
                {label}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            {scenario === 'existing' ? 'จะแสดงหน้าเลือก Basic ID ก่อนเข้า Dashboard' : 'จะข้ามไป Dashboard (Locked Mode) — ลอง Link Account Modal'}
          </p>
        </div>
        <button onClick={handleLogin} disabled={loading}
          className="w-full bg-[#00BB03] hover:bg-[#009a02] text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-70">
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
          <div className="w-14 h-14 bg-[#00BB03] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
            <MessageCircle className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-[22px] font-bold text-gray-800">เลือก Basic ID</h1>
          <p className="text-gray-400 text-xs mt-1">สวัสดีครับ คุณ{user.name} — เลือก Basic ID ที่ต้องการจัดการ</p>
        </div>
        <div className="space-y-3 mb-4">
          {user.accounts.map(acc => (
            <button key={acc.id} onClick={() => onSelect(acc)}
              className="w-full bg-white rounded-xl border border-gray-200 hover:border-[#00BB03] hover:shadow-md p-4 flex items-center gap-4 transition-all group text-left">
              <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center shrink-0 font-bold text-green-700 text-xs">{acc.avatar}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-xs">{acc.name}</p>
                <p className="text-gray-400 text-xs mt-0.5">{acc.id}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${acc.plan === 'Premium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{acc.plan}</span>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#00BB03] transition-colors" />
              </div>
            </button>
          ))}
        </div>
        <button onClick={onAddNew} className="w-full bg-white border-2 border-dashed border-gray-300 hover:border-[#00BB03] rounded-xl p-4 flex items-center justify-center gap-2 text-gray-400 hover:text-[#00BB03] transition-all">
          <Plus className="w-4 h-4" />
          <span className="font-semibold text-xs">Add New / Buy Service</span>
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
        <h1 className="text-[18px] md:text-[22px] font-bold text-slate-800 leading-snug">สรุปคำสั่งซื้อ</h1>
        <p className="text-xs text-slate-500 mt-1">Order Summary — กรุณาตรวจสอบรายละเอียดก่อนยืนยัน</p>
      </div>

      <div className="space-y-4 max-w-2xl">
        {/* Service card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl ${service?.bg ?? 'bg-slate-100'} flex items-center justify-center shrink-0`}>
            <Icon className={`w-6 h-6 ${service?.color ?? 'text-slate-500'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-800 text-xs">{service?.title ?? '—'}</p>
            <p className="text-xs text-slate-400 mt-0.5">{service?.desc ?? ''}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-bold text-slate-800 text-xs">{service?.price ?? '—'}</p>
            <p className="text-xs text-slate-400">{service?.unit ?? ''}</p>
          </div>
        </div>

        {/* Account info */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">ข้อมูลบัญชี</p>
          <div className="space-y-2 text-xs">
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
          <span className="font-semibold text-slate-700 text-xs">ยอดรวม</span>
          <span className="font-bold text-green-700 text-[18px]">{service?.price ?? '—'}<span className="text-xs font-normal text-green-600 ml-1">{service?.unit ?? ''}</span></span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={onBack}
            className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-100 transition-colors"
          >
            ← แก้ไขข้อมูล
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#00BB03] hover:bg-[#009a02] active:bg-[#049a42] text-white font-bold text-xs transition-colors shadow-md shadow-green-100"
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
        <CheckCircle2 size={40} className="text-[#00BB03]" />
      </div>

      <h1 className="text-[22px] font-bold text-slate-800 mb-2">ส่งคำสั่งซื้อสำเร็จ!</h1>
      <p className="text-slate-500 text-xs mb-1">ทีมงานได้รับคำสั่งซื้อของคุณแล้ว</p>
      <p className="text-slate-400 text-xs mb-6">และจะติดต่อกลับภายใน 1–2 วันทำการ</p>

      {/* Order ref */}
      <div className="inline-flex items-center gap-2 bg-slate-100 rounded-xl px-5 py-2.5 mb-8">
        <span className="text-xs text-slate-400 font-medium">เลขที่อ้างอิง</span>
        <span className="font-bold text-slate-700 text-xs tracking-wider">{orderRef}</span>
      </div>

      {/* Service summary pill */}
      {service && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 mb-8 text-left">
          <div className={`w-10 h-10 rounded-xl ${service.bg} flex items-center justify-center shrink-0`}>
            <service.icon className={`w-5 h-5 ${service.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-800 text-xs">{service.title}</p>
            <p className="text-xs text-slate-400 mt-0.5">{service.desc}</p>
          </div>
          <p className="font-bold text-slate-700 text-xs shrink-0">{service.price}<span className="font-normal text-slate-400">{service.unit}</span></p>
        </div>
      )}

      <button
        onClick={onBackToDashboard}
        className="w-full py-3.5 rounded-xl bg-[#00BB03] hover:bg-[#009a02] text-white font-bold text-xs transition-colors shadow-md shadow-green-100"
      >
        กลับหน้าหลัก
      </button>
    </div>
  )
}

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyState({ icon: Icon, title, subtitle, ctaLabel, onCta }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
        <Icon className="w-7 h-7 text-slate-400" />
      </div>
      <p className="font-bold text-slate-700 text-xs mb-1">{title}</p>
      <p className="text-xs text-slate-400 mb-6 max-w-xs leading-relaxed">{subtitle}</p>
      {ctaLabel && (
        <button onClick={onCta}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00BB03] hover:bg-[#009a02] text-white font-semibold text-xs transition-colors shadow-md shadow-green-100">
          <ShoppingCart className="w-4 h-4" /> {ctaLabel}
        </button>
      )}
    </div>
  )
}

// ─── Order History View ───────────────────────────────────────────────────────

function OrderHistoryView({ recentOrder, onBuyService }) {
  if (!recentOrder) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="ยังไม่มีรายการสั่งซื้อ"
        subtitle="เมื่อคุณสั่งซื้อบริการ รายการจะปรากฏที่นี่"
      />
    )
  }
  const { service, orderRef, date } = recentOrder
  const Icon = service?.icon ?? ClipboardList
  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-[18px] font-bold text-slate-800">รายการสั่งซื้อ</h1>
        <p className="text-xs text-slate-400 mt-0.5">Order History</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <span>บริการ</span>
          <span className="text-right">ราคา</span>
          <span className="text-right">สถานะ</span>
        </div>
        {/* Order row */}
        <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-4 items-center">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-xl ${service?.bg ?? 'bg-slate-100'} flex items-center justify-center shrink-0`}>
              <Icon className={`w-5 h-5 ${service?.color ?? 'text-slate-500'}`} />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-800 text-xs truncate">{service?.title ?? '—'}</p>
              <p className="text-xs text-slate-400 mt-0.5">#{orderRef} · {date?.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>
          <p className="font-bold text-slate-700 text-xs text-right whitespace-nowrap">
            {service?.price ?? '—'}<span className="font-normal text-slate-400 text-xs">{service?.unit ?? ''}</span>
          </p>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 whitespace-nowrap">
            รอดำเนินการ
          </span>
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-4 text-center">ทีมงานจะติดต่อกลับภายใน 1–2 วันทำการ</p>
    </div>
  )
}

// ─── Manage Account View ─────────────────────────────────────────────────────

function ManageAccountView({ customerInfo, isExistingUser, onBuyService }) {
  if (!customerInfo) {
    return (
      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-[18px] font-bold text-slate-800">จัดการบัญชี</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage Account</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-10 flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
            <UserCog className="w-7 h-7 text-blue-500" />
          </div>
          <div>
            <p className="font-bold text-slate-800 text-xs mb-2">ยังไม่มีข้อมูลบัญชี</p>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              ข้อมูลของท่านจะปรากฏที่นี่หลังจากที่ท่านซื้อบริการ<br />
              กรุณาดำเนินการซื้อบริการก่อน — ข้อมูลบัญชีจะถูกกรอกในขั้นตอนการซื้อ
            </p>
          </div>
          <button
            onClick={onBuyService}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00BB03] hover:bg-[#009a02] text-white font-semibold text-xs transition-colors shadow-md shadow-green-100"
          >
            <ShoppingCart className="w-4 h-4" /> ซื้อบริการ
          </button>
        </div>
      </div>
    )
  }

  function InfoRow({ label, value }) {
    if (!value) return null
    return (
      <div className="flex justify-between gap-4 py-2.5 border-b border-slate-100 last:border-0">
        <span className="text-xs text-slate-500 shrink-0">{label}</span>
        <span className="text-xs font-medium text-slate-800 text-right">{value}</span>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-[18px] font-bold text-slate-800">จัดการบัญชี</h1>
        <p className="text-xs text-slate-400 mt-0.5">Manage Account</p>
      </div>

{/* ข้อมูลร้านค้า หรือบริษัท */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">ข้อมูลร้านค้า หรือบริษัท</p>
        <InfoRow label="ประเภท" value={customerInfo.customerType === 'individual' ? 'บุคคลธรรมดา' : 'นิติบุคคล'} />
        <InfoRow label="เลขประจำตัวประชาชน" value={customerInfo.nationalId} />
      </div>

      {/* ข้อมูลผู้ติดต่อ */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">ข้อมูลผู้ติดต่อ</p>
        <InfoRow label="ชื่อ-นามสกุล" value={`${customerInfo.firstName} ${customerInfo.lastName}`.trim()} />
        <InfoRow label="Email (ใบกำกับภาษี)" value={customerInfo.emailTax} />
        <InfoRow label="Email (ใบเสนอราคา)" value={customerInfo.emailQuote} />
        <InfoRow label="เบอร์โทรศัพท์" value={customerInfo.phone} />
      </div>

      {/* ที่อยู่ */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">ที่อยู่ของร้านค้า หรือบริษัท</p>
        <InfoRow label="ที่อยู่" value={customerInfo.address} />
        <InfoRow label="ถนน" value={customerInfo.street} />
        <InfoRow label="แขวง/ตำบล" value={customerInfo.subdistrict} />
        <InfoRow label="เขต/อำเภอ" value={customerInfo.district} />
        <InfoRow label="จังหวัด" value={customerInfo.province} />
        <InfoRow label="รหัสไปรษณีย์" value={customerInfo.postalCode} />
      </div>
    </div>
  )
}

// ─── Payment Notification View ────────────────────────────────────────────────

function PaymentNotificationView({ recentOrder, onBuyService }) {
  if (!recentOrder) {
    return (
      <EmptyState
        icon={CreditCard}
        title="ยังไม่มีรายการที่ต้องชำระ"
        subtitle="รายการชำระเงินจะปรากฏที่นี่หลังจากที่คุณสั่งซื้อบริการ"
      />
    )
  }
  const { service, orderRef, date } = recentOrder
  const Icon = service?.icon ?? CreditCard
  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-[18px] font-bold text-slate-800">แจ้งการชำระเงิน</h1>
        <p className="text-xs text-slate-400 mt-0.5">Payment Notification</p>
      </div>
      {/* Order summary */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-4 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl ${service?.bg ?? 'bg-slate-100'} flex items-center justify-center shrink-0`}>
          <Icon className={`w-6 h-6 ${service?.color ?? 'text-slate-500'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-800 text-xs">{service?.title ?? '—'}</p>
          <p className="text-xs text-slate-400 mt-0.5">#{orderRef} · {date?.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-extrabold text-slate-800 text-xs">{service?.price ?? '—'}</p>
          <p className="text-xs text-slate-400">{service?.unit ?? ''}</p>
        </div>
      </div>
      {/* Upload slip */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <p className="text-xs font-semibold text-slate-700 mb-1">แนบสลิปโอนเงิน</p>
        <p className="text-xs text-slate-400 mb-4">อัปโหลดหลักฐานการชำระเงินเพื่อให้ทีมงานดำเนินการต่อ</p>
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center gap-2 bg-slate-50 cursor-not-allowed opacity-60">
          <CreditCard className="w-8 h-8 text-slate-300" />
          <p className="text-xs font-medium text-slate-400">คลิกเพื่ออัปโหลดสลิป</p>
          <p className="text-xs text-slate-300">PNG, JPG ขนาดไม่เกิน 5MB</p>
        </div>
        <p className="text-xs text-slate-400 mt-3 text-center">ฟีเจอร์นี้จะเปิดใช้งานเร็วๆ นี้</p>
      </div>
    </div>
  )
}

// ─── Screen 3: Dashboard ──────────────────────────────────────────────────────

function DashboardScreen({ user, selectedAccount: initAccount, isLocked: initLocked, onLogout }) {
  // True if the user started this session as an existing/full-mode user.
  // Survives handleGoNewUserPath resets so @duplicate chip stays visible for them.
  const wasExistingUser = !initLocked

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
  const [lockedMenuModal,     setLockedMenuModal]     = useState(null)  // stores menu label string
  const [purchaseEntryMode,   setPurchaseEntryMode]   = useState(null)  // 'new' | 'transfer' | null
  const [transferBasicId,     setTransferBasicId]     = useState(null)  // persists for transfer customers
  const [recentOrder,         setRecentOrder]         = useState(null)  // persists across nav
  const [savedCustomerInfo,   setSavedCustomerInfo]   = useState(null)  // saved from purchase form
  const [purchasedServices,   setPurchasedServices]   = useState(new Set())  // tracks completed purchases

  const isManageView = activeMenu === 'จัดการ Basic ID' && !showPurchase

  const handlePurchase = (service) => {
    if (service.id === 'api' && !purchasedServices.has('broadcast')) {
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

  // Unlock to transfer mode without navigating away (used inside purchase flow)
  const handleUnlockAsTransfer = (basicId) => {
    handleUnlock(basicId)
    setTransferBasicId(basicId)
  }

  const handleNavClick = (label) => {
    setActiveMenu(label)
    setShowPurchase(false)
    setManageEntryStep(null)
    setPurchaseStep(1)
    setOrderPayload(null)
    setPurchaseEntryMode(null)
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
    setPurchaseEntryMode('new')
    setShowPurchase(true)
    setActiveMenu('ซื้อบริการ')
  }

  // "ไปที่หน้าซื้อบริการ" from transfer-user ACCOUNT_LIST:
  // Leave purchaseEntryMode=null so the fallback (!locked && transferBasicId → 'transfer')
  // is used, giving the form Display Name + Payment Channel fields.
  const handleGoToPurchaseAsTransfer = () => {
    setSelectedService(null)
    setCameFromPicker(false)
    setPurchaseStep(1)
    setOrderPayload(null)
    setPurchaseEntryMode(null)
    setShowPurchase(true)
    setActiveMenu('ซื้อบริการ')
  }

  // "เพิ่ม/เชื่อมต่อ LINE OA" from existing-user ACCOUNT_LIST:
  // Reset to new-user state (locked, no account) so dashboard looks like a fresh setup.
  // User picks a service themselves; purchaseEntryMode='new' so purchase form opens in new-OA mode.
  const handleGoNewUserPath = () => {
    setLocked(true)
    setAccount(null)
    setTransferBasicId(null)
    setPurchaseEntryMode(null)
    setShowPurchase(false)
    setActiveMenu('หน้าหลัก')
  }

  const handleTransferMode = (basicId) => {
    handleUnlock(basicId)
    setTransferBasicId(basicId)
    setSelectedService(null)
    setCameFromPicker(false)
    setPurchaseStep(1)
    setOrderPayload(null)
    setShowPurchase(true)
    setActiveMenu('ซื้อบริการ')
  }

  return (
    <div className="min-h-screen bg-white flex">
      {toast && <Toast message={toast.message} type={toast.type} onAction={toast.action} onDone={() => setToast(null)} />}
      {showLinkModal && <LinkAccountModal onClose={() => setShowLinkModal(false)} onUnlock={handleUnlock} />}

      {/* Locked menu modal — blocks interaction until user dismisses */}
      {lockedMenuModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl p-7 text-center">
            <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-amber-500" />
            </div>
            <h2 className="text-xs font-bold text-slate-800 mb-2">เมนูนี้ถูกล็อกอยู่</h2>
            <p className="text-xs text-slate-500 leading-relaxed mb-1">
              คุณยังไม่สามารถเข้าใช้งาน
            </p>
            <p className="font-semibold text-slate-800 text-xs mb-4">"{lockedMenuModal}"</p>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              เชื่อมต่อ Basic ID เพื่อปลดล็อกและเข้าถึงทุกฟีเจอร์ในระบบ
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setLockedMenuModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors"
              >
                ปิด
              </button>
              <button
                onClick={() => { setLockedMenuModal(null); handleNavClick('จัดการ Basic ID') }}
                className="flex-1 py-2.5 rounded-xl bg-[#00BB03] hover:bg-[#009a02] text-white font-semibold text-xs transition-colors shadow-md shadow-green-100"
              >
                เพิ่ม/เชื่อมต่อ Basic ID
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blocked service modal — Messaging API requires Broadcast first */}
      {blockedServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setBlockedServiceModal(false)} />
          <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl p-7 text-center">
            <button onClick={() => setBlockedServiceModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"><X size={18} /></button>
            <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-orange-500" />
            </div>
            <h2 className="text-xs font-bold text-slate-800 mb-2">ต้องซื้อ Broadcast Package ก่อน</h2>
            <p className="text-xs text-slate-500 leading-relaxed mb-5">
              Additional Message จำเป็นต้องใช้งานร่วมกับ Broadcast Package<br />
              กรุณาซื้อ <span className="font-semibold text-slate-700">Broadcast Package</span> ก่อนเพื่อเปิดใช้งานบริการนี้
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setBlockedServiceModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors"
              >
                ปิด
              </button>
              <button
                onClick={() => {
                  setBlockedServiceModal(false)
                  const broadcast = SERVICES.find(s => s.id === 'broadcast')
                  handlePurchase(broadcast)
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#00BB03] hover:bg-[#009a02] text-white font-semibold text-xs transition-colors shadow-md shadow-green-100"
              >
                ซื้อ Broadcast
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Sidebar ── */}
      <aside className="w-[219px] bg-white border-r border-[#E0E0E0] flex flex-col shrink-0" style={{ fontFamily: "'Prompt', sans-serif" }}>
        {/* User info — click to จัดการ Basic ID */}
        <button
          onClick={() => handleNavClick('จัดการ Basic ID')}
          className={`flex items-center gap-4 px-4 py-4 w-full text-left transition-colors hover:bg-[#F4F4F4] ${isManageView ? 'bg-[#F4F4F4]' : ''}`}
        >
          <div className="w-10 h-10 rounded-full bg-[#E4F4DF] flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-[#00BB03]">{user.name?.[0] ?? 'U'}</span>
          </div>
          <div className="flex flex-col min-w-0">
            {account?.id && (
              <span className="text-xs font-bold text-[#00BB03] truncate">{account.id}</span>
            )}
            <span className="text-xs text-[#666666] truncate">{account?.name ?? user.name}</span>
          </div>
        </button>

        <div className="border-t border-[#E0E0E0]" />

        {/* Main nav */}
        <nav className="flex-1 flex flex-col gap-[19px] px-4 py-4 overflow-y-auto">
          {SIDEBAR_ITEMS.map(({ icon: Icon, label }) => {
            const isActive = (activeMenu === label && !showPurchase) || (label === 'ซื้อบริการ' && showPurchase)
            const hasChevron = label === 'ซื้อบริการ'
            return (
              <button key={label} onClick={() => handleNavClick(label)}
                className={`flex items-center justify-between gap-4 text-xs transition-colors ${
                  isActive ? 'text-[#00BB03] font-semibold' : 'text-black hover:text-[#00BB03]'
                }`}>
                <span className="flex items-center gap-4">
                  <Icon className="w-5 h-5 shrink-0 text-[#6B7280]" />
                  {label}
                </span>
                {hasChevron && <ChevronRight className="w-4 h-4 text-[#6B7280] shrink-0" />}
              </button>
            )
          })}
        </nav>

        <div className="border-t border-[#E0E0E0]" />

        {/* Bottom nav */}
        <div className="flex flex-col gap-[19px] px-4 py-4">
          {[{ icon: BookOpen, label: 'คู่มือการใช้งาน' }, { icon: MessageCircle, label: 'ติดต่อเรา' }].map(({ icon: Icon, label }) => (
            <button key={label} className="flex items-center gap-4 text-xs text-black hover:text-[#00BB03] transition-colors">
              <Icon className="w-5 h-5 shrink-0 text-[#6B7280]" /> {label}
            </button>
          ))}
          <button onClick={onLogout} className="flex items-center gap-4 text-xs text-black hover:text-red-500 transition-colors">
            <LogOut className="w-5 h-5 shrink-0 text-[#6B7280]" /> ออกจากระบบ
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
            transferBasicId={!locked && transferBasicId ? transferBasicId : null}
            onExit={() => handleNavClick('หน้าหลัก')}
            onUnlockFullMode={handleUnlock}
            onRedirectToPurchase={handleRedirectToPurchase}
            onGoToPurchaseAsTransfer={handleGoToPurchaseAsTransfer}
            onGoNewUserPath={handleGoNewUserPath}
            onTransferMode={handleTransferMode}
          />
        </main>

      ) : (
      /* ══════════════════════════════════════════════════════════════
           ALL OTHER ROUTES — normal scrollable layout
      ══════════════════════════════════════════════════════════════ */
        <main className="flex-1 overflow-y-auto" style={{ fontFamily: "'Prompt', sans-serif" }}>
          <div className="px-[108px] py-[90px]">

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
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 mb-5 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    {selectedService && cameFromPicker ? 'เปลี่ยนบริการ' : 'กลับหน้า Dashboard'}
                  </button>
                )}

                {/* Service picker — shown when no service has been chosen yet */}
                {purchaseStep === 1 && !selectedService && (
                  <div>
                    <h2 className="text-[18px] font-bold text-gray-800 mb-1">เลือกบริการที่ต้องการสั่งซื้อ</h2>
                    <p className="text-xs text-gray-400 mb-6">Select a service to continue</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {SERVICES.map(({ id, title, icon: Icon, img, desc, color, bg, price, unit }) => (
                        <button
                          key={id}
                          onClick={() => {
                            if (id === 'api' && !purchasedServices.has('broadcast')) {
                              setBlockedServiceModal(true)
                              return
                            }
                            setSelectedService({ id, title, icon: Icon, img, desc, color, bg, price, unit })
                            setCameFromPicker(true)
                          }}
                          className="group text-left bg-white border-2 border-slate-200 hover:border-[#00BB03] rounded-2xl p-5 transition-all hover:shadow-md cursor-pointer flex items-center gap-4"
                        >
                          <div className="w-14 h-14 flex items-center justify-center shrink-0">
                            {img ? <img src={img} alt={title} className="w-9 h-9 object-contain" /> : <Icon className={`w-7 h-7 ${color}`} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-800 text-xs leading-tight">{title}</p>
                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{desc}</p>
                            <p className="text-xs font-semibold text-slate-700 mt-1.5">
                              เริ่มต้น {price}<span className="font-normal text-slate-400">{unit}</span>
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#00BB03] transition-colors shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Service form */}
                {purchaseStep === 1 && selectedService && (
                  <>
                    <h2 className="text-[18px] font-bold text-gray-800 mb-5">
                      ซื้อบริการ — {selectedService.title}
                    </h2>
                    <PurchaseValidationHeader
                      key={`${selectedService?.id}-${transferBasicId ?? 'none'}`}
                      service={selectedService}
                      isLocked={locked}
                      entryMode={purchaseEntryMode ?? (!locked && transferBasicId ? 'transfer' : null)}
                      prefilledBasicId={transferBasicId}
                      prefillCustomerInfo={!locked && !transferBasicId ? (savedCustomerInfo ?? MOCK_EXISTING_CUSTOMER_INFO) : null}
                      wasExistingUser={wasExistingUser}
                      onProceed={(p) => {
                        const ref = `ORD-${Date.now().toString().slice(-6)}`
                        setOrderPayload(p)
                        setRecentOrder({ service: selectedService, payload: p, orderRef: ref, date: new Date() })
                        if (p.customerInfo) setSavedCustomerInfo(p.customerInfo)
                        setPurchasedServices(prev => new Set([...prev, selectedService.id]))
                        setPurchaseStep('success')
                      }}
                      onUnlockFullMode={handleUnlock}
                      onTransferMode={handleUnlockAsTransfer}
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

            ) : activeMenu === 'รายการสั่งซื้อ' ? (
              <OrderHistoryView recentOrder={recentOrder} onBuyService={() => { setShowPurchase(true); setActiveMenu('ซื้อบริการ') }} />

            ) : activeMenu === 'แจ้งการชำระเงิน' ? (
              <PaymentNotificationView recentOrder={recentOrder} onBuyService={() => { setShowPurchase(true); setActiveMenu('ซื้อบริการ') }} />

            ) : activeMenu === 'จัดการบัญชี' ? (
              <ManageAccountView
                customerInfo={
                  savedCustomerInfo ??
                  (!locked && !transferBasicId ? MOCK_EXISTING_CUSTOMER_INFO : null)
                }
                isExistingUser={!locked && !transferBasicId && !savedCustomerInfo}
                onBuyService={() => { setShowPurchase(true); setActiveMenu('ซื้อบริการ') }}
              />

            ) : (
              /* Dashboard home (and any other non-purchase route) */
              <>
                {/* Greeting */}
                <div className="mb-6">
                  <div className="text-[34px] leading-tight">
                    <span className="font-normal text-black">
                      {locked ? 'สวัสดีครับ คุณ ' : 'ยินดีต้อนรับกลับมา คุณ '}
                    </span>
                    <span className="font-bold text-black">{user.name}</span>
                  </div>
                  {account?.id && !locked && (
                    <p className="text-[34px] font-normal text-black leading-tight mt-0.5">
                      คุณกำลังใช้บริการ Basic ID <span className="font-bold text-[#00BB03]">{account.id}</span>
                    </p>
                  )}
                </div>


                {/* Full Mode celebration */}
                {justUnlocked && !locked && (
                  <div className="mb-8 bg-[#E7FAE7] border border-[#00BB03] rounded p-5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-[#00BB03]/10 flex items-center justify-center shrink-0"><Unlock className="w-4 h-4 text-[#00BB03]" /></div>
                    <div>
                      <p className="font-bold text-[#00BB03] text-xs flex items-center gap-1.5"><Sparkles size={14} /> Full Mode เปิดใช้งานแล้ว!</p>
                      <p className="text-xs text-[#666666] mt-0.5">เมนูทั้งหมดพร้อมใช้งานเรียบร้อยแล้ว</p>
                    </div>
                  </div>
                )}

                {/* Packages */}
                <section className="mb-10 flex flex-col gap-6">
                  {PACKAGES.map(({ name, statusLabel, status }) => (
                    <div key={name} className="bg-white rounded p-6 flex flex-col gap-4" style={{ boxShadow: '0px 2px 4px rgba(0,0,0,0.25)' }}>
                      <p className="text-[22px] font-bold text-black">{name}</p>
                      <p className="text-[18px] leading-[21px]">
                        <span className="font-normal text-black">{statusLabel}</span>
                        <span className="font-bold text-[#00BB03]">{status}</span>
                      </p>
                    </div>
                  ))}
                </section>

                {/* Services */}
                <section>
                  <h2 className="text-[34px] font-normal text-black text-center mb-6">กรุณาเลือกบริการที่ต้องการ</h2>
                  <div className="grid grid-cols-4 gap-6">
                    {SERVICES.map(({ id, title, icon: Icon, img, desc, color, bg, price, unit }) => (
                      <div key={id} className="bg-white rounded p-8 flex flex-col items-center gap-6" style={{ boxShadow: '0px 2px 4px rgba(0,0,0,0.25)' }}>
                        <div className="w-16 h-16 flex items-center justify-center">
                          {img ? <img src={img} alt={title} className="w-10 h-10 object-contain" /> : <Icon className={`w-8 h-8 ${color}`} />}
                        </div>
                        <div className="w-full flex flex-col gap-2">
                          <p className="font-bold text-[22px] text-black text-center leading-tight">{title}</p>
                          <button
                            onClick={() => handlePurchase({ id, title, icon: Icon, img, desc, color, bg, price, unit })}
                            className="w-full bg-[#00BB03] hover:bg-[#009a02] text-white text-xs py-2 rounded-full transition-colors">
                            สั่งซื้อ
                          </button>
                        </div>
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
