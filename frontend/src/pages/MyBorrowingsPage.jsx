import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function MyBorrowingsPage() {
  const [borrowings, setBorrowings] = useState([]);

  useEffect(() => {
    fetchBorrowings();
  }, []);

  const fetchBorrowings = async () => {
    try {
      const token = localStorage.getItem("access");

      const response = await api.get("my-borrowings/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBorrowings(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const returnBook = async (borrowingId) => {
    try {
      const token = localStorage.getItem("access");

      const response = await api.post(
        `return/${borrowingId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        `Book returned successfully. Fine: $${response.data.fine}`
      );

      fetchBorrowings();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.error || "Return failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-5">
        <h2>My Borrowings</h2>

        <p className="text-muted">
          {borrowings.length} borrowing(s)
        </p>

        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Borrow Date</th>
              <th>Due Date</th>
              <th>Fine</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {borrowings.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No borrowings found
                </td>
              </tr>
            ) : (
              borrowings.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>

                  <td>{item.borrow_date}</td>

                  <td>{item.due_date}</td>

                  <td>
                    {item.fine_amount > 0 ? (
                      <span className="badge bg-danger">
                        ${Number(item.fine_amount).toLocaleString()}
                      </span>
                    ) : (
                      <span className="badge bg-success">
                        $0
                      </span>
                    )}
                  </td>

                  <td>
                    {item.status === "borrowed" ? (
                      <span className="badge bg-primary">
                        Borrowed
                      </span>
                    ) : (
                      <span className="badge bg-secondary">
                        Returned
                      </span>
                    )}
                  </td>

                  <td>
                    {item.status === "borrowed" && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => returnBook(item.id)}
                      >
                        ↩️ Return
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default MyBorrowingsPage;