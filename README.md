# Bove AI – Realistic Voice Studio (Nepali, Hindi & English)

High-fidelity Neural Text-to-Speech (TTS) Voice Studio built with React, Vite, Tailwind CSS, TypeScript, and Express, powered by Gemini 3.8 Flash Neural Speech models.

---

## 🚀 1. How to Make Your Project Permanent (100% Free)

To own your application permanently, update features whenever you want, and deploy it live with a 24/7 free URL:

### Step 1: Upload Your Code to GitHub (Permanent Codebase)
1. Go to [github.com](https://github.com) and create a free account if you haven't already.
2. Click **New Repository** (e.g., name it `bove-ai-voice`). Set it to **Public** or **Private**.
3. Extract your downloaded `bove-ai-source-code.zip`.
4. Open your terminal or Command Prompt inside the extracted folder:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of Bove AI voice studio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/bove-ai-voice.git
   git push -u origin main
   ```
*Congratulations! Your code is now permanently stored in your own GitHub repository.*

---

### Step 2: Deploy Free on Render.com (Recommended for Full-Stack)
Render provides free permanent Node.js web services with automated GitHub deployment:
1. Sign up for free at [render.com](https://render.com) using your GitHub account.
2. In your Render Dashboard, click **New +** -> **Web Service**.
3. Select your `bove-ai-voice` repository.
4. Configure the settings:
   - **Name**: `bove-ai-voice`
   - **Language / Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
5. Scroll down to **Environment Variables** and add:
   - `GEMINI_API_KEY`: *(Get your free key from [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey))*
   - `NODE_ENV`: `production`
6. Click **Deploy Web Service**.
7. In ~2 minutes, Render gives you a permanent live HTTPS URL (e.g., `https://bove-ai-voice.onrender.com`).
   *Every time you push new code to GitHub, Render automatically builds and updates your live site!*

---

## 🛠️ 2. How to Add New Features Anytime

Because your project is on GitHub:
1. **Add New Voice Personas**:
   - Open `src/data/characters.ts`.
   - Add a new character object with custom name, avatar, default emotion, and sample audio text.
2. **Add New Script Templates**:
   - Open `src/data/templates.ts`.
   - Add new scripts for Nepali news, YouTube intros, dramatic stories, or podcasts.
3. **Add New Voice Emotions & Accents**:
   - Open `src/types.ts` and `src/components/EmotionControls.tsx`.
4. **Push Updates**:
   ```bash
   git add .
   git commit -m "feat: added new voices and templates"
   git push
   ```
   *Your live website will automatically update in 2 minutes!*

---

## 💳 3. Monetization & Subscription System (Khalti / eSewa / Stripe)

Bove AI comes with a built-in **Subscription & Pricing Tier architecture**:
- **Free Starter**: 10 daily voice generations with standard audio download.
- **Pro Creator**: रु. २९९/month ($2.99) with unlimited generations, dual-speaker dialogue, and commercial license.
- **Studio Agency**: रु. ९९९/month ($8.99) with team workspace and API access.

### Connecting Nepal Payment Gateways:

#### 1. Khalti Payment Gateway
1. Create a merchant account at [khalti.com](https://khalti.com).
2. Obtain your **Live Public Key** and **Secret Key**.
3. In `src/components/SubscriptionModal.tsx` or your Express backend in `server.ts`, call Khalti's initiate endpoint:
   ```typescript
   // POST https://a.khalti.com/api/v2/epayment/initiate/
   // Headers: Authorization: Key <your-khalti-secret-key>
   ```

#### 2. eSewa ePay
1. Sign up at [developer.esewa.com.np](https://developer.esewa.com.np).
2. Use the standard HMAC SHA256 signature payment request to eSewa `https://epay.esewa.com.np/api/epay/main/v2/form`.

#### 3. International Payments (Stripe / Lemon Squeezy)
1. Set up a free account at [lemonsqueezy.com](https://lemonsqueezy.com) or [stripe.com](https://stripe.com).
2. Embed the checkout overlay directly to accept credit cards globally.

---

## 💻 4. Running Locally on Your Computer

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```
3. **Start local development**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Production Build**:
   ```bash
   npm run build
   npm start
   ```

---

## 🛡️ License & Commercial Rights
All code is open for modification and private commercial deployment by Bove AI Studio.
