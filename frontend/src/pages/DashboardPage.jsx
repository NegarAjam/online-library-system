import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function DashboardPage() {
  const [booksCount, setBooksCount] = useState(0);
  const [borrowingsCount, setBorrowingsCount] = useState(0);
  const [reservationsCount, setReservationsCount] = useState(0);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("access");

      const booksResponse = await api.get("books/");

      const borrowingsResponse = await api.get(
        "my-borrowings/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const reservationsResponse = await api.get(
        "my-reservations/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

        setBooksCount(
            booksResponse.data.length
        );

        setBorrowingsCount(
        borrowingsResponse.data.filter(
            (item) => item.status === "borrowed"
        ).length
        );

        setReservationsCount(
        reservationsResponse.data.filter(
            (item) => item.is_active
        ).length
        );

    } catch (error) {
      console.log(error);
    }
  };

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

                  <h2>{booksCount}</h2>

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

                  <h2>{borrowingsCount}</h2>

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

                  <h2>{reservationsCount}</h2>

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