import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function BooksPage() {
  const [books, setBooks] = useState([]);

  const [search, setSearch] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    fetchBooks();
  }, [search, author, genre, year]);

  const fetchBooks = async () => {
    try {

      let url = `books/?search=${search}`;

      if (author) {
        url += `&author=${author}`;
      }

      if (genre) {
        url += `&genre=${genre}`;
      }

      if (year) {
        url += `&publication_year=${year}`;
      }

      const response = await api.get(url);

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

        <div className="row mb-3">

          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Author"
              value={author}
              onChange={(e) =>
                setAuthor(e.target.value)
              }
            />
          </div>

          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Genre"
              value={genre}
              onChange={(e) =>
                setGenre(e.target.value)
              }
            />
          </div>

          <div className="col-md-3">
            <input
              type="number"
              className="form-control"
              placeholder="Year"
              value={year}
              onChange={(e) =>
                setYear(e.target.value)
              }
            />
          </div>

        </div>

        <p className="text-muted">
          {books.length} book(s) found
        </p>

        <table className="table table-bordered table-hover">

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

                <td>
                  {book.available_copies > 0 ? (
                    <span className="badge bg-success">
                      {book.available_copies}
                    </span>
                  ) : (
                    <span className="badge bg-danger">
                      Out of Stock
                    </span>
                  )}
                </td>

                <td>
                  {book.available_copies > 0 ? (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() =>
                        borrowBook(book.id)
                      }
                    >
                      📚 Borrow
                    </button>
                  ) : (
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() =>
                        reserveBook(book.id)
                      }
                    >
                      🔖 Reserve
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