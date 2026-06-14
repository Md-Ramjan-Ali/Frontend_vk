stepsData['G4'] = {
  stepLabel: "GATE 04",
  stepName: "Budget Authorization Gate",
  objective: "Ensure that the workflow has the necessary budget authorization to proceed.",
  description: "This gate interfaces with the financial management system to confirm that the associated budget code has sufficient allocation for the current workflow phase. It validates approval limits against the requestor's authorization level and flags any over-budget scenarios for escalation.",
  additionalInfo: "Budget checks are performed in real-time against the live financial ledger to prevent stale data issues.",
  badge: "GATE 04",
  duration: "~8 min",
  status: "Active"
};
