import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "./components/login-page.tsx";
import { HomePage } from "./components/home-page.tsx";
import { OrdersPage } from "./components/orders-page.tsx";
import { ProductsPage } from "./components/products-page.tsx";
import { RequireAuth } from "./components/require-auth.tsx";
import { Shell } from "./components/shell.tsx";
import { AuthProvider } from "./state/auth-context.tsx";
import { CatalogProvider } from "./state/catalog-context.tsx";
import { OrderProvider } from "./state/order-context.tsx";

export default function App() {
  return (
    <AuthProvider>
      <OrderProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<RequireAuth />}>
              <Route element={<Workspace />}>
                <Route index element={<HomePage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="orders" element={<OrdersPage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </OrderProvider>
    </AuthProvider>
  );
}

function Workspace() {
  return (
    <CatalogProvider>
      <Shell />
    </CatalogProvider>
  );
}
