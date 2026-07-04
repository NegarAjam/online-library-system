import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function AdminDashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("access");

      const response = await api.get("admin-dashboard/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  if (!data) {
    return (
      <>
        <Navbar />
        <div className="container mt-5">
          <h3>Loading dashboard...</h3>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container mt-5">

        <h2 className="mb-4">Admin Dashboard 📊</h2>

        {/* STATS */}
        <div className="row">

          <div className="col-md-4">
            <div className="card p-3 text-center">
              <h5>Total Books</h5>
              <h2>{data.total_books}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-3 text-center">
              <h5>Borrowed Books</h5>
              <h2>{data.borrowed_books}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-3 text-center">
              <h5>Available Copies</h5>
              <h2>{data.available_books}</h2>
            </div>
          </div>

        </div>

        {/* Popular Books */}
        <div className="mt-5">

          <h4>Most Popular Books</h4>

          <table className="table table-bordered mt-3">

            <thead>
              <tr>
                <th>Book</th>
                <th>Borrow Count</th>
              </tr>
            </thead>

            <tbody>

              {data.popular_books.map((book, index) => (
                <tr key={index}>
                  <td>{book.book__title}</td>
                  <td>{book.borrow_count}</td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>

        {/* Users with fines */}
        <div className="mt-5">

          <h4>Users With Fines</h4>

          <table className="table table-bordered mt-3">

            <thead>
              <tr>
                <th>User</th>
                <th>Total Fine</th>
              </tr>
            </thead>

            <tbody>

              {data.users_with_fines.map((user, index) => (
                <tr key={index}>
                  <td>{user.user__username}</td>
                  <td>${user.total_fine}</td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>

        {/* Member Performance */}
        <div className="mt-5">

          <h4>Member Performance</h4>

          <table className="table table-bordered mt-3">

            <thead>
              <tr>
                <th>User</th>
                <th>Total Borrowed</th>
                <th>Total Fines</th>
              </tr>
            </thead>

            <tbody>

              {data.member_performance.map((member, index) => (
                <tr key={index}>
                  <td>{member.user__username}</td>
                  <td>{member.total_borrowed}</td>
                  <td>${member.total_fines || 0}</td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>
    </>
  );
}

export default AdminDashboardPage;