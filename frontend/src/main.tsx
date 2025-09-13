import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./assets/styles/index.css";
import "./assets/styles/bootstrap.custom.css";
import App from "./App.tsx";
import HomeScreen from "./screens/HomeScreen.tsx";
import ProductScreen from "./screens/ProductScreen.tsx";
import CartScreen from "./screens/CartScreen.tsx";
import { Provider } from "react-redux";
import store from "./store.ts";
import LoginScreen from "./screens/LoginScreen.tsx";
import RegisterScreen from "./screens/RegisterScreen.tsx";
import ShippingScreen from "./screens/ShippingScreen.tsx";
import PrivateRote from "./components/PrivateRote.tsx";
import AdminRote from "./components/AdminRote.tsx";
import PaymentScreen from "./screens/PaymentScreen.tsx";
import PlaceOrderScreen from "./screens/PlaceOrderScreen.tsx";
import OrderScreen from "./screens/OrderScreen.tsx";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import ProfileScreen from "./screens/ProfileScreen.tsx";
import OrderListScreen from "./screens/admin/OrderListScreen.tsx";
import ProductListScreen from "./screens/admin/ProductListScreen.tsx";
import UserListScreen from "./screens/admin/UserListScreen.tsx";
import { HelmetProvider } from "react-helmet-async";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="/search/:keyword" element={<HomeScreen />} />
      <Route path="/page/:pageNumber" element={<HomeScreen />} />
      <Route
        path="/search/:keyword/page/:pageNumber"
        element={<HomeScreen />}
      />
      <Route path="/product/:id" element={<ProductScreen />} />
      <Route path="/cart" element={<CartScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />

      <Route path="" element={<PrivateRote />}>
        <Route path="/shipping" element={<ShippingScreen />} />
        <Route path="/payment" element={<PaymentScreen />} />
        <Route path="/placeorder" element={<PlaceOrderScreen />} />
        <Route path="/order/:id" element={<OrderScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
      </Route>
      <Route path="" element={<AdminRote />}>
        <Route path="admin/orderlist" element={<OrderListScreen />} />
        <Route path="admin/productlist" element={<ProductListScreen />} />
        <Route
          path="admin/productlist/:pageNumber"
          element={<ProductListScreen />}
        />
        <Route path="admin/userlist" element={<UserListScreen />} />
      </Route>
    </Route>
  )
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <PayPalScriptProvider options={{ clientId: "" }} deferLoading={true}>
          <RouterProvider router={router} />
        </PayPalScriptProvider>
      </Provider>
    </HelmetProvider>
  </StrictMode>
);
