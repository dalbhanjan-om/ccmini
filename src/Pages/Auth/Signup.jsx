import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../Firebase/firebase";
import { UserIcon, ShieldCheckIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Customer"); // Default to Customer
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCredential.user, { displayName: name });

      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email,
        role,
        uid: userCredential.user.uid,
        createdAt: new Date(),
        favorites: [],
        orderHistory: [],
      });

      setLoading(false);
      alert("Welcome to FoodDelight! Your account has been created successfully.");

      // 🎯 Redirect based on role
      if (role === "Owner") {
        navigate("/add-restaurant");
      } else {
        navigate("/restaurants");
      }
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
      <div className="w-full max-w-md px-4 py-8 md:py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with food-themed decoration */}
          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white">
            <h2 className="text-3xl font-bold text-center">Join FoodDelight</h2>
            <p className="text-center mt-2 text-orange-100">
              Create an account to start ordering delicious meals
            </p>
          </div>

          <form onSubmit={handleSignup} className="p-6 md:p-8 space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                {error}
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <UserIcon size={18} />
              </div>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                📧
              </div>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                🔒
              </div>
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <ShieldCheckIcon size={18} />
              </div>
              <select
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition bg-white"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Customer">Regular Customer</option>
                <option value="Owner">Restaurant Owner</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] font-medium text-lg flex items-center justify-center"
            >
              {loading && (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              )}
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <div className="text-center text-sm text-gray-500 mt-4">
              <p>By signing up, you agree to our Terms and Privacy Policy</p>
              <p className="mt-4 text-gray-700">
                Already have an account?{" "}
                <a href="/login" className="text-orange-600 hover:text-orange-700 font-medium">
                  Log in
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
