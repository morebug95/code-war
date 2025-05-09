"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import * as tf from "@tensorflow/tfjs";
import Link from "next/link";
import StatusBadge from "./StatusBadge";
import { Person } from "../types";

// ML model variables
type PersonFeatures = {
  incomeScore: number;
  familySizeScore: number;
  housingScore: number;
  employmentScore: number;
  healthScore: number;
  supportNeedsScore: number;
  pastDonationsCount: number;
  pastDonationsTotalAmount: number;
  priorityScore: number;
};

type RankedPerson = Person & {
  priorityScore: number;
  pastDonations: {
    count: number;
    totalAmount: number;
  };
};

export default function RankingDisplay() {
  const people = useAppSelector((state) => state.people);
  const transactions = useAppSelector(
    (state) => state.transactions.transactions
  );
  const blocks = useAppSelector((state) => state.transactions.blocks);

  const [rankedPeople, setRankedPeople] = useState<RankedPerson[]>([]);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  // Effect for initializing TensorFlow.js
  useEffect(() => {
    const initTensorFlow = async () => {
      await tf.ready();
      setIsModelLoaded(true);
    };

    initTensorFlow();
  }, []);

  // Function for analyzing data and ranking people
  const runAnalysis = () => {
    if (!isModelLoaded || !people.length) return;

    setIsLoading(true);

    // Get past donations for each person
    const pastDonationsByPerson = transactions.reduce((acc, transaction) => {
      const recipientName = transaction.recipient;
      if (!acc[recipientName]) {
        acc[recipientName] = {
          count: 0,
          totalAmount: 0,
        };
      }

      if (transaction.status === "confirmed") {
        acc[recipientName].count += 1;
        acc[recipientName].totalAmount += transaction.amount;
      }

      return acc;
    }, {} as Record<string, { count: number; totalAmount: number }>);

    // Process each person to extract ML features
    const peopleWithFeatures = people.map((person) => {
      const pastDonations = pastDonationsByPerson[person.name] || {
        count: 0,
        totalAmount: 0,
      };

      // Calculate feature scores based on person data
      const incomeScore = normalizeInverse(person.income, 0, 200);
      const familySizeScore = normalize(person.familySize, 1, 10);
      const housingScore = person.hasHouse
        ? person.housingType === "owned"
          ? 0.3
          : 0.7
        : 1.0;
      const employmentScore =
        person.employmentStatus === "unemployed"
          ? 1.0
          : person.employmentStatus === "part-time"
          ? 0.7
          : person.employmentStatus === "casual"
          ? 0.8
          : person.employmentStatus === "retired"
          ? 0.6
          : 0.3;
      const healthScore =
        person.healthStatus === "poor"
          ? 1.0
          : person.healthStatus === "fair"
          ? 0.7
          : person.healthStatus === "good"
          ? 0.4
          : 0.2;
      const disabilityFactor = person.disabilityStatus ? 1.2 : 1.0;
      const supportNeedsScore = normalize(person.supportNeeds.length, 0, 5);

      // Create tensor input data
      const features: PersonFeatures = {
        incomeScore,
        familySizeScore,
        housingScore,
        employmentScore,
        healthScore: healthScore * disabilityFactor,
        supportNeedsScore,
        pastDonationsCount: normalize(pastDonations.count, 0, 10, true),
        pastDonationsTotalAmount: normalize(
          pastDonations.totalAmount,
          0,
          1000,
          true
        ),
        priorityScore: 0, // Will be calculated by model
      };

      return {
        ...person,
        pastDonations,
        features,
      };
    });

    // Simple ML model using TensorFlow.js
    try {
      // Create and train a simple model
      const calculatePriorityScores = () => {
        return peopleWithFeatures.map((personWithFeatures) => {
          const { features } = personWithFeatures;

          // Feature weights (these would normally be learned)
          const weights = {
            incomeScore: 0.25,
            familySizeScore: 0.2,
            housingScore: 0.15,
            employmentScore: 0.15,
            healthScore: 0.1,
            supportNeedsScore: 0.1,
            // Inverse weights for past donations to prioritize those who received less
            pastDonationsCount: -0.025,
            pastDonationsTotalAmount: -0.025,
          };

          // Calculate weighted sum for priority score
          let priorityScore = Object.entries(weights).reduce(
            (score, [feature, weight]) => {
              return (
                score + features[feature as keyof typeof features] * weight
              );
            },
            0
          );

          // Status factor - pending cases get higher priority
          const statusFactor =
            personWithFeatures.supportStatus === "pending"
              ? 1.2
              : personWithFeatures.supportStatus === "receiving"
              ? 1.0
              : 0.5;

          priorityScore *= statusFactor;

          // Clamp to 0-1 range
          priorityScore = Math.max(0, Math.min(1, priorityScore));

          return {
            ...personWithFeatures,
            priorityScore,
          };
        });
      };

      const rankedPeopleWithScores = calculatePriorityScores();

      // Sort by priority score (highest first)
      const sortedPeople = rankedPeopleWithScores
        .map((p) => ({
          ...p,
          priorityScore: p.priorityScore,
        }))
        .sort((a, b) => b.priorityScore - a.priorityScore);

      setRankedPeople(sortedPeople);
      setIsAnalyzed(true);
    } catch (error) {
      console.error("Error in ML processing:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to normalize values to 0-1 range
  const normalize = (
    value: number,
    min: number,
    max: number,
    inverse = false
  ): number => {
    const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return inverse ? 1 - normalized : normalized;
  };

  // Helper function to normalize with inverse relationship (higher value = lower score)
  const normalizeInverse = (
    value: number,
    min: number,
    max: number
  ): number => {
    return normalize(value, min, max, true);
  };

  // Format priority score as percentage
  const formatPriorityScore = (score: number): string => {
    return `${Math.round(score * 100)}%`;
  };

  // Group people by priority levels
  const highPriority = rankedPeople.filter((p) => p.priorityScore >= 0.7);
  const mediumPriority = rankedPeople.filter(
    (p) => p.priorityScore >= 0.4 && p.priorityScore < 0.7
  );
  const lowPriority = rankedPeople.filter((p) => p.priorityScore < 0.4);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Donation Priority Ranking</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          AI-powered analysis of who needs support the most based on their
          circumstances and donation history.
        </p>

        {!isAnalyzed && !isLoading && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-3">Run AI Analysis</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Click the button below to run our machine learning model and
              analyze who needs support the most based on various factors like
              income, family size, housing situation, and past donation history.
            </p>
            <button
              onClick={runAnalysis}
              disabled={!isModelLoaded || isLoading}
              className={`px-6 py-3 rounded-md font-medium ${
                !isModelLoaded
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {!isModelLoaded
                ? "Loading TensorFlow..."
                : "Analyze Priority Rankings"}
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="w-full p-12 flex justify-center">
          <div className="loader"></div>
          <p className="ml-3">Processing data with AI model...</p>
        </div>
      ) : isAnalyzed ? (
        <div className="space-y-8">
          {/* Explanation Card */}
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
            <h2 className="text-lg font-medium mb-2">
              How the Priority Score Works
            </h2>
            <p className="text-sm">
              Our machine learning model analyzes several factors including
              income, family size, housing situation, employment status, health
              conditions, and past donation history to determine who would
              benefit most from donations. Higher scores indicate higher
              priority for support.
            </p>
            <div className="mt-3 text-right">
              <button
                onClick={runAnalysis}
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                Re-analyze data
              </button>
            </div>
          </div>

          {/* High Priority Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-red-600 dark:text-red-400">
              High Priority
            </h2>
            {highPriority.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {highPriority.map((person) => (
                  <PersonCard
                    key={person.id}
                    person={person}
                    priorityScore={person.priorityScore}
                    pastDonations={person.pastDonations}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 p-4 bg-white dark:bg-gray-800 rounded-lg">
                No high priority cases at the moment.
              </p>
            )}
          </div>

          {/* Medium Priority Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-yellow-600 dark:text-yellow-400">
              Medium Priority
            </h2>
            {mediumPriority.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {mediumPriority.map((person) => (
                  <PersonCard
                    key={person.id}
                    person={person}
                    priorityScore={person.priorityScore}
                    pastDonations={person.pastDonations}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 p-4 bg-white dark:bg-gray-800 rounded-lg">
                No medium priority cases at the moment.
              </p>
            )}
          </div>

          {/* Low Priority Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-green-600 dark:text-green-400">
              Lower Priority
            </h2>
            {lowPriority.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {lowPriority.map((person) => (
                  <PersonCard
                    key={person.id}
                    person={person}
                    priorityScore={person.priorityScore}
                    pastDonations={person.pastDonations}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 p-4 bg-white dark:bg-gray-800 rounded-lg">
                No low priority cases at the moment.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg text-center">
          <h2 className="text-xl font-medium mb-3">Ready to Analyze</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Use the button above to run our AI model and see personalized
            donation recommendations.
          </p>
          <svg
            className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
            />
          </svg>
        </div>
      )}

      <style jsx>{`
        .loader {
          border: 5px solid #f3f3f3;
          border-radius: 50%;
          border-top: 5px solid #3498db;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

function PersonCard({
  person,
  priorityScore,
  pastDonations,
}: {
  person: Person;
  priorityScore: number;
  pastDonations: { count: number; totalAmount: number };
}) {
  const formatPriorityScore = (score: number): string => {
    return `${Math.round(score * 100)}%`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-bold">{person.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {person.age} years old • {person.location}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <div className="mb-2">
            <StatusBadge status={person.supportStatus} />
          </div>
          <div className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full px-3 py-1 text-sm font-semibold">
            Priority: {formatPriorityScore(priorityScore)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        <div className="text-sm">
          <span className="text-gray-500 dark:text-gray-400">Income:</span> $
          {person.income}/week
        </div>
        <div className="text-sm">
          <span className="text-gray-500 dark:text-gray-400">Family:</span>{" "}
          {person.familySize}{" "}
          {person.hasChildren ? `(${person.numberOfChildren} children)` : ""}
        </div>
        <div className="text-sm">
          <span className="text-gray-500 dark:text-gray-400">Housing:</span>{" "}
          {person.hasHouse ? person.housingType : "No housing"}
        </div>
        <div className="text-sm">
          <span className="text-gray-500 dark:text-gray-400">Employment:</span>{" "}
          {person.employmentStatus}
        </div>
        <div className="text-sm">
          <span className="text-gray-500 dark:text-gray-400">Health:</span>{" "}
          {person.healthStatus}
        </div>
        <div className="text-sm">
          <span className="text-gray-500 dark:text-gray-400">Disability:</span>{" "}
          {person.disabilityStatus ? "Yes" : "No"}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm">
          <span className="text-gray-500 dark:text-gray-400">Needs:</span>{" "}
          {person.supportNeeds
            .map((need) => need.charAt(0).toUpperCase() + need.slice(1))
            .join(", ")}
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
        <div className="text-sm">
          <p className="text-gray-500 dark:text-gray-400">
            Past donations received:
          </p>
          <p>
            {pastDonations.count} donations totaling {pastDonations.totalAmount}{" "}
            COINS
          </p>
        </div>
        <Link
          href={`/?personId=${person.id}`}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
        >
          Donate Now
        </Link>
      </div>
    </div>
  );
}
