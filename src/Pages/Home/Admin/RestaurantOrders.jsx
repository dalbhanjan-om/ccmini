import React, { useEffect, useState } from "react";
import { auth, db } from "../../../Firebase/firebase";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useParams } from "react-router-dom";

const RestaurantOrders = () => {
  const { restaurantId } = useParams(); // get from route params
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (restaurantId) {
      fetchAllOrders(restaurantId);
    }
  }, [restaurantId]);

  const fetchAllOrders = async (resId) => {
    try {
      const menuRef = collection(db, "restaurants", resId, "menu");
      const menuSnapshot = await getDocs(menuRef);

      let allOrders = [];

      for (const menuDoc of menuSnapshot.docs) {
        const itemId = menuDoc.id;
        const ordersRef = collection(
          db,
          "restaurants",
          resId,
          "menu",
          itemId,
          "orders"
        );
        const ordersSnapshot = await getDocs(ordersRef);

        const itemOrders = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          itemName: menuDoc.data().name || "Unknown Item",
        }));

        allOrders = [...allOrders, ...itemOrders];
      }

      setOrders(allOrders);
    } catch (error) {
      console.error("Error fetching orders:", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading orders...</div>;
  }

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-orange-600 mb-6">
          Orders Placed for Your Restaurant
        </h1>

        {orders.length === 0 ? (
          <p className="text-gray-600">No orders found yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orders.map((order, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-lg shadow-md space-y-2"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={order.itemImage || "https://via.placeholder.com/80"}
                    alt={order.itemName}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">{order.itemName}</h2>
                    <p className="text-gray-600">₹{order.itemPrice}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-700">
                  <p><strong>Customer:</strong> {order.userName}</p>
                  <p><strong>Phone:</strong> {order.phone}</p>
                  <p><strong>Address:</strong> {order.deliveryAddress}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantOrders;
