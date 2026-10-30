# Vantage client

The React storefront and admin area for Vantage, built with Vite. For setup, the API and the full project overview, see the [main README](../README.md).

## Run it

The client expects the API on `http://localhost:5000`. The easiest way to start both is from the project root:

```bash
npm run dev
```

To run only the client:

```bash
cd client
npm install
npm run dev        # http://localhost:5173
```

| Command           | What it does |
| ----------------- | ------------ |
| `npm run dev`     | Start the Vite dev server |
| `npm run build`   | Build for production into `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint`    | Lint with Oxlint |

## Talking to the API

All requests go through the Axios instance in [src/api/axios.js](src/api/axios.js). Its base URL is `/api`, and in development [vite.config.js](vite.config.js) forwards `/api` to `http://localhost:5000`, so no `.env` file is needed.

For a production build that talks to a separate API, set `VITE_API_URL` when building:

```bash
VITE_API_URL=https://api.example.com/api npm run build
```

## Folder guide

```
src/
├── api/axios.js         Axios instance; adds the login token to every request
├── components/          Header, Footer, AnnouncementBar, ProductCard, AdminNav,
│                        ProtectedRoute (logged in) and AdminRoute (admins only)
├── context/
│   ├── AuthContext.jsx  Logged-in user, login, register and logout
│   └── CartContext.jsx  Bag items, totals and delivery fee
├── pages/               Home, Collection, Product, Cart, Checkout, Orders,
│   │                    Login, Register, ComingSoon (404)
│   └── admin/           AdminProducts, ProductForm, AdminOrders
├── styles/              Plain CSS: global plus one file per area
├── utils/
│   ├── collections.js   Title, intro, API gender and categories for each collection
│   └── format.js        formatLKR(5650) → "LKR 5,650.00"
├── App.jsx              Routes
└── main.jsx             Entry point; wraps the app in the router, auth and cart providers
```

## Routes

| Path                         | Page | Access |
| ---------------------------- | ---- | ------ |
| `/`                          | Home | Public |
| `/collections/:gender`       | `women`, `men` or `accessories`; supports `?category=`, `?sort=`, `?page=` | Public |
| `/products/:slug`            | Product page; `?colour=` picks the starting colour | Public |
| `/cart`                      | Bag | Public |
| `/login`, `/register`        | Log in, create an account | Public |
| `/checkout`, `/orders`       | Checkout, my orders | Logged in |
| `/admin`, `/admin/products`  | Product list | Admin |
| `/admin/products/new`        | Add a product | Admin |
| `/admin/products/:slug/edit` | Edit a product | Admin |
| `/admin/orders`              | All orders | Admin |

## State in the browser

| `localStorage` key | Holds | Managed by |
| ------------------ | ----- | ---------- |
| `vantage-user`     | The logged-in user and their token | `AuthContext` |
| `vantage-cart`     | Bag items (product, colour, size, quantity, price, stock limit) | `CartContext` |

The bag shows prices for display only. At checkout the client sends just the product ID, colour, size and quantity, and the server works out the real prices and totals.

Delivery rules live in `CartContext` (`DELIVERY_FEE = 450`, `FREE_DELIVERY = 15000`) and must match the values in `server/controllers/orderController.js`.
