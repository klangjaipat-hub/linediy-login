# UX Testing Report — Persona C (คุณขาประจำ: The Regular)

**App Under Test:** LINE DIY — LINE Official Account Purchase Flow (Sellsuki Platform)
**Test Date:** 2026-06-11
**Tester Profile:** Active returning Sellsuki customer with registered Basic ID (@sellsukishop), logging in from a new device. Goal is to check Order History — which is accessible but shows no data.
**Test Method:** Simulated Think Aloud + Heuristic Evaluation

> **Key change from previous test run:** In this scenario the Order History menu is NOT locked — the user can open it freely. However, the page shows empty/no data. The user's motivation to connect their Basic ID comes from seeing empty history, not from hitting a blocked menu. There is no locked-menu modal to guide them at any point.

---

## Part 1 — Think Aloud Walkthrough

---

### Step 1: Login and Land on Dashboard — Order History Shows No Data

> *"Okay, great, I'm in. The dashboard looks clean — I can see my name and the service cards. Nothing weird here. Let me just go straight to what I came for — รายการสั่งซื้อ. I use this system regularly, I know I have orders."*

*[Clicks รายการสั่งซื้อ in the sidebar. The menu is not locked — no gray color, no lock icon. It opens immediately.]*

> *"Wait... it says 'ยังไม่มีรายการสั่งซื้อ' — 'No orders yet.' That can't be right. I have multiple orders from before. Did something go wrong? Did my data get deleted? Is this a new account? Am I in the wrong place?"*

*[The empty state shows a clipboard icon, a title 'ยังไม่มีรายการสั่งซื้อ', and a subtitle 'เมื่อคุณสั่งซื้อบริการ รายการจะปรากฏที่นี่'. There is no CTA, no explanation linking the empty state to a missing Basic ID connection.]*

> *"There's no 'Buy Service' button here either — just an empty icon and a message. The subtitle says 'when you buy a service, orders will appear here.' But I HAVE bought services. Why is it treating me like a new customer? There's no explanation for why my history is missing. Is this a bug? Did I log into the wrong account? I'm confused and a bit worried."*

**Critical friction:** The empty state is architecturally blind to the distinction between "you have never bought anything" and "your account is not connected yet." There is no contextual hint — no banner, no inline link, no tooltip — explaining that the missing data is caused by a disconnected session and that connecting a Basic ID is what causes data to appear.

---

### Step 2: Exploring the UI to Find a Way to Connect an Existing Account

> *"Okay, let me look around. Maybe I need to go to 'จัดการบัญชี' — that sounds like it would manage my account details."*

*[Clicks จัดการบัญชี in the sidebar. The page opens and shows an empty state — 'ยังไม่มีข้อมูลบัญชี' with a 'ซื้อบริการ' CTA button.]*

> *"'ยังไม่มีข้อมูลบัญชี' — also empty? And the only CTA here tells me to buy a service. But I already bought services. I don't want to buy again. I just want to see my history."*

*[Frustrated. Scans the full sidebar nav list: หน้าหลัก, ซื้อบริการ, จัดการบัญชี, รายการสั่งซื้อ, แจ้งการชำระเงิน, สิทธิพิเศษ, เอกสาร. There is NO "จัดการ Basic ID" item anywhere in the nav.]*

> *"There's no menu for managing Basic ID. I don't see anything that says 'connect account' or 'link your existing ID.' Let me try 'แจ้งการชำระเงิน' — maybe that has something."*

*[Clicks แจ้งการชำระเงิน. Shows empty state: 'ยังไม่มีรายการที่ต้องชำระ'.]*

> *"Also empty. Three menus in a row, all empty. The system clearly doesn't know who I am. But there's no 'connect your account' link anywhere. I'm going back to the home page."*

*[Returns to หน้าหลัก. Dashboard shows service cards — no banner, no prompt to link an account.]*

> *"The dashboard looks normal — it says my name, it shows service cards. But all data is empty everywhere. Wait... let me look at the top of the sidebar. There's my name there with a little avatar circle. Maybe if I click on it? It doesn't look like a button, it looks like a display. But I've tried everything else."*

