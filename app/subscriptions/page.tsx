"use client";

import { useEffect } from "react";
import { useAppDispatch } from "../redux/hooks";
import { processDueSubscriptions } from "../redux/subscriptionSlice";
import SubscriptionManager from "../components/SubscriptionManager";

export default function SubscriptionsPage() {
  const dispatch = useAppDispatch();

  // Simulate checking for due subscriptions
  useEffect(() => {
    // Process any due subscriptions on page load
    dispatch(processDueSubscriptions());

    // Set up recurring check every 60 seconds (simulating a real system)
    const interval = setInterval(() => {
      dispatch(processDueSubscriptions());
    }, 60000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Recurring Donations</h1>

      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Manage your recurring donations below. You can change the frequency or
          cancel them at any time.
        </p>
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-2">
            How Recurring Donations Work
          </h2>
          <ul className="list-disc pl-5 text-blue-700 dark:text-blue-300 space-y-1 text-sm">
            <li>
              Your donation will be processed automatically on the scheduled
              date
            </li>
            <li>You will receive a notification for each processed donation</li>
            <li>The same amount will be donated each time</li>
            <li>Donations will continue until you cancel the subscription</li>
          </ul>
        </div>
      </div>

      <SubscriptionManager />

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">
          Benefits of Recurring Donations
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2">Sustained Support</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Provide consistent, reliable help that recipients can count on
              month after month.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2">Long-term Impact</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Enable recipients to plan ahead and make meaningful progress
              toward their goals.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2">Convenience</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Set it up once and know you're making a difference without having
              to remember to donate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
