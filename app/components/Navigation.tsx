"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { logout } from "../redux/authSlice";

export default function Navigation() {
  const pathname = usePathname();
  const userBalance = useAppSelector((state) => state.user.balance);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                Poverty Support System
              </h1>
            </div>
            <div className="ml-10 flex items-center space-x-4">
              <Link
                href="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === "/"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                People List
              </Link>
              <Link
                href="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === "/dashboard"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/ranking"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === "/ranking"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                AI Ranking
              </Link>
              <Link
                href="/blockchain"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === "/blockchain"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                Blockchain
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="px-3 py-2 rounded-md text-sm font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
              Balance: {userBalance} COINS
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Welcome, {user || "User"}
              </span>
              <button
                onClick={handleLogout}
                className="ml-2 px-3 py-2 rounded-md text-sm font-medium bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-800 dark:text-red-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
