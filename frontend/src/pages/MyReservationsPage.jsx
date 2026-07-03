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

        <table className="table table-bordered">

          <thead>
            <tr>
              <th>ID</th>
              <th>Book ID</th>
              <th>Reservation Date</th>
              <th>Active</th>
            </tr>
          </thead>

          <tbody>

            {reservations.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.book}</td>
                <td>{item.reservation_date}</td>
                <td>
                  {item.is_active
                    ? "Yes"
                    : "No"}
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