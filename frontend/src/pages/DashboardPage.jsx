import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function DashboardPage() {
  return (
    <>
      <Navbar />

      <div className="container mt-5">
        <h1 className="mb-4 text-center">
          Online Library Dashboard
        </h1>

        <div className="row">

          <div className="col-md-4">
            <Link
              to="/books"
              className="text-decoration-none text-dark"
            >
              <div className="card">
                <div className="card-body text-center">
                  <h5>Total Books</h5>
                  <h2>📚</h2>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-md-4">
            <Link
              to="/my-borrowings"
              className="text-decoration-none text-dark"
            >
              <div className="card">
                <div className="card-body text-center">
                  <h5>Borrowings</h5>
                  <h2>📖</h2>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-md-4">
            <Link
              to="/my-reservations"
              className="text-decoration-none text-dark"
            >
              <div className="card">
                <div className="card-body text-center">
                  <h5>Reservations</h5>
                  <h2>🔖</h2>
                </div>
              </div>
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}

export default DashboardPage;