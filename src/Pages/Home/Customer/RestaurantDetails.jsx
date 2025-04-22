import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../../Firebase/firebase";
import OrderModal from "./OrderModal"; // Adjust the path if needed


const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);


  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const docRef = doc(db, "restaurants", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const restaurantData = docSnap.data();
          setRestaurant(restaurantData);

          // Fetch menu subcollection inside this restaurant
          const menuRef = collection(docRef, "menu");
          const menuSnap = await getDocs(menuRef);
          const items = menuSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setMenuItems(items);
        }
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${restaurant?.image || "https://via.placeholder.com/1200x600"})`,
      }}
    >
      <div className="bg-white/80 min-h-screen backdrop-blur-sm py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-orange-600 mb-4">{restaurant?.name}</h1>
          <p className="text-gray-700 mb-2">{restaurant?.description}</p>
          <p className="text-gray-500 mb-4">📍 {restaurant?.address}</p>

          <h2 className="text-2xl font-semibold mt-6 mb-4">Menu</h2>
          {menuItems.length === 0 ? (
            <p>No menu items available.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
             {menuItems.map((item) => (
  <div
    key={item.id}
    className="bg-white rounded-xl shadow p-4 backdrop-blur-md"
  >
    <img
      src={item.image || "https://via.placeholder.com/150"}
      alt={item.name}
      className="w-full h-40 object-cover rounded-md mb-2"
    />
    <h3 className="text-lg font-semibold">{item.name}</h3>
    <p className="text-gray-600 text-sm mb-1">{item.description}</p>
    <p className="font-bold text-orange-600 mb-2">₹{item.price}</p>
    <button
  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg transition duration-300"
  onClick={() => setSelectedItem(item)}
>
  Order Now
</button>

  </div>
))}

            </div>
          )}
          {selectedItem && (
  <OrderModal
    item={selectedItem}
    onClose={() => setSelectedItem(null)}
  />
)}

        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;
