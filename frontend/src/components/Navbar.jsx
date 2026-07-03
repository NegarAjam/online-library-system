import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container">

        <Link
          className="navbar-brand"
          to="/books"
        >
          Library System
        </Link>

        <div>
          <Link
            className="btn btn-outline-light me-2"
            to="/books"
          >
            Books
          </Link>

          <Link
            className="btn btn-outline-light"
            to="/my-borrowings"
          >
            My Borrowings
          </Link>

          <Link
            className="btn btn-outline-light ms-2"
            to="/my-reservations"
            >
            My Reservations
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;