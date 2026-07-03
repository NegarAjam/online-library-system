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

      const response = await api.get(
        "my-borrowings/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
        `Book returned successfully. Fine: ${response.data.fine}`
        );

      fetchBorrowings();

    } catch (error) {
      console.log(error);

      alert("Return failed");
    }
  };

  return (
    <>
    <Navbar />    
        <div className="container mt-5">

        <h2>My Borrowings</h2>

        <table className="table table-bordered">

            <thead>
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

            {borrowings.map((item) => (

                <tr key={item.id}>

                <td>{item.id}</td>
                <td>{item.borrow_date}</td>
                <td>{item.due_date}</td>
                <td>{item.fine_amount}</td>
                <td>{item.status}</td>

                <td>

                    {item.status === "borrowed" && (
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                        returnBook(item.id)
                        }
                    >
                        Return
                    </button>
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

export default MyBorrowingsPage;