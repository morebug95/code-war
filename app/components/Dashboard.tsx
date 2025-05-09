"use client";

import { useAppSelector } from "../redux/hooks";

export default function Dashboard() {
  const people = useAppSelector((state) => state.people);

  // Calculate statistics
  const totalPeople = people.length;
  const pendingCount = people.filter(
    (p) => p.supportStatus === "pending"
  ).length;
  const receivingCount = people.filter(
    (p) => p.supportStatus === "receiving"
  ).length;
  const completedCount = people.filter(
    (p) => p.supportStatus === "completed"
  ).length;

  // Calculate housing statistics
  const housedCount = people.filter((p) => p.hasHouse).length;
  const homelessCount = people.filter((p) => !p.hasHouse).length;

  // Calculate average income
  const averageIncome =
    people.reduce((sum, person) => sum + person.income, 0) / totalPeople;

  return (
    <div className="w-full max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Total People
          </p>
          <p className="text-2xl font-bold">{totalPeople}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-500">{pendingCount}</p>
          <p className="text-xs text-gray-500">
            {((pendingCount / totalPeople) * 100).toFixed(1)}%
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Receiving</p>
          <p className="text-2xl font-bold text-green-500">{receivingCount}</p>
          <p className="text-xs text-gray-500">
            {((receivingCount / totalPeople) * 100).toFixed(1)}%
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Completed</p>
          <p className="text-2xl font-bold text-gray-500">{completedCount}</p>
          <p className="text-xs text-gray-500">
            {((completedCount / totalPeople) * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Housing stats */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Housing Status</h2>
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span>Housed</span>
              <span>{((housedCount / totalPeople) * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${(housedCount / totalPeople) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span>Homeless</span>
              <span>{((homelessCount / totalPeople) * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-red-600 h-2.5 rounded-full"
                style={{ width: `${(homelessCount / totalPeople) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Financial stats */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Financial Overview</h2>
          <div className="mt-2">
            <h3 className="font-medium mb-2">Income Statistics</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Average Weekly Income:{" "}
              <span className="font-semibold">${averageIncome.toFixed(2)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
