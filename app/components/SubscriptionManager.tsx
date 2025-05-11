"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  Subscription,
  SubscriptionFrequency,
  cancelSubscription,
  updateSubscription,
} from "../redux/subscriptionSlice";

export default function SubscriptionManager() {
  const dispatch = useAppDispatch();
  const subscriptions = useAppSelector(
    (state) => state.subscriptions.subscriptions
  );
  const activeSubscriptions = subscriptions.filter((sub) => sub.active);

  const [editingSubscription, setEditingSubscription] = useState<string | null>(
    null
  );

  if (activeSubscriptions.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Recurring Donations</h2>
        <p className="text-gray-500 dark:text-gray-400">
          You don't have any active recurring donations.
        </p>
      </div>
    );
  }

  const formatFrequency = (frequency: SubscriptionFrequency): string => {
    switch (frequency) {
      case "weekly":
        return "Weekly";
      case "monthly":
        return "Monthly";
      case "quarterly":
        return "Quarterly";
      default:
        return "Unknown";
    }
  };

  const formatNextPaymentDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString();
  };

  const handleCancelSubscription = (subscriptionId: string) => {
    if (confirm("Are you sure you want to cancel this recurring donation?")) {
      dispatch(cancelSubscription(subscriptionId));
    }
  };

  const handleUpdateFrequency = (
    subscriptionId: string,
    frequency: SubscriptionFrequency
  ) => {
    dispatch(
      updateSubscription({
        id: subscriptionId,
        updates: { frequency },
      })
    );
    setEditingSubscription(null);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Active Recurring Donations</h2>
      <div className="space-y-4">
        {activeSubscriptions.map((subscription) => (
          <div
            key={subscription.id}
            className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">
                  {subscription.personName}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {subscription.description}
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold">
                  {subscription.amount} COINS
                </span>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {formatFrequency(subscription.frequency)}
                </p>
              </div>
            </div>
            <div className="mt-2 text-sm">
              <p>
                Next payment:{" "}
                {formatNextPaymentDate(subscription.nextPaymentDate)}
              </p>
              {subscription.targetMilestone && (
                <p className="text-gray-500 dark:text-gray-400">
                  Targeted for specific milestone
                </p>
              )}
            </div>

            <div className="mt-4 flex justify-between items-center">
              {editingSubscription === subscription.id ? (
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      handleUpdateFrequency(subscription.id, "weekly")
                    }
                    className={`px-2 py-1 text-xs rounded ${
                      subscription.frequency === "weekly"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-600"
                    }`}
                  >
                    Weekly
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateFrequency(subscription.id, "monthly")
                    }
                    className={`px-2 py-1 text-xs rounded ${
                      subscription.frequency === "monthly"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-600"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateFrequency(subscription.id, "quarterly")
                    }
                    className={`px-2 py-1 text-xs rounded ${
                      subscription.frequency === "quarterly"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-600"
                    }`}
                  >
                    Quarterly
                  </button>
                  <button
                    onClick={() => setEditingSubscription(null)}
                    className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 rounded"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingSubscription(subscription.id)}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Change frequency
                </button>
              )}
              <button
                onClick={() => handleCancelSubscription(subscription.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Cancel donation
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
