import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("access");

      const response = await api.get("notifications/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("access");

      await api.post(
        `notifications/${id}/read/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchNotifications();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-5">
        <h2>Notifications</h2>

        <p className="text-muted">
          {notifications.length} notification(s)
        </p>

        {notifications.length === 0 ? (
          <p className="text-muted">No notifications</p>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className={
                item.is_read
                  ? "card mb-2"
                  : "card mb-2 border-primary"
              }
            >
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <span className="badge bg-secondary me-2">
                    {item.notif_type}
                  </span>
                  {item.message}
                  <br />
                  <small className="text-muted">{item.created_at}</small>
                </div>

                {!item.is_read && (
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => markAsRead(item.id)}
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default NotificationsPage;
