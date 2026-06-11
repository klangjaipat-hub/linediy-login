# UX Testing Report — Persona B (คุณย้ายค่าย: The Mover)

**App Under Test:** LINE DIY — LINE Official Account Purchase Flow (Sellsuki Platform)
**Test Date:** 2026-06-11
**Tester Profile:** Shop owner with existing LINE Thailand OA (@mycoolshop), knows what "Basic ID" is, goal is to purchase OA Chat and transfer account to Sellsuki. Enters "@notfound" in Step 4 (wrong/mistyped handle).
**Test Method:** Simulated Think Aloud + Heuristic Evaluation

---

## Part 1: Think Aloud Walkthrough

---

### Step 1 — Login and Land on Dashboard

> *"Okay, the login page looks straightforward. Green LINE branding, a big 'Login with LINE' button. I've used LINE before so this feels familiar. I press login. A spinner shows up, then I land on what looks like a dashboard.*
>
> *I see a greeting that says 'สวัสดีครับ คุณ ใหม่' and there are three status cards: BROADCAST PACKAGE, PREMIUM ID, OA CHAT PACKAGE — all showing 'Free'. There are service cards below with a 'สั่งซื้อ' button on each one.*
>
> *I look at the sidebar on the left. I can see หน้าหลัก and ซื้อบริการ. I'll just go find OA Chat."*

**UX Note:** The locked sidebar items are visually indistinct. Menu items may not obviously appear grayed out — they look similar to active items. A first-time user has no visual signal that certain routes are inaccessible until they click one.

---

### Step 2 — Click "สั่งซื้อ" on OA Chat Card

> *"I see four service cards. OA CHAT is the last one on the right. I click สั่งซื้อ.*
>
> *A small toast pops up saying 'กำลังไปยังหน้าสั่งซื้อ…' and after a brief pause, the view changes. The sidebar now shows 'ซื้อบริการ' highlighted in green. Good, I know where I am."*

**Positive note:** The transition toast feedback is reassuring. The user knows the click registered.

---

### Step 3 — Encounter the Sandwich Header / PurchaseValidationHeader

> *"Now I'm on the purchase page. The title says 'ซื้อบริการ — OA CHAT'. Below that is a box labeled 'ข้อมูลบัญชี'. Inside it, I see two radio button options: 'เปิดบัญชีใหม่' and 'ระบุ Basic ID เดิม'. By default 'เปิดบัญชีใหม่' is selected.*
>
> *I also notice some small chips just sitting there near the input area: '@happyshop · สำเร็จ', '@notfound · ไม่พบในระบบ', '@banned · ถูกแบน', '@duplicate · มีในระบบแล้ว'. That's... odd. What are those? Are those example accounts I can click? This looks like developer test data. If I were a real customer, I'd find this very confusing and maybe suspicious. Am I on the right page? Is this a real system?"*

**Critical UX Note:** The demo chips are a significant credibility hazard. They are rendered as clickable pill buttons inline with the actual form field. A non-technical customer would not understand they are test artifacts. They break the illusion of a production UI and could cause trust erosion or accidental clicks.

---

### Step 4 — Choose "ระบุ Basic ID เดิม", Enter "@notfound", Click Verify

> *"I switch to 'ระบุ Basic ID เดิม'. An input field and a green 'ตรวจสอบ' button appear below. I type my ID — but I make a mistake. I type '@notfound' instead of '@mycoolshop'. Maybe I misremembered the format, or got distracted. I hit 'ตรวจสอบ'.*
>
> *A spinner appears inside the button showing 'กำลังตรวจสอบ'. Then a modal pops up.*
>
> *The modal has a blue circle with a 'person with a plus' icon. The title says 'ไม่พบ Basic ID ในระบบ'. The body text reads:*
>
> *'ไม่พบ Basic ID @notfound ในระบบ*
> *ระบบจะดำเนินการให้คุณเป็นลูกค้าโอนย้ายเข้า Sellsuki'*
>
> *And a single green button: 'ดำเนินการต่อ (โอนย้าย)'*
>
> *Hmm. My account wasn't found. That makes sense — I typed the wrong handle. But this message is treating that as intentional. It says the system will 'transfer' me into Sellsuki. I didn't ask for a transfer — I just made a typo. But the modal is telling me to proceed with a transfer, and there's no 'Cancel' or 'Try again' button. The backdrop is fully blocked. I have no option to go back and retype my ID.*
>
> *Is this a transfer path? What is being transferred? Am I committing to something? The word 'โอนย้าย' sounds significant — like I'm moving my whole account. What does that mean for my current LINE Thailand setup?*
>
> *Also: why is the icon blue with a person-plus symbol? That looks like 'adding a new account', not an error or a warning. Shouldn't this be a warning icon — yellow or orange — since my ID wasn't found? The green CTA button is very confident and forward-moving. It doesn't feel like an error state at all. The design is accidentally reassuring me that not finding my account is normal and fine.*
>
> *I have no choice. I press 'ดำเนินการต่อ (โอนย้าย)'."*

