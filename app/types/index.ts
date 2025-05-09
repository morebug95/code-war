export type Person = {
  id: string;
  name: string;
  age: number;
  location: string;
  income: number;
  familySize: number;
  hasHouse: boolean;
  housingType: "owned" | "rented" | "homeless" | "temporary";
  hasChildren: boolean;
  numberOfChildren: number;
  educationLevel:
    | "none"
    | "primary"
    | "secondary"
    | "highschool"
    | "college"
    | "university";
  employmentStatus:
    | "unemployed"
    | "part-time"
    | "full-time"
    | "casual"
    | "retired"
    | "student";
  healthStatus: "excellent" | "good" | "fair" | "poor" | "critical";
  disabilityStatus: boolean;
  supportStatus: "pending" | "receiving" | "completed";
  supportNeeds: string[];
  fundraisingGoal: number;
  fundraisingMilestones: Milestone[];
  currentFunds: number;
  campaignTitle?: string;
  campaignDescription?: string;
};

export type Milestone = {
  id: string;
  amount: number;
  title: string;
  description: string;
  isReached: boolean;
  reachedAt?: number;
};
