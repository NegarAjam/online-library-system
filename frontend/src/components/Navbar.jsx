import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    navigate("/");
  };

  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container">
        <Link
          className="navbar-brand"
          to="/dashboard"
        >
          Library System
        </Link>

        <div>
          <Link
            className="btn btn-outline-light me-2"
            to="/dashboard"
          >
            Dashboard
          </Link>

          <Link
            className="btn btn-outline-light me-2"
            to="/books"
          >
            Books
          </Link>

          <Link
            className="btn btn-outline-light me-2"
            to="/my-borrowings"
          >
            My Borrowings
          </Link>

          <Link
            className="btn btn-outline-light me-2"
            to="/my-reservations"
          >
            My Reservations
          </Link>

          <button
            className="btn btn-danger"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;