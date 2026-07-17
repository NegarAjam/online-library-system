import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function MyPaymentsPage() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("access");

      const response = await api.get("payments/my-payments/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPayments(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-5">
        <h2>My Payments</h2>

        <p className="text-muted">
          {payments.length} payment(s)
        </p>

        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Book</th>
              <th>Amount</th>
              <th>Transaction ID</th>
              <th>Status</th>
              <th>Paid At</th>
            </tr>
          </thead>

          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No payments found
                </td>
              </tr>
            ) : (
              payments.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.book_title}</td>
                  <td>${item.amount}</td>
                  <td>
                    <small>{item.transaction_id}</small>
                  </td>
                  <td>
                    {item.status === "completed" ? (
                      <span className="badge bg-success">Completed</span>
                    ) : item.status === "failed" ? (
                      <span className="badge bg-danger">Failed</span>
                    ) : (
                      <span className="badge bg-warning text-dark">
                        Pending
                      </span>
                    )}
                  </td>
                  <td>{item.paid_at || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default MyPaymentsPage;
