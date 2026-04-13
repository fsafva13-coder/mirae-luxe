# MIRAÉ LUXE 💎
### *Elevate Your Beauty Ritual — A Full-Stack Luxury Beauty E-Commerce Platform*

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react&logoColor=white)
![.NET](https://img.shields.io/badge/.NET_Core-10.0-512BD4?style=flat&logo=dotnet&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Railway-336791?style=flat&logo=postgresql&logoColor=white)
![Groq AI](https://img.shields.io/badge/Groq_AI-LLaMA_3.3-FF6B35?style=flat)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)
![Status](https://img.shields.io/badge/Status-Completed-brightgreen?style=flat)

---

## 📌 Project Overview

**MIRAÉ LUXE** is a production-ready, full-stack luxury beauty e-commerce platform designed to deliver a seamless, premium shopping experience for skincare and makeup enthusiasts. The platform solves the fragmented online beauty shopping experience by combining intelligent product discovery (AI assistant + skin quiz), a complete purchase lifecycle (cart, checkout, orders), and a loyalty membership system — all within a cohesive, brand-consistent UI.

Built as a team capstone project for the University of West London (2026), MIRAÉ LUXE demonstrates end-to-end software engineering across frontend, backend, database, and AI integration layers.

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| **Frontend (Vercel)** | [https://mirae-luxe.vercel.app](https://mirae-luxe.vercel.app) |
| **Backend (Railway)** | [https://mirae-luxe-production.up.railway.app](https://mirae-luxe-production.up.railway.app) |
| **Database** | PostgreSQL on Railway |

---

## ✨ Features

- 🛍️ **Product Catalogue** — 152 products (64 skincare + 88 makeup) with filtering, sorting, and category browsing
- 🤖 **AI Beauty Assistant** — Real-time conversational AI powered by Groq (LLaMA 3.3-70B) with full store context
- 🧴 **Personalised Skin Quiz** — Multi-step quiz with backend-driven recommendations grouped by concern
- 🛒 **Full Cart System** — Add, update quantity, remove items, clear cart with real-time subtotal calculation
- 💖 **Wishlist** — Save products, move to cart, manage favourites
- 💳 **Checkout & Orders** — Simulated payment, order placement, tracking number generation, order history
- 💎 **Premium Membership** — AED 99/year with 15% discount, free shipping, and free gift on every order
- 🔐 **Authentication** — JWT-based register/login with protected routes
- 📦 **Order Management** — Full order history with item breakdown, discount savings, and tracking
- 🎨 **AI-Generated Product Imagery** — All product visuals created using AI image generation tools
- 🌱 **100% Vegan & Cruelty-Free** — Brand values reflected throughout the platform
- 📱 **Responsive Design** — Optimised for desktop and mobile

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js 18, React Router v6, Axios, CSS3 |
| **Backend** | ASP.NET Core (.NET 10), Entity Framework Core |
| **Database** | PostgreSQL (Railway), EF Core Migrations |
| **Authentication** | ASP.NET Core Identity, JWT Bearer Tokens |
| **AI Chat** | Groq Cloud API — LLaMA 3.3-70B Versatile |
| **AI Imagery** | AI image generation tools (product visuals) |
| **Image Hosting** | ImgBB |
| **Version Control** | Git, GitHub |
| **Dev Tools** | Visual Studio 2022, VS Code, Postman |
| **Deployment** | Vercel (Frontend), Railway (Backend + Database) |

---

## 📸 Screenshots

> *Replace placeholders below with actual screenshots*

### 🏠 Homepage & Best Sellers
![Homepage](https://via.placeholder.com/800x450?text=MIRAÉ+LUXE+Homepage)

### 🛍️ Shop All — Product Catalogue
![Shop Page](https://via.placeholder.com/800x450?text=Shop+All+Page+with+Filters)

### 🧴 Product Detail Page
![Product Detail](https://via.placeholder.com/800x450?text=Product+Detail+Page)

### 🛒 Shopping Cart
![Cart](https://via.placeholder.com/800x450?text=Shopping+Cart)

### 💳 Checkout
![Checkout](https://via.placeholder.com/800x450?text=Checkout+Page)

### 🧪 Skin Quiz & Recommendations
![Skin Quiz](https://via.placeholder.com/800x450?text=Skin+Quiz+Results)

### 💎 Membership Page
![Membership](https://via.placeholder.com/800x450?text=Membership+Page)

### 🤖 AI Beauty Assistant
![ChatBot](https://via.placeholder.com/800x450?text=AI+Beauty+Assistant+Chat)

### 👤 My Account — Orders & Profile
![My Account](https://via.placeholder.com/800x450?text=My+Account+Orders+Page)

---

## ⚙️ Installation & Setup

### Prerequisites

- Node.js 18+ and npm
- .NET SDK 10.0
- SQL Server (Express or full) for local development
- Visual Studio 2022
- Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/fsafva13-coder/mirae-luxe.git
cd mirae-luxe
```

---

### 2. Frontend Setup

```bash
cd mirae-luxe-client
npm install
```

Create a `.env` file in `mirae-luxe-client/`:

```env
REACT_APP_GROQ_API_KEY=your_groq_api_key_here
```

> Get a free Groq API key at [console.groq.com](https://console.groq.com)

Start the development server:

```bash
npm start
```

Frontend runs at: `http://localhost:3000`

---

### 3. Backend Setup

1. Open `MiraeLuxe.API/MiraeLuxe.API.sln` in **Visual Studio 2022**
2. Create `appsettings.json` using `appsettings.example.json` as template:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=MiraeLuxeDB;Trusted_Connection=True;TrustServerCertificate=True"
  },
  "JwtSettings": {
    "SecretKey": "your_jwt_secret_key_here",
    "Issuer": "MiraeLuxeAPI",
    "Audience": "MiraeLuxeClient",
    "ExpiryMinutes": 1440
  }
}
```

3. Run database migrations (Package Manager Console):

```bash
Update-Database
```

4. Press ▶ **Run** in Visual Studio

Backend runs at: `https://localhost:7078`

---

### 4. Seed the Database

After the backend is running, use the provided upload tools to seed:

- 64 skincare products
- 88 makeup products
- Reviews (3–5 per product)

---

## 🚀 Usage

### As a Guest User
- Browse all 152 products at `/shop`
- Filter by category, price, and skin type
- View product details and customer reviews
- Take the skin quiz at `/skin-quiz`

### As a Registered User
1. Register or login at `/login`
2. Add products to cart or wishlist
3. Proceed to checkout with shipping address
4. View orders in My Account → Orders
5. Join membership at `/membership` for 15% off all orders

### AI Beauty Assistant
- Click the **Ask AI** button (bottom right on any page)
- Ask about skincare routines, ingredients, product recommendations
- The assistant knows the full product catalogue, pricing, and store policies

---

## 📁 Project Structure

```
mirae-luxe/
│
├── mirae-luxe-client/              # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/             # ProductCard, ProductImage, Header, Footer
│   │   │   ├── layout/
│   │   │   └── ChatBot/            # AI Beauty Assistant (Groq)
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Shop.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Wishlist.jsx
│   │   │   ├── SkinQuiz.jsx
│   │   │   ├── QuizResults.jsx
│   │   │   ├── Membership.jsx
│   │   │   ├── MyAccount.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── About.jsx
│   │   │   └── Contact.jsx
│   │   ├── services/
│   │   │   └── api.js              # Axios API service layer
│   │   └── App.js
│   ├── .env.example
│   └── package.json
│
└── MiraeLuxe.API/                  # ASP.NET Core Backend
    ├── Controllers/
    │   ├── CartController.cs
    │   ├── WishlistController.cs
    │   ├── OrdersController.cs
    │   ├── MembershipController.cs
    │   ├── ProductsController.cs
    │   ├── ReviewsController.cs
    │   ├── QuizController.cs
    │   └── UsersController.cs
    ├── Models/
    │   ├── Product.cs
    │   ├── Cart.cs / CartItem.cs
    │   ├── Order.cs / OrderItem.cs
    │   ├── Wishlist.cs / WishlistItem.cs
    │   ├── Membership.cs
    │   ├── Review.cs
    │   └── ApplicationUser.cs
    ├── Data/
    │   └── ApplicationDbContext.cs
    ├── Migrations/
    ├── appsettings.example.json
    └── Program.cs
```

---

## 📊 Platform Stats

| Metric | Value |
|--------|-------|
| Total Products | 152 (64 Skincare + 88 Makeup) |
| Average Reviews per Product | 3–5 reviews |
| Average Review Rating | 4.5–5.0 ⭐ |
| API Endpoints | 40+ |
| Membership Savings | AED 900+ / year average |
| AI Model | LLaMA 3.3-70B Versatile (Groq) |

---

## 🧠 Challenges & Learnings

**Circular Reference Error** — EF Core's JSON serialiser caused infinite loops between `Product` and `Review` models. Resolved with `[JsonIgnore]` on the navigation property.

**NULL SelectedShade Validation** — .NET 10's nullable reference type enforcement rejected cart requests without the optional `SelectedShade` field. Fixed by marking the DTO property as `string?`.

**PostgreSQL Migration** — Migrated from SQL Server to PostgreSQL for cloud deployment. Required new EF Core migrations and handling of timestamp timezone differences via `AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true)`.

**Membership State Sync** — Frontend `localStorage` fell out of sync with backend membership state across sessions. Fixed by always verifying membership status via API on page load.

**AI Model Deprecation** — `llama3-8b-8192` was decommissioned mid-project. Migrated to `llama-3.3-70b-versatile` with a single line change.

**AI Image Coordination** — Coordinating AI-generated product imagery across team members required a structured shared workflow via Google Drive and standardised ImgBB upload links.

---

## 🔮 Future Improvements

- [ ] **Payment Gateway** — Integrate Stripe or PayPal for real transactions
- [ ] **Admin Dashboard** — Product management, order fulfilment, and analytics panel
- [ ] **Email Notifications** — Order confirmations and shipping updates via SendGrid
- [ ] **Full-Text Search** — Elasticsearch or Azure Cognitive Search integration
- [ ] **Review Submission** — Allow authenticated customers to write and submit reviews
- [ ] **Social Login** — Google/Facebook OAuth via ASP.NET Identity
- [ ] **Mobile App** — React Native version for iOS and Android
- [ ] **Inventory Alerts** — Low stock notifications for admin management
- [ ] **Internationalisation** — Multi-currency and multi-language support

---

## 👥 Team & Contributions

| Member | Belbin Role(s) | Key Contributions |
|--------|---------------|------------------|
| **Fathima Safva** | Coordinator · Shaper · Completer Finisher | Backend & frontend development (ASP.NET Core + React), API integration, JWT authentication, AI chatbot integration, AI product image integration, reviewing team work, guiding members, Google Drive organisation, GitHub management |
| **Fathimath Neha Mirsa Sajid** | Plant · Specialist | AI skincare product image creation, major contributor to AI visuals, uploading images and sharing ImgBB links for frontend integration, PowerPoint presentation creation |
| **Asna Haris** | Monitor Evaluator · Completer Finisher | Documentation writing, wireframe creation, Google Drive monitoring and file checking, logo creation, reviewing website visuals, UI/UX improvement suggestions |
| **Nishna Valiyakath Noushad** | Implementer · Resource Investigator · Teamworker | Project diagrams (Gantt Chart, WBS, ERD, Use Case Diagram, etc.), social media posting, Gmail communication, logo creation support |
| **Helen Moncy Abraham** | Plant · Resource Investigator | AI makeup product image creation, Instagram account management, uploading images and sharing ImgBB links for frontend integration, PowerPoint presentation creation |
| **All Members** | Teamworker | AI image creation discussions and collaborative group contributions |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🎓 Academic Context

> **University of West London** — Software Engineering Capstone Project, 2026
> This is an educational project. Payment processing is fully simulated and no real transactions occur.

---

<div align="center">
  <p>Made with 💎 by the MIRAÉ LUXE Team</p>
  <p><i>Premium beauty, thoughtfully engineered.</i></p>
</div>
