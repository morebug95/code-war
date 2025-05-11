"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { createDonation } from "../redux/transactionSlice";
import { deductFromBalance } from "../redux/userSlice";
import { addFunds } from "../redux/peopleSlice";
import { Person, Milestone } from "../types";
import RecurringDonationOptions from "./RecurringDonationOptions";
import {
  SubscriptionFrequency,
  createSubscription,
} from "../redux/subscriptionSlice";

interface DonationModalProps {
  person: Person;
  isOpen: boolean;
  onClose: () => void;
}

export default function DonationModal({
  person,
  isOpen,
  onClose,
}: DonationModalProps) {
  const dispatch = useAppDispatch();
  const userBalance = useAppSelector((state) => state.user.balance);
  const [amount, setAmount] = useState<number>(10);
  const [description, setDescription] = useState<string>(
    `Donation to ${person.name}`
  );
  const [error, setError] = useState<string>("");
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [potentialMilestones, setPotentialMilestones] = useState<Milestone[]>(
    []
  );
  const [selectedMilestone, setSelectedMilestone] = useState<string>("general");
  const [recurringFrequency, setRecurringFrequency] =
    useState<SubscriptionFrequency | null>(null);

  if (!isOpen) return null;

  // Calculate progress percentage
  const progressPercentage = Math.min(
    100,
    Math.round((person.currentFunds / person.fundraisingGoal) * 100)
  );

  // Determine next milestone
  const nextMilestone = person.fundraisingMilestones
    .filter((m) => !m.isReached)
    .sort((a, b) => a.amount - b.amount)[0];

  // Calculate milestone progress
  const calculateMilestoneProgress = (milestone: Milestone) => {
    if (milestone.isReached) return 100;

    // For unreached milestones
    const previousMilestone = person.fundraisingMilestones
      .filter((m) => m.isReached && m.amount < milestone.amount)
      .sort((a, b) => b.amount - a.amount)[0];

    const baseAmount = previousMilestone ? previousMilestone.amount : 0;
    const targetAmount = milestone.amount - baseAmount;
    const currentProgress = Math.min(
      person.currentFunds - baseAmount,
      targetAmount
    );

    return Math.max(0, Math.round((currentProgress / targetAmount) * 100));
  };

  // Organize milestones by status
  const completedMilestones = person.fundraisingMilestones
    .filter((m) => m.isReached)
    .sort((a, b) => a.amount - b.amount);

  const pendingMilestones = person.fundraisingMilestones
    .filter((m) => !m.isReached)
    .sort((a, b) => a.amount - b.amount);

  // Find the next milestone that would be reached with this donation
  const calculateNewMilestones = (donationAmount: number) => {
    const newTotal = person.currentFunds + donationAmount;
    return person.fundraisingMilestones
      .filter((m) => !m.isReached && newTotal >= m.amount)
      .sort((a, b) => a.amount - b.amount);
  };

  const handleAmountChange = (value: number) => {
    setAmount(value);
    const newPotentialMilestones = calculateNewMilestones(value);
    setPotentialMilestones(newPotentialMilestones);
  };

  const handleMilestoneChange = (milestoneId: string) => {
    setSelectedMilestone(milestoneId);
    if (milestoneId !== "general") {
      const milestone = person.fundraisingMilestones.find(
        (m) => m.id === milestoneId
      );
      if (milestone) {
        // Calculate how much more is needed to reach this milestone
        const previousMilestone = person.fundraisingMilestones
          .filter((m) => m.isReached && m.amount < milestone.amount)
          .sort((a, b) => b.amount - a.amount)[0];

        const baseAmount = previousMilestone ? previousMilestone.amount : 0;
        const remainingAmount = milestone.isReached
          ? 0
          : Math.max(0, milestone.amount - person.currentFunds);

        if (remainingAmount > 0) {
          setAmount(remainingAmount);
          setDescription(`Donation to ${person.name} for ${milestone.title}`);
        }
      }
    } else {
      setDescription(`Donation to ${person.name}`);
    }
  };

  const handleFrequencyChange = (frequency: SubscriptionFrequency | null) => {
    setRecurringFrequency(frequency);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate amount
    if (amount <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    // Check if user has enough balance
    if (amount > userBalance) {
      setError("Insufficient balance");
      return;
    }

    let finalDescription = description;
    if (selectedMilestone !== "general") {
      const milestone = person.fundraisingMilestones.find(
        (m) => m.id === selectedMilestone
      );
      if (milestone) {
        finalDescription = `Donation to ${person.name} for ${milestone.title}`;
      }
    }

    // Create donation transaction
    dispatch(
      createDonation({
        sender: "User",
        recipient: person.name,
        amount,
        description: finalDescription,
        targetMilestone:
          selectedMilestone !== "general" ? selectedMilestone : undefined,
      })
    );

    // Deduct from user balance
    dispatch(deductFromBalance(amount));

    // Add funds to person's campaign
    dispatch(
      addFunds({
        personId: person.id,
        amount,
        targetMilestone:
          selectedMilestone !== "general" ? selectedMilestone : undefined,
      })
    );

    // Create subscription if recurring donation
    if (recurringFrequency) {
      dispatch(
        createSubscription({
          personId: person.id,
          personName: person.name,
          amount,
          frequency: recurringFrequency,
          description: finalDescription,
          targetMilestone:
            selectedMilestone !== "general" ? selectedMilestone : undefined,
        })
      );
    }

    // Show celebration if milestones are reached
    if (potentialMilestones.length > 0) {
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        onClose();
      }, 3000);
    } else {
      // Close modal
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
        {showCelebration ? (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">
              🎉 Milestone Reached! 🎉
            </h2>
            <div className="space-y-3 mb-6">
              {potentialMilestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="bg-green-50 dark:bg-green-900 p-4 rounded-lg"
                >
                  <h3 className="font-bold text-green-700 dark:text-green-300">
                    {milestone.title}
                  </h3>
                  <p className="text-green-600 dark:text-green-400">
                    {milestone.description}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Thank you for your generous donation! You've helped {person.name}{" "}
              reach{" "}
              {potentialMilestones.length > 1
                ? "these important milestones"
                : "this important milestone"}
              .
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-2">Donate to {person.name}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {person.campaignDescription}
            </p>

            {/* Fundraising Progress */}
            <div className="mb-6">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">
                  Progress: ${person.currentFunds} of ${person.fundraisingGoal}
                </span>
                <span className="text-sm font-medium">
                  {progressPercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>

              {nextMilestone && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Next milestone:{" "}
                  <span className="font-medium">{nextMilestone.title}</span> at
                  ${nextMilestone.amount}
                  {person.currentFunds < nextMilestone.amount && (
                    <span>
                      {" "}
                      (${nextMilestone.amount - person.currentFunds} more
                      needed)
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Milestone Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Select a milestone to fund
              </label>
              <select
                value={selectedMilestone}
                onChange={(e) => handleMilestoneChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
              >
                <option value="general">
                  General donation (fund all milestones)
                </option>
                {pendingMilestones.map((milestone) => {
                  const progress = calculateMilestoneProgress(milestone);
                  const neededAmount = milestone.amount - person.currentFunds;
                  return (
                    <option key={milestone.id} value={milestone.id}>
                      {milestone.title} - ${milestone.amount}
                      {progress > 0 && ` (${progress}% funded)`}
                      {neededAmount > 0 && ` - ${neededAmount} more needed`}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Milestones Progress */}
            <div className="mb-6">
              <h3 className="text-md font-medium mb-2">Campaign Milestones</h3>
              <div className="space-y-3 max-h-48 overflow-y-auto mb-2">
                {/* Completed Milestones */}
                {completedMilestones.length > 0 && (
                  <div className="mb-2">
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Completed Milestones
                    </h4>
                    <div className="space-y-2">
                      {completedMilestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          className="p-2 rounded-md text-sm bg-green-100 dark:bg-green-900"
                        >
                          <div className="flex justify-between">
                            <span className="font-medium">
                              {milestone.title}
                            </span>
                            <span>${milestone.amount}</span>
                          </div>
                          <div className="text-xs mt-1 text-green-700 dark:text-green-300">
                            {milestone.description}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 dark:bg-gray-700">
                            <div
                              className="bg-green-500 h-1.5 rounded-full"
                              style={{ width: "100%" }}
                            ></div>
                          </div>
                          <div className="text-xs mt-1 text-green-600 dark:text-green-400">
                            Reached{" "}
                            {milestone.reachedAt
                              ? new Date(
                                  milestone.reachedAt
                                ).toLocaleDateString()
                              : ""}
                          </div>
                          {potentialMilestones.some(
                            (m) => m.id === milestone.id
                          ) && (
                            <div className="mt-1 text-green-600 dark:text-green-400 text-xs">
                              Will be reached with your donation! 🎉
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pending Milestones */}
                {pendingMilestones.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Upcoming Milestones
                    </h4>
                    <div className="space-y-2">
                      {pendingMilestones.map((milestone) => {
                        const progress = calculateMilestoneProgress(milestone);
                        return (
                          <div
                            key={milestone.id}
                            className={`p-2 rounded-md text-sm ${
                              selectedMilestone === milestone.id
                                ? "bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700"
                                : "bg-gray-100 dark:bg-gray-700"
                            }`}
                          >
                            <div className="flex justify-between">
                              <span className="font-medium">
                                {milestone.title}
                              </span>
                              <span>${milestone.amount}</span>
                            </div>
                            <div className="text-xs mt-1">
                              {milestone.description}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 dark:bg-gray-700">
                              <div
                                className={`${
                                  selectedMilestone === milestone.id
                                    ? "bg-blue-500"
                                    : "bg-gray-500"
                                } h-1.5 rounded-full`}
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs mt-1">
                              <span>{progress}% complete</span>
                              <span>
                                $
                                {milestone.amount - person.currentFunds > 0
                                  ? `${
                                      milestone.amount - person.currentFunds
                                    } more needed`
                                  : "Fully funded"}
                              </span>
                            </div>
                            {potentialMilestones.some(
                              (m) => m.id === milestone.id
                            ) && (
                              <div className="mt-1 text-green-600 dark:text-green-400 text-xs">
                                Will be reached with your donation! 🎉
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Amount (COINS)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => handleAmountChange(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                min="1"
                max={userBalance}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Your balance: {userBalance} COINS
              </p>
            </div>

            {/* Recurring Donation Options */}
            <RecurringDonationOptions
              selectedFrequency={recurringFrequency}
              onSelect={handleFrequencyChange}
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                rows={3}
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                {recurringFrequency ? "Set Up Recurring Donation" : "Donate"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
