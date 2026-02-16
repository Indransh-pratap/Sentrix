const axios = require("axios");
const { URL } = require("url");

const SQL_ERRORS = [
 "you have an error in your sql syntax",
  "check the manual that corresponds to your mysql server version",
  "pdoexception",
  "ora-00936",
  "ora-00933",
  "postgresql query failed",
  "sqlstate[hy000]",
  "microsoft ole db provider for odbc drivers",
  "unclosed quotation mark after the character string"
];

const PAYLOADS = [
  "'",
  "\"",
  "' OR '1'='1",
  "\" OR \"1\"=\"1"
];

const sqliScan = async (targetUrl) => {
  const findings = [];
  let parsed;

  try {
    parsed = new URL(targetUrl);
  } catch {
    return findings;
  }

  // If no params exist, add dummy param
  if (![...parsed.searchParams.keys()].length) {
    parsed.searchParams.set("id", "1");
  }

  for (const key of parsed.searchParams.keys()) {
    let vulnerable = false;

    for (const payload of PAYLOADS) {
      const testUrl = new URL(parsed.toString());
      testUrl.searchParams.set(key, payload);

      try {
        const res = await axios.get(testUrl.toString(), {
          timeout: 8000,
          validateStatus: () => true,
        });

        if (typeof res.data !== "string") continue;

        const body = res.data.toLowerCase();

        if (SQL_ERRORS.some(err => body.includes(err))) {
          findings.push({
            type: "SQLi",
            title: "Potential SQL Injection",
            detail: `SQL error pattern detected for parameter "${key}"`,
            impact:
              "An attacker may be able to manipulate database queries and access or modify sensitive data.",
            severity: "High",
            fix:
              "Use parameterized queries (prepared statements) and strict input validation.",
            url: testUrl.toString(),
          });

          vulnerable = true;
          break; // stop payload loop for this param
        }
      } catch {
        // ignore network errors
      }
    }

    if (vulnerable) break; // stop scanning other params (passive scan)
  }

  return findings;
};

module.exports = sqliScan;
