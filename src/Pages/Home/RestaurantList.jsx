import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Firebase/firebase";
import { Link } from "react-router-dom";
import { MapPin, Phone, Clock, Star } from "lucide-react";

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRestaurants = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "restaurants"));
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRestaurants(data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 bg-gradient-to-b from-orange-50 to-orange-100">
      <div className="w-full max-w-7xl">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-orange-800 mb-4">
            Browse Restaurants
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the best local dining experiences with detailed information and easy booking
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-orange-600 font-medium">Finding restaurants...</p>
            </div>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-10 text-center">
            <p className="text-gray-700 text-lg mb-4">No restaurants found.</p>
            <p className="text-gray-500">Please check back later for new additions.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
              >
                <div className="relative">
                  <img
                    src={restaurant.image || "https://source.unsplash.com/400x250/?restaurant,food"}
                    alt={restaurant.name}
                    className="w-full h-56 object-cover"
                  />
                  {restaurant.cuisine && (
                    <span className="absolute top-4 right-4 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {restaurant.cuisine}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">{restaurant.name}</h2>
                  <div className="flex items-center mb-3">
                    {[...Array(Math.floor(restaurant.rating || 4))].map((_, i) => (
                      <Star key={i} size={16} className="text-yellow-500 fill-current" />
                    ))}
                    {restaurant.rating && (
                      <span className="ml-2 text-sm text-gray-600">{restaurant.rating}/5</span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {restaurant.description || "Experience the unique flavors and ambiance at this wonderful establishment."}
                  </p>
                  
                  <div className="space-y-2 mb-5">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin size={16} className="mr-2 text-orange-500" /> 
                      <span className="truncate">{restaurant.address}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone size={16} className="mr-2 text-orange-500" /> 
                      <span>{restaurant.phone}</span>
                    </div>
                    {restaurant.hours && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock size={16} className="mr-2 text-orange-500" /> 
                        <span>{restaurant.hours}</span>
                      </div>
                    )}
                  </div>
                  
                  <Link
                    to={`/restaurant/${restaurant.id}`}
                    className="block w-full text-center bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition duration-300 transform hover:-translate-y-1"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantList;