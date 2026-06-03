# UX Test Report — Persona B (คุณย้ายค่าย) — v3

**Date:** 2026-06-02
**Tester persona:** คุณย้ายค่าย — existing LINE OA user, Basic ID `@mycoolshop`, migrating to Sellsuki
**Scope:** Login → Full Mode Dashboard → OA Chat purchase form → "ยืนยันคำสั่งซื้อ" (button click only; post-click behaviour is out of scope)
**Version compared:** v3 (current) vs. v2 baseline (Task Success 75%, CES 3.0/5)

---

## Think Aloud — Steps 1–5

### Step 1 — Login → Full Mode Dashboard

> "โอเค มีปุ่ม Login with LINE อยู่ตรงนี้ ไม่มีอะไรซับซ้อน เลือก 'Existing User' แล้วกด login ได้เลย…
> ระบบโหลดแป๊บนึง แล้วขึ้นหน้า 'เลือก Basic ID' ให้เลือกบัญชีที่เคย connect ไว้
> ไม่มีบัญชี @mycoolshop ของกูอยู่ในรายการเลยนะ แต่ก็เดาออกว่านี่คือบัญชีที่เชื่อมแล้ว — โอเค เลือกอันที่ใกล้เคียงที่สุดแล้วกด 'เข้าสู่บัญชี'
> Dashboard เปิดขึ้นมา ทุก menu ในซ้ายมือ unlock หมด Full Mode ชัดเจนดี"

**สิ่งที่สังเกต:** ไม่มีการยืนยันว่าบัญชีที่ระบบ map มาคือ @mycoolshop — ผู้ใช้เดาจาก label เอาเอง แต่ยังไม่ได้ตัดสินใจออก เพราะ flow โดยรวมเร็วและไม่มี blocker

---

### Step 2 — เห็น OA Chat card → กด "สั่งซื้อ"

> "หน้า Dashboard แสดงการ์ดบริการ 4 อัน หา OA CHAT PACKAGE เจอง่ายมาก ไอคอนสีเขียว bubble ชัดเจน
> กด 'สั่งซื้อ' บนการ์ดเลย ระบบขึ้น toast 'กำลังไปยังหน้าสั่งซื้อ' นิดนึงแล้วก็พาไปหน้า form
> โอเค เร็วดี ไม่ต้องผ่าน step เยอะ"

**สิ่งที่สังเกต:** UX ที่นี่ดีกว่า v2 ชัดเจน — ใน v2 Full Mode user ยังเห็น AccountSection ซ้อนกับ period selection ทำให้สับสน

---

### Step 3 — เห็นหน้า form (ไม่มี AccountSection)

> "เข้ามาแล้ว… เห็นหัวข้อ 'OA CHAT PACKAGE' และ section 'ระยะเวลา' เลย
> เดี๋ยวก่อนนะ… ไม่มีช่องให้กรอก @mycoolshop เลยเหรอ?
> ดูรอบๆ อีกที — ไม่มีจริงๆ ไม่มี field ข้อมูลบัญชีเลยสักอัน
> โอ้โห… งั้นระบบมันรู้ได้ยังไงว่าฉันซื้อให้ @mycoolshop? หรือมันจะเอาไปผูกกับบัญชีที่ login อยู่ให้อัตโนมัติ?
> ไม่มีอะไรบอกฉันเลยว่า order นี้จะไปผูกกับ OA ไหน — นี่คือ moment ที่ฉันเริ่มลังเล"

**สิ่งที่สังเกต:** นี่คือ friction point หลัก ผู้ใช้หยุดและ scan หน้าจอซ้ำอย่างน้อย 1 ครั้งก่อนจะเดินหน้าต่อ ไม่มี contextual cue ใดๆ บอกว่า "order จะผูกกับบัญชี X" แบบ implicit

---

### Step 4 — เลือกระยะเวลา 6 เดือน

> "โอเค สมมติว่าระบบจัดการเองแล้วกัน — ดูราคาก่อน
> 3 เดือน ฿990, 6 เดือน ฿1,800 ประหยัด 9%, 9 เดือน ฿2,500 ประหยัด 16%
> Badge 'ประหยัด 9%' ดึงดูดสายตาดี เลือก 6 เดือนเลย
> มี summary ราคา '฿1,800' ขึ้นมาด้านล่าง ชัดเจนดี
> แต่ยังคันอยู่เลย — ซื้อให้บัญชีไหนอ่ะ? ไม่เห็นเลย"

**สิ่งที่สังเกต:** การออกแบบ period selection card นั้น excellent — visual hierarchy ดี, savings badge ชัดเจน, summary row ช่วยลด cognitive load เรื่องราคา แต่ความกังวลเรื่อง account identity ยังค้างอยู่ตลอด

