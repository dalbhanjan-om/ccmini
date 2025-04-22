import React, { useState } from "react";
import { auth, db } from "../../../Firebase/firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import OrderSuccess from "./OrderSuccess"; // Import the OrderSuccess component

const OrderModal = ({ item, onClose }) => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    address: "",
    phone: "",
  });
  const [showSuccess, setShowSuccess] = useState(false); // State to control success message visibility

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleOrder = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("You must be logged in to place an order.");
      return;
    }

    // Basic validation
    if (!userDetails.name || !userDetails.address || !userDetails.phone) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const orderData = {
        userId: currentUser.uid,
        userName: userDetails.name,
        phone: userDetails.phone,
        deliveryAddress: userDetails.address,
        itemId: item.id,
        itemName: item.name,
        itemPrice: item.price,
        itemImage: item.image || "",
      };

      // Save order to restaurant's menu item subcollection
      const orderRef = collection(
        db,
        "restaurants",
        item.restaurantId,
        "menu",
        item.id,
        "orders"
      );
      await addDoc(orderRef, orderData);

      // Fetch the current user's orderHistory
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (!userDocSnapshot.exists()) {
        alert("User document not found!");
        return;
      }

      // Get the current orderHistory or initialize it as an empty array
      const userData = userDocSnapshot.data();
      const currentOrderHistory = userData.orderHistory || [];

      // Add the new order to the orderHistory
      const updatedOrderHistory = [...currentOrderHistory, orderData];

      // Update the user's orderHistory
      await updateDoc(userDocRef, {
        orderHistory: updatedOrderHistory,
      });

      // Show success message
      setShowSuccess(true);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Something went wrong while placing your order.");
    }
  };

  return (
    <div>
      {showSuccess ? (
        <OrderSuccess onClose={() => setShowSuccess(false)} /> // Show success message
      ) : (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-3 text-xl font-bold text-gray-500 hover:text-gray-800"
              onClick={onClose}
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-4 text-orange-600">Order Item</h2>

            <img
              src={item.image || "https://via.placeholder.com/150"}
              alt={item.name}
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-gray-700 mb-2">₹{item.price}</p>

            <div className="mb-3">
              <label className="block text-sm mb-1">Your Name</label>
              <input
                type="text"
                name="name"
                className="w-full border rounded p-2"
                onChange={handleChange}
                value={userDetails.name}
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm mb-1">Delivery Address</label>
              <textarea
                name="address"
                className="w-full border rounded p-2"
                rows="2"
                onChange={handleChange}
                value={userDetails.address}
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                className="w-full border rounded p-2"
                onChange={handleChange}
                value={userDetails.phone}
              />
            </div>

            <button
              className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
              onClick={handleOrder}
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderModal;
