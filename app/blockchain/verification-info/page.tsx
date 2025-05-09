import Navigation from "../../components/Navigation";
import Link from "next/link";

export default function VerificationInfo() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Donation Verification System
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Ensuring transparency and accountability in every donation
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              How Verification Works
            </h2>
            <p className="mb-4">
              Our blockchain-based verification system ensures that every
              donation is transparent, traceable, and verifiable. When a
              donation is made, it is recorded on the blockchain as a
              transaction. This transaction includes details about who made the
              donation, who received it, and the amount.
            </p>
            <p className="mb-4">
              After a donation is delivered to the recipient, the transaction is
              verified with photographic proof and documentation to confirm that
              the funds were properly received and used for their intended
              purpose.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">
                Benefits for Donors
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  See proof that your donation reached the intended recipient
                </li>
                <li>Track how your contributions are making a difference</li>
                <li>Build trust through transparency and accountability</li>
                <li>Receive verification certificates for tax purposes</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">
                Benefits for Recipients
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Verified transaction history proves legitimate receipt of aid
                </li>
                <li>Build credibility with future potential donors</li>
                <li>Transparent system prevents fraud or misattribution</li>
                <li>Fair distribution of resources based on verification</li>
              </ul>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Verification Process
            </h2>
            <ol className="list-decimal pl-5 space-y-4">
              <li className="mb-2">
                <h4 className="font-medium">Donation Transaction</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  A donation is made and recorded on the blockchain as a pending
                  transaction.
                </p>
              </li>
              <li className="mb-2">
                <h4 className="font-medium">Mining &amp; Confirmation</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  The transaction is mined into a block and becomes part of the
                  permanent blockchain record.
                </p>
              </li>
              <li className="mb-2">
                <h4 className="font-medium">Delivery Documentation</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  When the recipient receives the donation, photographic
                  evidence and documentation are collected.
                </p>
              </li>
              <li className="mb-2">
                <h4 className="font-medium">Verification</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  A verifier reviews the documentation and attaches it to the
                  blockchain transaction.
                </p>
              </li>
              <li>
                <h4 className="font-medium">Permanent Record</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  The verified transaction becomes a permanent, transparent
                  record that cannot be altered.
                </p>
              </li>
            </ol>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-300">
              View the Blockchain
            </h2>
            <p className="mb-4 text-blue-600 dark:text-blue-400">
              Explore our donation blockchain, verify transactions, and see the
              impact of contributions.
            </p>
            <Link
              href="/blockchain"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Go to Blockchain Explorer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
