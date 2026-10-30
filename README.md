# Vantage

A MERN (MongoDB, Express, React, Node.js) storefront for **Vantage**, an active and lifestyle wear brand designed in Sri Lanka. Shoppers browse men's, women's and accessories collections, add items to a bag by colour and size, and place cash-on-delivery orders. Admins manage the catalogue (with photo uploads to Cloudinary) and move orders through their delivery stages. All prices are in Sri Lankan rupees (LKR).

## Contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Client pages](#client-pages)
- [API reference](#api-reference)
- [How it works](#how-it-works)
- [Data models](#data-models)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## Features

### For shoppers

- **Home page** with a hero, a scrolling ticker, collection tiles and up to eight featured products (with loading skeletons and a "Try again" button if the request fails).
- **Collections** for Women, Men and Accessories, with category filter chips, sorting (newest, price low to high, price high to low) and pagination. Filters live in the URL, so a filtered page can be bookmarked or shared.
- **Product cards** with colour swatches; hovering or focusing a swatch switches the photo and the link opens the product in that colour.
- **Product page** with a per-colour photo gallery and thumbnails, size buttons (sold-out sizes are disabled), a "Sale" badge with the old price struck through, and a low-stock note when five or fewer are left.
- **Shopping bag** stored in `localStorage`, so it survives a refresh. Each colour and size combination is its own line, quantities can't go above the stock, and a progress bar shows how much more is needed for free delivery.
- **Accounts**: register and log in with email and password. Login lasts 7 days, and the site logs the user out by itself if the token expires.
- **Checkout** with Sri Lankan delivery details (all 25 districts and a 10-digit mobile number) and cash on delivery.
- **Order history** showing each order's items, delivery address, totals and status, with a confirmation banner after placing an order.

### For admins

- **Products table** showing price, total stock, a stock status pill (In stock, Low, Sizes out, Sold out) and featured flag, with edit and delete (delete asks for confirmation).
- **Product form** for creating and editing products: name with an auto-generated URL slug, description, gender, category, activities, price and "was" price, badge, featured flag, colours with a colour picker, size presets (Men S–XL, Women XS–L, One size) with stock per size, and up to 8 photos per colour uploaded to Cloudinary.
- **Orders table** with status filter chips and counts, expandable order details, and a status dropdown (Pending, Processing, Shipped, Delivered, Cancelled). Cancelling an order puts its items back in stock, and a cancelled order can't be changed again.

### On the server

- Prices and totals are always worked out from the database, never trusted from the browser.
- Stock is reserved atomically per size when an order is placed, and rolled back if any item fails.
- Passwords are hashed with bcrypt and never returned by default.
- Clear JSON error messages for bad IDs, failed validation, duplicate emails or slugs, invalid JSON and upload problems.

## Tech stack

| Layer    | Tools |
| -------- | ----- |
| Client   | React 19, Vite 8, React Router 7, Axios, plain CSS, Oxlint |
| Server   | Node.js, Express 5 (ES modules), Mongoose 9, JSON Web Tokens, bcryptjs, Multer, Cloudinary SDK, Morgan, CORS, dotenv |
| Database | MongoDB (MongoDB Atlas recommended) |
| Images   | Cloudinary |
| Tooling  | `concurrently` (runs client and server together), `nodemon` |

## Project structure

```
vantage/
├── client/                          # React + Vite frontend
│   ├── public/                      # Favicon and static icons
│   ├── src/
│   │   ├── api/axios.js             # Axios instance; attaches the login token
│   │   ├── components/              # Header, Footer, AnnouncementBar, ProductCard,
│   │   │                            # ProtectedRoute, AdminRoute, AdminNav
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Logged-in user, login/register/logout
│   │   │   └── CartContext.jsx      # Bag contents, totals, delivery fee
│   │   ├── pages/                   # Home, Collection, Product, Cart, Checkout,
│   │   │   │                        # Orders, Login, Register, ComingSoon (404)
│   │   │   └── admin/               # AdminProducts, ProductForm, AdminOrders
│   │   ├── styles/                  # global, home, product, cart, checkout, orders, admin
│   │   ├── utils/
│   │   │   ├── collections.js       # What each collection shows
│   │   │   └── format.js            # LKR price formatting
│   │   ├── App.jsx                  # Routes
│   │   └── main.jsx                 # Entry point and providers
│   └── vite.config.js               # Proxies /api to the server in development
├── server/                          # Express REST API
│   ├── config/
│   │   ├── db.js                    # MongoDB connection
│   │   └── cloudinary.js            # Cloudinary setup
│   ├── controllers/                 # product, user and order handlers
│   ├── data/                        # Seed products and users
│   ├── middleware/
│   │   ├── authMiddleware.js        # protect (logged in) and admin
│   │   └── errorMiddleware.js       # 404 and error responses
│   ├── models/                      # Product, User, Order schemas
│   ├── routes/                      # products, users, orders, upload
│   ├── utils/generateToken.js       # Signs 7-day JWTs
│   ├── seeder.js                    # Imports or clears sample data
│   ├── .env.example                 # Environment variable template
│   └── server.js                    # App entry point
└── package.json                     # Root scripts to run client and server together
```

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 20.19+ or 22.12+ (required by Vite)
- npm
- A MongoDB database, either a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster or a local MongoDB instance
- A free [Cloudinary](https://cloudinary.com/) account, needed only for uploading product photos from the admin area

### 1. Clone the repository

```bash
git clone https://github.com/AshenIsuruWijesuriya/vantage.git
cd vantage
```

### 2. Install dependencies

The root, server and client each have their own `package.json`:

```bash
npm install
npm install --prefix server
npm install --prefix client
```

### 3. Configure environment variables

Copy the template and fill in your own values:

```bash
cp server/.env.example server/.env
```

| Variable                | Description | Example |
| ----------------------- | ----------- | ------- |
| `PORT`                  | Port the API listens on | `5000` |
| `MONGO_URI`             | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/vantage` |
| `JWT_SECRET`            | Secret used to sign login tokens; use a long random string | `a_long_random_string` |
| `CLIENT_URL`            | Origin allowed by CORS | `http://localhost:5173` |
| `NODE_ENV`              | `development` turns on request logging; any value other than `production` includes error stack traces | `development` |
| `ADMIN_PASSWORD`        | Password for the seeded admin account (8+ characters) | |
| `CUSTOMER_PASSWORD`     | Password for the seeded customer account (8+ characters) | |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | |
| `CLOUDINARY_API_KEY`    | Cloudinary API key | |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | |

`.env` files are git-ignored. Never commit real credentials.

The client needs no `.env` in development: Vite forwards `/api` requests to `http://localhost:5000`. To point a production build at a different API, set `VITE_API_URL` (for example `https://api.example.com/api`) when building the client.

### 4. Seed the database

```bash
npm run seed --prefix server
```

> **Warning:** seeding first deletes **all** orders, products and users in the database, then imports the sample data.

This adds 13 sample products (6 men's, 4 women's, 3 accessories) and two accounts:

| Account  | Email                 | Password                         |
| -------- | --------------------- | -------------------------------- |
| Admin    | `admin@vantage.lk`    | `ADMIN_PASSWORD` from `.env`     |
| Customer | `customer@vantage.lk` | `CUSTOMER_PASSWORD` from `.env`  |

The sample products point at photo paths (`/images/products/...`) that aren't in the repository, so they show a panel in the product's colour until you upload real photos from the admin product form.

To clear everything without importing, run `npm run seed:destroy --prefix server`.

### 5. Run the app

From the project root:

```bash
npm run dev
```

This starts both apps:

- API at http://localhost:5000 (check http://localhost:5000/api/health)
- Client at http://localhost:5173

Log in as the admin and use the **Admin** link in the header to manage products and orders.

## Scripts

**Root**

| Command              | Description |
| -------------------- | ----------- |
| `npm run dev`        | Run server and client together |
| `npm run dev:server` | Run only the server |
| `npm run dev:client` | Run only the client |

**Server** (`cd server`)

| Command                | Description |
| ---------------------- | ----------- |
| `npm run dev`          | Start the API with `nodemon` (restarts on changes) |
| `npm start`            | Start the API with Node |
| `npm run seed`         | Replace all data with the sample products and users |
| `npm run seed:destroy` | Delete all orders, products and users |

**Client** (`cd client`)

| Command           | Description |
| ----------------- | ----------- |
| `npm run dev`     | Start the Vite dev server |
| `npm run build`   | Build for production into `client/dist` |
| `npm run preview` | Preview the production build |
| `npm run lint`    | Lint with Oxlint |

## Client pages

| Path                          | Page | Access |
| ----------------------------- | ---- | ------ |
| `/`                           | Home | Public |
| `/collections/:gender`        | Collection (`women`, `men` or `accessories`); supports `?category=`, `?sort=` and `?page=` | Public |
| `/products/:slug`             | Product detail; `?colour=` picks the starting colour | Public |
| `/cart`                       | Shopping bag | Public |
| `/login`, `/register`         | Log in, create an account | Public |
| `/checkout`                   | Delivery details and place order | Logged in |
| `/orders`                     | My orders | Logged in |
| `/admin`, `/admin/products`   | Product list | Admin |
| `/admin/products/new`         | Add a product | Admin |
| `/admin/products/:slug/edit`  | Edit a product | Admin |
| `/admin/orders`               | All orders | Admin |
| any other path                | "Page not found" | Public |

Visitors who aren't logged in are sent to `/login` and returned to the page they wanted afterwards. Logged-in customers who open an admin page are sent home.

## API reference

Base URL: `http://localhost:5000/api`

Protected endpoints need the token returned by register or login in an `Authorization` header:

```
Authorization: Bearer <token>
```

### Health

| Method | Endpoint  | Description |
| ------ | --------- | ----------- |
| GET    | `/health` | Returns `{ "status": "ok" }` |

### Users

| Method | Endpoint          | Access    | Description |
| ------ | ----------------- | --------- | ----------- |
| POST   | `/users/register` | Public    | Create an account. Body: `{ name, email, password }` |
| POST   | `/users/login`    | Public    | Log in. Body: `{ email, password }` |
| GET    | `/users/me`       | Logged in | The current user |

Register and login both return:

```json
{
  "_id": "665f...",
  "name": "Test Customer",
  "email": "customer@vantage.lk",
  "isAdmin": false,
  "token": "eyJhbGciOi..."
}
```

Tokens expire after 7 days. Passwords must be at least 8 characters, and emails are stored in lowercase.

### Products

| Method | Endpoint          | Access | Description |
| ------ | ----------------- | ------ | ----------- |
| GET    | `/products`       | Public | List products with filters, sorting and pagination |
| GET    | `/products/:slug` | Public | Get one product by its slug |
| POST   | `/products`       | Admin  | Create a product (body follows the [Product model](#data-models)) |
| PUT    | `/products/:id`   | Admin  | Update a product by its ID |
| DELETE | `/products/:id`   | Admin  | Delete a product by its ID |

#### `GET /products` query parameters

All parameters are optional.

| Parameter  | Values | Notes |
| ---------- | ------ | ----- |
| `gender`   | `men`, `women`, `unisex` | Unisex products are always included, so `men` returns men's and unisex products |
| `category` | `tees`, `tanks`, `joggers`, `shorts`, `jackets`, `leggings`, `sports-bras`, `crop-tops`, `bags`, `bottles`, `caps` | Exact match |
| `activity` | `lifting`, `running`, `rest-day`, `casual`, `pilates-yoga` | |
| `featured` | `true` | Only featured products |
| `keyword`  | any text | Case-insensitive search on product name |
| `sort`     | `newest` (default), `price-asc`, `price-desc` | |
| `page`     | number, default `1` | 12 products per page |

Example:

```
GET /api/products?gender=women&category=leggings&activity=running&sort=price-asc&page=1
```

Response:

```json
{
  "products": [ /* ... */ ],
  "page": 1,
  "pages": 3,
  "count": 30
}
```

### Orders

| Method | Endpoint             | Access    | Description |
| ------ | -------------------- | --------- | ----------- |
| POST   | `/orders`            | Logged in | Place an order |
| GET    | `/orders/mine`       | Logged in | The current user's orders, newest first |
| GET    | `/orders`            | Admin     | All orders with the customer's name and email, newest first |
| PUT    | `/orders/:id/status` | Admin     | Change an order's status. Body: `{ "status": "Shipped" }` |

`POST /orders` body:

```json
{
  "items": [
    { "productId": "665f...", "colour": "Black", "size": "M", "qty": 2 }
  ],
  "shippingAddress": {
    "fullName": "Test Customer",
    "phone": "0771234567",
    "address": "12 Galle Road",
    "city": "Colombo 03",
    "district": "Colombo"
  }
}
```

The server fills in each item's name, photo and price, works out the totals, and returns the saved order with status `Pending`.

### Upload

| Method | Endpoint  | Access | Description |
| ------ | --------- | ------ | ----------- |
| POST   | `/upload` | Admin  | Upload product photos to Cloudinary |

Send `multipart/form-data` with the files in a field named `images`. Up to 8 files per request, 5 MB each, in JPG, PNG, WebP or AVIF format. Photos wider than 1600px are scaled down and stored in the `vantage/products` folder. Response:

```json
{ "urls": ["https://res.cloudinary.com/..."] }
```

### Errors

Errors return JSON with a matching HTTP status code:

```json
{ "message": "Product not found" }
```

| Situation | Status |
| --------- | ------ |
| Missing or invalid fields, duplicate email or slug, invalid JSON, bad upload | `400` |
| Not logged in, or token expired | `401` |
| Logged in but not an admin | `403` |
| Unknown route, or an ID that isn't valid | `404` |
| Anything else | `500` |

When `NODE_ENV` is not `production`, the response also includes a `stack` field.

## How it works

### Authentication

On register or login the server returns a JWT signed with `JWT_SECRET`. The client saves the user and token in `localStorage` (`vantage-user`), and an Axios interceptor adds the token to every request. On the server, `protect` checks the token and loads the user, and `admin` allows only users with `isAdmin: true`. If any request comes back `401`, the client logs the user out.

### Delivery and pricing

- Delivery costs **LKR 450**, or is **free for orders of LKR 15,000 or more**. The same rule is used in the bag, at checkout and on the server, and the server's figure is the one saved.
- Payment is cash on delivery only.
- A product is on sale when its `compareAtPrice` is higher than its `price`.

### Placing an order

1. The server checks that the bag isn't empty and every address field is filled in.
2. It loads each product from the database, checks that the colour and size exist and that the quantity is a whole number in stock, and takes the **database** price.
3. It reduces the stock one item at a time, but only if enough is still left. If one item has just sold out, the stock already taken is put back and the order is rejected.
4. It works out the subtotal, delivery and total, then saves the order. If saving fails, the stock is put back.

### Order status and cancellations

Status changes are made in a single database step that skips orders that are already cancelled. This means two cancel requests at the same time can't both restock the items. Cancelling an order puts its items back in stock, and a cancelled order can't be changed again.

### Product photos

Each colour has its own list of photos; the first is the main photo. When an admin saves a product, the photos of the first colour that has any are also copied to the product's `images` field. If a colour has no photos, or a photo fails to load, the site shows a panel in that colour with the category name.

### Collections

The client maps each collection to an API gender and a set of categories (see [client/src/utils/collections.js](client/src/utils/collections.js)):

| Collection  | API gender | Categories |
| ----------- | ---------- | ---------- |
| Women's     | `women`    | leggings, sports bras, crop tops, shorts |
| Men's       | `men`      | tees, joggers, shorts, tanks, jackets |
| Accessories | `unisex`   | bags, bottles, caps |

## Data models

All models include `createdAt` and `updatedAt` timestamps.

**Product**

| Field            | Type | Notes |
| ---------------- | ---- | ----- |
| `name`           | String | Required |
| `slug`           | String | Required, unique, lowercase; used in product URLs |
| `description`    | String | |
| `gender`         | String | `men`, `women` or `unisex`; required |
| `category`       | String | Required, e.g. `tees`, `leggings`, `bags` |
| `activities`     | [String] | `lifting`, `running`, `rest-day`, `casual`, `pilates-yoga` |
| `price`          | Number | LKR, required, 0 or more |
| `compareAtPrice` | Number | Old price for sale items; default `0` |
| `images`         | [String] | Main photos (copied from the first colour with photos) |
| `colours`        | [{ `name`, `hex`, `images[]` }] | Each colour has its own photos |
| `sizes`          | [{ `size`, `stock` }] | Stock can't go below 0 |
| `badge`          | String | e.g. "New", "Best seller" |
| `isFeatured`     | Boolean | Shown on the home page |

**User**

| Field      | Type | Notes |
| ---------- | ---- | ----- |
| `name`     | String | Required |
| `email`    | String | Required, unique, lowercase |
| `password` | String | Required, 8+ characters, hashed with bcrypt, left out of queries by default |
| `isAdmin`  | Boolean | Default `false` |

**Order**

| Field             | Type | Notes |
| ----------------- | ---- | ----- |
| `user`            | ObjectId → User | Required |
| `items`           | [{ `product`, `name`, `image`, `price`, `colour`, `size`, `qty` }] | A copy of each item as it was when ordered |
| `shippingAddress` | { `fullName`, `phone`, `address`, `city`, `district` } | All required |
| `paymentMethod`   | String | Default "Cash on delivery" |
| `itemsPrice`      | Number | Subtotal |
| `shippingPrice`   | Number | `0` or `450` |
| `totalPrice`      | Number | Subtotal plus delivery |
| `status`          | String | `Pending` (default), `Processing`, `Shipped`, `Delivered`, `Cancelled` |

## Roadmap

- [x] Project setup: Vite React client, Express server, root dev script
- [x] Express server, MongoDB connection and error handling
- [x] Product, User and Order models
- [x] Public product API (list and detail)
- [x] Database seeder with sample products
- [x] User registration and login with JWT
- [x] Admin product management (create, update, delete) with Cloudinary photo uploads
- [x] Order placement and order history
- [x] Storefront UI: home, collections, product detail, bag and checkout
- [x] Admin area: products and orders
- [ ] Search box in the storefront (the API already supports `keyword`)
- [ ] Help pages (returns and exchanges, shipping, contact); the footer links are placeholders for now
- [ ] Deployment

## Contributing

Work happens on feature branches named `feature/<step>-<topic>` and is merged into `main` through pull requests. Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/), for example `feat(server): add product controller`.

Before opening a pull request, run `npm run lint --prefix client` and check that `npm run build --prefix client` succeeds.

## License

Released under the [MIT License](LICENSE). © 2026 Ashen Isuru Wijesuriya
