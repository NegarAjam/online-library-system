import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import BooksPage from "./pages/BooksPage";
import MyBorrowingsPage from "./pages/MyBorrowingsPage";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;