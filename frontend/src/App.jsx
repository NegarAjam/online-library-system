import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import BooksPage from "./pages/BooksPage";
import MyBorrowingsPage from "./pages/MyBorrowingsPage";
import MyReservationsPage from "./pages/MyReservationsPage";
import DashboardPage from "./pages/DashboardPage";
import PrivateRoute from "./components/PrivateRoute";
import RegisterPage from "./pages/RegisterPage";

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

      </Routes>
    </BrowserRouter>
  );
}

export default App;