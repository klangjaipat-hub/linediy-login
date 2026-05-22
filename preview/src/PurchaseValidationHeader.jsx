import { useState, useEffect, useRef } from "react";
import {
  Info,
  AlertCircle,
  CheckCircle2,
  Loader2,
  X,
  ShieldAlert,
  MessageCircle,
  ArrowRight,
  Building2,
} from "lucide-react";

// ---------------------------------------------------------------------------
// BannedUserModal
// ---------------------------------------------------------------------------
function BannedUserModal({ onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const el = modalRef.current;
    if (!el) return;
    const focusable = el.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable[0]?.focus();
    const trap = (e) => {
      if (e.key !== "Tab") return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      }
    };
    el.addEventListener("keydown", trap);
    return () => el.removeEventListener("keydown", trap);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="banned-title"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-200"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        <div className="flex justify-center mb-5">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
            <ShieldAlert size={32} className="text-red-500" />
          </span>
        </div>
        <h2 id="banned-title" className="text-xl font-bold text-center text-slate-800 mb-2">
          บัญชีนี้ถูกระงับการใช้งาน
        </h2>
        <p className="text-sm text-center text-slate-500 mb-1">
          Basic ID นี้<strong>ไม่สามารถทำรายการสั่งซื้อได้</strong>ในขณะนี้
        </p>
        <p className="text-sm text-center text-slate-400 mb-7">
          กรุณาติดต่อแอดมินเพื่อแก้ไขปัญหาก่อนดำเนินการต่อ
        </p>
        <a
          href="https://line.me/ti/p/~@sellsuki"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#06C755] hover:bg-green-600 active:bg-green-700 text-white font-semibold text-base transition-colors shadow-md shadow-green-200"
        >
          <MessageCircle size={20} />
          ติดต่อแอดมิน ผ่าน LINE
        </a>
        <button
          onClick={onClose}
          className="mt-3 w-full py-2.5 rounded-xl border border-slate-200 text-slate-500 text-sm hover:bg-slate-50 transition-colors"
        >
          ปิด
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tooltip
// ---------------------------------------------------------------------------
function Tooltip({ children, text }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="text-slate-400 hover:text-slate-600 transition-colors"
        aria-label="More info"
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
    <label
      htmlFor={id}
      className={`flex items-start gap-3 cursor-pointer rounded-xl border-2 px-4 py-3.5 transition-all select-none ${
        checked
          ? "border-green-500 bg-green-50 shadow-sm"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="mt-0.5 accent-green-500 w-4 h-4 shrink-0"
      />
      <span>
        <span className="block font-semibold text-slate-800 text-sm leading-snug">{label}</span>
        {sublabel && (
          <span className="block text-xs text-slate-500 mt-0.5">{sublabel}</span>
        )}
      </span>
    </label>
  );
}

// ---------------------------------------------------------------------------
// Animated Reveal wrapper
// ---------------------------------------------------------------------------
function Reveal({ show, children }) {
  const [render, setRender] = useState(show);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setRender(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      const t = setTimeout(() => setRender(false), 300);
      return () => clearTimeout(t);
    }
  }, [show]);

  if (!render) return null;
  return (
    <div
      className={`transition-all duration-300 ease-in-out overflow-hidden ${
        visible ? "opacity-100 max-h-[800px]" : "opacity-0 max-h-0"
      }`}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// PurchaseValidationHeader
// ---------------------------------------------------------------------------
export default function PurchaseValidationHeader({ onProceed }) {
  const [accountType, setAccountType] = useState("existing");

  // Existing flow fields
  const [displayName, setDisplayName]   = useState("");
  const [basicId, setBasicId]           = useState("");
  const [paymentChannel, setPaymentChannel] = useState(""); // "line_thailand" | "other_agency"
  const [agencyName, setAgencyName]     = useState("");

  // New account flow fields
  const [newDisplayName, setNewDisplayName] = useState("");

  const handleAccountTypeChange = (val) => {
    setAccountType(val);
    setDisplayName("");
    setBasicId("");
    setPaymentChannel("");
    setAgencyName("");
    setNewDisplayName("");
  };

  const handlePaymentChannelChange = (val) => {
    setPaymentChannel(val);
    if (val !== "other_agency") setAgencyName("");
  };

  const handleProceed = () => {
    const payload =
      accountType === "new"
        ? { type: "new", displayName: newDisplayName }
        : {
            type: "existing",
            displayName,
            basicId,
            paymentChannel,
            agencyName: paymentChannel === "other_agency" ? agencyName : "",
          };
    onProceed?.(payload);
  };

  // ── Validation ──
  const existingValid =
    displayName.trim() !== "" &&
    basicId.trim() !== "" &&
    paymentChannel !== "" &&
    (paymentChannel !== "other_agency" || agencyName.trim() !== "");

  const canProceedNew = newDisplayName.trim() !== "";

  return (
    <>
      <section aria-label="Account Verification" className="max-w-5xl mx-auto bg-slate-50 rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
        {/* ── Header ── */}
        <div className="mb-6 md:mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-green-600 mb-1">
            Step 1 of 2
          </p>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 leading-snug">
            กรุณาระบุบัญชีที่ต้องการสั่งซื้อบริการ
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Please specify the account for this purchase
          </p>
        </div>

        {/* ── Phase 1: Account type ── */}
        <fieldset className="mb-6">
          <legend className="text-sm font-semibold text-slate-700 mb-3">
            Account type <span className="text-red-400">*</span>
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
            <RadioCard
              id="radio-existing"
              name="accountType"
              value="existing"
              checked={accountType === "existing"}
              onChange={() => handleAccountTypeChange("existing")}
              label="ระบุ Basic ID เดิม"
              sublabel="Use Existing Basic ID"
            />
            <RadioCard
              id="radio-new"
              name="accountType"
              value="new"
              checked={accountType === "new"}
              onChange={() => handleAccountTypeChange("new")}
              label="เปิดบัญชีใหม่"
              sublabel="Open New Account"
            />
          </div>
        </fieldset>

        {/* ── Phase 2a: Existing Basic ID flow ── */}
        <Reveal show={accountType === "existing"}>
          <div className="space-y-5 max-w-2xl">

            {/* 1. Display Name */}
            <div>
              <label htmlFor="existing-display-name" className="block text-sm font-semibold text-slate-700 mb-2">
                ชื่อแสดงผล (Display Name) <span className="text-red-400">*</span>
              </label>
              <input
                id="existing-display-name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="เช่น Jayna's Boutique"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition"
              />
            </div>

            {/* 2. Basic ID */}
            <div>
              <label htmlFor="basic-id" className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                Basic ID
                <Tooltip text="ค้นหา Basic ID ของคุณใน LINE app → โปรไฟล์ → Basic ID โดยจะขึ้นต้นด้วย @">
                  <Info size={14} />
                </Tooltip>
                <span className="text-red-400">*</span>
              </label>
              <input
                id="basic-id"
                type="text"
                value={basicId}
                onChange={(e) => setBasicId(e.target.value)}
                placeholder="@your-id"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition"
              />
            </div>

            {/* 3. Payment channel */}
            <fieldset>
              <legend className="text-sm font-semibold text-slate-700 mb-1">
                ช่องทางที่เคยชำระเงินมาก่อน <span className="text-red-400">*</span>
              </legend>
              <p className="text-xs text-slate-400 mb-3">
                Previous Payment Channel
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <RadioCard
                  id="pay-line"
                  name="paymentChannel"
                  value="line_thailand"
                  checked={paymentChannel === "line_thailand"}
                  onChange={() => handlePaymentChannelChange("line_thailand")}
                  label="ชำระผ่าน LINE Thailand"
                  sublabel="ชำระโดยตรงกับ LINE Thailand"
                />
                <RadioCard
                  id="pay-agency"
                  name="paymentChannel"
                  value="other_agency"
                  checked={paymentChannel === "other_agency"}
                  onChange={() => handlePaymentChannelChange("other_agency")}
                  label="ชำระผ่าน Agency เจ้าอื่น"
                  sublabel="ชำระผ่านตัวแทนขายรายอื่น"
                />
              </div>

              {/* Agency name — revealed when "other_agency" selected */}
              <Reveal show={paymentChannel === "other_agency"}>
                <div className="mt-4">
                  <label htmlFor="agency-name" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <Building2 size={14} className="text-slate-400" />
                    ชื่อ Agency <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="agency-name"
                    type="text"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    placeholder="กรอกชื่อ Agency ที่เคยชำระเงินผ่าน"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition"
                  />
                </div>
              </Reveal>
            </fieldset>

            {/* Proceed button */}
            <div className="pt-1">
              <button
                onClick={handleProceed}
                disabled={!existingValid}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 active:bg-green-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-sm transition-colors shadow-md shadow-green-100"
              >
                <ArrowRight size={16} />
                ดำเนินการต่อ →
              </button>
            </div>
          </div>
        </Reveal>

        {/* ── Phase 2b: New account flow ── */}
        <Reveal show={accountType === "new"}>
          <div className="space-y-4 max-w-2xl">
            <div>
              <label htmlFor="new-display-name" className="block text-sm font-semibold text-slate-700 mb-2">
                Display Name (ชื่อแสดงผล) <span className="text-red-400">*</span>
              </label>
              <input
                id="new-display-name"
                type="text"
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
                placeholder="e.g. Jayna's Boutique"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition"
              />
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                แอดมินจะทำการสร้าง Basic ID ให้ท่านหลังจากทำรายการสั่งซื้อสำเร็จ
                <br />
                Our admin will create your Basic ID after the purchase is complete.
              </p>
            </div>
            <button
              onClick={handleProceed}
              disabled={!canProceedNew}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 active:bg-green-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-sm transition-colors shadow-md shadow-green-100"
            >
              <ArrowRight size={16} />
              ดำเนินการต่อ →
            </button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
