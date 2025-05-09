"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { createDonation } from "../redux/transactionSlice";
import { deductFromBalance } from "../redux/userSlice";
import { Person } from "../types";

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

  if (!isOpen) return null;

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

    // Create donation transaction
    dispatch(
      createDonation({
        sender: "User",
        recipient: person.name,
        amount,
        description,
      })
    );

    // Deduct from user balance
    dispatch(deductFromBalance(amount));

    // Close modal
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Donate to {person.name}</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount (COINS)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
              min="1"
              max={userBalance}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Your balance: {userBalance} COINS
            </p>
          </div>

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
              Donate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