*[After approximately 45–90 seconds of exploration and 3–4 misclicks on menu items, the user — through process of elimination rather than clear UI signposting — clicks on the sidebar user area.]*

> *"Oh! Something happened. A page appeared."*

**Critical finding:** The user area at the top of the sidebar is the ONLY entry point to จัดการ Basic ID. It has NO label saying "Manage Basic ID", NO edit icon, NO tooltip, NO underline or visual affordance to suggest it is clickable. The user discovers it by exhaustive exploration, not by design. This is a fundamental discoverability failure.

---

### Step 3: The จัดการ Basic ID Card — Choosing "บัญชีเดิม"

*[ManageBasicIdCard renders with TYPE_SELECTION step: "กรุณาเลือกประเภทบัญชี" with two options: "บัญชีเดิม — สำหรับผู้ที่มี Basic ID เดิมอยู่แล้ว" and "เปิดบัญชีใหม่ — สำหรับผู้ที่ยังไม่มี Basic ID".]*

> *"Okay! Now this makes sense. Two options: 'บัญชีเดิม' and 'เปิดบัญชีใหม่'. The subtitle under 'บัญชีเดิม' says 'สำหรับผู้ที่มี Basic ID เดิมอยู่แล้ว'. That first one is obviously me."*

*[Clicks "บัญชีเดิม" without hesitation.]*

> *"Great, this part was clear. The labels are good."*

**Positive note:** The TYPE_SELECTION step is the strongest part of the flow — the two-option layout with clear subtitles is unambiguous and requires zero hesitation.

---

### Step 4: Entering "@sellsukishop" and Clicking Verify

*[ACCOUNT_INPUT step renders: a Basic ID text field, "ตรวจสอบ" button, and four demo chip buttons — @happyshop, @notfound/transfer, @banned, @duplicate.]*

> *"Okay, I need to enter my Basic ID. That I know — it's @sellsukishop. Let me type it in.*
>
> *Wait, what are these colored buttons here? '@happyshop · สำเร็จ', '@notfound/transfer · ไม่พบ/โอนย้าย', '@banned · ถูกแบน', '@duplicate · มีแล้ว'... These look like test buttons. Are these supposed to be here? This is a bit weird. Is this a developer tool? Am I on the right page? Should I click one of these instead of typing?"*

*[Momentarily confused by demo chips. Decides to ignore them and proceed with manually typed value.]*

> *"I'll just ignore those. I already typed my ID. Let me click ตรวจสอบ."*

*[Clicks ตรวจสอบ. A 1.2-second spinner appears, then a success modal fires.]*

---

### Step 5: Success — Sidebar Unlocks, Full Mode Activated

*[Success modal: green checkmark icon, "เชื่อมต่อสำเร็จ!" heading, "พบ Basic ID @sellsukishop ในระบบแล้ว กำลังเข้าสู่ Full Mode Dashboard…", CTA "เข้าใช้งาน Full Mode".]*

> *"Oh, great! It found my account! 'เชื่อมต่อสำเร็จ!' — connected successfully."*

*[Clicks "เข้าใช้งาน Full Mode". Sidebar updates to show "@sellsukishop" in green above the display name. A toast notification and a green banner briefly appear on the dashboard.]*

> *"I can see '@sellsukishop' in green now. Let me go back to รายการสั่งซื้อ now."*

*[Navigates to รายการสั่งซื้อ. The empty state renders again — "ยังไม่มีรายการสั่งซื้อ" — because `recentOrder` is still null in this session.]*

> *"...It's still empty. But I was told connecting my Basic ID would let me see my history. Why is it still showing nothing? Maybe the data takes time to load? Or maybe this is only for orders placed through this specific platform, not all my LINE OA orders? I'm not sure if I did the right thing."*

**Post-success disappointment:** The user successfully completed the connection flow, but the core goal — seeing order history — remains unmet because the prototype does not populate historical mock data post-linkage. This is both a prototype fidelity issue and a signal that the empty state must communicate WHY data is absent post-connection.

---

## Part 2 — UX Testing Report

---

### Metric 1: Task Success Rate

