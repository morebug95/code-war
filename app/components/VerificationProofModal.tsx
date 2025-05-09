"use client";

import { useState } from "react";
import Image from "next/image";
import { Transaction } from "../redux/transactionSlice";
import { useAppDispatch } from "../redux/hooks";
import { addVerificationProof } from "../redux/transactionSlice";

interface VerificationProofModalProps {
  transaction: Transaction;
  isOpen: boolean;
  onClose: () => void;
}

export default function VerificationProofModal({
  transaction,
  isOpen,
  onClose,
}: VerificationProofModalProps) {
  const dispatch = useAppDispatch();
  const [notes, setNotes] = useState(
    transaction.verificationProof?.notes || ""
  );
  const [verifier, setVerifier] = useState(
    transaction.verificationProof?.verifiedBy || "System Verifier"
  );
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  const handleVerify = () => {
    setIsVerifying(true);

    // Simulate verification delay
    setTimeout(() => {
      dispatch(
        addVerificationProof({
          transactionId: transaction.id,
          verifiedBy: verifier,
          notes,
        })
      );
      setIsVerifying(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-xl">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-bold">Transaction Verification</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {transaction.verificationProof?.isVerified ? (
          <div>
            <div className="mb-6 bg-green-50 dark:bg-green-900 p-4 rounded-lg">
              <p className="text-green-700 dark:text-green-300 font-medium">
                This transaction has been verified
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                Verified by: {transaction.verificationProof.verifiedBy}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                Verification time:{" "}
                {transaction.verificationProof.verificationTime
                  ? formatDate(transaction.verificationProof.verificationTime)
                  : "Unknown"}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Delivery Proof</h3>
              <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                {transaction.verificationProof.proofImageUrl ? (
                  <div className="relative w-full h-64">
                    <Image
                      src={transaction.verificationProof.proofImageUrl}
                      alt="Verification proof"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                ) : (
                  <div className="bg-gray-100 dark:bg-gray-700 w-full h-64 flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      No proof image available
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Notes</h3>
              <p className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                {transaction.verificationProof.notes || "No notes provided"}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Transaction Details</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    From:
                  </p>
                  <p className="font-medium">{transaction.sender}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    To:
                  </p>
                  <p className="font-medium">{transaction.recipient}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Amount:
                  </p>
                  <p className="font-medium">{transaction.amount} COINS</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Transaction Date:
                  </p>
                  <p className="font-medium">
                    {formatDate(transaction.timestamp)}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6 bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
              <p className="text-yellow-700 dark:text-yellow-300 font-medium">
                This transaction has not been verified yet
              </p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                Verify that the funds have been properly delivered to the
                recipient
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Verifier
              </label>
              <input
                type="text"
                value={verifier}
                onChange={(e) => setVerifier(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Verification Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                rows={3}
                placeholder="Describe how the delivery was confirmed"
              />
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Transaction Details</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    From:
                  </p>
                  <p className="font-medium">{transaction.sender}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    To:
                  </p>
                  <p className="font-medium">{transaction.recipient}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Amount:
                  </p>
                  <p className="font-medium">{transaction.amount} COINS</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Transaction Date:
                  </p>
                  <p className="font-medium">
                    {formatDate(transaction.timestamp)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleVerify}
                disabled={isVerifying}
                className={`px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center ${
                  isVerifying ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isVerifying && (
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                {isVerifying ? "Verifying..." : "Verify Transaction"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
