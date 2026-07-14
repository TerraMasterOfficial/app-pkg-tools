# 18. Commercialization & Donations

### 18.1 Donation Feature Description

#### 18.1.1 Feature Overview

To support developers in continuously maintaining and developing quality applications, the TNAS Developer Platform provides the ability to configure a donation link. Developers can add a donation link in their profile, and the app detail page for all published apps will automatically display a donation button. Users who click it will be redirected directly to that link and can voluntarily provide financial support to the developer.

#### 18.1.2 Donation Link Configuration Rules

**Configuration Entry:** Log in to the TNAS Developer Platform → Go to the "Profile" page → Locate the "Donation Link" module and click the "Edit" button on the right to make changes.

**Format Requirements:**

- Type: String format; must be a valid HTTPS link (only HTTPS is supported);
- Length limit: 10–255 characters;
- Optional: Developers may choose not to configure a donation link; this does not affect app publishing;
- Editable: Supports modification or deletion at any time; changes take effect immediately (app detail pages update synchronously).

**Display Logic:**

- The "Donate" button on the app detail page is only displayed when the developer has configured a valid donation link; the button is hidden otherwise;
- The platform does not intervene in fund transfers, settlement, or dispute resolution; it only provides a link redirect channel and does not charge any fees or commissions.

#### 18.1.3 Compliance Notes

- The donation link must comply with the laws and regulations of the relevant region and must not contain gambling, pornography, illegal finance, fraud, or other prohibited content;
- It is forbidden to tie donations to core app functionality (e.g., "basic features are unavailable without donating"); the voluntary nature of donations must be preserved;
- Developers are solely responsible for the accessibility, compliance, and related tax and legal liabilities of the link.

### 18.2 Future Paid App Feature (Planned)

#### 18.2.1 Feature Vision

To help developers earn reasonable returns for their development efforts, the TNAS app ecosystem will introduce a paid app commercialization program in the future, providing compliant and transparent paid distribution channels for quality apps. This will allow developers' innovation and investment to yield corresponding returns while offering users more high-quality professional app choices.

#### 18.2.2 Core Program Framework (Planned Direction)

| Module | Planned Details |
|------|----------|
| **Payment Models** | Supports multiple commercialization models, including:<br>1. One-time purchase: Users pay a fixed fee for permanent app access;<br>2. Subscription: Monthly/annual payment for ongoing updates and technical support;<br>3. Premium feature unlock: Basic features are free; advanced features require paid unlock. |
| **Pricing & Revenue Share** | 1. Developer sets their own price; the platform provides a suggested pricing range for reference;<br>2. Transparent revenue sharing: Developers receive the vast majority of revenue; the platform charges a small technical service fee (specific percentage to be announced later);<br>3. Settlement cycle: Supports settlement by calendar month/quarter, providing clear order and reconciliation data. |
| **Review & Publishing** | 1. Paid apps must pass additional quality and compliance review (including feature completeness, user agreement, privacy policy, etc.);<br>2. Clear functional descriptions, changelogs, and after-sales support commitments are required;<br>3. Free trials / time-limited experiences are supported to lower the user's decision barrier. |
| **Rights & Protections** | 1. The developer backend provides a paid data dashboard (downloads, conversion rate, user reviews, etc.);<br>2. The platform provides user complaint handling and dispute mediation channels;<br>3. Quality paid apps are offered recommendation slots, traffic support, and other promotional resources. |

#### 18.2.3 Developer Preparation Recommendations

To prepare for the launch of paid app features, developers are advised to prepare in advance as follows:

- **Polish App Quality:** Focus on solving users' real pain points, optimize feature stability, performance, and user experience, and build differentiated competitiveness;
- **Improve Supporting Services:** Prepare clear user documentation, update plans, and technical support channels to increase users' willingness to pay;
- **Proactive Compliance Preparation:** Review app data processing logic, prepare compliance documents such as privacy policies and user agreements, and prepare for paid publishing review;
- **Define Commercialization Path:** Based on the app's positioning, plan the payment model (e.g., one-time purchase / subscription) and pricing strategy in advance to match the spending habits of the target user group.

### 18.3 Supplementary Notes

- The "Paid App Feature" described in this chapter is a future planned direction; specific launch timelines and detailed rules will be subject to subsequent platform announcements;
- The platform will open a developer reservation channel before the feature goes live, prioritizing quality apps for testing and publishing support;
- If developers have suggestions or questions about the commercialization program, they can provide feedback through the Developer Platform ticket channel.

---

← [Previous: Operations & Delisting](17_Operations_Delisting.md) &nbsp;&nbsp;|&nbsp;&nbsp; [Next: FAQ](19_FAQ.md) → &nbsp;&nbsp;|&nbsp;&nbsp; [📖 Back to Contents](../README.md)
