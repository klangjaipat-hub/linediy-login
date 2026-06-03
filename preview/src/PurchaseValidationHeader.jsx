import { useState, useEffect } from "react";
import {
  Info, Radio, Crown, MessageSquare, Zap,
  CheckCircle2, Building2, ChevronRight, Loader2, AlertCircle,
} from "lucide-react";

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
        <span className="block font-semibold text-slate-800 text-sm leading-snug">{label}</span>
        {sublabel && <span className="block text-xs text-slate-500 mt-0.5">{sublabel}</span>}
      </span>
    </label>
  );
}

// ---------------------------------------------------------------------------
// Reveal
// ---------------------------------------------------------------------------
function Reveal({ show, children }) {
  const [render, setRender] = useState(show);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (show) { setRender(true); requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true))); }
    else { setVisible(false); const t = setTimeout(() => setRender(false), 300); return () => clearTimeout(t); }
  }, [show]);
  if (!render) return null;
  return (
    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${visible ? "opacity-100 max-h-[600px]" : "opacity-0 max-h-0"}`}>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// useAccountForm — shared account state hook
// ---------------------------------------------------------------------------
function useAccountForm(isLocked) {
  const [accountType,    setAccountType]    = useState(isLocked ? "new" : "existing");
  const [displayName,    setDisplayName]    = useState("");
  const [basicId,        setBasicId]        = useState("");
  const [idVerifyState,  setIdVerifyState]  = useState(null); // null | 'loading' | 'success' | 'error'
  const [paymentChannel, setPaymentChannel] = useState("");
  const [agencyName,     setAgencyName]     = useState("");

  const handleTypeChange = (val) => {
    setAccountType(val); setDisplayName(""); setBasicId("");
    setIdVerifyState(null); setPaymentChannel(""); setAgencyName("");
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
    if (/^@[a-zA-Z0-9_.-]{1,}/.test(basicId.trim())) {
      setIdVerifyState("success");
    } else {
      setIdVerifyState("error");
    }
  };

  const handleChannelChange = (val) => {
    setPaymentChannel(val);
    if (val !== "other_agency") setAgencyName("");
  };

  const isValid = !isLocked || (
    displayName.trim() !== "" && (
      accountType === "new" ||
      (idVerifyState === "success" && paymentChannel !== "" &&
        (paymentChannel !== "other_agency" || agencyName.trim() !== ""))
    )
  );

  const payload =
    accountType === "new"
      ? { type: "new", displayName }
      : { type: "existing", displayName, basicId, paymentChannel, agencyName: paymentChannel === "other_agency" ? agencyName : "" };

  return {
    accountType, handleTypeChange,
    displayName, setDisplayName,
    basicId, handleBasicIdChange,
    idVerifyState, handleVerifyId,
    paymentChannel, handleChannelChange,
    agencyName, setAgencyName,
    isValid, payload,
  };
}

// ---------------------------------------------------------------------------
// AccountSection — shared account fields used across all forms
// ---------------------------------------------------------------------------
function AccountSection({ acc, isLocked }) {
  if (!isLocked) return null;
  const {
    accountType, handleTypeChange,
    displayName, setDisplayName,
    basicId, handleBasicIdChange,
    idVerifyState, handleVerifyId,
    paymentChannel, handleChannelChange,
    agencyName, setAgencyName,
  } = acc;

  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">ข้อมูลบัญชี</p>

      {/* Account type */}
      {isLocked && (
        <fieldset>
          <legend className="text-sm font-semibold text-slate-700 mb-3">
            ประเภทบัญชี <span className="text-red-400">*</span>
          </legend>
          <div className="grid grid-cols-2 gap-3">
            <RadioCard id="acc-new"      name="accountType" value="new"      checked={accountType === "new"}      onChange={() => handleTypeChange("new")}      label="เปิดบัญชีใหม่"     sublabel="Open New Account"       />
            <RadioCard id="acc-existing" name="accountType" value="existing" checked={accountType === "existing"} onChange={() => handleTypeChange("existing")} label="ระบุ Basic ID เดิม" sublabel="Use Existing Basic ID" />
          </div>
        </fieldset>
      )}

      {/* Display Name */}
      <div>
        <label htmlFor="acc-display-name" className="block text-sm font-semibold text-slate-700 mb-2">
          ชื่อแสดงผล (Display Name) <span className="text-red-400">*</span>
        </label>
        <input id="acc-display-name" type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
          placeholder="เช่น My Brand Store"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition" />
      </div>

      {/* Existing-only fields */}
      <Reveal show={accountType === "existing"}>
        <div className="space-y-4 pt-1">

          {/* Basic ID + Verify button */}
          <div>
            <label htmlFor="acc-basic-id" className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
              Basic ID
              <Tooltip text="Basic ID คือรหัส @username ของ LINE OA เช่น @myshop — ใช้สำหรับค้นหาและจดจำบัญชีของคุณ"><Info size={14} /></Tooltip>
              <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-2">
              <input
                id="acc-basic-id"
                type="text"
                value={basicId}
                onChange={e => handleBasicIdChange(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleVerifyId()}
                placeholder="@your-id"
                disabled={idVerifyState === "success"}
                className={`flex-1 rounded-xl border px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 transition bg-white ${
                  idVerifyState === "success"
                    ? "border-green-500 bg-green-50 focus:ring-green-100"
                    : idVerifyState === "error"
                    ? "border-red-400 focus:ring-red-100"
                    : "border-slate-300 focus:border-green-500 focus:ring-green-200"
                }`}
              />
              <button
                type="button"
                onClick={handleVerifyId}
                disabled={idVerifyState === "loading" || idVerifyState === "success" || !basicId.trim()}
                className={`px-4 py-3 rounded-xl font-semibold text-sm transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  idVerifyState === "success"
                    ? "bg-green-100 text-green-700 cursor-default"
                    : "bg-[#06C755] hover:bg-[#05b34c] disabled:bg-slate-200 disabled:text-slate-400 text-white"
                }`}
              >
                {idVerifyState === "loading"
                  ? <><Loader2 size={14} className="animate-spin" /> กำลังตรวจสอบ</>
                  : idVerifyState === "success"
                  ? <><CheckCircle2 size={14} /> ตรวจสอบแล้ว</>
                  : "ตรวจสอบ"}
              </button>
            </div>

            {/* Success inline feedback */}
            {idVerifyState === "success" && (
              <div className="mt-2 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
                <CheckCircle2 size={15} className="text-green-600 shrink-0" />
                <p className="text-sm text-green-700 font-medium">✅ ตรวจพบข้อมูลบัญชี — กรุณาระบุช่องทางชำระเงินเดิม</p>
              </div>
            )}

            {/* Error inline feedback */}
            {idVerifyState === "error" && (
              <div className="mt-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 space-y-2.5">
                <div className="flex items-start gap-2">
                  <AlertCircle size={15} className="text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-red-700 font-semibold">ไม่พบ Basic ID นี้ในระบบ</p>
                    <p className="text-xs text-red-500 mt-0.5">กรุณาตรวจสอบ ID อีกครั้ง หรือติดต่อทีมงานเพื่อขอความช่วยเหลือ</p>
                  </div>
                </div>
                <a
                  href="https://lin.ee/sellsuki-support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors"
                >
                  <MessageSquare size={13} /> ติดต่อ Admin
                </a>
              </div>
            )}
          </div>

          {/* Payment channel — only revealed after successful verification */}
          <Reveal show={idVerifyState === "success"}>
            <fieldset>
              <legend className="text-sm font-semibold text-slate-700 mb-1">
                ช่องทางที่เคยชำระเงินมาก่อน <span className="text-red-400">*</span>
              </legend>
              <p className="text-xs text-slate-400 mb-3">Previous Payment Channel</p>
              <div className="grid grid-cols-2 gap-3">
                <RadioCard id="pay-line"   name="paymentChannel" value="line_thailand" checked={paymentChannel === "line_thailand"} onChange={() => handleChannelChange("line_thailand")} label="ชำระผ่าน LINE Thailand"   sublabel="โดยตรงกับ LINE Thailand"   />
                <RadioCard id="pay-agency" name="paymentChannel" value="other_agency"  checked={paymentChannel === "other_agency"}  onChange={() => handleChannelChange("other_agency")}  label="ชำระผ่าน Agency เจ้าอื่น" sublabel="ผ่านตัวแทนขายรายอื่น" />
              </div>
              <Reveal show={paymentChannel === "other_agency"}>
                <div className="mt-3">
                  <label htmlFor="acc-agency-name" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <Building2 size={14} className="text-slate-400" /> ชื่อ Agency <span className="text-red-400">*</span>
                  </label>
                  <input id="acc-agency-name" type="text" value={agencyName} onChange={e => setAgencyName(e.target.value)}
                    placeholder="กรอกชื่อ Agency ที่เคยชำระเงินผ่าน"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition" />
                </div>
              </Reveal>
            </fieldset>
          </Reveal>

        </div>
      </Reveal>
    </div>
  );
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
      <p className={`font-bold text-base mb-1 ${checked ? `text-${accent}-700` : "text-slate-800"}`}>{name}</p>
      <p className={`text-2xl font-extrabold mb-0.5 ${checked ? `text-${accent}-700` : "text-slate-800"}`}>
        {price}<span className="text-sm font-normal text-slate-400 ml-1">{unit}</span>
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
// FORM 1 — BROADCAST PACKAGE
// ===========================================================================
function BroadcastForm({ onProceed, isLocked }) {
  const acc = useAccountForm(isLocked);
  const [plan, setPlan] = useState(""); // "basic" | "pro"

  const canSubmit = acc.isValid && plan !== "";

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Service header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <Radio className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h2 className="font-bold text-slate-800 text-lg leading-tight">BROADCAST PACKAGE</h2>
          <p className="text-sm text-slate-400">เลือกแพ็กเกจที่เหมาะกับขนาดธุรกิจของคุณ</p>
        </div>
      </div>

      {/* Account */}
      <AccountSection acc={acc} isLocked={isLocked} />

      {/* Plan selection */}
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-3">
          เลือกแพ็กเกจ <span className="text-red-400">*</span>
        </p>
        <div className="grid grid-cols-2 gap-4">
          <PlanCard
            id="plan-basic" checked={plan === "basic"} onChange={() => setPlan("basic")}
            name="Basic" price="฿1,500" unit="/เดือน" accent="blue"
            features={["ส่งได้ 1,000 ข้อความ/เดือน", "รายงานสรุปรายเดือน", "รองรับ Rich Message"]}
          />
          <PlanCard
            id="plan-pro" checked={plan === "pro"} onChange={() => setPlan("pro")}
            name="Pro" price="฿3,000" unit="/เดือน" accent="blue" badge="แนะนำ"
            features={["ส่งข้อความไม่จำกัด", "รายงาน Advanced Analytics", "รองรับ Video Message", "Priority Support"]}
          />
        </div>
      </div>

      <button onClick={() => onProceed({ ...acc.payload, service: "broadcast", plan })}
        disabled={!canSubmit}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#06C755] hover:bg-[#05b34c] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm transition-colors shadow-md shadow-green-100">
        <CheckCircle2 size={16} /> ยืนยันคำสั่งซื้อ
      </button>
    </div>
  );
}

// ===========================================================================
// FORM 2 — PREMIUM ID
// ===========================================================================
function PremiumIdForm({ onProceed, isLocked }) {
  const acc = useAccountForm(isLocked);
  const [premiumId, setPremiumId] = useState("");

  const canSubmit = acc.isValid && premiumId.trim() !== "";
  const cleanId   = premiumId.startsWith("@") ? premiumId : premiumId ? `@${premiumId}` : "";

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Service header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-yellow-50 flex items-center justify-center shrink-0">
          <Crown className="w-6 h-6 text-yellow-500" />
        </div>
        <div>
          <h2 className="font-bold text-slate-800 text-lg leading-tight">PREMIUM ID</h2>
          <p className="text-sm text-slate-400">เลือก Premium ID สำหรับ LINE OA ของคุณ</p>
        </div>
      </div>

      {/* Account */}
      <AccountSection acc={acc} isLocked={isLocked} />

      {/* Premium ID input */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 space-y-4">
        <div>
          <label htmlFor="premium-id-input" className="block text-sm font-semibold text-slate-700 mb-1">
            Premium ID ที่ต้องการ <span className="text-red-400">*</span>
          </label>
          <p className="text-xs text-slate-400 mb-3">ระบบจะตรวจสอบความพร้อมใช้งานหลังจากส่งคำขอ</p>
          <div className="flex items-center gap-0">
            <span className="inline-flex items-center px-4 py-3 rounded-l-xl bg-slate-200 border border-r-0 border-slate-300 text-slate-500 font-bold text-sm select-none">
              @
            </span>
            <input
              id="premium-id-input" type="text"
              value={premiumId.startsWith("@") ? premiumId.slice(1) : premiumId}
              onChange={e => setPremiumId(e.target.value)}
              placeholder="mybrand"
              className="flex-1 rounded-r-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition"
            />
          </div>
        </div>

        {/* Preview */}
        {cleanId && (
          <div className="flex items-center gap-3 bg-white rounded-xl border border-yellow-200 px-4 py-3">
            <Crown size={16} className="text-yellow-500 shrink-0" />
            <div>
              <p className="text-xs text-slate-400">ตัวอย่าง ID ที่ต้องการ</p>
              <p className="font-bold text-slate-800 text-sm">{cleanId}</p>
            </div>
          </div>
        )}

        <p className="text-xs text-slate-400 leading-relaxed">
          ราคา <strong className="text-slate-600">฿3,000/ปี</strong> — ทีมงานจะยืนยันความพร้อมใช้งานของ ID ภายใน 1–2 วันทำการ
        </p>
      </div>

      <button onClick={() => onProceed({ ...acc.payload, service: "premium", premiumId: cleanId })}
        disabled={!canSubmit}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-yellow-500 hover:bg-yellow-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm transition-colors shadow-md shadow-yellow-100">
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

function OAChatForm({ onProceed, isLocked }) {
  const acc = useAccountForm(isLocked);
  const [period, setPeriod] = useState(null); // 3 | 6 | 9

  const canSubmit  = acc.isValid && period !== null;
  const selected   = CHAT_PERIODS.find(p => p.months === period);

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Service header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
          <MessageSquare className="w-6 h-6 text-green-500" />
        </div>
        <div>
          <h2 className="font-bold text-slate-800 text-lg leading-tight">OA CHAT PACKAGE</h2>
          <p className="text-sm text-slate-400">เลือกระยะเวลาที่เหมาะกับแผนของคุณ</p>
        </div>
      </div>

      {/* Account */}
      <AccountSection acc={acc} isLocked={isLocked} />

      {/* Period selection */}
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-3">
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
                <p className={`font-bold text-xl mb-0.5 ${checked ? "text-green-700" : "text-slate-800"}`}>
                  {months} <span className="text-sm font-normal">เดือน</span>
                </p>
                <p className={`font-extrabold text-lg ${checked ? "text-green-700" : "text-slate-700"}`}>
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
          <span className="text-sm text-slate-600">ยอดรวม ({selected.months} เดือน)</span>
          <span className="font-extrabold text-green-700 text-lg">฿{selected.price.toLocaleString()}</span>
        </div>
      )}

      <button onClick={() => onProceed({ ...acc.payload, service: "chat", period, price: selected?.price })}
        disabled={!canSubmit}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#06C755] hover:bg-[#05b34c] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm transition-colors shadow-md shadow-green-100">
        <CheckCircle2 size={16} /> ยืนยันคำสั่งซื้อ
      </button>
    </div>
  );
}

// ===========================================================================
// FORM 4 — MESSAGING API
// ===========================================================================
function MessagingApiForm({ onProceed, isLocked }) {
  const acc = useAccountForm(isLocked);
  const [plan, setPlan] = useState(""); // "starter" | "business"

  const canSubmit = acc.isValid && plan !== "";

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Service header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
          <Zap className="w-6 h-6 text-purple-500" />
        </div>
        <div>
          <h2 className="font-bold text-slate-800 text-lg leading-tight">MESSAGING API</h2>
          <p className="text-sm text-slate-400">เลือกแพ็กเกจ API สำหรับการเชื่อมต่อระบบของคุณ</p>
        </div>
      </div>

      {/* Account */}
      <AccountSection acc={acc} isLocked={isLocked} />

      {/* Plan selection */}
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-3">
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

      <button onClick={() => onProceed({ ...acc.payload, service: "api", plan })}
        disabled={!canSubmit}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm transition-colors shadow-md shadow-purple-100">
        <CheckCircle2 size={16} /> ยืนยันคำสั่งซื้อ
      </button>
    </div>
  );
}

// ===========================================================================
// Router (default export)
// ===========================================================================
export default function PurchaseValidationHeader({ service, isLocked, onProceed }) {
  switch (service?.id) {
    case "broadcast": return <BroadcastForm     onProceed={onProceed} isLocked={isLocked} />;
    case "premium":   return <PremiumIdForm      onProceed={onProceed} isLocked={isLocked} />;
    case "chat":      return <OAChatForm         onProceed={onProceed} isLocked={isLocked} />;
    case "api":       return <MessagingApiForm   onProceed={onProceed} isLocked={isLocked} />;
    default:          return <BroadcastForm      onProceed={onProceed} isLocked={isLocked} />;
  }
}
