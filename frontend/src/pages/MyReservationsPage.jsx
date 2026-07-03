import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function MyReservationsPage() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem("access");

      const response = await api.get(
        "my-reservations/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReservations(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-5">

        <h2>My Reservations</h2>

        <p className="text-muted">
          {reservations.length} reservation(s)
        </p>

        <table className="table table-bordered table-hover">

          <thead>
            <tr>
              <th>ID</th>
              <th>Book ID</th>
              <th>Reservation Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {reservations.map((item) => (
              <tr key={item.id}>

                <td>{item.id}</td>

                <td>{item.book_title}</td>

                <td>{item.reservation_date}</td>

                <td>
                  {item.is_active ? (
                    <span className="badge bg-warning text-dark">
                      Active
                    </span>
                  ) : (
                    <span className="badge bg-secondary">
                      Closed
                    </span>
                  )}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>
    </>
  );
}

export default MyReservationsPage;