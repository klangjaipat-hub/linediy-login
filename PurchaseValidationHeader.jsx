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
} from "lucide-react";

// ---------------------------------------------------------------------------
// Mock API — returns "ACTIVE" | "TRANSFER" | "NOT_FOUND" | "BANNED"
// ---------------------------------------------------------------------------
const mockValidateBasicId = (id) =>
  new Promise((resolve) => {
    setTimeout(() => {
      const roll = Math.random();
      if (roll < 0.40) resolve("ACTIVE");
      else if (roll < 0.65) resolve("TRANSFER");
      else if (roll < 0.82) resolve("NOT_FOUND");
      else resolve("BANNED");
    }, 1400);
  });

const TRANSFER_OPTIONS = [
  {
    value: "line_thailand",
    label: "LINE Thailand",
    sublabel: "ชำระผ่าน LINE Thailand โดยตรง",
  },
  {
    value: "other_agency",
    label: "Other Agency",
    sublabel: "ชำระผ่านตัวแทนขายรายอื่น",
  },
];

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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Card */}
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

        <h2
          id="banned-title"
          className="text-xl font-bold text-center text-slate-800 mb-2"
        >
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
        <span className="block font-semibold text-slate-800 text-sm leading-snug">
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
        visible ? "opacity-100 max-h-[600px]" : "opacity-0 max-h-0"
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
  const [basicId, setBasicId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [status, setStatus] = useState(null); // null | "loading" | "ACTIVE" | "TRANSFER" | "NOT_FOUND" | "BANNED"
  const [transferChannel, setTransferChannel] = useState("");
  const [showBannedModal, setShowBannedModal] = useState(false);

  // Reset validation when the ID input changes
  useEffect(() => {
    if (status && status !== "loading") {
      setStatus(null);
      setTransferChannel("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basicId]);

  const handleAccountTypeChange = (val) => {
    setAccountType(val);
    setBasicId("");
    setDisplayName("");
    setStatus(null);
    setTransferChannel("");
  };

  const handleVerify = async () => {
    if (!basicId.trim()) return;
    setStatus("loading");
    setTransferChannel("");
    const result = await mockValidateBasicId(basicId.trim());
    setStatus(result);
    if (result === "BANNED") setShowBannedModal(true);
  };

  const handleProceed = () => {
    const payload =
      accountType === "new"
        ? { type: "new", displayName }
        : { type: "existing", basicId, transferChannel: transferChannel || "none" };
    onProceed?.(payload);
  };

  const isBanned = status === "BANNED";
  const isActive = status === "ACTIVE";
  const isTransfer = status === "TRANSFER";
  const canProceedNew = accountType === "new" && displayName.trim() !== "";
  const canProceedTransfer = isTransfer && transferChannel !== "";

  return (
    <>
      {showBannedModal && (
        <BannedUserModal onClose={() => setShowBannedModal(false)} />
      )}

      <section
        aria-label="Account Verification"
        className={`max-w-5xl mx-auto bg-slate-50 rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 transition-opacity duration-200 ${
          isBanned ? "opacity-60 pointer-events-none select-none" : ""
        }`}
      >
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
          <div className="space-y-5">
            {/* Input + Verify row */}
            <div>
              <label
                htmlFor="basic-id"
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2"
              >
                Basic ID
                <Tooltip text="ค้นหา Basic ID ของคุณใน LINE app → โปรไฟล์ → Basic ID โดยจะขึ้นต้นด้วย @">
                  <Info size={14} />
                </Tooltip>
                <span className="text-red-400">*</span>
              </label>

              <div className="flex gap-3 max-w-2xl">
                <input
                  id="basic-id"
                  type="text"
                  value={basicId}
                  onChange={(e) => setBasicId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                  placeholder="@your-id"
                  aria-describedby="basic-id-status"
                  className={`flex-1 rounded-xl border px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 transition bg-white ${
                    status === "NOT_FOUND"
                      ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                      : isActive || isTransfer
                      ? "border-green-500 focus:border-green-500 focus:ring-green-100"
                      : "border-slate-300 focus:border-green-500 focus:ring-green-200"
                  }`}
                />
                <button
                  onClick={handleVerify}
                  disabled={status === "loading" || !basicId.trim()}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 active:bg-green-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-sm transition-colors whitespace-nowrap"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      ตรวจสอบ…
                    </>
                  ) : (
                    "ตรวจสอบ"
                  )}
                </button>
              </div>

              {/* NOT_FOUND error */}
              <div id="basic-id-status" className="mt-2 min-h-[20px]">
                {status === "NOT_FOUND" && (
                  <p className="flex items-center gap-1.5 text-sm text-red-500">
                    <AlertCircle size={14} className="shrink-0" />
                    ไม่พบ Basic ID นี้ในระบบ —{" "}
                    <a
                      href="https://line.me/ti/p/~@sellsuki"
                      target="_blank"
                      rel="noreferrer"
                      className="underline font-medium hover:text-red-700"
                    >
                      ติดต่อแอดมิน
                    </a>
                  </p>
                )}
              </div>
            </div>

            {/* ACTIVE: Seamless Open Purchase banner */}
            <Reveal show={isActive}>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={22} className="text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-green-800">
                      พบข้อมูลบัญชี {basicId} ในระบบเรียบร้อยแล้ว
                    </p>
                    <p className="text-xs text-green-700 mt-0.5 leading-relaxed">
                      คุณสามารถเลือกซื้อแพ็กเกจด้านล่างได้ทันที — ไม่ต้องโอนย้ายบัญชี
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleProceed}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold text-sm transition-colors shadow-sm shadow-green-200 whitespace-nowrap shrink-0"
                >
                  <ArrowRight size={16} />
                  ดำเนินการต่อ
                </button>
              </div>
            </Reveal>

            {/* TRANSFER: Previous payment channel */}
            <Reveal show={isTransfer}>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 md:p-6">
                <fieldset>
                  <legend className="text-sm font-bold text-slate-800 mb-0.5">
                    ช่องทางชำระเงินครั้งก่อน{" "}
                    <span className="text-red-400">*</span>
                  </legend>
                  <p className="text-xs text-slate-500 mb-4">
                    Previous Payment Channel — กรุณาเลือกช่องทางที่ใช้ชำระเงินในการสั่งซื้อครั้งก่อน
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mb-5">
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
                    disabled={!canProceedTransfer}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 active:bg-green-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-sm transition-colors shadow-sm shadow-green-100"
                  >
                    <CheckCircle2 size={16} />
                    ดำเนินการต่อ →
                  </button>
                </fieldset>
              </div>
            </Reveal>
          </div>
        </Reveal>

        {/* ── Phase 2b: New account flow ── */}
        <Reveal show={accountType === "new"}>
          <div className="space-y-4">
            <div className="max-w-2xl">
              <label
                htmlFor="display-name"
                className="block text-sm font-semibold text-slate-700 mb-2"
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
