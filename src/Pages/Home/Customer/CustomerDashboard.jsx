import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../../Firebase/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
const CustomerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const currentUser = auth.currentUser;



  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchOrders(user.uid);
      } else {
        setLoading(false);
      }
    });
  
    return () => unsubscribe();
  }, []);
  

  const fetchOrders = async (uid) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists() && userDoc.data().orderHistory) {
        setOrders(userDoc.data().orderHistory);
      } else {
        const ordersColRef = collection(db, "users", uid, "orders");
        const snapshot = await getDocs(ordersColRef);
        const orderList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setOrders(orderList);
        console.log("Fetched orders:", orderList);
      }
    } catch (error) {
      console.error("Error fetching orders:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBrowseRestaurants = () => {
    navigate("/restaurants");
  };

 

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-orange-600">My Orders</h1>
          <button
            onClick={handleBrowseRestaurants}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
          >
            Browse Restaurants
          </button>
        </div>

        {orders.length === 0 ? (
          <p className="text-gray-600 text-center">No orders found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orders.map((order, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-2"
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
                  <p><strong>Name:</strong> {order.userName}</p>
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

export default CustomerDashboard;
