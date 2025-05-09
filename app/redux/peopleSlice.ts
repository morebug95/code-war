import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Person, Milestone } from "../types";
import { nanoid } from "@reduxjs/toolkit";

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
    fundraisingGoal: 5000,
    currentFunds: 1250,
    campaignTitle: "Support for John's Family",
    campaignDescription:
      "Help John secure stable housing and education for his children",
    fundraisingMilestones: [
      {
        id: nanoid(),
        amount: 1000,
        title: "Emergency Fund",
        description: "Create an emergency fund for immediate needs",
        isReached: true,
        reachedAt: Date.now() - 1000000,
      },
      {
        id: nanoid(),
        amount: 2500,
        title: "Housing Security",
        description: "Help with rent deposits and stable housing",
        isReached: false,
      },
      {
        id: nanoid(),
        amount: 5000,
        title: "Education Fund",
        description: "Fund children's education and school supplies",
        isReached: false,
      },
    ],
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
    fundraisingGoal: 4000,
    currentFunds: 320,
    campaignTitle: "Help Maria Find Employment",
    campaignDescription:
      "Support Maria with job training and childcare while she seeks employment",
    fundraisingMilestones: [
      {
        id: nanoid(),
        amount: 500,
        title: "Immediate Relief",
        description: "Provide immediate financial relief for basic needs",
        isReached: false,
      },
      {
        id: nanoid(),
        amount: 2000,
        title: "Job Training",
        description: "Fund vocational training to improve employment prospects",
        isReached: false,
      },
      {
        id: nanoid(),
        amount: 4000,
        title: "Childcare Support",
        description:
          "Provide childcare support during job hunting and initial employment",
        isReached: false,
      },
    ],
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
    fundraisingGoal: 7500,
    currentFunds: 2800,
    campaignTitle: "Housing for Ahmed's Family",
    campaignDescription:
      "Help Ahmed and his family move from temporary to permanent housing",
    fundraisingMilestones: [
      {
        id: nanoid(),
        amount: 2000,
        title: "Temporary Housing Extension",
        description:
          "Extend current temporary housing while searching for permanent options",
        isReached: true,
        reachedAt: Date.now() - 2000000,
      },
      {
        id: nanoid(),
        amount: 5000,
        title: "Housing Deposit",
        description:
          "Provide first and last month's rent plus security deposit",
        isReached: false,
      },
      {
        id: nanoid(),
        amount: 7500,
        title: "Basic Furnishings",
        description:
          "Basic furniture and household items for permanent housing",
        isReached: false,
      },
    ],
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
    fundraisingGoal: 3000,
    currentFunds: 3000,
    campaignTitle: "Sarah's Education Fund",
    campaignDescription:
      "Help Sarah complete her professional certification for better employment",
    fundraisingMilestones: [
      {
        id: nanoid(),
        amount: 1000,
        title: "Tuition Support",
        description: "Cover tuition fees for professional certification",
        isReached: true,
        reachedAt: Date.now() - 4000000,
      },
      {
        id: nanoid(),
        amount: 2000,
        title: "Study Materials",
        description: "Purchase necessary books and study materials",
        isReached: true,
        reachedAt: Date.now() - 3000000,
      },
      {
        id: nanoid(),
        amount: 3000,
        title: "Certification Exam",
        description: "Pay for certification exam and associated fees",
        isReached: true,
        reachedAt: Date.now() - 1000000,
      },
    ],
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
    fundraisingGoal: 6000,
    currentFunds: 850,
    campaignTitle: "Healthcare Support for Li",
    campaignDescription: "Help Li access essential healthcare and medications",
    fundraisingMilestones: [
      {
        id: nanoid(),
        amount: 1000,
        title: "Medication Fund",
        description: "Fund essential medications for chronic conditions",
        isReached: false,
      },
      {
        id: nanoid(),
        amount: 3000,
        title: "Medical Treatments",
        description: "Cover costs of necessary medical treatments",
        isReached: false,
      },
      {
        id: nanoid(),
        amount: 6000,
        title: "Long-term Care",
        description: "Establish a fund for long-term healthcare needs",
        isReached: false,
      },
    ],
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
    addFunds: (
      state,
      action: PayloadAction<{
        personId: string;
        amount: number;
        targetMilestone?: string;
      }>
    ) => {
      const { personId, amount, targetMilestone } = action.payload;
      const personIndex = state.findIndex((person) => person.id === personId);

      if (personIndex !== -1) {
        const person = state[personIndex];
        const newFundAmount = person.currentFunds + amount;
        person.currentFunds = newFundAmount;

        // Sort milestones by amount to ensure proper order
        const sortedMilestones = [...person.fundraisingMilestones].sort(
          (a, b) => a.amount - b.amount
        );

        // If a specific milestone is targeted
        if (targetMilestone) {
          const targetedMilestone = person.fundraisingMilestones.find(
            (m) => m.id === targetMilestone
          );

          if (targetedMilestone) {
            // Find all milestones that should be reached before this one
            const lowerMilestones = sortedMilestones.filter(
              (m) => m.amount < targetedMilestone.amount && !m.isReached
            );

            // Check if we have enough funds for those lower milestones
            lowerMilestones.forEach((milestone) => {
              if (newFundAmount >= milestone.amount) {
                const milestoneIndex = person.fundraisingMilestones.findIndex(
                  (m) => m.id === milestone.id
                );
                if (milestoneIndex !== -1) {
                  person.fundraisingMilestones[milestoneIndex].isReached = true;
                  person.fundraisingMilestones[milestoneIndex].reachedAt =
                    Date.now();
                }
              }
            });

            // Check if targeted milestone should be reached
            if (
              !targetedMilestone.isReached &&
              newFundAmount >= targetedMilestone.amount
            ) {
              const milestoneIndex = person.fundraisingMilestones.findIndex(
                (m) => m.id === targetMilestone
              );
              if (milestoneIndex !== -1) {
                person.fundraisingMilestones[milestoneIndex].isReached = true;
                person.fundraisingMilestones[milestoneIndex].reachedAt =
                  Date.now();
              }
            }
          }
        } else {
          // For general donations, update all milestones in order
          sortedMilestones.forEach((milestone) => {
            if (!milestone.isReached && newFundAmount >= milestone.amount) {
              const milestoneIndex = person.fundraisingMilestones.findIndex(
                (m) => m.id === milestone.id
              );
              if (milestoneIndex !== -1) {
                person.fundraisingMilestones[milestoneIndex].isReached = true;
                person.fundraisingMilestones[milestoneIndex].reachedAt =
                  Date.now();
              }
            }
          });
        }

        // Update person status based on funding progress
        if (newFundAmount >= person.fundraisingGoal) {
          // All milestones reached - check if all goals are complete
          const allMilestonesReached = person.fundraisingMilestones.every(
            (m) => m.isReached
          );

          if (allMilestonesReached) {
            person.supportStatus = "completed";
          } else {
            person.supportStatus = "receiving";
          }
        }
      }
    },
    addMilestone: (
      state,
      action: PayloadAction<{ personId: string; milestone: Milestone }>
    ) => {
      const { personId, milestone } = action.payload;
      const personIndex = state.findIndex((person) => person.id === personId);

      if (personIndex !== -1) {
        state[personIndex].fundraisingMilestones.push(milestone);
      }
    },
    updateMilestone: (
      state,
      action: PayloadAction<{
        personId: string;
        milestoneId: string;
        updates: Partial<Milestone>;
      }>
    ) => {
      const { personId, milestoneId, updates } = action.payload;
      const personIndex = state.findIndex((person) => person.id === personId);

      if (personIndex !== -1) {
        const milestoneIndex = state[
          personIndex
        ].fundraisingMilestones.findIndex((m) => m.id === milestoneId);

        if (milestoneIndex !== -1) {
          state[personIndex].fundraisingMilestones[milestoneIndex] = {
            ...state[personIndex].fundraisingMilestones[milestoneIndex],
            ...updates,
          };
        }
      }
    },
    updateFundraisingGoal: (
      state,
      action: PayloadAction<{ personId: string; goal: number }>
    ) => {
      const { personId, goal } = action.payload;
      const personIndex = state.findIndex((person) => person.id === personId);

      if (personIndex !== -1) {
        state[personIndex].fundraisingGoal = goal;
      }
    },
  },
});

export const {
  addPerson,
  updatePersonStatus,
  updatePerson,
  removePerson,
  addFunds,
  addMilestone,
  updateMilestone,
  updateFundraisingGoal,
} = peopleSlice.actions;

export default peopleSlice.reducer;
