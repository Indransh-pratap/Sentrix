import { AlertTriangle, ShieldAlert, CheckCircle, Info } from 'lucide-react';

export type RiskLevel = 'High' | 'Medium' | 'Low' | 'Safe';

export interface Vulnerability {
  id: string;
  title: string;
  riskLevel: RiskLevel;
  summary: string;
  description: string;
  walletImpact: string;
  fix: string;
  icon: any;
}

export const scanResults: Vulnerability[] = [
  {
    id: 'csp',
    title: 'Content Security Policy (CSP)',
    riskLevel: 'High',
    summary: 'Missing or Weak CSP',
    description: 'The website lacks a strict set of rules (CSP) that tells the browser which scripts are safe to run. This is like leaving the front door open for anyone to walk in.',
    walletImpact: 'Web2: Attackers can inject keyloggers to steal passwords. Web3: They can inject fake wallet popups to drain funds.',
    fix: 'Add a strict Content-Security-Policy header that only allows scripts from trusted domains.',
    icon: ShieldAlert
  },
  {
    id: 'xss',
    title: 'Cross-Site Scripting (XSS)',
    riskLevel: 'High',
    summary: 'Possible Reflected XSS',
    description: 'The application accepts input from the URL or user without checking it properly. This allows attackers to send a special link that executes code in the victim\'s browser.',
    walletImpact: 'Web2: Attackers can steal your session cookies and takeover your account. Web3: They can manipulate transaction data before you sign it.',
    fix: 'Sanitize all user inputs and encode data before displaying it on the page.',
    icon: AlertTriangle
  },
  {
    id: 'https',
    title: 'HTTPS Encryption',
    riskLevel: 'Safe',
    summary: 'Valid SSL Certificate',
    description: 'The connection to this site is secure and encrypted.',
    walletImpact: 'Your communication with the dApp is private.',
    fix: 'No action needed.',
    icon: CheckCircle
  }
];

export const riskSummary = {
  high: 2,
  medium: 0,
  low: 0,
  score: 45 // 0-100 score
};
