import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function BooksPage() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get("books/");
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
        console.log("ERROR:", error);
        console.log("RESPONSE:", error.response);

        alert(JSON.stringify(error.response?.data));
      
    }
  };

  return (
      <>
        <Navbar />

        <div className="container mt-5">
        <h2>Books</h2>

        <table className="table table-bordered">
            <thead>
            <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>Year</th>
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
                    <button
                    className="btn btn-success btn-sm"
                    onClick={() => borrowBook(book.id)}
                    >
                    Borrow
                    </button>
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