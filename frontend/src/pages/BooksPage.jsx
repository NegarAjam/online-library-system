import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function BooksPage() {
  const [books, setBooks] = useState([]);

  const [search, setSearch] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");

  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [borrowDays, setBorrowDays] = useState(14);

  const [showReserveModal, setShowReserveModal] = useState(false);
  const [selectedReserveBookId, setSelectedReserveBookId] = useState(null);
  const [reserveDays, setReserveDays] = useState(14);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewBook, setReviewBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [myRating, setMyRating] = useState(5);
  const [myComment, setMyComment] = useState("");

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


  const borrowBook = async () => {
    try {

        const token = localStorage.getItem("access");

        const response = await api.post(
        `borrow/${selectedBookId}/`,
        {
            days: borrowDays,
        },
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
        );

        alert(
        `${response.data.message}
    Due Date: ${response.data.due_date}`
        );

        setShowBorrowModal(false);

        fetchBooks();

    } catch (error) {

        console.log(error);

        alert(
        error.response?.data?.error ||
        "Borrow failed"
        );
    }
  };

    const reserveBook = async () => {
    try {
        const token = localStorage.getItem("access");

        const response = await api.post(
        `reserve/${selectedReserveBookId}/`,
        {
            days: reserveDays,
        },
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
        );

        alert(
        `${response.data.message}
    Borrow Duration: ${response.data.borrow_days} days`
        );

        setShowReserveModal(false);

        fetchBooks();

    } catch (error) {
        console.log(error);

        alert(
        error.response?.data?.error ||
        "Reservation failed"
        );
    }
    };

  const openReviews = async (book) => {
    setReviewBook(book);
    setMyRating(5);
    setMyComment("");
    setShowReviewModal(true);

    try {
      const response = await api.get(`books/${book.id}/reviews/`);
      setReviews(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const submitReview = async () => {
    try {
      const token = localStorage.getItem("access");

      await api.post(
        `books/${reviewBook.id}/reviews/`,
        {
          rating: myRating,
          comment: myComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Review submitted successfully");

      const response = await api.get(`books/${reviewBook.id}/reviews/`);
      setReviews(response.data);

      fetchBooks();

    } catch (error) {
      console.log(error);
      alert(error.response?.data?.error || "Review submission failed");
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
              <th>Rating</th>
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
                  {book.review_count > 0 ? (
                    <span>
                      ⭐ {book.average_rating} ({book.review_count})
                    </span>
                  ) : (
                    <span className="text-muted">No reviews</span>
                  )}
                </td>

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
                    onClick={() => {
                        setSelectedBookId(book.id);
                        setBorrowDays(14);
                        setShowBorrowModal(true);
                    }}
                    >
                    📚 Borrow
                    </button>
                  ) : (
                    <button
                    className="btn btn-warning btn-sm"
                    onClick={() => {
                        setSelectedReserveBookId(book.id);
                        setReserveDays(14);
                        setShowReserveModal(true);
                    }}
                    >
                    🔖 Reserve
                    </button>
                  )}
                  {" "}
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => openReviews(book)}
                  >
                    ⭐ Reviews
                  </button>
                </td>

              </tr>
            ))}

          </tbody>

        </table>
            {showBorrowModal && (

        <div
            className="modal d-block"
            style={{
            backgroundColor: "rgba(0,0,0,0.5)"
            }}
        >

            <div className="modal-dialog">

            <div className="modal-content">

                <div className="modal-header">

                <h5 className="modal-title">
                    Borrow Book
                </h5>

                <button
                    className="btn-close"
                    onClick={() =>
                    setShowBorrowModal(false)
                    }
                />

                </div>

                <div className="modal-body">

                <label className="form-label">
                    Borrow Duration
                </label>

                <select
                    className="form-select"
                    value={borrowDays}
                    onChange={(e) =>
                    setBorrowDays(Number(e.target.value))
                    }
                >
                    <option value={7}>7 Days</option>
                    <option value={14}>14 Days</option>
                    <option value={21}>21 Days</option>
                </select>

                </div>

                <div className="modal-footer">

                <button
                    className="btn btn-secondary"
                    onClick={() =>
                    setShowBorrowModal(false)
                    }
                >
                    Cancel
                </button>

                <button
                    className="btn btn-success"
                    onClick={borrowBook}
                >
                    Confirm Borrow
                </button>

                </div>

            </div>

            </div>

        </div>

        )}

            {showReserveModal && (

            <div
                className="modal d-block"
                style={{
                backgroundColor: "rgba(0,0,0,0.5)"
                }}
            >

                <div className="modal-dialog">

                <div className="modal-content">

                    <div className="modal-header">

                    <h5 className="modal-title">
                        Reserve Book
                    </h5>

                    <button
                        className="btn-close"
                        onClick={() => setShowReserveModal(false)}
                    />

                    </div>

                    <div className="modal-body">

                    <label className="form-label">
                        Borrow Duration After Availability
                    </label>

                    <select
                        className="form-select"
                        value={reserveDays}
                        onChange={(e) =>
                        setReserveDays(Number(e.target.value))
                        }
                    >
                        <option value={7}>7 Days</option>
                        <option value={14}>14 Days</option>
                        <option value={21}>21 Days</option>
                    </select>

                    </div>

                    <div className="modal-footer">

                    <button
                        className="btn btn-secondary"
                        onClick={() => setShowReserveModal(false)}
                    >
                        Cancel
                    </button>

                    <button
                        className="btn btn-warning"
                        onClick={reserveBook}
                    >
                        Confirm Reservation
                    </button>

                    </div>

                </div>

                </div>

            </div>

            )}

            {showReviewModal && (

            <div
                className="modal d-block"
                style={{
                backgroundColor: "rgba(0,0,0,0.5)"
                }}
            >

                <div className="modal-dialog">

                <div className="modal-content">

                    <div className="modal-header">

                    <h5 className="modal-title">
                        Reviews - {reviewBook?.title}
                    </h5>

                    <button
                        className="btn-close"
                        onClick={() => setShowReviewModal(false)}
                    />

                    </div>

                    <div className="modal-body">

                    <div className="mb-3">
                        <label className="form-label">
                            Your Rating
                        </label>

                        <select
                            className="form-select mb-2"
                            value={myRating}
                            onChange={(e) =>
                            setMyRating(Number(e.target.value))
                            }
                        >
                            <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                            <option value={4}>⭐⭐⭐⭐ (4)</option>
                            <option value={3}>⭐⭐⭐ (3)</option>
                            <option value={2}>⭐⭐ (2)</option>
                            <option value={1}>⭐ (1)</option>
                        </select>

                        <textarea
                            className="form-control mb-2"
                            placeholder="Write a comment (optional)"
                            value={myComment}
                            onChange={(e) => setMyComment(e.target.value)}
                        />

                        <button
                            className="btn btn-primary btn-sm"
                            onClick={submitReview}
                        >
                            Submit Review
                        </button>
                    </div>

                    <hr />

                    {reviews.length === 0 ? (
                        <p className="text-muted">No reviews yet</p>
                    ) : (
                        reviews.map((review) => (
                            <div key={review.id} className="border-bottom pb-2 mb-2">
                                <strong>{review.username}</strong>
                                {" "}
                                <span>{"⭐".repeat(review.rating)}</span>
                                <p className="mb-0">{review.comment}</p>
                            </div>
                        ))
                    )}

                    </div>

                    <div className="modal-footer">

                    <button
                        className="btn btn-secondary"
                        onClick={() => setShowReviewModal(false)}
                    >
                        Close
                    </button>

                    </div>

                </div>

                </div>

            </div>

            )}


    </div>
    </>
  );
}

export default BooksPage;