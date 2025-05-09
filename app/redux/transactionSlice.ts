import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "@reduxjs/toolkit";

// Type definitions
export type Transaction = {
  id: string;
  hash: string;
  timestamp: number;
  sender: string;
  recipient: string;
  amount: number;
  status: "pending" | "confirmed" | "failed";
  description: string;
  targetMilestone?: string;
  verificationProof?: {
    verifiedBy?: string;
    verificationTime?: number;
    proofImageUrl?: string;
    notes?: string;
    isVerified: boolean;
  };
};

export type TransactionState = {
  transactions: Transaction[];
  pendingTransactions: Transaction[];
  blocks: Block[];
  lastBlockNumber: number;
};

export type Block = {
  blockNumber: number;
  hash: string;
  timestamp: number;
  transactions: Transaction[];
  previousBlockHash: string;
  nonce: number;
};

// Generate a mock hash for simulation
const generateHash = (): string => {
  return (
    "0x" +
    Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("")
  );
};

// Some sample proof images for simulation
const sampleProofImages = [
  "/proof/delivery1.jpg",
  "/proof/delivery2.jpg",
  "/proof/delivery3.jpg",
  "/proof/receipt1.jpg",
  "/proof/receipt2.jpg",
];

// Initial state
const initialState: TransactionState = {
  transactions: [],
  pendingTransactions: [],
  blocks: [
    {
      blockNumber: 1,
      hash: generateHash(),
      timestamp: Date.now(),
      transactions: [],
      previousBlockHash:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      nonce: 1,
    },
  ],
  lastBlockNumber: 1,
};

// Create the slice
export const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    // Create a new donation transaction
    createDonation: (
      state,
      action: PayloadAction<{
        sender: string;
        recipient: string;
        amount: number;
        description: string;
        targetMilestone?: string;
      }>
    ) => {
      const { sender, recipient, amount, description, targetMilestone } =
        action.payload;

      // Create a new transaction
      const newTransaction: Transaction = {
        id: nanoid(),
        hash: generateHash(),
        timestamp: Date.now(),
        sender,
        recipient,
        amount,
        status: "pending",
        description,
        targetMilestone,
      };

      // Add to pending transactions
      state.pendingTransactions.push(newTransaction);
    },

    // Process pending transactions into a new block (simulating mining)
    mineBlock: (state) => {
      if (state.pendingTransactions.length === 0) return;

      // Get the latest block to reference its hash
      const latestBlock = state.blocks[state.blocks.length - 1];

      // Mark pending transactions as confirmed
      const confirmedTransactions = state.pendingTransactions.map((tx) => ({
        ...tx,
        status: "confirmed" as const,
      }));

      // Create a new block
      const newBlock: Block = {
        blockNumber: state.lastBlockNumber + 1,
        hash: generateHash(),
        timestamp: Date.now(),
        transactions: confirmedTransactions,
        previousBlockHash: latestBlock.hash,
        nonce: Math.floor(Math.random() * 1000000),
      };

      // Add the new block to the chain
      state.blocks.push(newBlock);
      state.lastBlockNumber += 1;

      // Add transactions to the confirmed list
      state.transactions = [...state.transactions, ...confirmedTransactions];

      // Clear pending transactions
      state.pendingTransactions = [];
    },

    // Fail a transaction (simulating validation failure)
    failTransaction: (state, action: PayloadAction<string>) => {
      const transactionId = action.payload;

      state.pendingTransactions = state.pendingTransactions.map((tx) =>
        tx.id === transactionId ? { ...tx, status: "failed" as const } : tx
      );

      // Move failed transactions out of pending
      const failedTx = state.pendingTransactions.find(
        (tx) => tx.id === transactionId
      );
      if (failedTx) {
        state.transactions.push(failedTx);
        state.pendingTransactions = state.pendingTransactions.filter(
          (tx) => tx.id !== transactionId
        );
      }
    },

    // Add verification proof to a transaction
    addVerificationProof: (
      state,
      action: PayloadAction<{
        transactionId: string;
        verifiedBy: string;
        notes?: string;
        proofImageUrl?: string;
      }>
    ) => {
      const { transactionId, verifiedBy, notes, proofImageUrl } =
        action.payload;

      // Get a random proof image if none provided (for simulation)
      const selectedProofImage =
        proofImageUrl ||
        sampleProofImages[Math.floor(Math.random() * sampleProofImages.length)];

      // Find transaction in confirmed transactions
      const transactionIndex = state.transactions.findIndex(
        (tx) => tx.id === transactionId
      );
      if (transactionIndex !== -1) {
        state.transactions[transactionIndex].verificationProof = {
          verifiedBy,
          verificationTime: Date.now(),
          proofImageUrl: selectedProofImage,
          notes: notes || "Delivery confirmed by recipient",
          isVerified: true,
        };
      }

      // Also update the transaction in the corresponding block
      for (let block of state.blocks) {
        const blockTxIndex = block.transactions.findIndex(
          (tx) => tx.id === transactionId
        );
        if (blockTxIndex !== -1) {
          block.transactions[blockTxIndex].verificationProof = {
            verifiedBy,
            verificationTime: Date.now(),
            proofImageUrl: selectedProofImage,
            notes: notes || "Delivery confirmed by recipient",
            isVerified: true,
          };
          break;
        }
      }
    },
  },
});

// Export actions and reducer
export const {
  createDonation,
  mineBlock,
  failTransaction,
  addVerificationProof,
} = transactionSlice.actions;
export default transactionSlice.reducer;
