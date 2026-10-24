# Vantage

A MERN (MongoDB, Express, React, Node.js) storefront for **Vantage**, an active and lifestyle wear brand. Shoppers can browse products by gender, category and activity (lifting, running, pilates/yoga and more), and place orders paid by cash on delivery. Prices are in Sri Lankan rupees (LKR).

> **Status:** in active development. The backend API and data models are being built step by step; the React client is still the Vite starter template. See [Roadmap](#roadmap).

## Tech stack

| Layer    | Tools |
| -------- | ----- |
| Client   | React 19, Vite, React Router, Axios, Oxlint |
| Server   | Node.js, Express 5, Mongoose, JSON Web Tokens, bcryptjs, Morgan, CORS |
| Database | MongoDB (MongoDB Atlas recommended) |
| Tooling  | `concurrently` (runs client and server together), `nodemon` |

## Project structure

```
vantage/
├── client/                 # React + Vite frontend
│   ├── public/
│   └── src/
├── server/                 # Express REST API (ES modules)
│   ├── config/db.js        # MongoDB connection
│   ├── controllers/        # Route handlers
│   ├── middleware/         # 404 and error handling
│   ├── models/             # Product, User, Order schemas
│   ├── routes/             # Express routers
│   ├── .env.example        # Environment variable template
│   └── server.js           # App entry point
└── package.json            # Root scripts to run client and server together
```

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 20.19+ or 22.12+ (required by Vite)
- npm
- A MongoDB database, either a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster or a local MongoDB instance

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

| Variable     | Description | Example |
| ------------ | ----------- | ------- |
| `PORT`       | Port the API listens on | `5000` |
| `MONGO_URI`  | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/vantage` |
| `JWT_SECRET` | Secret used to sign auth tokens; use a long random string | `a_long_random_string` |
| `CLIENT_URL` | Origin allowed by CORS (the Vite dev server) | `http://localhost:5173` |
| `NODE_ENV`   | `development` enables request logging and error stack traces | `development` |

`.env` files are git-ignored. Never commit real credentials.

### 4. Run the app

From the project root:

```bash
npm run dev
```

This starts both apps:

- API at http://localhost:5000 (check http://localhost:5000/api/health)
- Client at http://localhost:5173

## Scripts

**Root**

| Command              | Description |
| -------------------- | ----------- |
| `npm run dev`        | Run server and client together |
| `npm run dev:server` | Run only the server |
| `npm run dev:client` | Run only the client |

**Server** (`cd server`)

| Command         | Description |
| --------------- | ----------- |
| `npm run dev`   | Start the API with `nodemon` (auto-restart on changes) |
| `npm start`     | Start the API with Node |

`npm run seed` and `npm run seed:destroy` are defined, but `seeder.js` has not been added yet.

**Client** (`cd client`)

| Command           | Description |
| ----------------- | ----------- |
| `npm run dev`     | Start the Vite dev server |
| `npm run build`   | Build for production into `client/dist` |
| `npm run preview` | Preview the production build |
| `npm run lint`    | Lint with Oxlint |

## API reference

Base URL: `http://localhost:5000/api`

### Health

| Method | Endpoint  | Description |
| ------ | --------- | ----------- |
| GET    | `/health` | Returns `{ "status": "ok" }` |

### Products

| Method | Endpoint          | Access | Description |
| ------ | ----------------- | ------ | ----------- |
| GET    | `/products`       | Public | List products with filters, sorting and pagination |
| GET    | `/products/:slug` | Public | Get one product by its slug |

#### `GET /products` query parameters

All parameters are optional.

| Parameter  | Values | Notes |
| ---------- | ------ | ----- |
| `gender`   | `men`, `women`, `unisex` | `men` or `women` also include unisex products |
| `category` | e.g. `tees`, `joggers`, `leggings`, `sports-bras`, `bags` | Exact match |
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

### Errors

Errors return JSON with a matching HTTP status code:

```json
{ "message": "Product not found" }
```

Unknown routes return `404`. When `NODE_ENV` is not `production`, the response also includes a `stack` field.

## Data models

**Product**: `name`, `slug` (unique), `description`, `gender` (`men` / `women` / `unisex`), `category`, `activities[]`, `price` (LKR), `compareAtPrice` (original price for sale items), `images[]`, `colours[]` (`name`, `hex`), `sizes[]` (`size`, `stock`), `badge` (e.g. "New", "Best seller"), `isFeatured`.

**User**: `name`, `email` (unique), `password` (hashed with bcrypt and left out of queries by default), `isAdmin`.

**Order**: `user`, `items[]` (product, name, image, price, colour, size, qty), `shippingAddress` (full name, phone, address, city, district), `paymentMethod` (default "Cash on delivery"), `itemsPrice`, `shippingPrice`, `totalPrice`, `status` (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).

All models include `createdAt` and `updatedAt` timestamps.

## Roadmap

- [x] Project setup: Vite React client, Express server, root dev script
- [x] Express server, MongoDB connection and error handling
- [x] Product, User and Order models
- [x] Public product API (list and detail)
- [ ] Database seeder with sample products
- [ ] User registration and login with JWT
- [ ] Admin product management (create, update, delete)
- [ ] Order placement and order history
- [ ] Storefront UI: home, product listing, product detail, cart and checkout
- [ ] Admin dashboard
- [ ] Deployment

## Contributing

Work happens on feature branches named `feature/<step>-<topic>` and is merged into `main` through pull requests. Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/), for example `feat(server): add product controller`.

## License

Released under the [MIT License](LICENSE). © 2026 Ashen Isuru Wijesuriya