**Score: 55% — Well below the 80% target threshold**

**Verdict: Partial success — the connection flow completed but the core goal was never achieved**

The primary task was to access Order History. The user was able to complete the Basic ID connection flow — that sub-task succeeds. However:

1. **Core goal unmet.** Order History shows empty both before AND after connecting Basic ID. The user's primary goal was never fulfilled within the prototype.
2. **Discovery by elimination, not design.** The user found the entry point to จัดการ Basic ID only through process-of-elimination exploration (~45–90 seconds of unproductive clicks). Success was stumbled upon, not designed for.
3. **No system-initiated guidance.** Unlike the previous test scenario where a locked-menu modal would guide the user toward "เพิ่ม/เชื่อมต่อ Basic ID," this scenario provides ZERO proactive guidance at any point. All menus are open; all pages are empty. The user has no cue from the system that they need to connect their account.

If the test were strictly scored on whether the user can *confidently* access their order history, the success rate would be closer to 35–40%.

---

### Metric 2: Time on Task / Friction Analysis

**Estimated time to reach จัดการ Basic ID: ~60–120 seconds of unproductive exploration.**
**Total task time (including verification): ~3–4 minutes** (goal: under 60 seconds for a returning customer)

| Phase | Est. Time | Friction |
|---|---|---|
| Login | ~15 sec | Low |
| Opening Order History, reading empty state | ~20 sec | HIGH — empty state is misleading |
| Exploring จัดการบัญชี, แจ้งการชำระเงิน, หน้าหลัก | ~60–90 sec | CRITICAL — productive-looking paths yield nothing |
| Discovering sidebar user area as clickable | ~45–90 sec | CRITICAL — zero affordance |
| TYPE_SELECTION: choosing "บัญชีเดิม" | ~5–10 sec | Low — labels are clear |
| Entering Basic ID + verifying | ~30 sec | Low (with brief demo-chip confusion) |
| Success modal + unlock | ~10 sec | Low — clear confirmation |
| Checking Order History post-connection | ~10 sec | HIGH — still empty, secondary confusion |

**Single highest time sink:** The ~60–120 seconds of aimless exploration before finding the entry point. Unlike the previous scenario (locked menus with a guiding modal), this scenario provides zero system-initiated navigation assist. The entire discovery burden is on the user.

---

### Metric 3: Error Rate (Misclicks / Confusion)

**Observed errors and confusion events: 5–6**

**Error 1 — จัดการบัญชี shows wrong empty state (HIGH)**
The page says "ยังไม่มีข้อมูลบัญชี" with a "ซื้อบริการ" CTA — content appropriate for a new user. For Persona C who is a returning customer, this CTA is irrelevant and confusing. There is no distinction between "new user who has never bought" and "returning user whose account isn't linked yet." Severity: High — it actively misdirects the user away from the connection flow.

**Error 2 — Exhaustive sidebar exploration (CRITICAL)**
The user clicks 3–4 menu items before discovering the hidden user area. Each unproductive click increases frustration and erodes confidence that the system is working correctly. In a real user test, this pattern often precedes task abandonment. The core cause is the absence of a visible "จัดการ Basic ID" entry in the sidebar nav.

**Error 3 — Sidebar user area has zero clickability affordance (CRITICAL)**
The user area at the top of the sidebar is a `<button>` component with only a `hover:bg-[#F4F4F4]` visual state — a barely perceptible light gray background shift. There is no label, no icon (no pencil, no gear, no chevron), no descriptive text, and no tooltip. This element is invisible as an interactive component to users who are not testing it deliberately. A real user will not hover over a static display element to discover its interactivity.

**Error 4 — Empty state gives no account-linkage guidance (HIGH)**
The Order History empty state message "เมื่อคุณสั่งซื้อบริการ รายการจะปรากฏที่นี่" is written for a genuinely new user. There is no second message for "you are a returning user whose session is not linked." No CTA, no link, no explanation of why data is missing for a logged-in user who has prior orders. This is the starting confusion that cascades into all subsequent exploration errors.

