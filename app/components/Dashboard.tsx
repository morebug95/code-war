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

  // Calculate education level distribution
  const educationLevels = {
    none: people.filter((p) => p.educationLevel === "none").length,
    primary: people.filter((p) => p.educationLevel === "primary").length,
    secondary: people.filter((p) => p.educationLevel === "secondary").length,
    highschool: people.filter((p) => p.educationLevel === "highschool").length,
    college: people.filter((p) => p.educationLevel === "college").length,
    university: people.filter((p) => p.educationLevel === "university").length,
  };

  // Calculate employment status breakdown
  const employmentStatus = {
    unemployed: people.filter((p) => p.employmentStatus === "unemployed")
      .length,
    partTime: people.filter((p) => p.employmentStatus === "part-time").length,
    fullTime: people.filter((p) => p.employmentStatus === "full-time").length,
    casual: people.filter((p) => p.employmentStatus === "casual").length,
    retired: people.filter((p) => p.employmentStatus === "retired").length,
    student: people.filter((p) => p.employmentStatus === "student").length,
  };

  // Calculate health status statistics
  const healthStatus = {
    excellent: people.filter((p) => p.healthStatus === "excellent").length,
    good: people.filter((p) => p.healthStatus === "good").length,
    fair: people.filter((p) => p.healthStatus === "fair").length,
    poor: people.filter((p) => p.healthStatus === "poor").length,
    critical: people.filter((p) => p.healthStatus === "critical").length,
  };

  // Calculate support needs
  const supportNeeds: Record<string, number> = {};
  people.forEach((person) => {
    person.supportNeeds.forEach((need) => {
      supportNeeds[need] = (supportNeeds[need] || 0) + 1;
    });
  });

  // Sort support needs by frequency
  const topSupportNeeds: [string, number][] = Object.entries(supportNeeds)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

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

      {/* Education Level Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Education Level</h2>
          {Object.entries(educationLevels).map(([level, count]) => (
            <div className="mb-3" key={level}>
              <div className="flex justify-between mb-1">
                <span className="capitalize">
                  {level.replace(/([A-Z])/g, " $1").trim()}
                </span>
                <span>{((count / totalPeople) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full"
                  style={{ width: `${(count / totalPeople) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Employment Status */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Employment Status</h2>
          {Object.entries(employmentStatus).map(([status, count]) => (
            <div className="mb-3" key={status}>
              <div className="flex justify-between mb-1">
                <span className="capitalize">
                  {status.replace(/([A-Z])/g, " $1").trim()}
                </span>
                <span>{((count / totalPeople) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-teal-600 h-2.5 rounded-full"
                  style={{ width: `${(count / totalPeople) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Health Status and Support Needs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Health Status</h2>
          {Object.entries(healthStatus).map(([status, count]) => (
            <div className="mb-3" key={status}>
              <div className="flex justify-between mb-1">
                <span className="capitalize">{status}</span>
                <span>{((count / totalPeople) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className={`${
                    status === "excellent"
                      ? "bg-green-600"
                      : status === "good"
                      ? "bg-green-500"
                      : status === "fair"
                      ? "bg-yellow-500"
                      : status === "poor"
                      ? "bg-orange-500"
                      : "bg-red-600"
                  } h-2.5 rounded-full`}
                  style={{ width: `${(count / totalPeople) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Top Support Needs */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Top Support Needs</h2>
          {topSupportNeeds.map(([need, count]) => (
            <div className="mb-3" key={need}>
              <div className="flex justify-between mb-1">
                <span className="capitalize">{need}</span>
                <span>{count} people</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-purple-600 h-2.5 rounded-full"
                  style={{ width: `${(count / totalPeople) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
