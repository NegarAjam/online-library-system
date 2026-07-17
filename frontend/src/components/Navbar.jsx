import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function Navbar() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const [unreadCount, setUnreadCount] = useState(0);

  const dashboardLink =
    role === "admin"
      ? "/admin-dashboard"
      : "/dashboard";

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("access");

      const response = await api.get("notifications/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUnreadCount(
        response.data.filter((item) => !item.is_read).length
      );
    } catch (error) {
      console.log(error);
    }
  };

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

            <Link
            className="btn btn-outline-info me-2 position-relative"
            to="/notifications"
            >
            Notifications
            {unreadCount > 0 && (
              <span className="badge bg-danger ms-1">
                {unreadCount}
              </span>
            )}
            </Link>

            <Link
            className="btn btn-outline-info me-2"
            to="/profile"
            >
            Profile
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