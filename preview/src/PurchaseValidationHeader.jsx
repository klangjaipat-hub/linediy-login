import { useState, useEffect } from "react";
import {
  Info, Radio, Crown, MessageSquare, Zap,
  CheckCircle2, Building2, ChevronRight, Loader2, Ban, Copy, UserPlus, X,
  ShoppingBag, ShoppingCart, Store, Calendar,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Mock verification lookup — use these handles in demos
// ---------------------------------------------------------------------------
const VERIFY_MOCK = {
  // ✅ Happy cases
  '@happyshop':  'success',
  '@demo':       'success',
  '@mycoolshop': 'success',
  '@sellsukishop': 'success',
  '@333aaaa':    'success',
  '@mybrand-th': 'success',
  // 🚫 Banned / suspended
  '@banned':     'banned',
  '@suspended':  'banned',
  // 🔁 Already registered with Sellsuki
  '@duplicate':  'duplicate',
  '@existing':   'duplicate',
  // 🔄 Not found — transfer path
  '@notfound':          'not_found',
  '@notfound/transfer': 'not_found',
}

const DEMO_CHIPS = [
  { id: '@happyshop', label: 'สำเร็จ',      color: 'bg-green-100 text-green-700 hover:bg-green-200'   },
  { id: '@notfound',  label: 'ไม่พบในระบบ', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200'      },
  { id: '@banned',    label: 'ถูกแบน',      color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
  { id: '@duplicate', label: 'มีในระบบแล้ว',color: 'bg-purple-100 text-purple-700 hover:bg-purple-200' },
]

const THAI_PROVINCES = [
  'กรุงเทพมหานคร','กระบี่','กาญจนบุรี','กาฬสินธุ์','กำแพงเพชร',
  'ขอนแก่น','จันทบุรี','ฉะเชิงเทรา','ชลบุรี','ชัยนาท','ชัยภูมิ',
  'ชุมพร','เชียงราย','เชียงใหม่','ตรัง','ตราด','ตาก','นครนายก',
  'นครปฐม','นครพนม','นครราชสีมา','นครศรีธรรมราช','นครสวรรค์',
  'นนทบุรี','นราธิวาส','น่าน','บึงกาฬ','บุรีรัมย์','ปทุมธานี',
  'ประจวบคีรีขันธ์','ปราจีนบุรี','ปัตตานี','พระนครศรีอยุธยา',
  'พะเยา','พังงา','พัทลุง','พิจิตร','พิษณุโลก','เพชรบุรี',
  'เพชรบูรณ์','แพร่','ภูเก็ต','มหาสารคาม','มุกดาหาร','แม่ฮ่องสอน',
  'ยโสธร','ยะลา','ร้อยเอ็ด','ระนอง','ระยอง','ราชบุรี','ลพบุรี',
  'ลำปาง','ลำพูน','เลย','ศรีสะเกษ','สกลนคร','สงขลา','สตูล',
  'สมุทรปราการ','สมุทรสงคราม','สมุทรสาคร','สระแก้ว','สระบุรี',
  'สิงห์บุรี','สุโขทัย','สุพรรณบุรี','สุราษฎร์ธานี','สุรินทร์',
  'หนองคาย','หนองบัวลำภู','อ่างทอง','อำนาจเจริญ','อุดรธานี',
  'อุตรดิตถ์','อุทัยธานี','อุบลราชธานี',
]

// ---------------------------------------------------------------------------
// Tooltip
// ---------------------------------------------------------------------------
function Tooltip({ children, text }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}
        className="text-slate-400 hover:text-slate-600 transition-colors" aria-label="More info"
      >
        {children}
      </button>
      {open && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 rounded-lg bg-slate-800 text-white text-xs p-3 leading-relaxed shadow-lg z-20 pointer-events-none">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
        </span>
      )}
    </span>
  );
}

// ---------------------------------------------------------------------------
// RadioCard
// ---------------------------------------------------------------------------
function RadioCard({ id, name, value, checked, onChange, label, sublabel }) {
  return (
    <label htmlFor={id} className={`flex items-start gap-3 cursor-pointer rounded-xl border-2 px-4 py-3.5 transition-all select-none ${
      checked ? "border-green-500 bg-green-50 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"
    }`}>
      <input id={id} type="radio" name={name} value={value} checked={checked} onChange={onChange}
        className="mt-0.5 accent-green-500 w-4 h-4 shrink-0" />
      <span>
        <span className="block font-semibold text-slate-800 text-xs leading-snug">{label}</span>
        {sublabel && <span className="block text-xs text-slate-500 mt-0.5">{sublabel}</span>}
      </span>
    </label>
  );
}

