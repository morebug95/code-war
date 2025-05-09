"use client";

import { useState } from "react";
import { Person } from "../types";
import { useAppDispatch } from "../redux/hooks";
import { addPerson } from "../redux/peopleSlice";

type AddPersonFormProps = {
  onCancel: () => void;
};

export default function AddPersonForm({ onCancel }: AddPersonFormProps) {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    location: "",
    income: "",
    familySize: "",
    hasHouse: false,
    housingType: "rented" as const,
    hasChildren: false,
    numberOfChildren: "0",
    educationLevel: "primary" as const,
    employmentStatus: "unemployed" as const,
    healthStatus: "good" as const,
    disabilityStatus: false,
    supportStatus: "pending" as const,
    supportNeeds: [] as string[],
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle support needs checkboxes
  const handleSupportNeedsChange = (need: string) => {
    setFormData((prev) => {
      const currentNeeds = [...prev.supportNeeds];
      if (currentNeeds.includes(need)) {
        return {
          ...prev,
          supportNeeds: currentNeeds.filter((n) => n !== need),
        };
      } else {
        return {
          ...prev,
          supportNeeds: [...currentNeeds, need],
        };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newPerson: Person = {
      id: Date.now().toString(),
      name: formData.name,
      age: parseInt(formData.age),
      location: formData.location,
      income: parseInt(formData.income),
      familySize: parseInt(formData.familySize),
      hasHouse: formData.hasHouse,
      housingType: formData.housingType,
      hasChildren: formData.hasChildren,
      numberOfChildren: parseInt(formData.numberOfChildren),
      educationLevel: formData.educationLevel,
      employmentStatus: formData.employmentStatus,
      healthStatus: formData.healthStatus,
      disabilityStatus: formData.disabilityStatus,
      supportStatus: formData.supportStatus,
      supportNeeds: formData.supportNeeds,
    };

    dispatch(addPerson(newPerson));
    onCancel(); // Close the form after submission
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-3xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white dark:bg-gray-800 py-2">
          <h2 className="text-xl font-semibold">Add New Person</h2>
          <button
            onClick={onCancel}
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <h3 className="text-lg font-medium mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Full Name
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                  htmlFor="age"
                >
                  Age
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="age"
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="0"
                  placeholder="45"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                  htmlFor="location"
                >
                  Location
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="East District"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                  htmlFor="educationLevel"
                >
                  Education Level
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="educationLevel"
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleChange}
                  required
                >
                  <option value="none">None</option>
                  <option value="primary">Primary School</option>
                  <option value="secondary">Secondary School</option>
                  <option value="highschool">High School</option>
                  <option value="college">College</option>
                  <option value="university">University</option>
                </select>
              </div>
            </div>
          </div>

          {/* Financial & Employment Section */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <h3 className="text-lg font-medium mb-4">Financial & Employment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                  htmlFor="income"
                >
                  Weekly Income ($)
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="income"
                  type="number"
                  name="income"
                  value={formData.income}
                  onChange={handleChange}
                  min="0"
                  placeholder="150"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                  htmlFor="employmentStatus"
                >
                  Employment Status
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="employmentStatus"
                  name="employmentStatus"
                  value={formData.employmentStatus}
                  onChange={handleChange}
                  required
                >
                  <option value="unemployed">Unemployed</option>
                  <option value="part-time">Part-time</option>
                  <option value="full-time">Full-time</option>
                  <option value="casual">Casual</option>
                  <option value="retired">Retired</option>
                  <option value="student">Student</option>
                </select>
              </div>
            </div>
          </div>

          {/* Housing Section */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <h3 className="text-lg font-medium mb-4">Housing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center mb-4">
                <input
                  id="hasHouse"
                  type="checkbox"
                  name="hasHouse"
                  checked={formData.hasHouse}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="hasHouse"
                  className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Has a place to live
                </label>
              </div>

              <div>
                <label
                  className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                  htmlFor="housingType"
                >
                  Housing Type
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="housingType"
                  name="housingType"
                  value={formData.housingType}
                  onChange={handleChange}
                  required
                >
                  <option value="owned">Owned</option>
                  <option value="rented">Rented</option>
                  <option value="temporary">Temporary/Shelter</option>
                  <option value="homeless">Homeless</option>
                </select>
              </div>
            </div>
          </div>

          {/* Family Section */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <h3 className="text-lg font-medium mb-4">Family</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                  htmlFor="familySize"
                >
                  Family Size
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="familySize"
                  type="number"
                  name="familySize"
                  value={formData.familySize}
                  onChange={handleChange}
                  min="1"
                  placeholder="4"
                  required
                />
              </div>

              <div className="flex items-center mb-4">
                <input
                  id="hasChildren"
                  type="checkbox"
                  name="hasChildren"
                  checked={formData.hasChildren}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="hasChildren"
                  className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Has children
                </label>
              </div>

              {formData.hasChildren && (
                <div>
                  <label
                    className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                    htmlFor="numberOfChildren"
                  >
                    Number of Children
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="numberOfChildren"
                    type="number"
                    name="numberOfChildren"
                    value={formData.numberOfChildren}
                    onChange={handleChange}
                    min="0"
                    required={formData.hasChildren}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Health Section */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <h3 className="text-lg font-medium mb-4">Health</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                  htmlFor="healthStatus"
                >
                  Health Status
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="healthStatus"
                  name="healthStatus"
                  value={formData.healthStatus}
                  onChange={handleChange}
                  required
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div className="flex items-center mb-4">
                <input
                  id="disabilityStatus"
                  type="checkbox"
                  name="disabilityStatus"
                  checked={formData.disabilityStatus}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="disabilityStatus"
                  className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Has disability
                </label>
              </div>
            </div>
          </div>

          {/* Support Needs Section */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <h3 className="text-lg font-medium mb-4">Support Needs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center">
                <input
                  id="need-food"
                  type="checkbox"
                  checked={formData.supportNeeds.includes("food")}
                  onChange={() => handleSupportNeedsChange("food")}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="need-food"
                  className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Food assistance
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="need-housing"
                  type="checkbox"
                  checked={formData.supportNeeds.includes("housing")}
                  onChange={() => handleSupportNeedsChange("housing")}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="need-housing"
                  className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Housing support
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="need-healthcare"
                  type="checkbox"
                  checked={formData.supportNeeds.includes("healthcare")}
                  onChange={() => handleSupportNeedsChange("healthcare")}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="need-healthcare"
                  className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Healthcare services
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="need-education"
                  type="checkbox"
                  checked={formData.supportNeeds.includes("education")}
                  onChange={() => handleSupportNeedsChange("education")}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="need-education"
                  className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Education support
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="need-employment"
                  type="checkbox"
                  checked={formData.supportNeeds.includes("employment")}
                  onChange={() => handleSupportNeedsChange("employment")}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="need-employment"
                  className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Employment assistance
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="need-financial"
                  type="checkbox"
                  checked={formData.supportNeeds.includes("financial")}
                  onChange={() => handleSupportNeedsChange("financial")}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="need-financial"
                  className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Financial aid
                </label>
              </div>
            </div>
          </div>

          {/* Support Status */}
          <div className="mb-6">
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              htmlFor="supportStatus"
            >
              Support Status
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="supportStatus"
              name="supportStatus"
              value={formData.supportStatus}
              onChange={handleChange}
              required
            >
              <option value="pending">Pending</option>
              <option value="receiving">Receiving</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 sticky bottom-0 bg-white dark:bg-gray-800 py-3">
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Add Person
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
