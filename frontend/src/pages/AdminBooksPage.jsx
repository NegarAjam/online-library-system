import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function AdminBooksPage() {
  const [books, setBooks] = useState([]);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [availableCopies, setAvailableCopies] = useState("");

  const [editingId, setEditingId] = useState(null);

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

  const addBook = async () => {
    try {
      const token = localStorage.getItem("access");

      await api.post(
        "books/",
        {
          title,
          author,
          genre,
          publication_year: publicationYear,
          available_copies: availableCopies,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Book added successfully");

      clearForm();

      fetchBooks();

    } catch (error) {
      console.log(error);
      alert("Add book failed");
    }
  };

  const updateBook = async () => {
    try {
      const token = localStorage.getItem("access");

      await api.put(
        `books/${editingId}/`,
        {
          title,
          author,
          genre,
          publication_year: publicationYear,
          available_copies: availableCopies,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Book updated successfully");

      clearForm();

      fetchBooks();

    } catch (error) {
      console.log(error);
      alert("Update failed");
    }
  };

  const startEdit = (book) => {
    setEditingId(book.id);

    setTitle(book.title);
    setAuthor(book.author);
    setGenre(book.genre);
    setPublicationYear(book.publication_year);
    setAvailableCopies(book.available_copies);
  };

  const clearForm = () => {
    setEditingId(null);

    setTitle("");
    setAuthor("");
    setGenre("");
    setPublicationYear("");
    setAvailableCopies("");
  };

  const deleteBook = async (id) => {
    try {
      const token = localStorage.getItem("access");

      await api.delete(`books/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Book deleted");

      fetchBooks();

    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-5">

        <h2 className="mb-4">
          Admin Book Management
        </h2>

        <div className="card p-4 mb-4">

          <h4>
            {editingId
              ? "Edit Book"
              : "Add New Book"}
          </h4>

          <input
            className="form-control mb-2"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="form-control mb-2"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />

          <input
            className="form-control mb-2"
            placeholder="Genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />

          <input
            type="number"
            className="form-control mb-2"
            placeholder="Publication Year"
            value={publicationYear}
            onChange={(e) =>
              setPublicationYear(e.target.value)
            }
          />

          <input
            type="number"
            className="form-control mb-3"
            placeholder="Available Copies"
            value={availableCopies}
            onChange={(e) =>
              setAvailableCopies(e.target.value)
            }
          />

          {editingId ? (
            <>
              <button
                className="btn btn-warning me-2"
                onClick={updateBook}
              >
                Update Book
              </button>

              <button
                className="btn btn-secondary"
                onClick={clearForm}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              className="btn btn-primary"
              onClick={addBook}
            >
              Add Book
            </button>
          )}

        </div>

        <table className="table table-bordered">

          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>Year</th>
              <th>Copies</th>
              <th>Edit</th>
              <th>Delete</th>
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
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => startEdit(book)}
                  >
                    Edit
                  </button>
                </td>

                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteBook(book.id)}
                  >
                    Delete
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

export default AdminBooksPage;