**Error 5 — Demo chips on VALIDATION_FORM (MEDIUM)**
The presence of `@happyshop · สำเร็จ`, `@banned · ถูกแบน`, etc. chips as styled clickable pill buttons causes a credibility moment. The user correctly identifies them as test artifacts but still loses time and confidence. These must be removed from any production-facing build.

**Error 6 — Post-connection Order History still empty (HIGH)**
After successfully connecting Basic ID, navigating back to Order History still shows the same empty state. The user has no explanation for why their history is still missing. The success modal said "กำลังเข้าสู่ Full Mode Dashboard" — which implies their data should now be accessible. The empty state does not distinguish between "no orders" and "orders exist but are loading/unavailable."

---

### Metric 4: Customer Effort Score (CES)

**Score: 2 / 5 (Difficult)**

**Justification:**

A score of 2 reflects a task that was mechanically completable (the connection flow works) but required disproportionate effort relative to the simplicity of the user's goal ("I just want to see my order history").

**Factors driving the low score:**

1. **No passive account-linkage indicator.** The entire locked state is communicated only reactively (locked-menu modal in other scenarios) or not at all (this scenario). There is no persistent indicator on the dashboard, Order History, or any other page that the session is unlinked and data is therefore unavailable.

2. **Hidden single entry point.** The only way to access จัดการ Basic ID is a visually unmarked button with no label, no icon, and a barely perceptible hover state. This violates the principle of affordance. A user who does not click it by accident or exhaustive exploration will never find the connection flow.

3. **All empty states speak to new users, not returning users.** Three pages (Order History, Manage Account, Payment Notification) all display empty states written for first-time users. None acknowledge the possibility of a disconnected returning customer or offer a recovery path.

4. **Post-success state does not fulfill the goal.** After successfully linking @sellsukishop, the Order History remains empty. The value of connecting the account is never demonstrated within the prototype. This is the most deflating possible ending to an already effortful task.

5. **Dev artifacts in production UI.** Demo chips on the validation form are a credibility and usability issue requiring unnecessary cognitive processing.

**One point awarded because:** The TYPE_SELECTION step and VALIDATION_FORM (once reached) are clean and well-designed, requiring minimal effort. The success modal is reassuring. The visual feedback on unlock (green @handle in sidebar, toast, Full Mode banner) is satisfying. The path from "found the entry point" to "successfully connected" is genuinely good UX — the failure is entirely in the discoverability and orientation layers.

---

## Summary Table

| Metric | Target | Actual | Status |
|---|---|---|---|
| Task Success Rate | > 80% | ~55% | ❌ FAIL |
| Time on Task | < 60 sec | 3–4 min | ❌ FAIL |
| Error Rate | Low (0–1 misclick) | 5–6 errors/confusion events | ❌ FAIL |
| Customer Effort Score | 4–5 (Easy) | 2 (Difficult) | ❌ FAIL |

---

## Priority Recommendations

| Priority | Issue | Recommendation |
|---|---|---|
| P0 | Sidebar user area is the only entry point to จัดการ Basic ID with zero affordance | Add a visible "จัดการ Basic ID" item to the sidebar nav list, OR add a settings/edit icon + tooltip to the user area |
| P0 | Empty Order History gives no guidance for disconnected returning users | Add a secondary empty state variant: "เชื่อมต่อ Basic ID เพื่อดูรายการสั่งซื้อของคุณ" with a CTA button |
| P1 | No passive indicator anywhere that session is unlinked | Add a persistent but non-intrusive dashboard notice (chip or banner) for users whose Basic ID is not yet linked |
| P1 | All empty states are written for new users, not returning users | Add a context-aware empty state variant that acknowledges the returning-user scenario |
| P2 | จัดการบัญชี empty state CTA says "ซื้อบริการ" for all users | Add a "เชื่อมต่อ Basic ID" CTA as an alternative for users who have no linked account |
| P2 | Demo test chips visible in VALIDATION_FORM | Remove from production build; gate behind `?debug=true` or dev-environment flag |
| P3 | Post-connection Order History still shows empty | Seed mock historical order data that becomes visible after Basic ID is linked (prototype fidelity issue) |
