/*
  Targeted Threat Risk Engine
  Focused only on:
  - SQLi
  - XSS
*/

function calculateRisk(vulnerabilities = []) {

  if (!vulnerabilities.length) {
    return {
      riskPercent: 0,
      level: "Low Risk",
      breakdown: {
        sqli: 0,
        xss: 0,
        other: 0
      }
    };
  }

  let sqliCount = 0;
  let xssCount = 0;
  let otherCount = 0;

  vulnerabilities.forEach(v => {
    const type = (v.type || "").toLowerCase();

    if (type.includes("sqli") || type.includes("sql")) {
      sqliCount++;
    } 
    else if (type.includes("xss")) {
      xssCount++;
    } 
    else {
      otherCount++;
    }
  });

  /*
    Risk Logic:
    SQLi = most dangerous
    XSS = dangerous
    Others = negligible impact
  */

  // Base weights
  const sqliWeight = 35;
  const xssWeight = 25;

  let riskScore =
      (sqliCount * sqliWeight) +
      (xssCount * xssWeight);

  // Exponential escalation if both present
  if (sqliCount > 0 && xssCount > 0) {
    riskScore *= 1.2;
  }

  // If multiple SQLi, boost heavily
  if (sqliCount >= 2) {
    riskScore *= 1.3;
  }

  // Cap realistic max
  riskScore = Math.min(riskScore, 95);

  const riskPercent = Number(riskScore.toFixed(2));

  let level = "Low Risk";
  if (riskPercent >= 70) level = "High Risk";
  else if (riskPercent >= 40) level = "Medium Risk";

  return {
    riskPercent,
    level,
    breakdown: {
      sqli: sqliCount,
      xss: xssCount,
      other: otherCount
    }
  };
}

module.exports = { calculateRisk };