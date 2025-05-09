"use client";

import { Suspense } from "react";
import Dashboard from "../components/Dashboard";
import Navigation from "../components/Navigation";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div>Loading...</div>}>
          <Dashboard />
        </Suspense>
      </div>
    </div>
  );
}
