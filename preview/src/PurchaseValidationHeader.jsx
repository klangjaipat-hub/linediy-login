import { useState, useEffect, useRef } from "react";
import {
  Info,
  AlertCircle,
  CheckCircle,
  Loader2,
  X,
  ShieldAlert,
  MessageCircle,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Mock API
// ---------------------------------------------------------------------------
const mockValidateBasicId = (id) =>
  new Promise((resolve) => {
    setTimeout(() => {
      const roll = Math.random();
      if (roll < 0.5) resolve("SUCCESS");
      else if (roll < 0.75) resolve("NOT_FOUND");
      else resolve("BANNED");
    }, 1400);
  });

// ---------------------------------------------------------------------------
// BannedUserModal
// ---------------------------------------------------------------------------
function BannedUserModal({ onClose }) {
  // trap focus inside modal
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
      aria-labelledby="banned-modal-title"
    >
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* card */}
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* icon */}
        <div className="flex justify-center mb-5">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
            <ShieldAlert size={32} className="text-red-500" />
          </span>
        </div>

        <h2
          id="banned-modal-title"
          className="text-xl font-bold text-center text-slate-800 mb-2"
        >
          Account Suspended
        </h2>
        <p className="text-sm text-center text-slate-500 mb-1">
          This Basic ID has been suspended and <strong>cannot make purchases</strong> at this time.
        </p>
        <p className="text-sm text-center text-slate-400 mb-7">
          Please contact our admin team to resolve the issue before proceeding.
        </p>

        <a
          href="https://line.me/ti/p/~@sellsuki"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold text-base transition-colors shadow-md shadow-green-200"
        >
          <MessageCircle size={20} />
          Contact Admin via LINE
        </a>

        <button
          onClick={onClose}
          className="mt-3 w-full py-2.5 rounded-xl border border-slate-200 text-slate-500 text-sm hover:bg-slate-50 transition-colors"
        >
          Close
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
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-lg bg-slate-800 text-white text-xs p-2.5 leading-relaxed shadow-lg z-20 pointer-events-none">
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
        <span className="block font-medium text-slate-800 text-sm leading-snug">
          {label}
        </span>
        {sublabel && (
          <span className="block text-xs text-slate-500 mt-0.5">{sublabel}</span>
        )}
      </span>
    </label>
  );
}

