import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";

import api from "../../utils/axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const IMG_URL = "http://localhost:5000/img/";

  /* ----------  initial fetch  ---------- */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/users/profile");
        setUser(data.user);
        setName(data.user.username);
      } catch {
        toast.error("Could not load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ----------  save username  ---------- */
  const saveUsername = async () => {
    try {
      await api.put("/users/profile", { username: name });
      setUser((u) => ({ ...u, username: name }));
      setEdit(false);
      toast.success("Username updated");
    } catch {
      toast.error("Update failed");
    }
  };

  /* ----------  upload / change avatar  ---------- */
  const changeAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("avatar", file); // must match multer field name
    console.log("Let see");
    console.log(file);
    try {
      const { data } = await api.post("/users/avatar", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser((u) => ({ ...u, avatar: data.file })); // filename only
      toast.success("Avatar updated");
    } catch {
      toast.error("Upload failed");
    }
  };

  if (loading) return <p className="p-8">Loading…</p>;
  if (!user) return <p className="p-8">No user found</p>;

  /* ----------  avatar URL helper  ---------- */
  const avatarSrc = user.avatar
    ? IMG_URL + user.avatar
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user.username
      )}&size=128`;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      {/* ---- avatar ---- */}
      <div className="flex items-center gap-6 mb-6">
        <img
          src={avatarSrc}
          alt="avatar"
          className="w-32 h-32 rounded-full object-cover border"
        />
        <div>
          <input
            id="avatar-input"
            type="file"
            accept="image/*"
            onChange={changeAvatar}
            className="hidden"
          />
          <label
            htmlFor="avatar-input"
            className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Change avatar
          </label>
        </div>
      </div>

      {/* ---- username / email ---- */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Username</label>
        {edit ? (
          <div className="flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={saveUsername}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={() => setEdit(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <p className="text-lg">{user.username}</p>
            <button
              onClick={() => setEdit(true)}
              className="text-sm text-indigo-600 hover:underline"
            >
              Edit
            </button>
          </div>
        )}
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium mb-1">Email</label>
        <p className="text-gray-700">{user.email}</p>
      </div>

      {/* ---- uploaded images (optional) ---- */}
      <div>
        <h2 className="text-xl font-semibold mb-3">My Images</h2>
        {(user.images || []).length === 0 ? (
          <p className="text-gray-500">No images uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {user.images.map((f) => (
              <img
                key={f}
                src={`http://localhost:5000/img/${f}`}
                alt={f}
                className="w-full h-32 object-cover rounded border"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
