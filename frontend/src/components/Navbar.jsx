import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const dashboardLink =
    role === "admin"
      ? "/admin-dashboard"
      : "/dashboard";

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("role");

    navigate("/");
  };

  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container">

        <Link
          className="navbar-brand"
          to={dashboardLink}
        >
          Library System
        </Link>

        <div>

          <Link
            className="btn btn-outline-light me-2"
            to={dashboardLink}
          >
            Dashboard
          </Link>

          {role === "admin" ? (
            <>
              <Link
                className="btn btn-outline-warning me-2"
                to="/admin-books"
              >
                Manage Books
              </Link>
            </>
          ) : (
            <>
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
            </>
          )}

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