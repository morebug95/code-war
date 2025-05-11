import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "@reduxjs/toolkit";

// Type definitions
export type SubscriptionFrequency = "weekly" | "monthly" | "quarterly";

export type Subscription = {
  id: string;
  personId: string;
  personName: string;
  amount: number;
  frequency: SubscriptionFrequency;
  createdAt: number;
  nextPaymentDate: number;
  active: boolean;
  description: string;
  targetMilestone?: string;
};

export type SubscriptionState = {
  subscriptions: Subscription[];
};

// Initial state
const initialState: SubscriptionState = {
  subscriptions: [],
};

// Helper function to calculate next payment date
const calculateNextPaymentDate = (
  currentDate: number,
  frequency: SubscriptionFrequency
): number => {
  const date = new Date(currentDate);

  switch (frequency) {
    case "weekly":
      date.setDate(date.getDate() + 7);
      break;
    case "monthly":
      date.setMonth(date.getMonth() + 1);
      break;
    case "quarterly":
      date.setMonth(date.getMonth() + 3);
      break;
  }

  return date.getTime();
};

// Create the slice
export const subscriptionSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {
    // Create a new subscription
    createSubscription: (
      state,
      action: PayloadAction<{
        personId: string;
        personName: string;
        amount: number;
        frequency: SubscriptionFrequency;
        description: string;
        targetMilestone?: string;
      }>
    ) => {
      const {
        personId,
        personName,
        amount,
        frequency,
        description,
        targetMilestone,
      } = action.payload;
      const now = Date.now();

      const newSubscription: Subscription = {
        id: nanoid(),
        personId,
        personName,
        amount,
        frequency,
        createdAt: now,
        nextPaymentDate: calculateNextPaymentDate(now, frequency),
        active: true,
        description,
        targetMilestone,
      };

      state.subscriptions.push(newSubscription);
    },

    // Cancel a subscription
    cancelSubscription: (state, action: PayloadAction<string>) => {
      const subscriptionId = action.payload;
      const subscriptionIndex = state.subscriptions.findIndex(
        (sub) => sub.id === subscriptionId
      );

      if (subscriptionIndex !== -1) {
        state.subscriptions[subscriptionIndex].active = false;
      }
    },

    // Update a subscription
    updateSubscription: (
      state,
      action: PayloadAction<{
        id: string;
        updates: Partial<Omit<Subscription, "id" | "createdAt">>;
      }>
    ) => {
      const { id, updates } = action.payload;
      const subscriptionIndex = state.subscriptions.findIndex(
        (sub) => sub.id === id
      );

      if (subscriptionIndex !== -1) {
        state.subscriptions[subscriptionIndex] = {
          ...state.subscriptions[subscriptionIndex],
          ...updates,
        };

        // If frequency was updated, recalculate next payment date
        if (updates.frequency) {
          state.subscriptions[subscriptionIndex].nextPaymentDate =
            calculateNextPaymentDate(Date.now(), updates.frequency);
        }
      }
    },

    // Process payment for a subscription
    processSubscriptionPayment: (state, action: PayloadAction<string>) => {
      const subscriptionId = action.payload;
      const subscriptionIndex = state.subscriptions.findIndex(
        (sub) => sub.id === subscriptionId
      );

      if (
        subscriptionIndex !== -1 &&
        state.subscriptions[subscriptionIndex].active
      ) {
        const subscription = state.subscriptions[subscriptionIndex];

        // Update next payment date
        state.subscriptions[subscriptionIndex].nextPaymentDate =
          calculateNextPaymentDate(Date.now(), subscription.frequency);
      }
    },

    // Check for due subscriptions and update next payment dates
    processDueSubscriptions: (state) => {
      const now = Date.now();

      state.subscriptions.forEach((subscription, index) => {
        if (subscription.active && subscription.nextPaymentDate <= now) {
          state.subscriptions[index].nextPaymentDate = calculateNextPaymentDate(
            now,
            subscription.frequency
          );
        }
      });
    },
  },
});

// Export actions and reducer
export const {
  createSubscription,
  cancelSubscription,
  updateSubscription,
  processSubscriptionPayment,
  processDueSubscriptions,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