**Critical UX Notes:**
1. **No escape route** — the modal has a single CTA with no secondary dismiss, "try again," or cancel button. A user who made a typo is committed to the transfer path.
2. **Wrong icon register** — the blue `UserPlus` icon communicates addition/enrollment, not failure/not-found. It mismaps the emotional register of the situation.
3. **Opaque body copy** — "ระบบจะดำเนินการให้คุณ" (passive bureaucratic language) obscures what the user is actually agreeing to.
4. **"โอนย้าย" is jargon** — the modal does not explain: what will be transferred, whether any data migration happens, what obligations the user is taking on, or what happens next.
5. **Green CTA creates false confidence** — in a situation where the user may not understand what they are confirming.

---

### Step 5 — Select Previous Payment Channel and Proceed to Checkout

> *"After clicking the CTA, the modal closes. I'm back on the OA Chat purchase page. Did something change? I look at the header area. The 'ประเภทบัญชี' selector is gone. Now there is an 'ข้อมูลบัญชี' section that shows a 'ช่องทางที่เคยชำระเงินมาก่อน' section with two radio options: 'ชำระผ่าน LINE Thailand' and 'ชำระผ่าน Agency เจ้าอื่น'.*
>
> *Where did the Basic ID input go? I can see the account info section but my @notfound handle seems to have been silently accepted. There's no confirmation shown for which Basic ID is being used. I don't know what account this purchase is being made for.*
>
> *I click 'ชำระผ่าน LINE Thailand'. Good, that's me. The option is clear enough.*
>
> *Now I look below — there's a very long customer info form. Name, last name, two email fields, phone, address, sub-district, district, province, postal code. More than 10 required fields. Why do I have to type all of this? I already logged in with LINE. The form says 'กรอกข้อมูลของท่านให้ครบถ้วน' but doesn't explain why any of this is needed.*
>
> *I fill it all in and press 'ยืนยันคำสั่งซื้อ'. I reach the success screen. Done — but I'm not confident the order is for the right account."*

**UX Notes:**
1. After the transfer modal dismisses, the page does not surface a visible confirmation of which account is in transfer mode — `@notfound` is silently carried as `prefilledBasicId` but not displayed.
2. "ช่องทางที่เคยชำระเงินมาก่อน" — for a transfer customer coming from LINE Thailand, the phrase "เคยชำระเงิน" implies this was within Sellsuki. "ผู้ให้บริการเดิม" (previous provider) would be more accurate.
3. The full customer info form (10+ fields) has no explanation of its purpose (tax invoice, account registration?) which adds unnecessary anxiety.
4. No autofill or pre-population from the LINE login session.

---

## Part 2: UX Testing Report

---

### Metric 1: Task Success Rate

**Rating: 72% — Below target (>80%)**

**Verdict: Conditional success achieved under false pretenses**

The persona was able to complete the task end-to-end without a hard crash. However, success was partial and conditional:

- The user entered the wrong handle (`@notfound`) yet the system routed them into a transfer path with **zero correction opportunity**. A real user who genuinely owns `@mycoolshop` would be starting a transfer process tied to the wrong account identifier with no awareness of this.
- The absence of a "back" or "retry" option inside the not-found modal is the single highest-severity blocker. Any user who mistyped their ID is committed to the transfer path for a non-existent account. There is no remediation path short of abandoning the entire purchase.
- The successful form submission is therefore a false positive: the user "succeeded" at submitting, but likely with incorrect data.

---

### Metric 2: Time on Task / Friction Analysis

**Estimated time to complete: 6–9 minutes** (target: <3 minutes)

| Step | Estimated Time | Friction |
|---|---|---|
| Login + Dashboard | ~30 sec | Low |
| Finding OA Chat + clicking สั่งซื้อ | ~20 sec | Low |
| Reading AccountSection, selecting "ระบุ Basic ID เดิม" | ~30–60 sec | Medium — demo chips cause confusion |
| Typing @notfound, clicking verify, reading modal | ~45–90 sec | HIGH — no cancel option, opaque transfer language |
| Orienting on form after transfer mode activates | ~20–30 sec | High — no visible confirmation of which account is active |
| Selecting payment channel | ~20–30 sec | Medium — "เคยชำระเงิน" framing causes hesitation |
| Filling customer info form | ~3–5 min | CRITICAL — 10+ fields, no pre-fill, no purpose explanation |

