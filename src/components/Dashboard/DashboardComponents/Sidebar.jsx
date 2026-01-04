import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { HiOutlineMenu } from "react-icons/hi";
import { RiCloseLine } from "react-icons/ri";
import { FaClipboardList } from "react-icons/fa";
import { BsPeopleFill } from "react-icons/bs";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { IoCarSport } from "react-icons/io5";
import { GrUserAdmin } from "react-icons/gr";
import { CgLogOut } from "react-icons/cg";

// here should be the logo
// import { logo } from "../assets";

const links = [
  { name: "Products", to: "/Dashboard/Products", icon: FaClipboardList },
  {
    name: "Orders",
    to: "/Dashboard/orders",
    icon: FaMoneyBillTransfer,
  },
];
// Section 2
const linksTwo = [
  { name: "Users", to: "/Dashboard/Users", icon: GrUserAdmin },
  { name: "Logout", to: "/", icon: CgLogOut },
];

const NavLinks = ({ handleClick }) => (
  <div className="mt-4 ">
    <p className="ml-4 font-semibold text-sm">Menu List</p>
    <ul>
      {links.map((item) => (
        <li key={item.name}>
          <NavLink
            to={item.to}
            className={({ isActive }) =>
              `flex flex-row items-center p-3 m-2 text-md font-medium rounded-lg transition-colors duration-200 ${
                isActive
                  ? "bg-slate-700 text-gray-800 shadow-md"
                  : "text-gray-900 hover:bg-slate-400 hover:text-gray-900"
              }`
            }
            onClick={() => handleClick && handleClick()}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </NavLink>
        </li>
      ))}
    </ul>

    <div className="mt-[2.2rem]">
      <p className="ml-4 font-semibold text-sm">Settings</p>
      <ul>
        {linksTwo.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `flex flex-row items-center p-3 m-2 text-md font-medium rounded-lg transition-colors duration-200 ${
                  isActive
                    ? "bg-slate-700 text-gray-800 shadow-md"
                    : "text-gray-900 hover:bg-slate-400 hover:text-gray-900"
                }`
              }
              onClick={() => handleClick && handleClick()}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const Sidebar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="md:flex hidden flex-col w-[240px] py-3 px-.5 bg-slate-600 border-r-[#ffffffb0] md:border-r-black">
        <Link to="/" className="text-center text-slate-800 font-bold">
          {/* <img src={logo} alt="logo" className="w-full h-14 object-contain" /> */}
          Medi Shop
        </Link>
        <NavLinks />
      </div>

      {/* Mobile sidebar */}
      <div className="absolute md:hidden block top-6 right-3">
        {!mobileMenuOpen ? (
          <HiOutlineMenu
            className="w-6 h-6 mr-2 text-purple-950"
            onClick={() => setMobileMenuOpen(true)}
          />
        ) : (
          <RiCloseLine
            className="w-6 h-6 mr-2 text-white"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </div>

      <div
        className={`absolute top-0 h-screen w-2/3 bg-gradient-to-tl from-white/10 to-[#483D8B] backdrop-blur-lg z-10 p-6 md:hidden smooth-transition ${
          mobileMenuOpen ? "left-0" : "-left-full"
        }`}
      >
        {/* <img src={logo} alt="logo" className="w-full h-14 object-contain" /> */}
        <NavLinks handleClick={() => setMobileMenuOpen(false)} />
      </div>
    </>
  );
};

export default Sidebar;