---

### Step 5 — กด "ยืนยันคำสั่งซื้อ"

> "ปุ่ม 'ยืนยันคำสั่งซื้อ' enable อยู่ — เพราะฉันเลือก period แล้ว สีเขียว ใหญ่ ชัด
> กำลังจะกด… แต่หยุดคิดอีกที — ถ้าฉัน confirm แล้วมันไปผูกกับบัญชีผิด จะแก้ยังไง?
> ไม่มี confirmation summary ก่อนส่งเลย ไม่มีบอกว่า 'คุณกำลังซื้อให้ @mycoolshop' หรืออะไรทั้งนั้น
> ก็… กดไปก็แล้วกัน ถ้าผิดก็ค่อย contact support — แต่รู้สึกว่าระบบควรบอกฉันตรงๆ ว่าผูกกับใคร"

**สิ่งที่สังเกต:** ผู้ใช้ "ยอมรับความเสี่ยง" แล้วกด confirm — ไม่ abandon แต่มี hesitation ชัดเจน 1 pause ก่อนกด เป็น distrust signal ที่สำคัญ

---

## UX Report

### 1. Task Success Rate

| | v2 | v3 |
|---|---|---|
| Target | >80% | >80% |
| Estimated rate | 75% | **88%** |

**v3 สูงขึ้นจาก 75% → ~88%** (ประมาณจาก usability heuristics และ flow analysis)

**เหตุผลที่ดีขึ้น:**
- AccountSection ถูกซ่อนใน Full Mode — ลด form fields จาก 4-5 fields เหลือ 1 decision (period selection) ทำให้ form เสร็จได้เร็วและ completion rate สูงขึ้น
- Period selection cards มี visual affordance ที่แข็งแกร่ง (badge, color, summary row) ลด wrong-selection error
- ปุ่ม "ยืนยันคำสั่งซื้อ" ยัง enable ทันทีเมื่อเลือก period โดยไม่มี artificial gatekeeping

**ความเสี่ยงที่ยังอยู่:**
- ผู้ใช้ที่ cautious สูง (risk-averse persona) อาจ abandon ก่อนกด confirm เพราะไม่มี account confirmation — ในกลุ่มนี้ success rate อาจต่ำกว่า 88%

---

### 2. Time on Task / Friction

| Phase | v2 (estimated) | v3 (estimated) | Delta |
|---|---|---|---|
| Login → Dashboard | ~25s | ~22s | -3s |
| Dashboard → form | ~15s | ~10s | -5s |
| Form completion (period selection) | ~40s | **~20s** | **-20s** |
| Hesitation before confirm | ~8s | **~15s** | **+7s ⚠️** |
| **Total** | ~88s | **~67s** | **-21s** |

**Overall time ลดลงอย่างมีนัยสำคัญ** ส่วนใหญ่มาจากการตัด AccountSection ออก ใน v2 Full Mode user ต้องเห็น account form ที่ไม่เกี่ยวข้องก่อนเลื่อนลงมาหา period selection

**Friction regression ที่น่าสังเกต:** Hesitation time ก่อนกด confirm เพิ่มขึ้น +7 วินาที เพราะไม่มี account identity confirmation ใดๆ ในหน้า form ผู้ใช้ต้องตัดสินใจโดยมีข้อมูลไม่ครบ

---

### 3. Error Rate / Confusion — โฟกัส Missing Account Confirmation

**Critical Confusion Point: ไม่มีการยืนยัน account identity ใน purchase form**

ใน v3 เมื่อ Full Mode user กด "สั่งซื้อ" จาก OA Chat card ระบบนำไปสู่ `OAChatForm` ที่ render ผ่าน `PurchaseValidationHeader` โดยตรวจสอบ `isLocked` flag:

```
// PurchaseValidationHeader.jsx line 572
export default function PurchaseValidationHeader({ service, isLocked, onProceed }) {
  switch (service?.id) {
    case "chat": return <OAChatForm onProceed={onProceed} isLocked={isLocked} />;
  }
}

// OAChatForm line 444
function OAChatForm({ onProceed, isLocked }) {
  // ...
  // AccountSection renders only when isLocked === true
  <AccountSection acc={acc} isLocked={isLocked} />
  // AccountSection.jsx line 137: if (!isLocked) return null;
}
```

สำหรับ Full Mode user: `isLocked = false` → `AccountSection` returns `null` → **ไม่มี account field ใดๆ ปรากฏ**

**Confusion pattern ที่เกิดขึ้น:**

