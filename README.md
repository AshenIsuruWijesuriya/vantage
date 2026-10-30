<div align="center">

# VANTAGE

**Active and lifestyle wear, designed in Sri Lanka.**

A full-stack MERN storefront with a shopping bag, cash-on-delivery checkout and an admin area for products and orders.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20.19%2B-5FA04E?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%209-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Cloudinary](https://img.shields.io/badge/Images-Cloudinary-3448C5?logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Features](#features) · [Quick start](#quick-start) · [API](#api-reference) · [How it works](#how-it-works) · [Roadmap](#roadmap)

</div>

---

## About

Vantage is an online shop for an activewear brand. Shoppers browse the Women's, Men's and Accessories collections, choose a colour and size, and pay the courier in cash when the order arrives. Admins add products with photos, keep stock up to date and move orders from *Pending* to *Delivered*. All prices are in Sri Lankan rupees (LKR).

<!--
## Screenshots

Add images to docs/screenshots/ and uncomment this section.

| Home | Product | Admin orders |
| :--: | :-----: | :----------: |
| ![Home page](docs/screenshots/home.png) | ![Product page](docs/screenshots/product.png) | ![Admin orders](docs/screenshots/admin-orders.png) |
-->

## Features

**Storefront**

- 🏠 Home page with collection tiles and featured products
- 🗂️ Collections with category filters, sorting and pagination, all kept in the URL
- 🎨 Colour swatches that switch photos, plus a per-colour photo gallery
- 📏 Size picker that disables sold-out sizes and warns when stock is low
- 👜 Bag saved in the browser, with a progress bar towards free delivery
- 🚚 Checkout for all 25 districts of Sri Lanka, with cash on delivery
- 📦 Order history with status tracking

**Admin**

- 🧾 Product table with stock status at a glance
- ✏️ Product form with colours, size presets, stock per size and up to 8 photos per colour (uploaded to Cloudinary)
- 🔄 Orders table with status filters; cancelling an order puts the stock back

**Under the hood**

- 🔐 JWT login with bcrypt-hashed passwords and admin-only routes
- 💰 Prices and totals are always worked out on the server
- 🧮 Stock is reserved safely, so two shoppers can't buy the last item twice

## Tech stack

| Layer    | Tools |
| -------- | ----- |
| Client   | React 19, Vite 8, React Router 7, Axios, plain CSS, Oxlint |
| Server   | Node.js, Express 5 (ES modules), Mongoose 9, JSON Web Tokens, bcryptjs, Multer, Morgan, CORS, dotenv |
| Database | MongoDB (Atlas recommended) |
| Images   | Cloudinary |
| Tooling  | `concurrently`, `nodemon` |

## Quick start

**You'll need:** Node.js 20.19+ or 22.12+, a MongoDB database ([Atlas](https://www.mongodb.com/atlas) free tier works), and a [Cloudinary](https://cloudinary.com/) account if you want to upload product photos.

```bash
# 1. Clone
git clone https://github.com/AshenIsuruWijesuriya/vantage.git
cd vantage

# 2. Install (root, server and client)
npm install
npm install --prefix server
npm install --prefix client

# 3. Configure, then edit server/.env with your own values
cp server/.env.example server/.env

# 4. Load sample data (wipes the database first)
npm run seed --prefix server

# 5. Run the API and the client together
npm run dev
```

Open **http://localhost:5173**. The API runs at http://localhost:5000 (health check: `/api/health`).

> [!WARNING]
> `npm run seed` deletes **all** orders, products and users before importing the sample data.

### Demo accounts

Seeding adds 13 sample products and these accounts:

| Role     | Email                 | Password                        |
| -------- | --------------------- | ------------------------------- |
| Admin    | `admin@vantage.lk`    | `ADMIN_PASSWORD` from `.env`    |
| Customer | `customer@vantage.lk` | `CUSTOMER_PASSWORD` from `.env` |

Log in as the admin and click **Admin** in the header to manage products and orders.

> [!NOTE]
> The sample products point at photo paths that aren't in the repository, so they show a panel in the product's colour until you upload photos from the admin product form.

<details>
<summary><strong>Environment variables</strong> (<code>server/.env</code>)</summary>

<br>

| Variable                | Description |
| ----------------------- | ----------- |
| `PORT`                  | Port the API listens on, e.g. `5000` |
| `MONGO_URI`             | MongoDB connection string |
| `JWT_SECRET`            | Long random string used to sign login tokens |
| `CLIENT_URL`            | Origin allowed by CORS, e.g. `http://localhost:5173` |
| `NODE_ENV`              | `development` turns on request logging; anything except `production` adds stack traces to errors |
| `ADMIN_PASSWORD`        | Seeded admin's password (8+ characters) |
| `CUSTOMER_PASSWORD`     | Seeded customer's password (8+ characters) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY`    | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

`.env` files are git-ignored. Never commit real credentials.

The client needs no `.env` in development because Vite forwards `/api` to `http://localhost:5000`. For a production build that talks to a different API, set `VITE_API_URL` (e.g. `https://api.example.com/api`).

</details>

<details>
<summary><strong>All scripts</strong></summary>

<br>

| Where  | Command                | What it does |
| ------ | ---------------------- | ------------ |
| root   | `npm run dev`          | Run the server and client together |
| root   | `npm run dev:server`   | Run only the server |
| root   | `npm run dev:client`   | Run only the client |
| server | `npm run dev`          | Start the API with `nodemon` |
| server | `npm start`            | Start the API with Node |
| server | `npm run seed`         | Replace all data with the sample products and users |
| server | `npm run seed:destroy` | Delete all orders, products and users |
| client | `npm run dev`          | Start the Vite dev server |
| client | `npm run build`        | Build for production into `client/dist` |
| client | `npm run preview`      | Preview the production build |
| client | `npm run lint`         | Lint with Oxlint |

</details>

## Project structure

```
vantage/
├── client/                  React + Vite storefront and admin area (see client/README.md)
│   └── src/
│       ├── api/             Axios instance that attaches the login token
│       ├── components/      Header, footer, product card, route guards
│       ├── context/         Auth and cart state
│       ├── pages/           Storefront pages, plus admin/ for the admin area
│       ├── styles/          Plain CSS, one file per area
│       └── utils/           Collection settings and LKR formatting
├── server/                  Express REST API
│   ├── config/              MongoDB and Cloudinary setup
│   ├── controllers/         Product, user and order handlers
│   ├── data/                Seed products and users
│   ├── middleware/          Auth guards and error handling
│   ├── models/              Product, User and Order schemas
│   ├── routes/              products, users, orders, upload
│   ├── seeder.js            Imports or clears sample data
│   └── server.js            App entry point
└── package.json             Root scripts that run both apps
```

## API reference

Base URL: `http://localhost:5000/api`. Protected endpoints need the token from register or login:

```
Authorization: Bearer <token>
```

| Method | Endpoint             | Access    | Description |
| ------ | -------------------- | --------- | ----------- |
| GET    | `/health`            | Public    | Returns `{ "status": "ok" }` |
| POST   | `/users/register`    | Public    | Create an account |
| POST   | `/users/login`       | Public    | Log in |
| GET    | `/users/me`          | Logged in | The current user |
| GET    | `/products`          | Public    | List products (filters, sorting, pages) |
| GET    | `/products/:slug`    | Public    | One product by slug |
| POST   | `/products`          | Admin     | Create a product |
| PUT    | `/products/:id`      | Admin     | Update a product |
| DELETE | `/products/:id`      | Admin     | Delete a product |
| POST   | `/orders`            | Logged in | Place an order |
| GET    | `/orders/mine`       | Logged in | The current user's orders |
| GET    | `/orders`            | Admin     | All orders |
| PUT    | `/orders/:id/status` | Admin     | Change an order's status |
| POST   | `/upload`            | Admin     | Upload product photos to Cloudinary |

<details>
<summary><strong>Users</strong>: register and login</summary>

<br>

`POST /users/register` takes `{ name, email, password }` and `POST /users/login` takes `{ email, password }`. Both return the user and a token:

```json
{
  "_id": "665f...",
  "name": "Test Customer",
  "email": "customer@vantage.lk",
  "isAdmin": false,
  "token": "eyJhbGciOi..."
}
```

Tokens last 7 days. Passwords need at least 8 characters, and emails are stored in lowercase.

</details>

<details>
<summary><strong>Products</strong>: <code>GET /products</code> query parameters</summary>

<br>

All parameters are optional.

| Parameter  | Values | Notes |
| ---------- | ------ | ----- |
| `gender`   | `men`, `women`, `unisex` | Unisex products are always included |
| `category` | `tees`, `tanks`, `joggers`, `shorts`, `jackets`, `leggings`, `sports-bras`, `crop-tops`, `bags`, `bottles`, `caps` | Exact match |
| `activity` | `lifting`, `running`, `rest-day`, `casual`, `pilates-yoga` | |
| `featured` | `true` | Featured products only |
| `keyword`  | any text | Case-insensitive search on the name |
| `sort`     | `newest` (default), `price-asc`, `price-desc` | |
| `page`     | number, default `1` | 12 per page |

```
GET /api/products?gender=women&category=leggings&sort=price-asc&page=1
```

```json
{ "products": [ /* ... */ ], "page": 1, "pages": 3, "count": 30 }
```

`POST` and `PUT` take a body shaped like the [Product model](#data-models).

</details>

<details>
<summary><strong>Orders</strong>: placing an order and changing its status</summary>

<br>

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

The server fills in each item's name, photo and price, works out the totals and returns the saved order with status `Pending`.

`PUT /orders/:id/status` takes `{ "status": "Shipped" }`. Allowed values: `Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`.

</details>

<details>
<summary><strong>Upload</strong>: product photos</summary>

<br>

Send `multipart/form-data` with the files in a field named `images`: up to 8 files, 5 MB each, in JPG, PNG, WebP or AVIF format. Photos wider than 1600px are scaled down and stored in the `vantage/products` Cloudinary folder.

```json
{ "urls": ["https://res.cloudinary.com/..."] }
```

</details>

<details>
<summary><strong>Errors</strong></summary>

<br>

Errors return JSON with a matching status code, e.g. `{ "message": "Product not found" }`.

| Situation | Status |
| --------- | ------ |
| Missing or invalid fields, duplicate email or slug, invalid JSON, bad upload | `400` |
| Not logged in, or token expired | `401` |
| Logged in but not an admin | `403` |
| Unknown route, or an ID that isn't valid | `404` |
| Anything else | `500` |

Outside `production`, responses also include a `stack` field.

</details>

## How it works

<details>
<summary><strong>Login and admin access</strong></summary>

<br>

Register and login return a JWT signed with `JWT_SECRET`. The client keeps the user in `localStorage` and an Axios interceptor adds the token to every request. On the server, `protect` checks the token and `admin` allows only users with `isAdmin: true`. If a request comes back `401`, for example because the token has expired, the client logs the user out.

In the browser, logged-out visitors are sent to the login page and brought back afterwards, and customers who open an admin page are sent home. The server checks admin rights on every request either way.

</details>

<details>
<summary><strong>Delivery and pricing</strong></summary>

<br>

- Delivery is **LKR 450**, or **free from LKR 15,000**. The bag, checkout and server all use the same rule, and the server's figure is the one saved.
- Payment is cash on delivery.
- A product is on sale when its `compareAtPrice` is higher than its `price`.

</details>

<details>
<summary><strong>Placing an order</strong></summary>

<br>

1. The server checks that the bag isn't empty and every address field is filled in.
2. It loads each product, checks the colour, size and quantity, and uses the **database** price.
3. It takes the stock one item at a time, only if enough is left. If an item has just sold out, the stock already taken goes back and the order is rejected.
4. It works out the totals and saves the order. If saving fails, the stock goes back.

</details>

<details>
<summary><strong>Cancelling an order</strong></summary>

<br>

A status change happens in one database step that skips orders that are already cancelled, so two cancel requests at once can't restock the items twice. Cancelling puts the items back in stock, and a cancelled order can't be changed again.

</details>

<details>
<summary><strong>Collections and photos</strong></summary>

<br>

Each collection maps to an API gender and a set of categories ([client/src/utils/collections.js](client/src/utils/collections.js)):

| Collection  | API gender | Categories |
| ----------- | ---------- | ---------- |
| Women's     | `women`    | leggings, sports bras, crop tops, shorts |
| Men's       | `men`      | tees, joggers, shorts, tanks, jackets |
| Accessories | `unisex`   | bags, bottles, caps |

Each colour has its own photos, and the first one is the main photo. When an admin saves a product, the photos of the first colour that has any are copied to the product's `images` field. If a colour has no photos, or a photo fails to load, the site shows a panel in that colour instead.

</details>

## Data models

<details>
<summary><strong>Product, User and Order</strong></summary>

<br>

All models have `createdAt` and `updatedAt` timestamps.

**Product**

| Field            | Type | Notes |
| ---------------- | ---- | ----- |
| `name`           | String | Required |
| `slug`           | String | Required, unique, lowercase; used in URLs |
| `description`    | String | |
| `gender`         | String | `men`, `women` or `unisex`; required |
| `category`       | String | Required, e.g. `tees`, `leggings`, `bags` |
| `activities`     | [String] | `lifting`, `running`, `rest-day`, `casual`, `pilates-yoga` |
| `price`          | Number | LKR, required, 0 or more |
| `compareAtPrice` | Number | Old price for sale items; default `0` |
| `images`         | [String] | Main photos |
| `colours`        | [{ `name`, `hex`, `images[]` }] | Each colour has its own photos |
| `sizes`          | [{ `size`, `stock` }] | Stock can't go below 0 |
| `badge`          | String | e.g. "New", "Best seller" |
| `isFeatured`     | Boolean | Shown on the home page |

**User**

| Field      | Type | Notes |
| ---------- | ---- | ----- |
| `name`     | String | Required |
| `email`    | String | Required, unique, lowercase |
| `password` | String | Required, 8+ characters, bcrypt-hashed, hidden from queries by default |
| `isAdmin`  | Boolean | Default `false` |

**Order**

| Field             | Type | Notes |
| ----------------- | ---- | ----- |
| `user`            | ObjectId → User | Required |
| `items`           | [{ `product`, `name`, `image`, `price`, `colour`, `size`, `qty` }] | A copy of each item at the time of ordering |
| `shippingAddress` | { `fullName`, `phone`, `address`, `city`, `district` } | All required |
| `paymentMethod`   | String | Default "Cash on delivery" |
| `itemsPrice`      | Number | Subtotal |
| `shippingPrice`   | Number | `0` or `450` |
| `totalPrice`      | Number | Subtotal plus delivery |
| `status`          | String | `Pending` (default), `Processing`, `Shipped`, `Delivered`, `Cancelled` |

</details>

## Roadmap

- [x] Express API, MongoDB models and error handling
- [x] Product API with filters, sorting and pagination
- [x] Sample data seeder
- [x] Registration and login with JWT
- [x] Storefront: home, collections, product page, bag and checkout
- [x] Order placement and order history
- [x] Admin area: products (with Cloudinary uploads) and orders
- [ ] Search box in the storefront (the API already supports `keyword`)
- [ ] Help pages: returns and exchanges, shipping, contact
- [ ] Deployment

## Contributing

Work happens on feature branches named `feature/<step>-<topic>` and is merged into `main` through pull requests. Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/), for example `feat(server): add product controller`.

## License

Released under the [MIT License](LICENSE). © 2026 Ashen Isuru Wijesuriya
