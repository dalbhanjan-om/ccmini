import React, { useState, useEffect } from "react";
import { auth, db } from "../../../Firebase/firebase";
import { doc, setDoc, getDocs, collection, query, where } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const RestaurantForm = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [restaurantExists, setRestaurantExists] = useState(false);

  const [restaurantName, setRestaurantName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // ✅ Fetch logged-in user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log("User logged in:", user);
        setCurrentUser(user);

        // 🔐 Check if this owner already has a restaurant
        const q = query(collection(db, "restaurants"), where("ownerId", "==", user.uid));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setRestaurantExists(true);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setErrorMsg("User not logged in");
      return;
    }

    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    const restaurantId = uuidv4();

    const restaurantData = {
      id: restaurantId,
      name: restaurantName,
      address,
      description,
      phone,
      image: imageUrl,
      ownerId: currentUser.uid,
      createdAt: new Date()
    };

    try {
      await setDoc(doc(db, "restaurants", restaurantId), restaurantData);
      setSuccessMsg("🎉 Restaurant added successfully!");
      setRestaurantExists(true);

      // Reset form
      setRestaurantName("");
      setAddress("");
      setDescription("");
      setPhone("");
      setImageUrl("");
      navigate("/admin");
    } catch (error) {
      setErrorMsg("❌ Failed to add restaurant: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="text-center text-orange-500 mt-10 font-semibold">
        🔄 Loading user...
      </div>
    );
  }

  if (restaurantExists) {
    return (
      <div className="flex flex-col items-center justify-center mt-16 space-y-6">
        <div className="text-green-600 text-lg font-semibold">
          ✅ You’ve already added a restaurant.
        </div>
  
        <Link
          to="/admin"
          className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition font-semibold"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }
  

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-2xl mt-12">
      <h2 className="text-3xl font-bold mb-6 text-center text-orange-600">🍴 Add Your Restaurant</h2>

      {errorMsg && <p className="text-red-600 mb-4 text-center font-medium">{errorMsg}</p>}
      {successMsg && <p className="text-green-600 mb-4 text-center font-medium">{successMsg}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Restaurant Name</label>
          <input
            type="text"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="e.g. Spice Garden"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Address</label>
          <input
            type="text"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="123 Main St, City, ZIP"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Description</label>
          <textarea
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Short description about your restaurant"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
          <input
            type="tel"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="+1 234 567 8901"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Image URL</label>
          <input
            type="url"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="animate-spin" size={20} />}
          {loading ? "Saving..." : "Add Restaurant"}
        </button>
      </form>
    </div>
  );
};

export default RestaurantForm;