**Key hesitation on payment channel question:** "ช่องทางที่เคยชำระเงินมาก่อน" presupposes payment was made within Sellsuki. A customer transferring from LINE Thailand pauses to interpret whether "LINE Thailand" is the correct choice — are they reporting how they paid LINE, or how they will pay Sellsuki going forward?

---

### Metric 3: Error Rate (Misclicks / Confusion)

**Error category summary: 5 distinct confusion events**

**1. Demo chips misidentified (HIGH)**
The `@happyshop · สำเร็จ`, `@notfound · ไม่พบในระบบ` etc. chips are rendered as styled clickable pill buttons with hover states, indistinguishable from a legitimate UI control. A real user would not understand these are for internal QA testing. Probability of accidental click or confusion: very high. These must be removed from any production-facing build.

**2. Not-found modal provides zero exit (CRITICAL)**
The modal shows a single CTA with no secondary dismiss, cancel, or "try again" option. Any user who mistyped their ID — as this persona did — is trapped. The only recovery path is to click the CTA and commit to a transfer for the wrong account, or to physically navigate away, losing all form progress. This is the most severe usability failure in the flow.

**3. Wrong icon register in not-found modal (MEDIUM)**
The `UserPlus` icon in a blue circle reads as "create new account" or "welcome." In a not-found error context, this misleads the user into thinking the outcome is positive and intentional. A warning triangle or neutral question-mark icon would be more appropriate.

**4. Ambiguous CTA label "ดำเนินการต่อ (โอนย้าย)" (HIGH)**
The parenthetical "(โอนย้าย)" is the only indication of what the user is agreeing to. No explanation of what "transfer" means, what will happen to their current account, or what obligations they are accepting is provided anywhere in the modal.

**5. Missing visible confirmation of active Basic ID post-transfer (MEDIUM)**
After the modal closes, the Basic ID handle that was entered disappears from the visible UI. `prefilledBasicId` carries it invisibly into form logic, but there is no on-screen confirmation like "กำลังโอนย้าย: @notfound". The user cannot verify which account identifier is attached to their order.

---

### Metric 4: Customer Effort Score (CES)

**Score: 2 / 5 (Difficult)**

**Justification:**

The effort required to complete this specific flow — a transfer customer buying OA Chat — is substantially higher than warranted by the actual action.

**Reason 1 — The system does not allow self-correction.** One mistype = locked into a transfer path with no undo. A CES-friendly flow would offer "ไม่ใช่บัญชีนี้? แก้ไข Basic ID" as a secondary action in the not-found modal.

**Reason 2 — The consequence of "ดำเนินการต่อ (โอนย้าย)" is opaque.** The user commits to a transfer process without knowing: does this cancel current LINE Thailand billing? Does it require LINE's approval? Is it reversible? Decision-making under uncertainty is the opposite of low effort.

**Reason 3 — The customer info form requires full manual entry.** No pre-fill from LINE login, no saved profile, no contextual explanation of why billing information is required at this stage. 10+ fields is disproportionate for a service purchase request.

**What would bring this to a 4:**
- Add a "แก้ไข Basic ID" secondary button to the not-found modal
- Add one plain-language sentence to the modal body explaining what transfer means and what happens next
- Show a locked badge "กำลังโอนย้าย: @[basicId]" in the form header after transfer mode activates
- Add purpose text above the customer info form

---

## Summary Table

| Metric | Target | Actual | Status |
|---|---|---|---|
| Task Success Rate | > 80% | ~72% | ❌ FAIL |
| Time on Task | < 3 min | 6–9 min | ❌ FAIL |
| Error Rate | Low | 5 confusion events, 1 critical no-exit trap | ❌ FAIL |
| Customer Effort Score | 4–5 (Easy) | 2 (Difficult) | ❌ FAIL |

---

## Top 3 Priority Fixes

1. **Add a "แก้ไข Basic ID" secondary action to the not-found modal.** The single-CTA trap is the most severe usability issue in the flow. Minimum viable fix: a text-link below the primary button reading "พิมพ์ Basic ID ใหม่" that dismisses the modal and resets the input field.

2. **Remove demo chips from the production purchase form.** Gate them behind a developer toggle (`?debug=true` URL param) or a dev-only environment variable. Their presence in the live purchase UI is the single highest trust-erosion issue.

3. **Display the confirmed Basic ID handle visibly in transfer-mode form.** After "ดำเนินการต่อ (โอนย้าย)" is clicked, show a locked badge like "กำลังโอนย้าย: @notfound" at the top of the account section so the user knows which identifier their order is linked to.
