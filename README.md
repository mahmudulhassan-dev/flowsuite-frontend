# FlowSuite Frontend (`suite.amanasuite.com`)

## 📌 Architecture & Overview
The **FlowSuite Frontend** is built using **Next.js 14 App Router**, **TypeScript**, and **Tailwind CSS**. It powers the **SaaS Business Landing Page** (`/`), the **User Control Panel** (`/panel`), and all application modules (Social Publisher, Omnichannel Inbox, AI Studio, CRM, Marketing, Billing, Assets, Settings).

- **Production Port**: `4005`
- **Domain**: `https://suite.amanasuite.com`
- **GitHub Repository**: `https://github.com/mahmudulhassan-dev/flowsuite-frontend.git`

---

## 🚀 Local Development Setup
```bash
# Navigate to the frontend directory
cd frontend

# Install Node dependencies
npm install

# Run the local Next.js dev server
npm run dev
```

---

## 🔄 Automated VPS Deployment Pipeline (No SFTP)
1. Local edits & build verification (`npm run build`).
2. Commit and push to GitHub: `git push origin main`.
3. On VPS Server (`148.230.98.190`):
   ```bash
   cd /www/wwwroot/suite.amanasuite.com
   git pull origin main
   npm install
   npm run build
   pm2 restart flowsuite-frontend
   ```

---

## 🗺️ Application Routes Directory
- `/`: Enterprise Business Landing Page (Hero, Features, Dropdown Menus, Pricing)
- `/panel`: User Control Panel Overview
- `/panel/publisher`: Multi-Platform Social Media Scheduler
- `/panel/inbox`: Omnichannel Inbox & Embeddable Web Live Chat Widget Generator
- `/panel/ai-studio`: Creative AI Agents (Copywriter, AI Model, Gemini Voice)
- `/panel/crm`: Lead Pipeline & Contact Management
- `/panel/marketing`: WhatsApp, Email, SMS & Chat Broadcast Suite
- `/panel/billing`: Subscription Plans & AI Credit Wallet
- `/panel/assets`: Digital Asset Manager
- `/panel/settings`: Custom CNAME Domains & Webhooks
- `/affiliate`: 30% MRR Affiliate Partner Portal
- `/terms`: Terms of Service & 99.99% Uptime SLA
- `/privacy`: Privacy Policy & GDPR Compliance
