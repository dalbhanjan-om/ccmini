// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Pages/Auth/Signup";
import Login from "./Pages/Auth/Login";
import HomePage from "./Pages/Home/HomePage";
import Dashboard from "./Pages/Home/Admin/Dashboard";
import RestaurantForm from "./Pages/Home/Admin/RestaurantForm";
import RestaurantList from "./Pages/Home/RestaurantList";
import RestaurantDetails from "./Pages/Home/Customer/RestaurantDetails";
import CustomerDashboard from "./Pages/Home/Customer/CustomerDashboard";
import RestaurantOrders from "./Pages/Home/Admin/RestaurantOrders";

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<HomePage />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/add-restaurant" element={<RestaurantForm />} />
        <Route path="/restaurants" element={<RestaurantList />} />
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />
        <Route path="/dashboard" element={<CustomerDashboard />} />
        <Route path="/ordersPlaced/:restaurantId" element={<RestaurantOrders />} />


      </Routes>
    </Router>
  );
}

export default App;
