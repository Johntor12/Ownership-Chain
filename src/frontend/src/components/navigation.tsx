import React from "react";
import { Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

export function NavBar() {
    const [openNavbar, setOpenNavbar] = React.useState(false);
    const { isAuthenticated, logout } = useAuth();

    return (
        <nav className={`w-full fixed z-50 justify-center items-center bg-white/60`}>
            <div className="px-5 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-2 md:w-[70%]">
                    <h1
                        className="font-bold text-lg cursor-pointer md:cursor-auto"
                        onClick={() => setOpenNavbar(!openNavbar)}
                    >
                        <span className="text-primary-dark">OwnerShip</span>{" "}
                        <span className="text-primary">Chainner</span>
                    </h1>
                </div>

                <div className="hidden md:flex space-x-6 text-gray-700 mr-4">
                    <Link to={"/"}>Marketplace</Link>
                    {!isAuthenticated && <Link to={"/auth"}>Login</Link>}
                    {isAuthenticated && <Link to={"/dashboard"}>Dashboard</Link>}
                    {isAuthenticated && <Link to={"/report"}>Courting</Link>}
                    {isAuthenticated && <button onClick={logout}>Logout</button>}
                </div>
            </div>

            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${openNavbar ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="bg-white px-5 pb-4 pt-2 space-y-3 border-t border-gray-200">
                    <Link to={'/'} className="block">
                        Marketplace
                    </Link>
                    {!isAuthenticated && <Link to={'/auth'} className="block">Login</Link>}
                    {isAuthenticated && <Link to={'/dashboard'} className="block">Dashboard</Link>}
                    {isAuthenticated && <Link to={'/report'} className="block">Courting</Link>}
                    {isAuthenticated && <button onClick={logout} className="block">Logout</button>}
                </div>
            </div>
        </nav>
    );
}
