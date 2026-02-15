const reconScan = require("./recon.service");
const xssScan = require("./xss.service");
const sqliScan = require("./sqli.service");
const csrfScan = require("./csrf.service");

const runScanner = async (url) => {
  const results = {
    recon: [],
    xss: [],
    sqli: [],
    csrf:[],
  };

  try {
    const recon = await reconScan(url);
    if (Array.isArray(recon)) results.recon = recon;
  } catch (e) {
    console.error("[Recon Error]", e.message);
  }

  try {
    const xss = await xssScan(url);
    if (Array.isArray(xss)) results.xss = xss;
  } catch (e) {
    console.error("[XSS Error]", e.message);
  }

  try {
    const sqli = await sqliScan(url);
    if (Array.isArray(sqli)) results.sqli = sqli;
  } catch (e) {
    console.error("[SQLi Error]", e.message);
  }
   try {
    const csrf = await csrfScan(url);
    if (Array.isArray(csrf)) results.csrf = csrf;
  } catch (e) {
    console.error("[CSRF Error]", e.message);
  }

  return {
    target: url,
    time: new Date().toISOString(),
    findings: [
      ...results.recon,
      ...results.xss,
      ...results.sqli,
      ...results.csrf,
    ],
  };
};

module.exports = runScanner;
