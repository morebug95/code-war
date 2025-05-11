"use client";

import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { useState } from "react";
import { Transaction, mineBlock } from "../redux/transactionSlice";
import VerificationProofModal from "./VerificationProofModal";
import Link from "next/link";

export default function BlockchainExplorer() {
  const dispatch = useAppDispatch();
  const { blocks, transactions, pendingTransactions } = useAppSelector(
    (state) => state.transactions
  );
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  // Format date
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  // Format hash for display (truncate)
  const formatHash = (hash: string): string => {
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
  };

  // Handle transaction selection
  const handleTransactionClick = (tx: Transaction) => {
    setSelectedTransaction(tx);
  };

  // Handle mining
  const handleMineBlock = () => {
    dispatch(mineBlock());
  };

  // Handle verification
  const handleVerifyTransaction = () => {
    if (selectedTransaction) {
      setShowVerificationModal(true);
    }
  };

  // Handle closing verification modal
  const handleCloseVerificationModal = () => {
    setShowVerificationModal(false);
  };

  // Get all confirmed transactions from blocks
  const confirmedTransactions = blocks.flatMap((block) => block.transactions);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blockchain Explorer</h1>
        <Link
          href="/blockchain/verification-info"
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          Verification System Info
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Completed Transactions */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Completed Transactions</h2>
          <div className="overflow-x-auto">
            {confirmedTransactions.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      From
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      To
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Verified
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {confirmedTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => handleTransactionClick(tx)}
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {formatHash(tx.id)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {tx.sender}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {tx.recipient}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        ${tx.amount}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {tx.verificationProof?.isVerified ? (
                          <span className="text-green-600 dark:text-green-400 flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              ></path>
                            </svg>
                            Yes
                          </span>
                        ) : (
                          <span className="text-yellow-600 dark:text-yellow-400">
                            No
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No completed transactions
              </p>
            )}
          </div>
        </div>

        {/* Transaction details column */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Transaction Details</h2>
          {selectedTransaction ? (
            <div>
              <div className="mb-3">
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  Transaction ID:
                </span>
                <p className="font-medium">{selectedTransaction.id}</p>
              </div>
              <div className="mb-3">
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  Status:
                </span>
                <p
                  className={`font-medium ${
                    selectedTransaction.status === "confirmed"
                      ? "text-green-500"
                      : selectedTransaction.status === "pending"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {selectedTransaction.status.charAt(0).toUpperCase() +
                    selectedTransaction.status.slice(1)}
                </p>
              </div>
              <div className="mb-3">
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  Timestamp:
                </span>
                <p className="font-medium">
                  {formatDate(selectedTransaction.timestamp)}
                </p>
              </div>
              <div className="mb-3">
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  From:
                </span>
                <p className="font-medium">{selectedTransaction.sender}</p>
              </div>
              <div className="mb-3">
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  To:
                </span>
                <p className="font-medium">{selectedTransaction.recipient}</p>
              </div>
              <div className="mb-3">
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  Amount:
                </span>
                <p className="font-medium">${selectedTransaction.amount}</p>
              </div>
              <div className="mb-3">
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  Description:
                </span>
                <p className="font-medium">{selectedTransaction.description}</p>
              </div>
              <div className="mb-3">
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  Transaction Hash:
                </span>
                <p className="font-mono text-xs break-all">
                  {selectedTransaction.hash}
                </p>
              </div>

              {/* Verification status section */}
              <div className="mb-3 mt-6 border-t border-gray-200 dark:border-gray-700 pt-3">
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  Verification Status:
                </span>
                {selectedTransaction.verificationProof?.isVerified ? (
                  <div className="bg-green-50 dark:bg-green-900 rounded p-3 mt-2">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-green-600 dark:text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <p className="font-medium text-green-600 dark:text-green-400">
                        Verified
                      </p>
                    </div>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      Verified by:{" "}
                      {selectedTransaction.verificationProof.verifiedBy}
                    </p>
                    <button
                      onClick={handleVerifyTransaction}
                      className="mt-2 text-sm text-blue-600 dark:text-blue-400 underline"
                    >
                      View verification proof
                    </button>
                  </div>
                ) : (
                  <div className="bg-yellow-50 dark:bg-yellow-900 rounded p-3 mt-2">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-yellow-600 dark:text-yellow-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        ></path>
                      </svg>
                      <p className="font-medium text-yellow-600 dark:text-yellow-400">
                        Not verified
                      </p>
                    </div>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                      This transaction has not been verified yet.
                    </p>
                    {selectedTransaction.status === "confirmed" && (
                      <button
                        onClick={handleVerifyTransaction}
                        className="mt-2 px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600"
                      >
                        Verify Now
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Select a transaction to view details
            </p>
          )}
        </div>
      </div>

      {/* Pending Transactions */}
      <div className="mt-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">
            Pending Transactions{" "}
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              (waiting to be mined)
            </span>
          </h2>
          {pendingTransactions.length > 0 && (
            <button
              onClick={handleMineBlock}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Mine Block
            </button>
          )}
        </div>
        {pendingTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    From
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    To
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {pendingTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleTransactionClick(tx)}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {formatHash(tx.id)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {tx.sender}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {tx.recipient}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      ${tx.amount}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(tx.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No pending transactions
          </p>
        )}
      </div>

      {/* Verification modal */}
      {selectedTransaction && showVerificationModal && (
        <VerificationProofModal
          transaction={selectedTransaction}
          isOpen={showVerificationModal}
          onClose={handleCloseVerificationModal}
        />
      )}
    </div>
  );
}
