stepsData['G3'] = {
  stepLabel: "GATE 03",
  stepName: "Technical Feasibility Gate",
  objective: "Confirm that all technical prerequisites are met before proceeding.",
  description: "The Technical Feasibility Gate checks system resource availability, API compatibility, and integration readiness with target platforms. Automated pings to dependent services confirm uptime and response times meet SLA thresholds before the workflow is allowed to continue.",
  additionalInfo: "If any dependent service is unavailable, the gate automatically retries at set intervals before escalating to the operations team.",
  badge: "GATE 03",
  duration: "~12 min",
  status: "Active"
};
