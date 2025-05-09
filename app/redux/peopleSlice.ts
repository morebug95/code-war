import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Person } from "../types";

// Sample initial data
const initialPeople: Person[] = [
  {
    id: "1",
    name: "John Doe",
    age: 45,
    location: "East District",
    income: 150,
    familySize: 4,
    hasHouse: true,
    housingType: "rented",
    hasChildren: true,
    numberOfChildren: 2,
    educationLevel: "secondary",
    employmentStatus: "part-time",
    healthStatus: "good",
    disabilityStatus: false,
    supportStatus: "receiving",
    supportNeeds: ["food", "financial"],
  },
  {
    id: "2",
    name: "Maria Garcia",
    age: 38,
    location: "North Village",
    income: 120,
    familySize: 3,
    hasHouse: true,
    housingType: "rented",
    hasChildren: true,
    numberOfChildren: 1,
    educationLevel: "highschool",
    employmentStatus: "unemployed",
    healthStatus: "fair",
    disabilityStatus: false,
    supportStatus: "pending",
    supportNeeds: ["employment", "financial", "education"],
  },
  {
    id: "3",
    name: "Ahmed Hassan",
    age: 52,
    location: "West Town",
    income: 100,
    familySize: 5,
    hasHouse: false,
    housingType: "temporary",
    hasChildren: true,
    numberOfChildren: 3,
    educationLevel: "primary",
    employmentStatus: "casual",
    healthStatus: "fair",
    disabilityStatus: true,
    supportStatus: "receiving",
    supportNeeds: ["housing", "food", "healthcare"],
  },
  {
    id: "4",
    name: "Sarah Johnson",
    age: 29,
    location: "South District",
    income: 180,
    familySize: 2,
    hasHouse: true,
    housingType: "owned",
    hasChildren: false,
    numberOfChildren: 0,
    educationLevel: "university",
    employmentStatus: "full-time",
    healthStatus: "excellent",
    disabilityStatus: false,
    supportStatus: "completed",
    supportNeeds: ["education"],
  },
  {
    id: "5",
    name: "Li Wei",
    age: 63,
    location: "Central Area",
    income: 90,
    familySize: 1,
    hasHouse: true,
    housingType: "rented",
    hasChildren: false,
    numberOfChildren: 0,
    educationLevel: "secondary",
    employmentStatus: "retired",
    healthStatus: "poor",
    disabilityStatus: true,
    supportStatus: "pending",
    supportNeeds: ["healthcare", "financial", "food"],
  },
];

export const peopleSlice = createSlice({
  name: "people",
  initialState: initialPeople,
  reducers: {
    addPerson: (state, action: PayloadAction<Person>) => {
      state.push(action.payload);
    },
    updatePersonStatus: (
      state,
      action: PayloadAction<{
        id: string;
        status: "pending" | "receiving" | "completed";
      }>
    ) => {
      const { id, status } = action.payload;
      const personIndex = state.findIndex((person) => person.id === id);
      if (personIndex !== -1) {
        state[personIndex].supportStatus = status;
      }
    },
    updatePerson: (state, action: PayloadAction<Person>) => {
      const index = state.findIndex(
        (person) => person.id === action.payload.id
      );
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    removePerson: (state, action: PayloadAction<string>) => {
      return state.filter((person) => person.id !== action.payload);
    },
  },
});

export const { addPerson, updatePersonStatus, updatePerson, removePerson } =
  peopleSlice.actions;

export default peopleSlice.reducer;