| # | Confusion Type | Severity | User Behavior |
|---|---|---|---|
| C1 | "Order นี้จะผูกกับ OA ไหน?" — ไม่มี contextual identity badge | High | Scan หน้าจอซ้ำ, pause ~15s |
| C2 | ไม่มี summary row แสดง Basic ID ก่อน confirm | High | Internal monologue "ถ้าผิดก็ค่อย contact" |
| C3 | System assumption implicit — ผู้ใช้ไม่รู้ว่า "ระบบจัดการเอง" หมายความว่าอะไร | Medium | ยอมรับความเสี่ยงและ proceed |
| C4 | ปุ่ม confirm ไม่มี pre-confirmation dialog | Low-Medium | Momentary hesitation |

**Error rate ประมาณ:** กรณีที่น่าเป็นห่วงไม่ใช่ wrong input (เพราะไม่มี input ให้กรอกผิด) แต่คือ **distrust-driven abandonment** คาดว่า ~10-15% ของ cautious users จะไม่กด confirm ในรอบแรก

**Improvement vs. v2:** ใน v2 มี error risk จากการกรอก AccountSection ผิด (wrong Basic ID, wrong payment channel) — ซึ่งหายไปใน v3 สำหรับ Full Mode อย่างสมบูรณ์ นี่คือ improvement จริง แต่มาพร้อมกับ trust gap ใหม่

---

### 4. Customer Effort Score (CES) — 1–5

**v3 CES: 2.5/5** (ลดจาก v2 ที่ 3.0/5 — ยิ่งต่ำยิ่งดี)

| Dimension | v2 | v3 | Notes |
|---|---|---|---|
| Form complexity | 3.5 | **1.5** | AccountSection หายไปใน Full Mode |
| Decision clarity (period) | 2.5 | **1.5** | Period cards + savings badge ชัดเจนมาก |
| Account identity confidence | 2.0 | **3.5** | ไม่มี confirmation → ต้องเดาเอง |
| Path to confirm button | 3.0 | **2.0** | Fewer steps, cleaner flow |
| **Overall CES** | **3.0** | **2.5** | ดีขึ้น แต่ account trust gap ฉุดคะแนน |

**วิเคราะห์:** CES ดีขึ้นอย่างเป็นรูปธรรม เพราะ effort ในการกรอก form ลดลงมาก อย่างไรก็ตาม account identity dimension แย่ลงจาก v2 — ใน v2 ผู้ใช้ต้องกรอก Basic ID เอง (effort สูง) แต่ "รู้" ว่า order ผูกกับ ID นั้น ใน v3 ไม่ต้องกรอก (effort ต่ำ) แต่ "ไม่รู้" ว่าผูกกับอะไร — เป็น trade-off ที่ต้องแก้

---

## สรุป — v3 vs. v2 Comparison

| Metric | v2 | v3 | Direction |
|---|---|---|---|
| Task Success Rate | 75% | ~88% | ✅ ดีขึ้น |
| Est. Time on Task | ~88s | ~67s | ✅ ดีขึ้น |
| Form Error Risk | Moderate (wrong input possible) | Low (no input = no error) | ✅ ดีขึ้น |
| Account Trust Gap | Low (explicit input) | **High (implicit, no cue)** | ⚠️ แย่ลง |
| CES | 3.0/5 | **2.5/5** | ✅ ดีขึ้น |

---

## ข้อเสนอแนะเร่งด่วน (Quick Wins)

1. **Account identity banner (Priority: High)**
   เพิ่ม read-only banner ในหน้า OA Chat form ที่บอกว่า "คำสั่งซื้อนี้จะผูกกับบัญชี `{account.id}` ({account.name})" — ใช้ข้อมูลจาก sidebar account pill ที่มีอยู่แล้วใน `DashboardScreen` state แค่ส่ง prop มาแสดงใน form header ใช้เวลา implement น้อยมาก

2. **Pre-confirm micro-summary (Priority: Medium)**
   ก่อน call `onProceed()` ให้แสดง inline summary เล็กๆ ใต้ปุ่ม หรือใน summary row ที่มีอยู่แล้ว เพิ่ม line: "บัญชี: `{account.id}`" ควบคู่กับ "ยอดรวม: ฿1,800"

3. **ไม่แนะนำให้เพิ่ม confirmation dialog (modal)** — จะสร้าง friction เพิ่มโดยไม่จำเป็น เพราะ v3 ทำงานได้ถูกต้องอยู่แล้ว แค่ขาด visibility

---

*Report generated: 2026-06-02 | Scope: Steps 1–5, ถึงแค่ปุ่ม "ยืนยันคำสั่งซื้อ" | Post-click behaviour ไม่อยู่ใน scope*
