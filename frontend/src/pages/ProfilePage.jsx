import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function ProfilePage() {

  const [profile, setProfile] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {

      const token = localStorage.getItem("access");

      const response = await api.get(
        "profile/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfile(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  const updateProfile = async () => {
    try {

      const token = localStorage.getItem("access");

      const response = await api.put(
        "profile/",
        {
          email: profile.email,
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone_number: profile.phone_number,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfile(response.data);

      alert("Profile updated successfully");

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.detail ||
        "Update failed"
      );
    }
  };

  const changePassword = async () => {
    try {

      const token = localStorage.getItem("access");

      const response = await api.post(
        "change-password/",
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);

      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.error ||
        "Password change failed"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">

        <h2>My Profile</h2>

        <div className="card mb-4">

          <div className="card-header">
            Personal Information
          </div>

          <div className="card-body">

            <div className="mb-3">
              <label className="form-label">
                Username
              </label>

              <input
                className="form-control"
                value={profile.username}
                disabled
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Email
              </label>

              <input
                className="form-control"
                value={profile.email}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                First Name
              </label>

              <input
                className="form-control"
                value={profile.first_name}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    first_name: e.target.value,
                  })
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Last Name
              </label>

              <input
                className="form-control"
                value={profile.last_name}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    last_name: e.target.value,
                  })
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Phone Number
              </label>

              <input
                className="form-control"
                placeholder="For SMS reminders"
                value={profile.phone_number}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    phone_number: e.target.value,
                  })
                }
              />
            </div>

            <button
              className="btn btn-primary"
              onClick={updateProfile}
            >
              Save Changes
            </button>

          </div>

        </div>

        <div className="card">

          <div className="card-header">
            Change Password
          </div>

          <div className="card-body">

            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Current Password"
                value={passwordData.current_password}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    current_password: e.target.value,
                  })
                }
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="New Password"
                value={passwordData.new_password}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    new_password: e.target.value,
                  })
                }
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Confirm New Password"
                value={passwordData.confirm_password}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirm_password: e.target.value,
                  })
                }
              />
            </div>

            <button
              className="btn btn-warning"
              onClick={changePassword}
            >
              Change Password
            </button>

          </div>

        </div>

      </div>
    </>
  );
}

export default ProfilePage;