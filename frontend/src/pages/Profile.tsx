import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

const Profile = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    address: "",
    dateOfBirth: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosClient.get("/users/profile");
        const data = response.data;

        setFormData({
          name: data.name || "",
          email: data.email || "",
          mobileNumber: data.mobileNumber || "",
          address: data.address || "",
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split("T")[0] : "",
          role: data.role || "",
        });

        // Optional: update global store with latest profile
        // login(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setMessage("Failed to load profile.");
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axiosClient.patch("/users/profile", formData);
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div>Loading profile...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-sm font-medium">Mobile Number</label>
          <input
            name="mobileNumber"
            type="tel"
            value={formData.mobileNumber}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border rounded-md"
            required
            disabled
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium">Address</label>
          <input
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium">Date of Birth</label>
          <input
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium">Role</label>
          <input
            type="text"
            value={formData.role}
            readOnly
            className="mt-1 w-full px-3 py-2 border rounded-md bg-gray-100"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Update Profile"}
        </button>

        {/* Message */}
        {message && <p className="text-sm text-green-600 mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default Profile;
