import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#C97C5D] text-white shadow-md px-1 py-1">
      <div className="px-6 py-6 flex justify-between items-center">
    
        <div className="text-2xl font-bold">Bakery Shop</div>

        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={
                menuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>

 
        <ul className="hidden md:flex space-x-6">
          <NavItem to="/">Home</NavItem>
          <NavItem to="/products">Products</NavItem>
          <NavItem to="/cart">Cart</NavItem>
          <NavItem to="/about">About</NavItem>
          <NavItem to="/contact">Contact</NavItem>
          <NavItem to="/admin">Admin</NavItem>
        </ul>
      </div>

   
      {menuOpen && (
        <ul className="md:hidden bg-[#C97C5D] px-6 pb-4 space-y-3">
          <NavItem to="/" onClick={() => setMenuOpen(false)}>Home</NavItem>
          <NavItem to="/products" onClick={() => setMenuOpen(false)}>Products</NavItem>
          <NavItem to="/cart" onClick={() => setMenuOpen(false)}>Cart</NavItem>
          <NavItem to="/about" onClick={() => setMenuOpen(false)}>About</NavItem>
          <NavItem to="/contact" onClick={() => setMenuOpen(false)}>Contact</NavItem>
          <NavItem to="/admin" onClick={() => setMenuOpen(false)}>Admin</NavItem>
        </ul>
      )}
    </nav>
  );
};

const NavItem = ({ to, children, onClick }) => (
  <li>
    <Link
      to={to}
      onClick={onClick}
      className="block px-2 py-1 rounded hover:bg-[#B36A50] transition-all duration-200"
    >
      {children}
    </Link>
  </li>
);

export default Navbar;
