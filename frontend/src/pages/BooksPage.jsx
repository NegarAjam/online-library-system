import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBooks();
  }, [search]);

  const fetchBooks = async () => {
    try {
      const response = await api.get(
        `books/?search=${search}`
      );

      setBooks(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  const borrowBook = async (bookId) => {
    try {
      const token = localStorage.getItem("access");

      const response = await api.post(
        `borrow/${bookId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);

      fetchBooks();

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.error ||
        "Borrow failed"
      );
    }
  };

  const reserveBook = async (bookId) => {
    try {
      const token = localStorage.getItem("access");

      const response = await api.post(
        `reserve/${bookId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);

      fetchBooks();

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.error ||
        "Reservation failed"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-5">

        <h2>Books</h2>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>Year</th>
              <th>Available</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>{book.publication_year}</td>
                <td>{book.available_copies}</td>

                <td>
                  {book.available_copies > 0 ? (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() =>
                        borrowBook(book.id)
                      }
                    >
                      Borrow
                    </button>
                  ) : (
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() =>
                        reserveBook(book.id)
                      }
                    >
                      Reserve
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

export default BooksPage;