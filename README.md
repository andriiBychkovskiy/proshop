# ProShop - E-commerce Platform

A full-stack e-commerce application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring modern UI/UX, payment integration, and comprehensive admin functionality.

## 🚀 Features

### Customer Features
- **Product Catalog**: Browse products with search, filtering, and pagination
- **Product Details**: View detailed product information with images and reviews
- **Shopping Cart**: Add/remove items, update quantities, and manage cart
- **User Authentication**: Secure registration and login system
- **Order Management**: Complete checkout process with order tracking
- **Product Reviews**: Rate and review products
- **Search & Filter**: Find products by name, category, or brand
- **Responsive Design**: Mobile-first responsive UI

### Admin Features
- **Product Management**: Create, read, update, and delete products
- **User Management**: View and manage user accounts
- **Order Management**: Track and manage customer orders
- **Image Upload**: Upload product images
- **Analytics**: View sales and product statistics

### Payment & Security
- **PayPal Integration**: Secure payment processing
- **JWT Authentication**: Secure user sessions
- **Password Hashing**: Bcrypt encryption for passwords
- **Protected Routes**: Role-based access control

## 🛠 Tech Stack

### Frontend
- **React 19.1.0** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Redux Toolkit** - State management
- **React Bootstrap** - UI components
- **React Toastify** - Notifications
- **Axios** - HTTP client
- **PayPal React SDK** - Payment integration

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### Development Tools
- **ESLint** - Code linting
- **Concurrently** - Run multiple commands
- **Nodemon** - Development server
- **ts-node** - TypeScript execution

## 📁 Project Structure

```
proshop/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── data/          # Sample data
│   │   ├── middleware/    # Custom middleware
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── utils/         # Utility functions
│   │   └── index.ts       # Server entry point
│   └── tsconfig.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── screens/       # Page components
│   │   ├── slices/        # Redux slices
│   │   ├── assets/        # Static assets
│   │   ├── utils/         # Utility functions
│   │   └── main.tsx       # App entry point
│   └── public/            # Public assets
├── shared/                # Shared TypeScript interfaces
└── uploads/               # File uploads
```

### FSD (Feature-Sliced Design) Structure

The frontend follows a modified Feature-Sliced Design pattern:

```
frontend/src/
├── components/           # Shared UI components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Product.tsx
│   ├── Loader.tsx
│   └── ...
├── screens/             # Page-level components
│   ├── HomeScreen.tsx
│   ├── ProductScreen.tsx
│   ├── CartScreen.tsx
│   ├── LoginScreen.tsx
│   ├── admin/           # Admin-specific screens
│   └── ...
├── slices/              # Redux state management
│   ├── authSlice.ts
│   ├── cartSlice.ts
│   ├── productsApiSlice.ts
│   └── ...
├── assets/              # Static assets
│   ├── styles/
│   └── logo.png
└── utils/               # Utility functions
    └── cartUtils.ts
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- PayPal Developer Account (for payments)

### Test Accounts
- **Admin Account**: (has admin privileges)
 -Email : `admin@email.com`
 -Password: `123456`
- **PayPal Test Account**: 
  - Email: `sb-ofxoq45810977@personal.example.com`
  - Password: `Y-,qW>8Z`

### 1. Clone the Repository
```bash
git clone <repository-url>
cd proshop
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
npm install --prefix frontend
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PAYPAL_CLIENT_ID=your_paypal_client_id
```

**Note**: Use the provided test accounts for development and testing purposes.

### 4. Database Setup
```bash
# Import sample data
npm run data:import

# Or destroy existing data
npm run data:destroy
```

### 5. Start the Application

#### Development Mode
```bash
# Start both frontend and backend concurrently
npm run app

# Or start individually:
# Backend only
npm run server

# Frontend only
npm run client
```

#### Production Mode
```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

## 📱 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start the backend server |
| `npm run server` | Start backend with nodemon |
| `npm run client` | Start frontend development server |
| `npm run app` | Start both frontend and backend |
| `npm run build` | Build for production |
| `npm run data:import` | Import sample data |
| `npm run data:destroy` | Clear database |

## 🔧 API Endpoints

### Products
- `GET /api/products` - Get all products (with pagination)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `POST /api/products/:id/reviews` - Add product review
- `GET /api/products/top` - Get top-rated products

### Users
- `POST /api/users` - Register user
- `POST /api/users/auth` - Login user
- `POST /api/users/logout` - Logout user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)
- `PUT /api/users/:id` - Update user (Admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/myorders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/pay` - Update order to paid
- `PUT /api/orders/:id/deliver` - Update order to delivered (Admin)
- `GET /api/orders` - Get all orders (Admin)

### Upload
- `POST /api/upload` - Upload image

## 🎨 Key Components

### Frontend Components
- **Header**: Navigation with search and user menu
- **Product**: Product card with add to cart functionality
- **ProductCarousel**: Featured products carousel
- **CartScreen**: Shopping cart management
- **CheckoutSteps**: Order process navigation
- **AdminRoute**: Protected admin routes
- **PrivateRoute**: Protected user routes

### Backend Models
- **Product**: Product schema with reviews
- **User**: User schema with authentication
- **Order**: Order schema with payment tracking

## 🔐 Authentication & Authorization

- JWT-based authentication
- Role-based access control (Admin/User)
- Protected routes for authenticated users
- Admin-only routes for management functions

## 💳 Payment Integration

- PayPal SDK integration
- Secure payment processing
- Order status tracking
- Payment confirmation

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `npm run build --prefix frontend`
2. Deploy the `frontend/dist` folder

### Backend (Heroku/Railway)
1. Set environment variables
2. Deploy the backend folder
3. Configure MongoDB connection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Built with ❤️ using the MERN stack

---

For more information or support, please open an issue in the repository.