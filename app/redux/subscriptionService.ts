import { store } from "./store";
import {
  processSubscriptionPayment,
  processDueSubscriptions,
} from "./subscriptionSlice";
import { createDonation } from "./transactionSlice";
import { deductFromBalance } from "./userSlice";
import { addFunds } from "./peopleSlice";

/**
 * Service to handle the processing of recurring donations
 * In a production environment, this would be handled by a background job/cron task
 */
export const SubscriptionService = {
  /**
   * Process all subscriptions that are due for payment
   */
  processSubscriptions: () => {
    const state = store.getState();
    const { subscriptions } = state.subscriptions;
    const now = Date.now();

    // Find subscriptions that are due
    const dueSubscriptions = subscriptions.filter(
      (subscription) =>
        subscription.active && subscription.nextPaymentDate <= now
    );

    if (dueSubscriptions.length === 0) return;

    // Process each due subscription
    dueSubscriptions.forEach((subscription) => {
      const { id, personId, personName, amount, description, targetMilestone } =
        subscription;

      // Find the person in state
      const person = state.people.find((p) => p.id === personId);
      if (!person) return;

      // Only process if user has enough balance
      if (state.user.balance >= amount) {
        // Create donation transaction
        store.dispatch(
          createDonation({
            sender: "User",
            recipient: personName,
            amount,
            description: `Recurring donation: ${description}`,
            targetMilestone,
          })
        );

        // Deduct from user balance
        store.dispatch(deductFromBalance(amount));

        // Add funds to person
        store.dispatch(
          addFunds({
            personId,
            amount,
            targetMilestone,
          })
        );

        // Update subscription next payment date
        store.dispatch(processSubscriptionPayment(id));

        // Show notification (in a real app)
        console.log(
          `Processed recurring donation of ${amount} to ${personName}`
        );
      } else {
        // Handle insufficient funds (would notify user in a real app)
        console.log(
          `Insufficient funds for recurring donation to ${personName}`
        );
      }
    });

    // Update all subscriptions
    store.dispatch(processDueSubscriptions());
  },

  /**
   * Start the subscription processor
   * In a real app this would be a server-side job
   */
  startProcessor: () => {
    // Check for due subscriptions every minute
    const intervalId = setInterval(() => {
      SubscriptionService.processSubscriptions();
    }, 60000); // Every minute

    return () => clearInterval(intervalId);
  },
};

// Automatic initialization in development environment
// In production, this would be a server-side cron job
let cleanup: (() => void) | null = null;

if (typeof window !== "undefined") {
  // Only run in browser environment
  cleanup = SubscriptionService.startProcessor();
}

export const stopSubscriptionProcessor = () => {
  if (cleanup) {
    cleanup();
    cleanup = null;
  }
};
