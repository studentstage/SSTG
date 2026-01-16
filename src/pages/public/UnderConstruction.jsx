import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Construction, ArrowLeft } from "lucide-react";

const UnderConstruction = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-xl w-full text-center">
        <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
          <Construction size={32} className="text-yellow-600 dark:text-yellow-400" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          Page Under Construction
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400">
          The page <span className="font-mono">{location.pathname}</span> is not ready yet.
        </p>
        <p className="mt-2 text-gray-500 dark:text-gray-500">
          Please check back later.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnderConstruction;
