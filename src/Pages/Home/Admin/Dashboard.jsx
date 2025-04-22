import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../../Firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc
} from "firebase/firestore";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", price: "", description: "", image: "" });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      fetchRestaurant(currentUser.uid);
    }
  }, []);

  const fetchRestaurant = async (ownerId) => {
    try {
      const q = query(collection(db, "restaurants"), where("ownerId", "==", ownerId));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const docData = snapshot.docs[0];
        setRestaurant({ id: docData.id, ...docData.data() });
        fetchMenuItems(docData.id);
      }
    } catch (error) {
      console.error("Error fetching restaurant:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuItems = async (restaurantId) => {
    try {
      const q = query(collection(db, "restaurants", restaurantId, "menu"));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMenuItems(items);
    } catch (error) {
      console.error("Error fetching menu items:", error.message);
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price || !newItem.image) return;
    try {
      await addDoc(collection(db, "restaurants", restaurant.id, "menu"), {
        ...newItem,
        price: parseFloat(newItem.price),
        restaurantId: restaurant.id,
        createdAt: new Date()
      });
      setNewItem({ name: "", price: "", description: "", image: "" });
      fetchMenuItems(restaurant.id);
      setShowForm(false);
    } catch (error) {
      console.error("Error adding menu item:", error.message);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-orange-50 py-10 px-4 md:px-12">
      <div className="max-w-4xl mx-auto space-y-10">
        {restaurant ? (
          <>
            {/* Restaurant Banner */}
            <div
              className="relative h-64 rounded-xl shadow-md overflow-hidden bg-cover bg-center flex items-end"
              style={{ backgroundImage: `url(${restaurant.image})` }}
            >
              <div className="absolute inset-0 bg-black/50"></div>
              <div className="relative p-6 text-white z-10 w-full flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-bold">{restaurant.name}</h2>
                  <p className="text-sm text-gray-200">{restaurant.address}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow"
                  >
                    {showForm ? "Cancel" : "Add Menu Item"}
                  </button>
                  <button
                    onClick={() => navigate(`/ordersPlaced/${restaurant.id}`)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
                  >
                    See Orders
                  </button>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="bg-white p-6 rounded-xl shadow-md mt-6">
              <h3 className="text-xl font-semibold text-orange-600 mb-4">Menu Items</h3>
              {menuItems.length === 0 ? (
                <p className="text-gray-500">No items added yet.</p>
              ) : (
                <div className="grid grid-cols-2 gap-6">
                  {menuItems.map(item => (
                    <div key={item.id} className="p-4 border rounded-lg shadow-md">
                      <div className="flex flex-col items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-full mb-3"
                        />
                        <div className="text-lg font-semibold text-orange-700">{item.name}</div>
                        <div className="text-sm text-gray-600">{item.description}</div>
                        <div className="text-sm text-green-700 font-bold">₹{item.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Menu Item Form */}
            {showForm && (
              <div className="bg-white p-6 rounded-xl shadow-md mt-6">
                <h3 className="text-xl font-semibold text-orange-600 mb-4">Add Menu Item</h3>
                <form onSubmit={handleAddMenuItem} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Item Name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price (₹)"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={newItem.image}
                    onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="w-full p-3 border rounded-lg"
                    rows={3}
                  />
                  <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition"
                  >
                    Add Item
                  </button>
                </form>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-600 text-lg">
            No restaurant found. Please add your restaurant first.
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
