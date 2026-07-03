import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import BooksPage from "./pages/BooksPage";
import MyBorrowingsPage from "./pages/MyBorrowingsPage";
import MyReservationsPage from "./pages/MyReservationsPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route
          path="/my-borrowings"
          element={<MyBorrowingsPage />}
        />
        <Route
          path="/my-reservations"
          element={<MyReservationsPage />}
        />
        <Route
        path="/dashboard"
        element={<DashboardPage />}
        />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;