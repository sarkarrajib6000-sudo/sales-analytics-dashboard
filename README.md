# AeroSales - AI-Powered Sales Analytics & Forecast Dashboard

AeroSales is a premium, next-generation web application designed to turn complex transactional CSV files into interactive, high-fidelity business analytics, forecasting models, and AI-driven growth strategies. Built using a modern glassmorphic aesthetic, it combines client-side spreadsheet compilation with active generative intelligence models.

---

## 📋 What We Built

AeroSales delivers a complete workspace for sales managers, executives, and data analysts. Key features include:

### 1. Optional Glassmorphic Login & User Session Management
- **Hero Intro Interface**: Features glowing animated mesh backdrops and structured lists of capabilities.
- **Outlined CTAs**: Aligned "Get Started" and "Enter as Guest" buttons to share matching dimensions.
- **Glassmorphic Credentials Form**: Integrates optional email validation and username collection, caching user credentials inside `localStorage` for reactive header greetings.
- **Reactive Header**: Tracks session status, displays custom initials, and provides a single-click logout trigger.

### 2. Live Gemini AI Executive Insights Engine
- **Direct Client Fetching**: Dispatches standard API calls to the Google Generative Language API (`gemini-2.5-flash:generateContent`) directly from the client.
- **Dashboard Serializer**: Gathers monthly transactions, profit margins, product categories, and regional footprints into an optimized JSON context prompt.
- **JSON Parser**: Parses raw Gemini content into type-safe card objects sorted into three columns: **Trends**, **Concerns**, and **Tactical Recommendations**.
- **Interactive Skeleton Block**: Renders pulse skeleton loading blocks while processing API responses.

### 3. AI Sales Forecast & Simulator Workspace
- **6-Month Revenue Forecast**: Combines historical sales indexes with future projections using a dashed Recharts LineChart and shaded confidence interval boundaries.
- **Growth Initiatives Simulator**: Provides a range slider (5% to 30% targets) and risk tolerance profile buttons (`Low`, `Medium`, `High`) that dynamically recalculate business initiatives.
- **Tactical Strategy Playbooks**: Computes custom actions (dynamic pricing, mid-market cohort emails, predictive inventory stocking) with cost estimates and expected impact indexes.

### 4. Interactive Analytics Ledger Views
- **Revenue & Profit Tracking**: Modernized charts using SVG gradients, customized tooltips, and interactive sidebar slicers.
- **Products Ledger**: Lists inventory turnover and categories with dynamic horizontal progress bars.
- **Customers & Segment Analysis**: Maps Enterprise, Mid-Market, and SMB revenues, complete with interactive sorting keys.
- **Orders ledger (with Search Bug Fix)**: Implemented search queries that filter orders dynamically, styled with transparent fulfillment status badges.
- **Settings & Sandbox**: Integrates database footprint tracking, factory reset seeding, and a console mock terminal to run custom relational queries.

### 5. Premium Workspace Backdrop
- **Blueprint Dots Pattern**: Body layer styled with radial gradients and a subtle dots grid layout for dark/light modes.
- **Quick Date Slicers**: Segmented header controls (`ALL TIME`, `2026`, `2025`) for quick filtering without opening date pickers.
- **Stripe-Style Collapsible Sidebar**: Square tile containers wrapping icons and vertical indicator pills matching selected menu themes.

---

## 🛠️ Technology Stack & Rationale

We selected this stack to provide a highly performant, modular, and visual frontend layer:

### 1. React (TypeScript)
- **Why**: TypeScript provides complete compile-time type safety for complex sales schemas (orders, customers, products). React's virtual DOM diffing ensures real-time updates when toggling date range filters or importing datasets.

### 2. Vite
- **Why**: Replaces heavy webpack setups with ES module compilation, providing sub-second Hot Module Replacement (HMR) during developer pairing and compact tree-shaken static production bundles.

### 3. Tailwind CSS (v4)
- **Why**: Utility-first CSS class structure enables rapid glassmorphic prototyping (e.g. `backdrop-blur-md`, `bg-white/80`). Version 4 native css styling maps theme properties directly into standard stylesheets without external parser overhead.

### 4. Recharts (SVG Graphing)
- **Why**: Recharts provides declarative, responsive React graph components that scale fluidly. Unlike canvas charts, SVG elements can be styled with standard CSS gradients and custom tooltip modules.

### 5. PapaParse
- **Why**: A fast, browser-based CSV parser that handles large transaction rows without blocking the main UI thread.

### 6. LocalStorage API & Custom Events
- **Why**: AeroSales runs entirely in the browser to maintain data privacy. Relational indexes (orders, products, customers) are cached locally and synchronized across widgets using decoupled event listeners (`sales_db_update` and `sales_user_update`).

---

## 🧠 AI Architecture

The application implements a local client-side prompt engineering model:

1. **State Aggregation**: A serializer script formats active sales databases into:
   ```json
   {
     "kpis": { "revenue": 142000, "profit": 56000, "ordersCount": 182 },
     "topCategories": ["Electronics", "Clothing"],
     "monthlyTrends": [{ "month": "Jan", "revenue": 12000 }]
   }
   ```
2. **API Handshake**: Dispatches requests directly to Google Generative Language servers using the browser's native `fetch` client to bypass intermediate Node server setups.
3. **Prompt Conditioning**: Commands the Gemini model to output responses strictly in JSON matching this schema:
   ```typescript
   interface GeminiInsightsResponse {
     insights: Array<{
       type: 'trend' | 'concern' | 'recommendation';
       title: string;
       description: string;
       metricChange?: string;
     }>;
   }
   ```
4. **Fallback Handling**: If the API key is unconfigured or rate-limited, local analytics fallback functions dynamically calculate statistical insights to maintain continuous operations.
