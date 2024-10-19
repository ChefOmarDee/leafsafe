import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-3xl font-bold">
          PlantSafe
        </Link>
        <div className="hidden md:flex space-x-8">
          <Link href="/" className="text-white hover:text-green-200 text-xl">
            Home
          </Link>
          <Link
            href="/detectplant"
            className="text-white hover:text-green-200 text-xl"
          >
            Detect
          </Link>
          <Link
            href="/getinfo"
            className="text-white hover:text-green-200 text-xl"
          >
            More Info
          </Link>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <Link
            href="/"
            className="block text-white py-2 px-4 hover:bg-green-700 text-xl"
          >
            Home
          </Link>
          <Link
            href="/detectplant"
            className="block text-white py-2 px-4 hover:bg-green-700 text-xl"
          >
            Detect
          </Link>
          <Link
            href="/getinfo"
            className="block text-white py-2 px-4 hover:bg-green-700 text-xl"
          >
            More Info
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
