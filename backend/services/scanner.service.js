const reconScan = require("./recon.service");
const xssScan = require("./xss.service");

const runScanner = async (url) => {
  const findings = [];

  findings.push(...(await reconScan(url)));
  findings.push(...(await xssScan(url)));

  return {
    target: url,
    time: new Date().toISOString(),
    findings,
  };
};

module.exports = runScanner;
