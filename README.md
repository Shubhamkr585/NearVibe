# 🌄 NearVibe

**NearVibe** is a Next.js web platform to discover and plan short, local micro-adventures (1–4 hours) based on your location, time, and interests.

---

## 🚀 Features

- Find nearby adventures with geolocation
- Build and manage personal itineraries
- Submit and explore community adventures
- AI-powered suggestions
- Adventure logbook
- Auth with NextAuth.js
- MongoDB + Mongoose backend
- Styled with Tailwind CSS

---

## 🧱 Tech Stack

**Frontend**: Next.js (App Router), TypeScript, Tailwind  
**Backend**: Next.js API Routes  
**Database**: MongoDB + Mongoose  
**Auth**: NextAuth.js  
**Maps**: Mapbox

---

## 📁 Project Structure

- `app/` – App Router pages and API routes
- `components/` – Reusable UI components
- `lib/` – MongoDB config, helpers, utils
- `types/` – TypeScript interfaces
- `styles/` – Tailwind CSS and custom styles
- `public/` – Static assets (images, fonts)

---

## 🛠 Getting Started

```bash
git clone https://github.com/your-username/nearvibe.git
cd nearvibe
npm install
cp .env.example .env.local   # Add MongoDB URI, Auth secrets
npm run dev