// ---------------------------------------------------------------------------
// Reveal
// ---------------------------------------------------------------------------
function Reveal({ show, children }) {
  const [render,  setRender]  = useState(show);
  const [visible, setVisible] = useState(false);
  const [stable,  setStable]  = useState(false); // true = animation done, allow overflow-visible for tooltips

  useEffect(() => {
    if (show) {
      setRender(true);
      setStable(false);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setStable(false);
      setVisible(false);
      const t = setTimeout(() => setRender(false), 300);
      return () => clearTimeout(t);
    }
  }, [show]);

  if (!render) return null;
  return (
    <div
      className={`transition-all duration-300 ease-in-out ${stable ? 'overflow-visible' : 'overflow-hidden'} ${visible ? "opacity-100 max-h-[600px]" : "opacity-0 max-h-0"}`}
      onTransitionEnd={() => { if (show && visible) setStable(true); }}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// useAccountForm — shared account state hook
// entryMode: null | 'new' | 'transfer'
// initialBasicId: pre-filled Basic ID handle (for transfer mode)
// ---------------------------------------------------------------------------
function useAccountForm(isLocked, entryMode, initialBasicId) {
  const [accountType,    setAccountType]    = useState(
    entryMode === 'transfer' ? 'existing' :
    entryMode === 'new'      ? 'new'      :
    isLocked ? "new" : "existing"
  );
  const [displayName,    setDisplayName]    = useState("");
  const [basicId,        setBasicId]        = useState(initialBasicId ?? "");
  // Transfer mode starts as pre-verified
  const [idVerifyState,  setIdVerifyState]  = useState(entryMode === 'transfer' ? 'transfer' : null);
  const [paymentChannel, setPaymentChannel] = useState("");
  const [agencyName,     setAgencyName]     = useState("");

  const handleTypeChange = (val) => {
    setAccountType(val); setDisplayName("");
    if (val === 'existing' && entryMode === 'transfer' && initialBasicId) {
      // Restore pre-filled transfer Basic ID when switching back to 'existing'
      setBasicId(initialBasicId);
      setIdVerifyState('transfer');
    } else {
      setBasicId("");
      setIdVerifyState(null);
    }
    setPaymentChannel(""); setAgencyName("");
  };

  const handleBasicIdChange = (val) => {
    setBasicId(val);
    if (idVerifyState !== null) {
      setIdVerifyState(null);
      setPaymentChannel("");
      setAgencyName("");
    }
  };

  const handleVerifyId = async () => {
    if (!basicId.trim()) return;
    setIdVerifyState("loading");
    await new Promise(r => setTimeout(r, 1200));
    const id = basicId.trim().toLowerCase();
    const result = VERIFY_MOCK[id] ?? "success";
    setIdVerifyState(result);
  };

  const handleChannelChange = (val) => {
    setPaymentChannel(val);
    if (val !== "other_agency") setAgencyName("");
  };

  const isValid =
    entryMode === 'new'
      ? displayName.trim() !== ""
    : entryMode === 'transfer'
      ? (accountType === 'new'
          ? displayName.trim() !== ""
          : (idVerifyState === 'success' || idVerifyState === 'transfer') && displayName.trim() !== "" && paymentChannel !== "" &&
            (paymentChannel !== "other_agency" || agencyName.trim() !== ""))
    : !isLocked || (
        accountType === "new"
          ? displayName.trim() !== ""
          : idVerifyState === "success" && paymentChannel !== "" &&
            (paymentChannel !== "other_agency" || agencyName.trim() !== "")
      );

  const payload =
    entryMode === 'new'
      ? { type: "new", displayName }
    : entryMode === 'transfer'
      ? (accountType === 'new'
          ? { type: "new", displayName }
          : { type: "transfer", basicId: basicId || initialBasicId, displayName, paymentChannel, agencyName: paymentChannel === "other_agency" ? agencyName : "" })
    : accountType === "new"
      ? { type: "new", displayName }
      : { type: "existing", displayName, basicId, paymentChannel, agencyName: paymentChannel === "other_agency" ? agencyName : "" };

  const resetVerify = () => {
    setIdVerifyState(null);
    setPaymentChannel("");
    setAgencyName("");
  };

  return {
    accountType, handleTypeChange,
    displayName, setDisplayName,
    basicId, handleBasicIdChange,
    idVerifyState, handleVerifyId, resetVerify,
    paymentChannel, handleChannelChange,
    agencyName, setAgencyName,
    isValid, payload,
  };
}

// ---------------------------------------------------------------------------
// useCustomerInfo — customer/billing information state hook
// Pass initialData to pre-fill all fields (full-mode / existing users).
// ---------------------------------------------------------------------------
function useCustomerInfo(initialData) {
  const d = initialData ?? {}
  const [customerType, setCustomerType] = useState(d.customerType ?? 'individual')
  const [nationalId,   setNationalId]   = useState(d.nationalId   ?? '')
  const [firstName,    setFirstName]    = useState(d.firstName    ?? '')
  const [lastName,     setLastName]     = useState(d.lastName     ?? '')
  const [emailTax,     setEmailTax]     = useState(d.emailTax     ?? '')
  const [emailQuote,   setEmailQuote]   = useState(d.emailQuote   ?? '')
  const [sameEmail,    setSameEmail]    = useState(false)
  const [phone,        setPhone]        = useState(d.phone        ?? '')
  const [address,      setAddress]      = useState(d.address      ?? '')
  const [street,       setStreet]       = useState(d.street       ?? '')
  const [subdistrict,  setSubdistrict]  = useState(d.subdistrict  ?? '')
  const [district,     setDistrict]     = useState(d.district     ?? '')
  const [province,     setProvince]     = useState(d.province     ?? '')
  const [postalCode,   setPostalCode]   = useState(d.postalCode   ?? '')

  const isPrefilled = !!initialData

  const MAX = 100
  const noFieldOver100 = [nationalId, firstName, lastName, emailTax, emailQuote, phone, address, street, subdistrict, district].every(f => f.length <= MAX)

  const isCustomerValid = isPrefilled || (
    firstName.trim() !== '' && lastName.trim() !== '' &&
    emailTax.trim() !== '' && phone.trim() !== '' &&
    address.trim() !== '' && subdistrict.trim() !== '' &&
    district.trim() !== '' && province !== '' && postalCode.trim() !== '' &&
    noFieldOver100
  )

  const customerPayload = {
    customerType, nationalId,
    firstName, lastName,
    emailTax,
    emailQuote: sameEmail ? emailTax : emailQuote,
    phone, address, street, subdistrict, district, province, postalCode,
  }

  return {
    customerType, setCustomerType,
    nationalId, setNationalId,
    firstName, setFirstName,
    lastName, setLastName,
    emailTax, setEmailTax,
    emailQuote, setEmailQuote,
    sameEmail, setSameEmail,
    phone, setPhone,
    address, setAddress,
    street, setStreet,
    subdistrict, setSubdistrict,
    district, setDistrict,
    province, setProvince,
    postalCode, setPostalCode,
    isPrefilled, isCustomerValid, customerPayload,
  }
}

// ---------------------------------------------------------------------------
// VerifyModal — blocking popup for all Basic ID verification outcomes
// ---------------------------------------------------------------------------
const VERIFY_MODAL_CONFIG = {
  success: {
    iconBg: 'bg-green-100',
    icon: (size) => <CheckCircle2 size={size} className="text-green-600" />,
    title: 'ตรวจพบข้อมูลบัญชี',
    body: (id) => `พบ Basic ID ${id} ในระบบแล้ว\nระบบจะปลดล็อกให้คุณเข้าสู่ Full Mode ทันที`,
    primaryLabel: 'ปลดล็อก Full Mode',
    primaryClass: 'bg-[#00BB03] hover:bg-[#009a02] text-white shadow-md shadow-green-100',
    showContact: false,
  },
  not_found: {
    iconBg: 'bg-blue-100',
    icon: (size) => <UserPlus size={size} className="text-blue-500" />,
    title: 'ไม่พบ Basic ID ในระบบ',
    body: (id) => `ไม่พบ Basic ID ${id} ในระบบ\nระบบจะดำเนินการให้คุณเป็นลูกค้าโอนย้ายเข้า Sellsuki`,
    primaryLabel: 'ดำเนินการต่อ (โอนย้าย)',
    primaryClass: 'bg-[#00BB03] hover:bg-[#009a02] text-white shadow-md shadow-green-100',
    showContact: false,
  },
  banned: {
    iconBg: 'bg-orange-100',
    icon: (size) => <Ban size={size} className="text-orange-500" />,
    title: 'บัญชีนี้ถูกระงับการใช้งาน',
    body: () => 'ติดต่อทีมงานเพื่อตรวจสอบสถานะบัญชีและขอคืนสิทธิ์การใช้งาน',
    primaryLabel: 'ปิด',
    primaryClass: 'bg-slate-800 hover:bg-slate-900 text-white',
    showContact: true,
  },
  duplicate: {
    iconBg: 'bg-purple-100',
    icon: (size) => <Copy size={size} className="text-purple-500" />,
    title: 'Basic ID นี้มีในระบบ Sellsuki แล้ว',
    body: () => 'หากคุณเป็นเจ้าของบัญชีนี้ ติดต่อ Admin เพื่อเข้าถึงบัญชีของคุณ',
    primaryLabel: 'ลองอีกครั้ง',
    primaryClass: 'bg-slate-800 hover:bg-slate-900 text-white',
    showContact: true,
  },
}

function VerifyModal({ state, basicId, onContinue, onTransfer, onRetry }) {
  const cfg = VERIFY_MODAL_CONFIG[state]
  if (!cfg) return null
  const isPrimary = state === 'success' ? onContinue : state === 'not_found' ? onTransfer : onRetry
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl p-7 text-center">
        <div className={`w-14 h-14 rounded-full ${cfg.iconBg} flex items-center justify-center mx-auto mb-4`}>
          {cfg.icon(28)}
        </div>
        <h2 className="text-xs font-bold text-slate-800 mb-2">{cfg.title}</h2>
        <p className="text-xs text-slate-500 leading-relaxed mb-6 whitespace-pre-line">{cfg.body(basicId)}</p>
        <div className="flex gap-3">
          {cfg.showContact && (
            <a href="https://lin.ee/sellsuki-support" target="_blank" rel="noopener noreferrer"
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5">
              <MessageSquare size={14} /> ติดต่อ Admin
            </a>
          )}
          <button onClick={isPrimary}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-xs transition-colors ${cfg.primaryClass}`}>
            {cfg.primaryLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// AccountSection — shared account fields used across all forms
// entryMode: null | 'new' | 'transfer'
// ---------------------------------------------------------------------------
function AccountSection({ acc, isLocked, entryMode, prefilledBasicId, wasExistingUser, onUnlockFullMode, onTransferMode }) {
  if (!isLocked && !entryMode) return null;

  const {
    accountType, handleTypeChange,
    displayName, setDisplayName,
    basicId, handleBasicIdChange,
    idVerifyState, handleVerifyId, resetVerify,
    paymentChannel, handleChannelChange,
    agencyName, setAgencyName,
  } = acc;

  const [verifyModalOpen,  setVerifyModalOpen]  = useState(false);
  const [showBasicIdGuide, setShowBasicIdGuide] = useState(false);
  useEffect(() => {
    // Don't auto-open modal for pre-seeded transfer state
    if (idVerifyState === 'transfer') return;
    if (idVerifyState && idVerifyState !== "loading") setVerifyModalOpen(true);
  }, [idVerifyState]);

  // ── Mode: 'new' — only Display Name field ──────────────────────────────────
  if (entryMode === 'new') {
    return (
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">ข้อมูลบัญชี</p>
        <div>
          <label htmlFor="acc-display-name" className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
            ชื่อแสดงผล (Display Name) <span className="text-red-400">*</span>
            <Tooltip text="ชื่อบัญชีที่แสดงให้คนอื่นเห็น โดยตั้งตามชื่อแบรนด์หรือร้านค้าของคุณ">
              <Info size={13} />
            </Tooltip>
          </label>
          <input id="acc-display-name" type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
            placeholder="เช่น My Brand Store"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition" />
        </div>
      </div>
    );
  }

  // ── Default: isLocked or entryMode='transfer' — show both type options ────────
  return (
    <>
    {verifyModalOpen && (
      <VerifyModal
        state={idVerifyState}
        basicId={basicId}
        onContinue={() => { setVerifyModalOpen(false); onUnlockFullMode?.(basicId); }}
        onTransfer={() => { setVerifyModalOpen(false); onTransferMode?.(basicId); }}
        onRetry={() => { resetVerify(); setVerifyModalOpen(false); }}
      />
    )}
    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">ข้อมูลบัญชี</p>

      {/* Account type */}
      <fieldset>
        <legend className="text-xs font-semibold text-slate-700 mb-3">
          ประเภทบัญชี <span className="text-red-400">*</span>
        </legend>
        <div className="grid grid-cols-2 gap-3">
          <RadioCard id="acc-new"      name="accountType" value="new"      checked={accountType === "new"}      onChange={() => handleTypeChange("new")}      label="เปิดบัญชีใหม่"     sublabel="Open New Account"       />
          <RadioCard id="acc-existing" name="accountType" value="existing" checked={accountType === "existing"} onChange={() => handleTypeChange("existing")} label="ระบุ Basic ID เดิม" sublabel="Use Existing Basic ID" />
        </div>
      </fieldset>

      {/* Existing-only: Basic ID + Verify (shown before Display Name so user can unlock immediately) */}
      <Reveal show={accountType === "existing"}>
        <div className="space-y-4 pt-1">

          {/* Basic ID + Verify button */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <label htmlFor="acc-basic-id" className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                Basic ID
                <Tooltip text="Basic ID คือ ID สุ่ม ประจำบัญชี LINE Official Account (LINE OA)"><Info size={14} /></Tooltip>
                <span className="text-red-400">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowBasicIdGuide(v => !v)}
                className="text-xs font-normal text-[#00BB03] hover:text-[#009a02] hover:underline transition-colors"
              >
                วิธีดู Basic ID
              </button>
            </div>

            {/* Demo chips — @duplicate only shown if user was originally an existing user */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {DEMO_CHIPS.filter(chip =>
                chip.id !== '@duplicate' || wasExistingUser
              ).map(({ id, label, color }) => (
                <button key={id} type="button" onClick={() => handleBasicIdChange(id)}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${color}`}>
                  {id} · {label}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                id="acc-basic-id"
                type="text"
                value={basicId}
                onChange={e => handleBasicIdChange(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleVerifyId()}
                placeholder="@your-id"
                disabled={idVerifyState === "success" || idVerifyState === "transfer"}
                className={`flex-1 rounded-xl border px-4 py-3 text-xs text-slate-800 placeholder-slate-400 outline-none focus:ring-2 transition bg-white ${
                  idVerifyState === "success"
                    ? "border-green-500 bg-green-50 focus:ring-green-100"
                    : idVerifyState === "transfer"
                    ? "border-orange-400 bg-orange-50 focus:ring-orange-100"
                    : ["banned","duplicate"].includes(idVerifyState)
                    ? "border-red-400 focus:ring-red-100"
                    : "border-slate-300 focus:border-green-500 focus:ring-green-200"
                }`}
              />
              <button
                type="button"
                onClick={handleVerifyId}
                disabled={idVerifyState === "loading" || idVerifyState === "success" || idVerifyState === "transfer" || !basicId.trim()}
                className={`px-4 py-3 rounded-xl font-semibold text-xs transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  idVerifyState === "success"
                    ? "bg-green-100 text-green-700 cursor-default"
                    : idVerifyState === "transfer"
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-[#00BB03] hover:bg-[#009a02] disabled:bg-slate-200 disabled:text-slate-400 text-white"
                }`}
              >
                {idVerifyState === "loading"
                  ? <><Loader2 size={14} className="animate-spin" /> กำลังตรวจสอบ</>
                  : idVerifyState === "success"
                  ? <><CheckCircle2 size={14} /> ตรวจสอบแล้ว</>
                  : idVerifyState === "transfer"
                  ? "ตรวจสอบ"
                  : ["banned","duplicate"].includes(idVerifyState)
                  ? "ลองอีกครั้ง"
                  : "ตรวจสอบ"}
              </button>
            </div>

            {/* "วิธีดู Basic ID" popup modal */}
            {showBasicIdGuide && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowBasicIdGuide(false)} />
                <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-800">วิธีดู Basic ID ของ LINE OA</h3>
                    <button type="button" onClick={() => setShowBasicIdGuide(false)}
                      className="text-slate-400 hover:text-slate-600 transition-colors">
                      <X size={16} />
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-slate-600">📱 ผ่านมือถือ</p>
                    <ol className="list-decimal list-inside space-y-1 text-xs text-slate-500 leading-relaxed">
                      <li>เปิดแอปพลิเคชัน LINE OA</li>
                      <li>กดที่ "หน้าหลัก" และกดที่เมนู "ตั้งค่า (Settings)"</li>
                      <li>กดที่ "บัญชี (Account)"</li>
                      <li>กดที่ "ID" คุณจะเห็น Basic ID ของคุณ</li>
                    </ol>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-slate-600">🖥 ผ่านคอมพิวเตอร์ (PC)</p>
                    <ol className="list-decimal list-inside space-y-1 text-xs text-slate-500 leading-relaxed">
                      <li>เข้าสู่ระบบ LINE OA ที่{' '}
                        <a href="https://manager.line.biz/" target="_blank" rel="noopener noreferrer"
                          className="text-[#00BB03] hover:underline">manager.line.biz</a>
                      </li>
                      <li>เลือกบัญชีที่คุณต้องการดู Basic ID</li>
                      <li>คลิกที่ "ตั้งค่า (Settings)" และเลื่อนลงด้านล่าง จะพบส่วนของ "ข้อมูลบัญชี (Account details)"</li>
                      <li>คุณจะพบ Basic ID ของคุณแสดงอยู่ภายใต้หัวข้อนี้</li>
                    </ol>
                  </div>

                  <button type="button" onClick={() => setShowBasicIdGuide(false)}
                    className="w-full py-2.5 rounded-xl bg-[#00BB03] hover:bg-[#009a02] text-white font-semibold text-xs transition-colors">
                    เข้าใจแล้ว
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Display Name — transfer users need this even on the existing path */}
          <Reveal show={entryMode === 'transfer' && (idVerifyState === 'transfer' || idVerifyState === 'success')}>
            <div>
              <label htmlFor="acc-display-name" className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
                ชื่อแสดงผล (Display Name) <span className="text-red-400">*</span>
                <Tooltip text="ชื่อบัญชีที่แสดงให้คนอื่นเห็น โดยตั้งตามชื่อแบรนด์หรือร้านค้าของคุณ">
                  <Info size={13} />
                </Tooltip>
              </label>
              <input id="acc-display-name" type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
                placeholder="เช่น My Brand Store"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition" />
            </div>
          </Reveal>

          {/* Payment channel — revealed after successful verification or transfer pre-fill */}
          <Reveal show={idVerifyState === "success" || idVerifyState === "transfer"}>
            <fieldset>
              <legend className="text-xs font-semibold text-slate-700 mb-1">
                ช่องทางที่เคยชำระเงินมาก่อน <span className="text-red-400">*</span>
              </legend>
              <p className="text-xs text-slate-400 mb-3">Previous Payment Channel</p>
              <div className="grid grid-cols-2 gap-3">
                <RadioCard id="pay-line"   name="paymentChannel" value="line_thailand" checked={paymentChannel === "line_thailand"} onChange={() => handleChannelChange("line_thailand")} label="ชำระผ่าน LINE Thailand"   sublabel="โดยตรงกับ LINE Thailand"   />
                <RadioCard id="pay-agency" name="paymentChannel" value="other_agency"  checked={paymentChannel === "other_agency"}  onChange={() => handleChannelChange("other_agency")}  label="ชำระผ่าน Agency เจ้าอื่น" sublabel="ผ่านตัวแทนขายรายอื่น" />
              </div>
              <Reveal show={paymentChannel === "other_agency"}>
                <div className="mt-3">
                  <label htmlFor="acc-agency-name" className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2">
                    <Building2 size={14} className="text-slate-400" /> ชื่อ Agency <span className="text-red-400">*</span>
                  </label>
                  <input id="acc-agency-name" type="text" value={agencyName} onChange={e => setAgencyName(e.target.value)}
                    placeholder="กรอกชื่อ Agency ที่เคยชำระเงินผ่าน"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition" />
                </div>
              </Reveal>
            </fieldset>
          </Reveal>

        </div>
      </Reveal>

      {/* Display Name — only shown for new account type */}
      <Reveal show={accountType === "new"}>
        <div>
          <label htmlFor="acc-display-name" className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
            ชื่อแสดงผล (Display Name) <span className="text-red-400">*</span>
            <Tooltip text="ชื่อบัญชีที่แสดงให้คนอื่นเห็น โดยตั้งตามชื่อแบรนด์หรือร้านค้าของคุณ">
              <Info size={13} />
            </Tooltip>
          </label>
          <input id="acc-display-name" type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
            placeholder="เช่น My Brand Store"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition" />
        </div>
      </Reveal>
    </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// CustomerInfoSection — customer/billing info, shown on every purchase form
// ---------------------------------------------------------------------------
const INPUT_CLS = "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition"
const SELECT_CLS = "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs text-slate-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition appearance-none cursor-pointer"

function CustomerInfoSection({ ci }) {
  const {
    customerType, setCustomerType,
    nationalId, setNationalId,
    firstName, setFirstName,
    lastName, setLastName,
    emailTax, setEmailTax,
    emailQuote, setEmailQuote,
    sameEmail, setSameEmail,
    phone, setPhone,
    address, setAddress,
    street, setStreet,
    subdistrict, setSubdistrict,
    district, setDistrict,
    province, setProvince,
    postalCode, setPostalCode,
    isPrefilled,
  } = ci

  // ── Full-mode: show confirmed read-only card ─────────────────────────────
  if (isPrefilled) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-slate-700">ข้อมูลร้านค้า หรือบริษัท</p>
          <span className="flex items-center gap-1 text-xs text-green-600 font-semibold cursor-pointer hover:text-green-700 transition-colors">
            <CheckCircle2 size={13} /> แก้ไขข้อมูลการสั่งซื้อ
          </span>
        </div>

        <div className="space-y-2 text-xs mb-5">
          <div className="flex gap-2">
            <span className="text-slate-400 shrink-0">ประเภทผู้เสียภาษี :</span>
            <span className="font-semibold text-slate-800">
              {customerType === 'corporate' ? 'นิติบุคคล' : 'บุคคลธรรมดา'}
            </span>
          </div>
          {nationalId && (
            <div className="flex gap-2">
              <span className="text-slate-400 shrink-0">เลขประจำตัวประชาชน :</span>
              <span className="font-semibold text-slate-800">{nationalId}</span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-slate-400">ชื่อ </span>
              <span className="font-semibold text-slate-800">{firstName}</span>
            </div>
            <div>
              <span className="text-slate-400">นามสกุล </span>
              <span className="font-semibold text-slate-800">{lastName}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-400 mb-0.5">Email สำหรับส่งในใบกำกับภาษี</p>
              <p className="font-semibold text-slate-800 break-all">{emailTax}</p>
            </div>
            <div>
              <p className="text-slate-400 mb-0.5">Email สำหรับส่งในใบเสนอราคา</p>
              <p className="font-semibold text-slate-800 break-all">{emailQuote || emailTax}</p>
            </div>
          </div>
          <div>
            <span className="text-slate-400">โทรศัพท์ </span>
            <span className="font-semibold text-slate-800">{phone}</span>
          </div>
        </div>

        <p className="text-xs font-semibold text-slate-700 mb-2">ที่อยู่ของร้านค้า หรือบริษัท</p>
        <div className="space-y-2 text-xs">
          <div className="flex gap-2">
            <span className="text-slate-400 shrink-0">ที่อยู่</span>
            <span className="font-semibold text-slate-800">{address}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-slate-400 shrink-0">ถนน</span>
            <span className="font-semibold text-slate-800">{street || '-'}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-slate-400">แขวง/ตำบล </span>
              <span className="font-semibold text-slate-800">{subdistrict}</span>
            </div>
            <div>
              <span className="text-slate-400">จังหวัด </span>
              <span className="font-semibold text-slate-800">{province}</span>
            </div>
          </div>
          <div>
            <span className="text-slate-400">รหัสไปรษณีย์ </span>
            <span className="font-semibold text-slate-800">{postalCode}</span>
          </div>
        </div>
      </div>
    )
  }

  // ── New user: full editable form ─────────────────────────────────────────
  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-7">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">กรอกข้อมูลของท่านให้ครบถ้วน</p>

      {/* ── ข้อมูลร้านค้า หรือบริษัท ─────────────────────────────── */}
      <div className="space-y-4">
        <p className="text-xs font-bold text-slate-700">ข้อมูลร้านค้า หรือบริษัท</p>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="ci-customerType" value="individual"
              checked={customerType === 'individual'} onChange={() => setCustomerType('individual')}
              className="accent-green-500 w-4 h-4 shrink-0" />
            <span className="text-xs text-slate-700">บุคคลธรรมดา</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="ci-customerType" value="corporate"
              checked={customerType === 'corporate'} onChange={() => setCustomerType('corporate')}
              className="accent-green-500 w-4 h-4 shrink-0" />
            <span className="text-xs text-slate-700">นิติบุคคล</span>
          </label>
        </div>
        <input type="text" value={nationalId} onChange={e => setNationalId(e.target.value)}
          placeholder="เลขประจำตัวประชาชน" maxLength={100}
          className={INPUT_CLS} />
      </div>

      {/* ── ข้อมูลผู้ติดต่อ ──────────────────────────────────────── */}
      <div className="space-y-3">
        <p className="text-xs font-bold text-slate-700">ข้อมูลผู้ติดต่อ</p>
        <div className="grid grid-cols-2 gap-3">
          <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
            placeholder="ชื่อ" maxLength={100} className={INPUT_CLS} />
          <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
            placeholder="นามสกุล" maxLength={100} className={INPUT_CLS} />
        </div>
        <label className="flex items-center gap-2 cursor-pointer w-fit">
          <input type="checkbox" id="ci-same-email" checked={sameEmail}
            onChange={e => setSameEmail(e.target.checked)}
            className="accent-green-500 w-4 h-4 rounded shrink-0" />
          <span className="text-xs text-slate-600">Email เดียวกับที่ส่งใบกำกับภาษี</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <input type="email" value={emailTax} onChange={e => setEmailTax(e.target.value)}
            placeholder="Email สำหรับส่งใบกำกับภาษี (E-tax Online)" maxLength={100}
            className={INPUT_CLS} />
          <input type="email"
            value={sameEmail ? emailTax : emailQuote}
            onChange={e => { if (!sameEmail) setEmailQuote(e.target.value) }}
            placeholder="Email สำหรับส่งใบเสนอราคา"
            disabled={sameEmail} maxLength={100}
            className={`${INPUT_CLS} ${sameEmail ? 'opacity-50 cursor-not-allowed bg-slate-100' : ''}`} />
        </div>
        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
          placeholder="เบอร์โทรศัพท์" maxLength={100}
          className={INPUT_CLS} />
      </div>

      {/* ── ที่อยู่ของร้านค้า หรือบริษัท ─────────────────────────── */}
      <div className="space-y-3">
        <p className="text-xs font-bold text-slate-700">ที่อยู่ของร้านค้า หรือบริษัท</p>
        <input type="text" value={address} onChange={e => setAddress(e.target.value)}
          placeholder="ที่อยู่ (ระบุเลขที่ อาคาร ชั้นที่ ห้องที่ หมู่ หรือซอย)" maxLength={100}
          className={INPUT_CLS} />
        <div className="grid grid-cols-2 gap-3">
          <input type="text" value={street} onChange={e => setStreet(e.target.value)}
            placeholder="ถนน (ถ้ามี)" maxLength={100} className={INPUT_CLS} />
          <input type="text" value={subdistrict} onChange={e => setSubdistrict(e.target.value)}
            placeholder="แขวง/ตำบล" maxLength={100} className={INPUT_CLS} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input type="text" value={district} onChange={e => setDistrict(e.target.value)}
            placeholder="เขต/อำเภอ" maxLength={100} className={INPUT_CLS} />
          <div className="relative">
            <select value={province} onChange={e => setProvince(e.target.value)}
              className={SELECT_CLS}>
              <option value="" disabled>จังหวัด</option>
              {THAI_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" />
          </div>
        </div>
        <input type="text" value={postalCode} onChange={e => setPostalCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
          placeholder="รหัสไปรษณีย์" inputMode="numeric" maxLength={5}
          className={INPUT_CLS} />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// PlanCard — generic selectable card with feature list
// ---------------------------------------------------------------------------
function PlanCard({ id, name, checked, onChange, price, unit, features, accent, badge }) {
  return (
    <label htmlFor={id} className={`relative cursor-pointer rounded-2xl border-2 p-5 transition-all select-none block ${
      checked ? `border-${accent}-500 bg-${accent}-50 shadow-md` : "border-slate-200 bg-white hover:border-slate-300"
    }`}>
      <input id={id} type="radio" checked={checked} onChange={onChange} className="sr-only" />
      {badge && (
        <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-0.5 rounded-full bg-${accent}-100 text-${accent}-700`}>
          {badge}
        </span>
      )}
      <p className={`font-bold text-xs mb-1 ${checked ? `text-${accent}-700` : "text-slate-800"}`}>{name}</p>
      <p className={`text-[22px] font-extrabold mb-0.5 ${checked ? `text-${accent}-700` : "text-slate-800"}`}>
        {price}<span className="text-xs font-normal text-slate-400 ml-1">{unit}</span>
      </p>
      <ul className="mt-3 space-y-1.5">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
            <CheckCircle2 size={13} className={checked ? `text-${accent}-500` : "text-slate-300"} />
            {f}
          </li>
        ))}
      </ul>
    </label>
  );
}

// ===========================================================================
// BROADCAST PACKAGE — helpers, data, sub-components, upgrade modal
// ===========================================================================

const BROADCAST_PLAN_DATA = {
  basic: {
    name: 'Basic',
    icon: Store,
    durations: [
      { months: 3,  price: 3840,  icon: ShoppingBag  },
      { months: 6,  price: 7680,  icon: ShoppingCart },
      { months: 12, price: 15360, icon: Store        },
    ],
  },
  pro: {
    name: 'Pro',
    icon: Building2,
    durations: [
      { months: 3,  price: 7680,  icon: ShoppingBag  },
      { months: 6,  price: 15360, icon: ShoppingCart },
      { months: 12, price: 30720, icon: Store        },
    ],
  },
}

function toInputDateStr(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function computeEndDate(dateStr, months) {
  if (!dateStr || !months) return ''
  const [y, m] = dateStr.split('-').map(Number)
  const end = new Date(y, m - 1 + months, 0)
  return end.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
}

function BroadcastSection({ label, children }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold text-slate-700 mb-2">{label}</p>
      <hr className="border-slate-200 mb-4" />
      {children}
    </div>
  )
}

function BroadcastPlanCard({ planKey, name, Icon, selected, onSelect }) {
  return (
    <div className={`rounded-2xl border-2 transition-all overflow-hidden ${
      selected ? 'border-[#00BB03] bg-[#00BB03]' : 'border-slate-200 bg-white'
    }`}>
      <div className="flex flex-col items-center justify-center px-6 pt-6 pb-5 gap-3">
        <div className={`w-[90px] h-[90px] rounded-xl flex items-center justify-center ${selected ? 'bg-white/15' : 'bg-slate-100'}`}>
          <Icon size={48} className={selected ? 'text-white' : 'text-slate-500'} />
        </div>
        <p className={`font-bold text-[20px] ${selected ? 'text-white' : 'text-slate-800'}`}>{name}</p>
        <button
          type="button"
          onClick={onSelect}
          className={`w-full py-2 rounded-full text-xs font-semibold border-2 transition-colors ${
            selected
              ? 'border-white text-white hover:bg-white/10'
              : 'border-[#00BB03] text-[#00BB03] hover:bg-green-50'
          }`}
        >
          เลือกแพ็กเกจบรอดแคสต์
        </button>
        <button type="button" className={`text-xs ${selected ? 'text-white/80 hover:text-white' : 'text-[#00BB03]'} hover:underline`}>
          อ่านรายละเอียด
        </button>
      </div>
    </div>
  )
}

function BroadcastDurationCard({ planName, months, price, Icon, selected, onSelect }) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-2xl border-2 transition-all select-none text-center p-4 ${
        selected ? 'border-[#00BB03] bg-[#00BB03]' : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <p className={`font-bold text-[15px] mb-3 leading-tight ${selected ? 'text-white' : 'text-slate-800'}`}>
        {planName} {months} เดือน
      </p>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${selected ? 'bg-white/15' : 'bg-slate-100'}`}>
        <Icon size={24} className={selected ? 'text-white' : 'text-slate-500'} />
      </div>
      <p className={`font-extrabold text-[20px] mb-1 ${selected ? 'text-white' : 'text-green-600'}`}>
        {price.toLocaleString()} บาท
      </p>
      <p className={`text-[10px] leading-snug ${selected ? 'text-white/70' : 'text-slate-400'}`}>
        *ราคาดังกล่าวไม่รวมภาษีมูลค่าเพิ่ม7%
      </p>
    </div>
  )
}

// ── UpgradeProModal ──────────────────────────────────────────────────────────
function UpgradeProModal({ qty, duration, basicDurPrice, proDurPrice, onUpgrade, onDismiss }) {
  const costBasic     = basicDurPrice + qty * 0.1
  const costPro       = proDurPrice + Math.max(0, qty - 20000) * 0.06
  const savings       = Math.round(costBasic - costPro)
  const basicAddon    = qty * 0.1
  const proAddon      = Math.max(0, qty - 20000) * 0.06
  const freeExtra     = Math.min(qty, 20000)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onDismiss} />
      <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl p-7">
        <button onClick={onDismiss} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
          <X size={18} />
        </button>

        <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
          <Crown size={28} className="text-yellow-500" />
        </div>

        <h2 className="text-xs font-bold text-slate-800 text-center mb-1">อัปเกรดเป็น Pro คุ้มค่ากว่า!</h2>
        <p className="text-xs text-slate-500 text-center mb-5 leading-relaxed">
          จากจำนวนข้อความที่คุณต้องการ ({qty.toLocaleString()} ข้อความ)<br />
          แพ็กเกจ Pro คิดราคาถูกกว่า Basic
        </p>

        {/* Comparison */}
        <div className="space-y-2 mb-4">
          {/* Basic */}
          <div className="rounded-xl border-2 border-slate-200 p-3">
            <p className="text-xs font-semibold text-slate-600 mb-2">Basic + ข้อความเพิ่มเติม</p>
            <div className="space-y-1 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>ค่าแพ็กเกจ Basic ({duration} เดือน)</span>
                <span className="font-semibold text-slate-700">฿{basicDurPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>{qty.toLocaleString()} ข้อความ × ฿0.10</span>
                <span className="font-semibold text-slate-700">฿{basicAddon.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-1">
                <span className="font-bold text-slate-700">รวม</span>
                <span className="font-bold text-slate-800">฿{Math.round(costBasic).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Pro */}
          <div className="rounded-xl border-2 border-[#00BB03] bg-green-50 p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-green-700">Pro + ข้อความเพิ่มเติม</p>
              <span className="text-[10px] bg-[#00BB03] text-white px-2 py-0.5 rounded-full font-bold">แนะนำ</span>
            </div>
            <div className="space-y-1 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>ค่าแพ็กเกจ Pro ({duration} เดือน)</span>
                <span className="font-semibold text-slate-700">฿{proDurPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>{freeExtra.toLocaleString()} ข้อความ รวมอยู่ใน Pro แล้ว</span>
                <span className="font-semibold">ฟรี</span>
              </div>
              {qty > 20000 && (
                <div className="flex justify-between">
                  <span>{(qty - 20000).toLocaleString()} ข้อความส่วนเกิน × ฿0.06</span>
                  <span className="font-semibold text-slate-700">฿{proAddon.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-green-200 pt-1">
                <span className="font-bold text-green-700">รวม</span>
                <span className="font-bold text-green-700">฿{Math.round(costPro).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Savings callout */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-center mb-5">
          <p className="text-xs text-amber-700">
            อัปเกรดเป็น Pro ประหยัดได้ถึง{' '}
            <strong className="text-amber-800">฿{savings.toLocaleString()}</strong>
          </p>
        </div>

        <div className="flex gap-3">
          <button onClick={onDismiss}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors">
            ไม่ ขอบคุณ
          </button>
          <button onClick={onUpgrade}
            className="flex-1 py-2.5 rounded-xl bg-[#00BB03] hover:bg-[#009a02] text-white font-bold text-xs transition-colors shadow-md shadow-green-100">
            อัปเกรดเป็น Pro
          </button>
        </div>
      </div>
    </div>
  )
}

// ===========================================================================
// FORM 1 — BROADCAST PACKAGE
// ===========================================================================
function BroadcastForm({ onProceed, isLocked, entryMode, prefilledBasicId, prefillCustomerInfo, wasExistingUser, onUnlockFullMode, onTransferMode }) {
  const acc = useAccountForm(isLocked, entryMode, prefilledBasicId)
  const ci  = useCustomerInfo(prefillCustomerInfo)

  const [plan,       setPlan]       = useState(null)
  const [duration,   setDuration]   = useState(null)
  const [startDate,  setStartDate]  = useState(toInputDateStr(new Date()))

  const [addlMsg,    setAddlMsg]    = useState(true)
  const [addlMsgQty, setAddlMsgQty] = useState('')
  const [premiumId,  setPremiumId]  = useState(false)
  const [oaChat,     setOaChat]     = useState(false)

  // ── Upgrade suggestion state ────────────────────────────────────────────
  const [upgradePopupOpen,      setUpgradePopupOpen]      = useState(false)
  const [popupShownThisSession, setPopupShownThisSession] = useState(false)
  const [lastTriggerQty,        setLastTriggerQty]        = useState(null)
  const [bannerDismissed,       setBannerDismissed]       = useState(false)

  // Reset inline banner whenever the plan changes so it reappears if user switches back to Basic
  useEffect(() => { setBannerDismissed(false) }, [plan]) // eslint-disable-line react-hooks/exhaustive-deps

  const qty           = parseInt(addlMsgQty || 0)
  const basicDurPrice = plan && duration ? (BROADCAST_PLAN_DATA.basic.durations.find(d => d.months === duration)?.price ?? 0) : 0
  const proDurPrice   = plan && duration ? (BROADCAST_PLAN_DATA.pro.durations.find(d => d.months === duration)?.price ?? 0) : 0
  const costBasic     = basicDurPrice + qty * 0.1
  const costPro       = proDurPrice + Math.max(0, qty - 20000) * 0.06

  // Plan-aware add-on price: flat rate per message regardless of free quota
  const addlMsgPrice = addlMsg
    ? (plan === 'pro' ? qty * 0.06 : qty * 0.1)
    : 0

  // Savings on the add-on messages if the user were on Pro instead
  // (Pro's 20k free + 0.06 rate vs Basic's 0.10 rate — always positive when qty > 0)
  const msgSavings = Math.round(qty * 0.1 - Math.max(0, qty - 20000) * 0.06)

  // Debounced upgrade suggestion trigger
  useEffect(() => {
    if (plan !== 'basic' || !addlMsg || !duration) return
    if (qty < 15000) return
    if (costBasic <= costPro) return

    const timer = setTimeout(() => {
      const isSignificant = lastTriggerQty === null || Math.abs(qty - lastTriggerQty) >= 5000
      if (!popupShownThisSession || isSignificant) {
        setUpgradePopupOpen(true)
        setPopupShownThisSession(true)
        setLastTriggerQty(qty)
      }
    }, 600)

    return () => clearTimeout(timer)
  }, [addlMsgQty, plan, addlMsg, duration]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleUpgradeToPro = () => {
    setPlan('pro')
    setUpgradePopupOpen(false)
    if (qty > 20000) setAddlMsgQty(String(qty - 20000))
    else if (qty > 0) setAddlMsgQty('0')
    setPopupShownThisSession(false)
    setLastTriggerQty(null)
  }

  const handleBannerUpgrade = () => {
    setPlan('pro')
    setBannerDismissed(true)
    if (qty > 20000) setAddlMsgQty(String(qty - 20000))
    else if (qty > 0) setAddlMsgQty('0')
    setLastTriggerQty(null)
  }

  const endDate   = computeEndDate(startDate, duration)
  const canSubmit = acc.isValid && plan !== null && duration !== null && ci.isCustomerValid

  return (
    <div className="max-w-2xl">
      {upgradePopupOpen && (
        <UpgradeProModal
          qty={qty}
          duration={duration}
          basicDurPrice={basicDurPrice}
          proDurPrice={proDurPrice}
          onUpgrade={handleUpgradeToPro}
          onDismiss={() => setUpgradePopupOpen(false)}
        />
      )}

      {/* Page title */}
      <div className="mb-5">
        <h1 className="text-[22px] font-bold text-black">ซื้อแพ็กเกจบรอดแคสต์</h1>
        <p className="text-xs text-slate-500 mt-0.5">เลือกแพ็กเกจบรอดแคสต์ที่คุณต้องการ</p>
      </div>
      <hr className="border-slate-200 mb-6" />

      {/* Account (locked / transfer users only) */}
      {(isLocked || entryMode) && (
        <div className="mb-6">
          <AccountSection acc={acc} isLocked={isLocked} entryMode={entryMode} prefilledBasicId={prefilledBasicId} wasExistingUser={wasExistingUser} onUnlockFullMode={onUnlockFullMode} onTransferMode={onTransferMode} />
        </div>
      )}

      {/* ── 1. Plan selection ── */}
      <BroadcastSection label="เลือกแพ็กเกจ">
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(BROADCAST_PLAN_DATA).map(([key, p]) => (
            <BroadcastPlanCard
              key={key}
              planKey={key}
              name={p.name}
              Icon={p.icon}
              selected={plan === key}
              onSelect={() => { setPlan(key); setDuration(null) }}
            />
          ))}
        </div>
      </BroadcastSection>

      {/* ── 2. Duration ── */}
      {plan && (
        <BroadcastSection label="เลือกจำนวนเดือนที่คุณต้องการ">
          <div className="grid grid-cols-3 gap-3">
            {BROADCAST_PLAN_DATA[plan].durations.map(({ months, price, icon: DIcon }) => (
              <BroadcastDurationCard
                key={months}
                planName={BROADCAST_PLAN_DATA[plan].name}
                months={months}
                price={price}
                Icon={DIcon}
                selected={duration === months}
                onSelect={() => setDuration(months)}
              />
            ))}
          </div>
        </BroadcastSection>
      )}

      {/* ── 3. Date ── */}
      {duration && (
        <BroadcastSection label="เลือกวันที่ต้องการเปิดใช้งานแพ็กเกจ">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">วันที่เริ่มใช้งาน</label>
              <div className="relative">
                <input
                  type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs text-slate-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition pr-10"
                />
                <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">วันที่แพ็กเกจหมดอายุ</label>
              <input
                type="text" value={endDate} readOnly
                className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-xs text-slate-500 outline-none cursor-not-allowed"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-red-500">หมายเหตุ</p>
            {[
              'กรณีต้องการเริ่มใช้งานใน วันมะรืนหรือวันใดก็ตาม ระบบจะดำเนินการเปิดให้บริการในวันที่กำหนดไว้',
              'สำหรับลูกค้าที่ย้ายมาจาก Agency อื่น ถ้าหากแพ็กเกจเดิมยังมีอยู่สามารถกำหนดวันที่เริ่มใช้งานได้ตั้งแต่วันที่แพ็กเกจเดิมหมดอายุ',
              'แพ็กเกจบรอดแคสต์จะเริ่มบริการตั้งแต่วันที่ 1 เพราะ LINE Thailand จะบริการตั้งแต่วันที่บรอดแคสต์ใช้งานบน วันที่สิ้นเดือนเสมอ (เช่น เริ่มใช้วันที่ 16 มีนาคม อายุการใช้งานของเดือนมีนาคมจะถือตั้งแต่วันที่ 16-31 มีนาคม)',
            ].map((note, i) => (
              <p key={i} className="text-xs text-red-500 leading-relaxed">* {note}</p>
            ))}
          </div>
        </BroadcastSection>
      )}

      {/* ── 4. Add-on services ── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <p className="text-xs font-semibold text-slate-700">
            เลือกบริการเสริมที่คุณต้องการ <span className="font-normal">(เลือกได้มากกว่า 1 อย่าง)</span>
          </p>
          <Tooltip text="บริการเสริมที่สามารถซื้อเพิ่มเติมควบคู่กับ Broadcast Package">
            <Info size={13} />
          </Tooltip>
        </div>
        <div className="space-y-3">
          {/* ข้อความเพิ่มเติม */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <label className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors">
              <input type="checkbox" checked={addlMsg} onChange={e => setAddlMsg(e.target.checked)}
                className="accent-green-500 w-4 h-4 shrink-0" />
              <span className="text-xs font-medium text-slate-800">
                ข้อความเพิ่มเติม (ข้อความละ {plan === 'pro' ? '0.06' : '0.1'} บาท)
              </span>
            </label>
            {addlMsg && (
              <div className="px-4 pb-4 border-t border-slate-100 bg-slate-50">
                <div className="relative mt-3">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={addlMsgQty}
                    onChange={e => setAddlMsgQty(e.target.value.replace(/\D/g, ''))}
                    placeholder="จำนวนข้อความเพิ่มเติม ที่ต้องการซื้อ"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition pr-28"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-green-600 pointer-events-none">
                    {addlMsgPrice.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท
                  </span>
                </div>
                {/* ── Inline Pro upsell banner ── */}
                {plan === 'basic' && qty > 0 && !bannerDismissed && (
                  <div className="mt-3 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="flex">
                      {/* Left accent bar */}
                      <div className="w-[3px] bg-[#00BB03] shrink-0" />

                      <div className="flex-1 px-3.5 pt-3 pb-3">
                        {/* Header row */}
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="flex items-center gap-2">
                            <Crown size={13} className="text-yellow-500 shrink-0" />
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                              Broadcast Pro
                            </span>
                            <span className="text-[9px] font-bold text-white bg-[#00BB03] px-1.5 py-0.5 rounded uppercase tracking-wide leading-none">
                              แนะนำ
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setBannerDismissed(true)}
                            aria-label="ปิด"
                            className="text-slate-300 hover:text-slate-500 transition-colors"
                          >
                            <X size={13} />
                          </button>
                        </div>

                        {/* Savings headline */}
                        <p className="text-[13px] font-bold text-slate-800 leading-tight mb-2.5">
                          ประหยัดค่าข้อความได้{' '}
                          <span className="text-[#00BB03]">฿{msgSavings.toLocaleString()}</span>
                          {' '}เมื่ออัปเกรดเป็น Pro
                        </p>

                        {/* Benefit bullets */}
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1 mb-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-3.5 h-3.5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#00BB03]" />
                            </div>
                            <span className="text-[10px] text-slate-500">
                              ฟรี <span className="font-semibold text-slate-700">35,000</span> ข้อความ
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-3.5 h-3.5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#00BB03]" />
                            </div>
                            <span className="text-[10px] text-slate-500">
                              ส่วนเกินเพียง <span className="font-semibold text-slate-700">0.06</span> บาท/ข้อความ
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={handleBannerUpgrade}
                            className="text-[11px] font-bold text-white bg-[#00BB03] hover:bg-[#009a02] px-4 py-2 rounded-lg transition-colors"
                          >
                            อัปเกรดเป็น Pro
                          </button>
                          <button
                            type="button"
                            onClick={() => setBannerDismissed(true)}
                            className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            ยกเลิก
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-2 space-y-0.5">
                  <p className="text-xs text-slate-400">* ราคาดังกล่าวไม่รวมภาษีมูลค่าเพิ่ม 7%</p>
                  <p className="text-xs text-slate-400">** ข้อความเพิ่มเติม หากใช้ไม่หมดจะถูกตัดดอกตามระยะเวลาที่ถือกับแพ็กเกจหลักเข้ามา</p>
                </div>
              </div>
            )}
          </div>

          {/* Premium ID */}
          <label className="flex items-center gap-3 px-4 py-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
            <input type="checkbox" checked={premiumId} onChange={e => setPremiumId(e.target.checked)}
              className="accent-green-500 w-4 h-4 shrink-0" />
            <span className="text-xs font-medium text-slate-800">Premium ID (444 บาท)</span>
          </label>

          {/* OA Chat Package */}
          <label className="flex items-center gap-3 px-4 py-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
            <input type="checkbox" checked={oaChat} onChange={e => setOaChat(e.target.checked)}
              className="accent-green-500 w-4 h-4 shrink-0" />
            <span className="text-xs font-medium text-slate-800">OA Chat Package</span>
          </label>
        </div>
      </div>

      {/* ── 5. Customer info ── */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-slate-700 mb-3">ตรวจสอบข้อมูลของท่านให้ครบถ้วน</p>
        <CustomerInfoSection ci={ci} />
      </div>

      <button
        onClick={() => onProceed({
          ...acc.payload, service: 'broadcast', plan, duration, startDate, endDate,
          addons: { additionalMessages: addlMsg, additionalMsgQty: addlMsgQty ? parseInt(addlMsgQty) : 0, premiumId, oaChat },
          customerInfo: ci.customerPayload,
        })}
        disabled={!canSubmit}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#00BB03] hover:bg-[#009a02] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs transition-colors shadow-md shadow-green-100"
      >
        <CheckCircle2 size={16} /> ยืนยัน
      </button>
    </div>
  )
}

// ===========================================================================
// FORM 2 — PREMIUM ID
// ===========================================================================
function PremiumIdForm({ onProceed, isLocked, entryMode, prefilledBasicId, prefillCustomerInfo, wasExistingUser, onUnlockFullMode, onTransferMode }) {
  const acc = useAccountForm(isLocked, entryMode, prefilledBasicId);
  const ci  = useCustomerInfo(prefillCustomerInfo);
  const [premiumId, setPremiumId] = useState("");

  const canSubmit = acc.isValid && premiumId.trim() !== "" && ci.isCustomerValid;
  const cleanId   = premiumId.startsWith("@") ? premiumId : premiumId ? `@${premiumId}` : "";

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Service header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-yellow-50 flex items-center justify-center shrink-0">
          <Crown className="w-6 h-6 text-yellow-500" />
        </div>
        <div>
          <h2 className="font-bold text-slate-800 text-xs leading-tight">PREMIUM ID</h2>
          <p className="text-xs text-slate-400">เลือก Premium ID สำหรับ LINE OA ของคุณ</p>
        </div>
      </div>

      {/* Account */}
      <AccountSection acc={acc} isLocked={isLocked} entryMode={entryMode} prefilledBasicId={prefilledBasicId} wasExistingUser={wasExistingUser} onUnlockFullMode={onUnlockFullMode} onTransferMode={onTransferMode} />

      {/* Premium ID input */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 space-y-4">
        <div>
          <label htmlFor="premium-id-input" className="block text-xs font-semibold text-slate-700 mb-1">
            Premium ID ที่ต้องการ <span className="text-red-400">*</span>
          </label>
          <p className="text-xs text-slate-400 mb-3">ระบบจะตรวจสอบความพร้อมใช้งานหลังจากส่งคำขอ</p>
          <div className="flex items-center gap-0">
            <span className="inline-flex items-center px-4 py-3 rounded-l-xl bg-slate-200 border border-r-0 border-slate-300 text-slate-500 font-bold text-xs select-none">
              @
            </span>
            <input
              id="premium-id-input" type="text"
              value={premiumId.startsWith("@") ? premiumId.slice(1) : premiumId}
              onChange={e => setPremiumId(e.target.value)}
              placeholder="mybrand"
              className="flex-1 rounded-r-xl border border-slate-300 bg-white px-4 py-3 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition"
            />
          </div>
        </div>

        {/* Preview */}
        {cleanId && (
          <div className="flex items-center gap-3 bg-white rounded-xl border border-yellow-200 px-4 py-3">
            <Crown size={16} className="text-yellow-500 shrink-0" />
            <div>
              <p className="text-xs text-slate-400">ตัวอย่าง ID ที่ต้องการ</p>
              <p className="font-bold text-slate-800 text-xs">{cleanId}</p>
            </div>
          </div>
        )}

        <p className="text-xs text-slate-400 leading-relaxed">
          ราคา <strong className="text-slate-600">฿3,000/ปี</strong> — ทีมงานจะยืนยันความพร้อมใช้งานของ ID ภายใน 1–2 วันทำการ
        </p>
      </div>

      {/* Customer info */}
      <CustomerInfoSection ci={ci} />

      <button onClick={() => onProceed({ ...acc.payload, service: "premium", premiumId: cleanId, customerInfo: ci.customerPayload })}
        disabled={!canSubmit}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-yellow-500 hover:bg-yellow-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs transition-colors shadow-md shadow-yellow-100">
        <CheckCircle2 size={16} /> ยืนยันคำสั่งซื้อ
      </button>
    </div>
  );
}

// ===========================================================================
// FORM 3 — OA CHAT PACKAGE
// ===========================================================================
const CHAT_PERIODS = [
  { months: 3, price: 990,  perMonth: 330,  savings: null },
  { months: 6, price: 1800, perMonth: 300,  savings: "ประหยัด 9%" },
  { months: 9, price: 2500, perMonth: 278,  savings: "ประหยัด 16%" },
];

function OAChatForm({ onProceed, isLocked, entryMode, prefilledBasicId, prefillCustomerInfo, wasExistingUser, onUnlockFullMode, onTransferMode }) {
  const acc = useAccountForm(isLocked, entryMode, prefilledBasicId);
  const ci  = useCustomerInfo(prefillCustomerInfo);
  const [period, setPeriod] = useState(null); // 3 | 6 | 9

  const canSubmit  = acc.isValid && period !== null && ci.isCustomerValid;
  const selected   = CHAT_PERIODS.find(p => p.months === period);

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Service header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
          <MessageSquare className="w-6 h-6 text-green-500" />
        </div>
        <div>
          <h2 className="font-bold text-slate-800 text-xs leading-tight">OA CHAT PACKAGE</h2>
          <p className="text-xs text-slate-400">เลือกระยะเวลาที่เหมาะกับแผนของคุณ</p>
        </div>
      </div>

      {/* Account */}
      <AccountSection acc={acc} isLocked={isLocked} entryMode={entryMode} prefilledBasicId={prefilledBasicId} wasExistingUser={wasExistingUser} onUnlockFullMode={onUnlockFullMode} onTransferMode={onTransferMode} />

      {/* Period selection */}
      <div>
        <p className="text-xs font-semibold text-slate-700 mb-3">
          ระยะเวลา <span className="text-red-400">*</span>
        </p>
        <div className="grid grid-cols-3 gap-3">
          {CHAT_PERIODS.map(({ months, price, perMonth, savings }) => {
            const checked = period === months;
            return (
              <label key={months} htmlFor={`period-${months}`}
                className={`relative cursor-pointer rounded-2xl border-2 p-4 transition-all select-none block text-center ${
                  checked ? "border-green-500 bg-green-50 shadow-md" : "border-slate-200 bg-white hover:border-slate-300"
                }`}>
                <input id={`period-${months}`} type="radio" checked={checked} onChange={() => setPeriod(months)} className="sr-only" />
                {savings && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs font-bold px-2 py-0.5 rounded-full bg-green-500 text-white whitespace-nowrap">
                    {savings}
                  </span>
                )}
                <p className={`font-bold text-[18px] mb-0.5 ${checked ? "text-green-700" : "text-slate-800"}`}>
                  {months} <span className="text-xs font-normal">เดือน</span>
                </p>
                <p className={`font-extrabold text-xs ${checked ? "text-green-700" : "text-slate-700"}`}>
                  ฿{price.toLocaleString()}
                </p>
                <p className="text-xs text-slate-400 mt-1">฿{perMonth}/เดือน</p>
              </label>
            );
          })}
        </div>
      </div>

      {/* Selected summary */}
      {selected && (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-5 py-3">
          <span className="text-xs text-slate-600">ยอดรวม ({selected.months} เดือน)</span>
          <span className="font-extrabold text-green-700 text-xs">฿{selected.price.toLocaleString()}</span>
        </div>
      )}

      {/* Customer info */}
      <CustomerInfoSection ci={ci} />

      <button onClick={() => onProceed({ ...acc.payload, service: "chat", period, price: selected?.price, customerInfo: ci.customerPayload })}
        disabled={!canSubmit}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#00BB03] hover:bg-[#009a02] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs transition-colors shadow-md shadow-green-100">
        <CheckCircle2 size={16} /> ยืนยันคำสั่งซื้อ
      </button>
    </div>
  );
}

// ===========================================================================
// FORM 4 — MESSAGING API
// ===========================================================================
function MessagingApiForm({ onProceed, isLocked, entryMode, prefilledBasicId, prefillCustomerInfo, wasExistingUser, onUnlockFullMode, onTransferMode }) {
  const acc = useAccountForm(isLocked, entryMode, prefilledBasicId);
  const ci  = useCustomerInfo(prefillCustomerInfo);
  const [plan, setPlan] = useState(""); // "starter" | "business"

  const canSubmit = acc.isValid && plan !== "" && ci.isCustomerValid;

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Service header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
          <Zap className="w-6 h-6 text-purple-500" />
        </div>
        <div>
          <h2 className="font-bold text-slate-800 text-xs leading-tight">ADDITIONAL MESSAGE</h2>
          <p className="text-xs text-slate-400">ข้อความเพิ่มเติมสำหรับ LINE Official Account ของคุณ</p>
        </div>
      </div>

      {/* Account */}
      <AccountSection acc={acc} isLocked={isLocked} entryMode={entryMode} prefilledBasicId={prefilledBasicId} wasExistingUser={wasExistingUser} onUnlockFullMode={onUnlockFullMode} onTransferMode={onTransferMode} />

      {/* Plan selection */}
      <div>
        <p className="text-xs font-semibold text-slate-700 mb-3">
          เลือกแพ็กเกจ <span className="text-red-400">*</span>
        </p>
        <div className="grid grid-cols-2 gap-4">
          <PlanCard
            id="api-starter" checked={plan === "starter"} onChange={() => setPlan("starter")}
            name="Starter" price="฿2,500" unit="/เดือน" accent="purple"
            features={["50,000 API calls/เดือน", "Webhook support", "Basic dashboard", "Email support"]}
          />
          <PlanCard
            id="api-business" checked={plan === "business"} onChange={() => setPlan("business")}
            name="Business" price="฿5,000" unit="/เดือน" accent="purple" badge="แนะนำ"
            features={["Unlimited API calls", "Webhook + Polling", "Advanced analytics", "Priority support 24/7"]}
          />
        </div>
      </div>

      {/* Customer info */}
      <CustomerInfoSection ci={ci} />

      <button onClick={() => onProceed({ ...acc.payload, service: "api", plan, customerInfo: ci.customerPayload })}
        disabled={!canSubmit}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs transition-colors shadow-md shadow-purple-100">
        <CheckCircle2 size={16} /> ยืนยันคำสั่งซื้อ
      </button>
    </div>
  );
}

// ===========================================================================
// Router (default export)
// ===========================================================================
export default function PurchaseValidationHeader({ service, isLocked, entryMode, prefilledBasicId, prefillCustomerInfo, wasExistingUser, onProceed, onUnlockFullMode, onTransferMode }) {
  const shared = { onProceed, isLocked, entryMode, prefilledBasicId, prefillCustomerInfo, wasExistingUser, onUnlockFullMode, onTransferMode };
  switch (service?.id) {
    case "broadcast": return <BroadcastForm    {...shared} />;
    case "premium":   return <PremiumIdForm    {...shared} />;
    case "chat":      return <OAChatForm       {...shared} />;
    case "api":       return <MessagingApiForm  {...shared} />;
    default:          return <BroadcastForm    {...shared} />;
  }
}