// ---------------------------------------------------------------------------
// Animated section wrapper
// ---------------------------------------------------------------------------
function Reveal({ show, children }) {
  const [render, setRender] = useState(show);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setRender(true);
      // next frame → trigger transition
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
        visible ? "opacity-100 max-h-[500px]" : "opacity-0 max-h-0"
      }`}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Validation status badge
// ---------------------------------------------------------------------------
function StatusBadge({ status }) {
  if (status === "SUCCESS")
    return (
      <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium">
        <CheckCircle size={14} /> Verified
      </span>
    );
  if (status === "NOT_FOUND")
    return (
      <span className="inline-flex items-center gap-1 text-red-500 text-xs">
        <AlertCircle size={14} />
        Basic ID not found in our system.{" "}
        <a
          href="https://line.me/ti/p/~@sellsuki"
          target="_blank"
          rel="noreferrer"
          className="underline font-medium hover:text-red-700"
        >
          Contact Admin for help
        </a>
      </span>
    );
  return null;
}

// ---------------------------------------------------------------------------
// Transfer channel options
// ---------------------------------------------------------------------------
const TRANSFER_OPTIONS = [
  { value: "line_thailand", label: "Transfer from LINE Thailand", sublabel: "ย้ายจาก LINE Thailand โดยตรง" },
  { value: "other_agency", label: "Transfer from Other Agency", sublabel: "ย้ายจากตัวแทนขายรายอื่น" },
  { value: "return_sellsuki", label: "Return Sellsuki Customer", sublabel: "ลูกค้าเก่า Sellsuki ที่กลับมา" },
];

// ---------------------------------------------------------------------------
// PurchaseValidationHeader
// ---------------------------------------------------------------------------
export default function PurchaseValidationHeader({ onProceed }) {
  const [accountType, setAccountType] = useState("existing"); // "existing" | "new"
  const [basicId, setBasicId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [validationStatus, setValidationStatus] = useState(null); // null | "loading" | "SUCCESS" | "NOT_FOUND" | "BANNED"
  const [transferChannel, setTransferChannel] = useState("");
  const [showBannedModal, setShowBannedModal] = useState(false);

  const isVerified = validationStatus === "SUCCESS";
  const isBanned = validationStatus === "BANNED";
  const canProceedExisting = isVerified && transferChannel !== "";
  const canProceedNew = accountType === "new" && displayName.trim() !== "";

  // reset validation when id changes
  useEffect(() => {
    if (validationStatus && validationStatus !== "loading") {
      setValidationStatus(null);
      setTransferChannel("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basicId]);

  const handleAccountTypeChange = (val) => {
    setAccountType(val);
    setBasicId("");
    setDisplayName("");
    setValidationStatus(null);
    setTransferChannel("");
  };

  const handleVerify = async () => {
    if (!basicId.trim()) return;
    setValidationStatus("loading");
    setTransferChannel("");
    const result = await mockValidateBasicId(basicId.trim());
    setValidationStatus(result);
    if (result === "BANNED") setShowBannedModal(true);
  };

  const handleProceed = () => {
    const payload =
      accountType === "new"
        ? { type: "new", displayName }
        : { type: "existing", basicId, transferChannel };
    onProceed?.(payload);
  };

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Modal                                                               */}
      {/* ------------------------------------------------------------------ */}
      {showBannedModal && <BannedUserModal onClose={() => setShowBannedModal(false)} />}

      {/* ------------------------------------------------------------------ */}
      {/* Header card                                                         */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-label="Account Verification"
        className={`w-full rounded-2xl border border-slate-200 bg-gradient-to-br from-green-50 to-slate-50 shadow-sm p-5 md:p-8 transition-opacity duration-200 ${
          isBanned ? "opacity-60 pointer-events-none select-none" : ""
        }`}
      >
        {/* heading */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-green-600 mb-1">
            Step 1 of 2
          </p>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 leading-snug">
            Please verify your account to proceed
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            กรุณายืนยันบัญชีก่อนดำเนินการสั่งซื้อ
          </p>
        </div>

        {/* ── Phase 1 ── Account type radio group ────────────────────────── */}
        <fieldset className="mb-5">
          <legend className="text-sm font-semibold text-slate-700 mb-2.5">
            Account type <span className="text-red-400">*</span>
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <RadioCard
              id="radio-existing"
              name="accountType"
              value="existing"
              checked={accountType === "existing"}
              onChange={() => handleAccountTypeChange("existing")}
              label="Use Existing Basic ID"
              sublabel="ระบุ Basic ID เดิม"
            />
            <RadioCard
              id="radio-new"
              name="accountType"
              value="new"
              checked={accountType === "new"}
              onChange={() => handleAccountTypeChange("new")}
              label="Open New Account"
              sublabel="เปิดบัญชีใหม่"
            />
          </div>
        </fieldset>

        {/* ── Phase 2 – New account: display name ────────────────────────── */}
        <Reveal show={accountType === "new"}>
          <div className="mb-5 space-y-4 pt-1">
            <div>
              <label
                htmlFor="display-name"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Display Name (ชื่อแสดงผล){" "}
                <span className="text-red-400">*</span>
              </label>
              <input
                id="display-name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Jayna's Boutique"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition"
              />
              <p className="mt-1.5 text-xs text-slate-400">
                This will be visible to your customers on LINE OA.
              </p>
            </div>

            <button
              onClick={handleProceed}
              disabled={!canProceedNew}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 active:bg-green-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-sm transition-colors shadow-md shadow-green-100"
            >
              Proceed to Order →
            </button>
            <p className="text-xs text-slate-400 mt-1">
              Our admin will create your Basic ID after the purchase is complete.
            </p>
          </div>
        </Reveal>

        {/* ── Phase 2 – Existing account: Basic ID input + verify ─────────── */}
        <Reveal show={accountType === "existing"}>
          <div className="mb-5 pt-1">
            <label
              htmlFor="basic-id"
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1.5"
            >
              Basic ID
              <Tooltip text="Find your Basic ID in LINE app → Profile → Basic ID. It starts with @.">
                <Info size={14} />
              </Tooltip>
              <span className="text-red-400">*</span>
            </label>

            <div className="flex gap-2">
              <input
                id="basic-id"
                type="text"
                value={basicId}
                onChange={(e) => setBasicId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                placeholder="@your-id"
                className={`flex-1 rounded-xl border px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 transition ${
                  validationStatus === "NOT_FOUND"
                    ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                    : validationStatus === "SUCCESS"
                    ? "border-green-500 focus:border-green-500 focus:ring-green-100"
                    : "border-slate-300 focus:border-green-500 focus:ring-green-200"
                } bg-white`}
                aria-describedby="basic-id-status"
              />
              <button
                onClick={handleVerify}
                disabled={validationStatus === "loading" || !basicId.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 active:bg-green-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-sm transition-colors whitespace-nowrap"
              >
                {validationStatus === "loading" ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Verifying…
                  </>
                ) : (
                  "Verify"
                )}
              </button>
            </div>

            {/* status message */}
            <div id="basic-id-status" className="mt-2 min-h-[18px]">
              <StatusBadge status={validationStatus} />
            </div>
          </div>

          {/* ── Phase 3 – Transfer channel (only after SUCCESS) ──────────── */}
          <Reveal show={isVerified}>
            <fieldset className="mt-1 mb-5 rounded-xl border border-green-200 bg-white p-4">
              <legend className="px-1 text-sm font-semibold text-slate-700">
                Previous Payment Channel{" "}
                <span className="text-red-400">*</span>
              </legend>
              <p className="text-xs text-slate-400 mb-3 mt-0.5">
                ช่องทางที่ใช้ชำระเงินในการสั่งซื้อครั้งก่อน
              </p>
              <div className="space-y-2.5">
                {TRANSFER_OPTIONS.map((opt) => (
                  <RadioCard
                    key={opt.value}
                    id={`transfer-${opt.value}`}
                    name="transferChannel"
                    value={opt.value}
                    checked={transferChannel === opt.value}
                    onChange={() => setTransferChannel(opt.value)}
                    label={opt.label}
                    sublabel={opt.sublabel}
                  />
                ))}
              </div>

              <button
                onClick={handleProceed}
                disabled={!canProceedExisting}
                className="mt-5 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 active:bg-green-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-sm transition-colors shadow-md shadow-green-100"
              >
                <CheckCircle size={16} />
                Proceed to Order →
              </button>
            </fieldset>
          </Reveal>
        </Reveal>
      </section>
    </>
  );
}
