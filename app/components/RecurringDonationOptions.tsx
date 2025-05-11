"use client";

import { useState } from "react";
import { SubscriptionFrequency } from "../redux/subscriptionSlice";

interface RecurringDonationOptionsProps {
  onSelect: (frequency: SubscriptionFrequency | null) => void;
  selectedFrequency: SubscriptionFrequency | null;
}

export default function RecurringDonationOptions({
  onSelect,
  selectedFrequency,
}: RecurringDonationOptionsProps) {
  const [isRecurring, setIsRecurring] = useState<boolean>(!!selectedFrequency);

  const handleRecurringToggle = (checked: boolean) => {
    setIsRecurring(checked);
    if (!checked) {
      onSelect(null);
    } else {
      // Default to monthly if toggled on
      onSelect("monthly");
    }
  };

  const handleFrequencyChange = (frequency: SubscriptionFrequency) => {
    onSelect(frequency);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center mb-2">
        <input
          type="checkbox"
          id="recurring-toggle"
          checked={isRecurring}
          onChange={(e) => handleRecurringToggle(e.target.checked)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label
          htmlFor="recurring-toggle"
          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Make this a recurring donation
        </label>
      </div>

      {isRecurring && (
        <div className="pl-6 pt-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Select how often you would like to donate this amount
          </p>
          <div className="flex space-x-2">
            <FrequencyButton
              frequency="weekly"
              label="Weekly"
              isSelected={selectedFrequency === "weekly"}
              onClick={handleFrequencyChange}
            />
            <FrequencyButton
              frequency="monthly"
              label="Monthly"
              isSelected={selectedFrequency === "monthly"}
              onClick={handleFrequencyChange}
            />
            <FrequencyButton
              frequency="quarterly"
              label="Quarterly"
              isSelected={selectedFrequency === "quarterly"}
              onClick={handleFrequencyChange}
            />
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            <p>
              Your donation will automatically process on the same day each
              period.
            </p>
            <p>You can cancel your recurring donation at any time.</p>
          </div>
        </div>
      )}
    </div>
  );
}

interface FrequencyButtonProps {
  frequency: SubscriptionFrequency;
  label: string;
  isSelected: boolean;
  onClick: (frequency: SubscriptionFrequency) => void;
}

function FrequencyButton({
  frequency,
  label,
  isSelected,
  onClick,
}: FrequencyButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(frequency)}
      className={`px-3 py-1 text-sm rounded ${
        isSelected
          ? "bg-blue-500 text-white"
          : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
      }`}
    >
      {label}
    </button>
  );
}
