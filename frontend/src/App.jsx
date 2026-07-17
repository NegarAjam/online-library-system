import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import BooksPage from "./pages/BooksPage";
import MyBorrowingsPage from "./pages/MyBorrowingsPage";
import MyReservationsPage from "./pages/MyReservationsPage";
import DashboardPage from "./pages/DashboardPage";
import PrivateRoute from "./components/PrivateRoute";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminRoute from "./components/AdminRoute";
import AdminBooksPage from "./pages/AdminBooksPage";
import ProfilePage from "./pages/ProfilePage";
import MyPaymentsPage from "./pages/MyPaymentsPage";
import NotificationsPage from "./pages/NotificationsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin-books"
          element={
            <AdminRoute>
              <AdminBooksPage />
            </AdminRoute>
          }
        />

        <Route
          path="/books"
          element={
            <PrivateRoute>
              <BooksPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/my-borrowings"
          element={
            <PrivateRoute>
              <MyBorrowingsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/my-reservations"
          element={
            <PrivateRoute>
              <MyReservationsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/my-payments"
          element={
            <PrivateRoute>
              <MyPaymentsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <NotificationsPage />
            </PrivateRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;