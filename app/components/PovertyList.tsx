"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import AddPersonForm from "./AddPersonForm";
import StatusBadge from "./StatusBadge";
import DonationModal from "./DonationModal";
import { Person } from "../types";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { addPerson, updatePersonStatus } from "../redux/peopleSlice";

export default function PovertyList() {
  // Use Redux state instead of local state
  const people = useAppSelector((state) => state.people);
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const [filter, setFilter] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [view, setView] = useState<"simple" | "detailed">("simple");
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showDonationModal, setShowDonationModal] = useState(false);

  // Handle personId from URL parameter (for direct donations from Ranking page)
  useEffect(() => {
    const personId = searchParams?.get("personId");
    if (personId) {
      const person = people.find((p) => p.id === personId);
      if (person) {
        setSelectedPerson(person);
        setShowDonationModal(true);
      }
    }
  }, [searchParams, people]);

  // Filter the list based on status
  const filteredPeople =
    filter === "all"
      ? people
      : people.filter((person) => person.supportStatus === filter);

  // Handle adding a new person via Redux
  const handleAddPerson = (newPerson: Person) => {
    dispatch(addPerson(newPerson));
  };

  // Handle changing a person's status via Redux
  const handleStatusChange = (
    id: string,
    newStatus: "pending" | "receiving" | "completed"
  ) => {
    dispatch(updatePersonStatus({ id, status: newStatus }));
  };

  // Handle opening donation modal
  const handleOpenDonationModal = (person: Person) => {
    setSelectedPerson(person);
    setShowDonationModal(true);
  };

  // Handle closing donation modal
  const handleCloseDonationModal = () => {
    setShowDonationModal(false);
  };

  // Format support needs as a string
  const formatSupportNeeds = (needs: string[]) => {
    if (needs.length === 0) return "None";
    return needs
      .map((need) => need.charAt(0).toUpperCase() + need.slice(1))
      .join(", ");
  };

  // Get housing status as a string
  const getHousingStatus = (person: Person) => {
    if (!person.hasHouse) return "No housing";
    return (
      person.housingType.charAt(0).toUpperCase() + person.housingType.slice(1)
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">
          Society Poverty Support Program
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Tracking and managing support for individuals in need within our
          community.
        </p>
      </div>

      {/* View toggle and filter controls */}
      <div className="flex flex-wrap items-center justify-between mb-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <div className="flex flex-wrap gap-2 mb-2 md:mb-0">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded ${
              filter === "all"
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-gray-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded ${
              filter === "pending"
                ? "bg-yellow-500 text-white"
                : "bg-white dark:bg-gray-700"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("receiving")}
            className={`px-4 py-2 rounded ${
              filter === "receiving"
                ? "bg-green-500 text-white"
                : "bg-white dark:bg-gray-700"
            }`}
          >
            Receiving
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded ${
              filter === "completed"
                ? "bg-gray-500 text-white"
                : "bg-white dark:bg-gray-700"
            }`}
          >
            Completed
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setView("simple")}
            className={`px-4 py-2 rounded ${
              view === "simple"
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-gray-700"
            }`}
          >
            Simple View
          </button>
          <button
            onClick={() => setView("detailed")}
            className={`px-4 py-2 rounded ${
              view === "detailed"
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-gray-700"
            }`}
          >
            Detailed View
          </button>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Total</p>
          <p className="text-2xl font-bold">{people.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-500">
            {people.filter((p) => p.supportStatus === "pending").length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Receiving</p>
          <p className="text-2xl font-bold text-green-500">
            {people.filter((p) => p.supportStatus === "receiving").length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Completed</p>
          <p className="text-2xl font-bold text-gray-500">
            {people.filter((p) => p.supportStatus === "completed").length}
          </p>
        </div>
      </div>

      {/* People list - Simple View */}
      {view === "simple" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Income
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Family Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPeople.length > 0 ? (
                  filteredPeople.map((person) => (
                    <tr
                      key={person.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => handleOpenDonationModal(person)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {person.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {person.age}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {person.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ${person.income}/week
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {person.familySize}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={person.supportStatus} />
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex gap-2">
                          {person.supportStatus !== "pending" && (
                            <button
                              onClick={() =>
                                handleStatusChange(person.id, "pending")
                              }
                              className="text-yellow-600 hover:text-yellow-800"
                            >
                              Set Pending
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDonationModal(person);
                            }}
                            className="text-blue-600 hover:text-blue-800 ml-2"
                          >
                            Donate
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                    >
                      No people found matching the current filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* People list - Detailed View */}
      {view === "detailed" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPeople.length > 0 ? (
            filteredPeople.map((person) => (
              <div
                key={person.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-md cursor-pointer"
                onClick={() => handleOpenDonationModal(person)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold mb-1">{person.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {person.age} years old • {person.location}
                    </p>
                  </div>
                  <StatusBadge status={person.supportStatus} />
                </div>

                <div className="mb-4 grid grid-cols-2 gap-y-2">
                  <p className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Weekly Income:
                    </span>{" "}
                    ${person.income}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Family Size:
                    </span>{" "}
                    {person.familySize}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Housing:
                    </span>{" "}
                    {getHousingStatus(person)}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Children:
                    </span>{" "}
                    {person.hasChildren ? `${person.numberOfChildren}` : "None"}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Education:
                    </span>{" "}
                    {person.educationLevel.charAt(0).toUpperCase() +
                      person.educationLevel.slice(1)}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Employment:
                    </span>{" "}
                    {person.employmentStatus.charAt(0).toUpperCase() +
                      person.employmentStatus.slice(1)}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Health:
                    </span>{" "}
                    {person.healthStatus.charAt(0).toUpperCase() +
                      person.healthStatus.slice(1)}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Disability:
                    </span>{" "}
                    {person.disabilityStatus ? "Yes" : "No"}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-sm mb-1 text-gray-500 dark:text-gray-400">
                    Support Needs:
                  </p>
                  <p className="text-sm">
                    {formatSupportNeeds(person.supportNeeds)}
                  </p>
                </div>

                <div
                  className="flex justify-between items-center mt-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex gap-2">
                    {person.supportStatus !== "pending" && (
                      <button
                        onClick={() => handleStatusChange(person.id, "pending")}
                        className="text-yellow-600 hover:text-yellow-800 text-sm"
                      >
                        Set Pending
                      </button>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDonationModal(person);
                    }}
                    className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                  >
                    Donate
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center text-gray-500 dark:text-gray-400">
              No people found matching the current filter.
            </div>
          )}
        </div>
      )}

      {/* Add Person button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add Person
        </button>
      </div>

      {/* Donation modal */}
      {selectedPerson && showDonationModal && (
        <DonationModal
          person={selectedPerson}
          isOpen={showDonationModal}
          onClose={handleCloseDonationModal}
        />
      )}

      {/* Add Person form modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Person</h2>
              <button
                onClick={() => setShowAddForm(false)}
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
            <AddPersonForm onCancel={() => setShowAddForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
