import { BrowserRouter as Bro, Route, Routes } from "react-router-dom";

import App from "./App";
// import Hero from "./src/components/Hero/Hero";
import Footer from "./components/Footer/Footer";
import Products from "./components/Products/Products";
import TopProducts from "./components/TopProducts/TopProducts";

import Testimonials from "./components/Testimonials/Testimonials";

import Banner from "./components/Banner/Banner";
import Navbar from "./components/Navbar/Navbar";
import Popup from "./components/Popup/Popup";
import Subscribe from "./components/Subscribe/Subscribe";

import Login from "./components/login/Login";
import Register from "./components/login/Register";

import ChatBotPage from "./components/ChatBot/ChatBotPage";
import ChatPage from "./components/ChatBot/ChatPage";

const Router = () => {
  return (
    <Bro>
      <Routes>
        {/* <Route path="/" element={<Hero />} /> */}
        <Route path="/footer" element={<Footer />} />
        <Route path="/" element={<App />} />
        <Route path="/products" element={<Products />} />
        <Route path="/topProducts" element={<TopProducts />} />
        <Route path="/testimonials" element={<Testimonials />} />

        <Route path="/banner" element={<Banner />} />
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/popup" element={<Popup />} />
        <Route path="/subscribe" element={<Subscribe />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/chatbot" element={<ChatBotPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Bro>
  );
};
export default Router;
