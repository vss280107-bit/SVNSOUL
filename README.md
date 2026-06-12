# SVNSOUL — Full Stack E-Commerce

Dark aesthetic clothing brand. Built with React + Node/Express + MongoDB + Razorpay.

---

## QUICK START

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas free tier)
- Razorpay account (free test keys at razorpay.com)

---

### 1. Clone / Download
```bash
cd /Users/vanshikasaxena/Downloads/svnsoul
cd svnsoul
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env — add your MongoDB URI and Razorpay keys
npm run dev
```
Backend runs on http://localhost:5000

On first start, the DB auto-seeds with:
- 8 products
- Admin account: admin@svnsoul.in / admin123

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend runs on http://localhost:3000

---

## RAZORPAY SETUP

1. Go to https://razorpay.com → sign up free
2. Dashboard → Settings → API Keys → Generate Test Key
3. Copy Key ID and Key Secret into backend/.env:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
   ```
4. Test payment card: 4111 1111 1111 1111, any future expiry, any CVV
5. For live payments: replace rzp_test_ keys with rzp_live_ keys

---

## LOGIN CREDENTIALS

### Admin
- URL: Click "Admin" tab on login page
- Email: admin@svnsoul.in
- Password: admin123
- Access: Full product management, order tracking, inventory, revenue dashboard

### Customer
- Register a new account on the Register tab
- Or use any email/password you register with

---

## FEATURES

### Customer
- Browse all products with filters (category, size, price)
- Product detail with size/color selection, stock tracking
- Persistent cart (localStorage)
- Wishlist (saved across sessions)
- Checkout with Razorpay (cards, UPI, netbanking, wallets) or COD
- Promo codes: FLAT10, NEWUSER, SVN20, PHANTOM
- Order history with status timeline
- Product reviews with star ratings
- Size guide, FAQ, Returns pages

### Admin (admin@svnsoul.in)
- Dashboard: revenue, order count, low stock alerts
- Add/edit/delete products with full variant management (size × color × stock)
- View all orders, update status through fulfilment pipeline
- Featured product toggle (shows on homepage)

---

## PROJECT STRUCTURE

```
svnsoul/
├── backend/
│   ├── server.js          # Express app entry point
│   ├── db.js              # MongoDB connection + seeder
│   ├── .env.example       # Environment variables template
│   ├── models/
│   │   ├── User.js        # User schema (customer/admin)
│   │   ├── Product.js     # Product + variants + reviews
│   │   └── Order.js       # Order + Razorpay payment tracking
│   ├── routes/
│   │   ├── auth.js        # Register, login, /me, wishlist
│   │   ├── products.js    # CRUD + reviews
│   │   └── orders.js      # Create order, Razorpay create+verify, status update
│   └── middleware/
│       └── auth.js        # JWT protect + adminOnly guards
│
└── frontend/
    ├── public/index.html  # HTML shell + inline favicon SVG
    └── src/
        ├── App.js         # Page router
        ├── index.js       # React entry
        ├── utils/api.js   # Axios instance with JWT interceptor
        ├── context/
        │   ├── AuthContext.js   # User auth state
        │   └── CartContext.js   # Cart + wishlist + promo codes
        ├── components/
        │   ├── Layout.js        # Header, footer, nav
        │   └── ProductCard.js   # Card, SVG product illustrations, Stars, Tag
        └── pages/
            ├── Home.js          # Hero, featured, brand banner
            ├── Shop.js          # Product grid + filters
            ├── Product.js       # Detail, variants, add to cart, reviews
            ├── Checkout.js      # 3-step checkout + Razorpay integration
            ├── Admin.js         # Full admin dashboard
            ├── Account.js       # Customer orders, profile
            ├── Auth.js          # Login / Register (customer + admin tabs)
            ├── About.js         # Brand story, team
            ├── Contact.js       # Contact form, social links
            └── Misc.js          # Cart, Wishlist, OrderConfirm, FAQ, SizeGuide, Returns
```

---

## API ENDPOINTS

```
POST   /api/auth/register          Register customer
POST   /api/auth/login             Login (customer or admin)
GET    /api/auth/me                Get current user
PUT    /api/auth/wishlist/:id      Toggle wishlist item

GET    /api/products               List with filters
GET    /api/products/:id           Single product
POST   /api/products               Create (admin)
PUT    /api/products/:id           Update (admin)
DELETE /api/products/:id           Soft delete (admin)
POST   /api/products/:id/reviews   Add review (auth)

POST   /api/orders/razorpay/create-order   Create Razorpay order
POST   /api/orders/razorpay/verify         Verify payment signature
POST   /api/orders                         Place order (auth)
GET    /api/orders/my                      Customer's orders
GET    /api/orders                         All orders (admin)
GET    /api/orders/:id                     Single order
PUT    /api/orders/:id/status              Update status (admin)
```

---

## DEPLOYMENT

### Backend (Railway / Render / VPS)
1. Push backend/ to your repo
2. Set environment variables in dashboard
3. Start command: `npm start`

### Frontend (Vercel / Netlify)
1. Set `REACT_APP_API_URL=https://your-backend-url.com/api`
2. Build command: `npm run build`
3. Publish directory: `build`

### Database
- MongoDB Atlas free tier: https://cloud.mongodb.com
- Copy connection string to MONGODB_URI in .env

---

## PROMO CODES
| Code     | Discount |
|----------|----------|
| FLAT10   | 10%      |
| NEWUSER  | 15%      |
| SVN20    | 20%      |
| PHANTOM  | 18%      |
| WELCOME  | 12%      |

---

Built with ♥ for SVNSOUL.
