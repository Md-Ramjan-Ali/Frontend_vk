stepsData['T2'] = {
  stepLabel: "STEP 02",
  stepName: "Data Validation",
  objective: "Validate and sanitize incoming data to ensure accuracy and completeness.",
  description: "In this phase, the system runs automated validation routines across all ingested data fields. This includes schema conformity checks, null-value detection, range validation for numeric fields, and format verification for dates and identifiers. Any anomalies are flagged for manual review.",
  additionalInfo: "Once all data passes validation, it is queued for transformation and normalization in the next step.",
  badge: "STEP 02",
  duration: "~20 min",
  status: "Active"
};
