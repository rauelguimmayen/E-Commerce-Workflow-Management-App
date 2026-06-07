# GlobalCArt

A front-end e-commerce app built with **Vue JS** , deployable to **Vercel** in minutes.

---

## Architecture

```
E-Commerce-Workflow-Management-App/
├── .gitignore              
├── .index.html 								
├── package-lock.json
├── package.json
├── README.md
├── .vscode/
│    └── extensions.json 
├── public/
│	 └── globalcart.svg
└── src/
	 ├── components/
	 │	  ├── AdminView.vue
	 │ 	  ├── CartTable.vue
	 │ 	  ├── NavbarComponent.vue
     │	  ├── ProductCard.vue
	 │	  ├── ProductSearch.vue
	 │    ├── UpdateProfile.vue	
	 │	  └── UserView.vue
	 ├── pages/
	 │	  ├── AddProduct.vue
	 │	  ├── CartView.vue
	 │	  ├── HomePage.Vue 					
	 │    ├── LoginPage.vue
	 │ 	  ├── Logout.vue
	 │    ├── MyOrder.vue
	 │	  ├── OrdersPage.vue
	 │    ├── Product.vue
	 │	  ├── ProductDetails.vue
	 │    ├── RegisterPage.vue
	 │    └── ResetPassword.vue
	 ├── stores/ 
	 │	  └── global.js
	 ├── api.js	  
	 ├── App.vue	  
	 ├── main.js	  
	 └── style.css	  


```

## Deploy to Vercel

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/E-Commerce-Workflow-Management-App.git
git push -u origin main
```

### Step 2 — Vercel, Add New Project

1. In Vercel Import your Git Repository.
2. Import E-Commerce-Workflow-Management-App.
3. In the environment variables panel, set `VITE_ECOMMERCE_WORKFLOW_MANAGEMENT_API` to your API url.
4. Click **Deploy** — deployment starts.

## Run Locally

```bash
# Install dependencies
npm install

# Create your .env file
cp .env.example .env
# Edit .env — set VITE_ECOMMERCE_WORKFLOW_MANAGEMENT_API

# Start frontend 
npm run dev     

```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Defaults to `5173` locally; Render sets this automatically |
| `VITE_ECOMMERCE_WORKFLOW_MANAGEMENT_API` | **Yes** | API connection string |

---

## API Reference

### Users
| Method | Endpoint | Auth   | Description |
|--------|----------|--------|-------------|
| POST   | `/users/register` | — | Register new user |
| POST   | `/users/login`    | — | Login → JWT |
| GET    | `/users/details`  | Bearer | Current user |
| PATCH  | `/users/update-password`  | Bearer | Current user |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/products/active` | — | List active products  |
| GET | `/products/all` | Admin | All products incl. inactive |
| GET | `/products/:productId` | — | Single product |
| POST | `/products/` | Admin | Create product |
| PUT | `/products/:productId/update` | Admin | Update product |
| DELETE | `/products/:productId/delete` | Admin | Delete product |
| POST | `/products/search-by-price` | search product by price|
| POST | `/products/search-by-name` | search product by name |
| PATCH | `/products/:productId/archive` | archive product |
| PATCH | `/products/:productId/activate` | activate product |

### Cart
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET    | `/cart/get-cart` | Bearer | Get cart |
| POST   | `/cart/add-to-cart` | Bearer | Add/increment item |
| PATCH  | `/cart/update-cart-quantity` | Bearer | Update quantity |
| PATCH  | `/cart/:productId/remove-from-cart` | Bearer | Remove item |
| PUT    | `/cart/clear-cart` | Bearer | Clear cart |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/orders/my-orders` | Bearer | User's orders |
| POST| `/orders/checkout` | Bearer | Place order |
| GET | `/orders/all-orders` | Admin | All orders |
| PUT | `/orders/:id/status` | Admin | Update status |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Bootstrap 5.3, Bootstrap Icons, Vue js |
| Backend | Node.js 18+, Express 4 |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Hosting | Vercel (single Web Service) |
| DB Hosting | MongoDB Atlas (M0 free tier) |
