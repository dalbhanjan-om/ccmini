import { CircleCheck } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";


const OrderSuccess = ({ onClose }) => {
 const navigate= useNavigate();

  const handleBrowseRestaurants = () => {
    navigate("/restaurants"); // Redirect to the restaurant list page
    onClose(); // Close the modal
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md text-center relative">
        <button
          className="absolute top-2 right-3 text-xl font-bold text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-green-600 mb-4">
          Order Placed Successfully!
        </h2>

        <div className="flex justify-center mb-6">
        <CircleCheck />
        </div>

        <p className="text-lg text-gray-700 mb-4">
          Your order will be delivered in <strong>30 minutes</strong>.
        </p>
        <p className="text-md text-gray-500 mb-6">
          Payment Mode: <strong>Cash on Delivery</strong>
        </p>

        <button
          className="w-full bg-orange-500 text-gray-700 py-2 rounded hover:bg-orange-600 transition mb-4"
          onClick={handleBrowseRestaurants}
        >
          Browse More Restaurants
        </button>

        <button
          className="w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
