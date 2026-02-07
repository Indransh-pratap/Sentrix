# Sentrix 🛡️

![Built with Trae](https://img.shields.io/badge/Built%20with-Trae%20AI-000000?style=for-the-badge&logo=openai&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Beta-orange?style=for-the-badge)

**Sentrix** is a next-generation security scanner designed to bridge the gap between Web2 identity layers and Web3 asset protection. It uses advanced heuristic analysis and Machine Learning to detect client-side vulnerabilities that traditional scanners miss.

---

## 🚀 Features

- **Hybrid Security Scanning**: Analyzes both standard web vulnerabilities (XSS, CSP) and Web3-specific risks (Wallet Spoofing, Asset Draining).
- **ML-Powered Payload Engine**: Uses an intelligent mutation engine to bypass WAFs and filters by generating adaptive XSS payloads in real-time.
- **Deep Crawling**: Automatically maps the target website, discovering hidden parameters and forms to test.
- **Smart Remediation**: Provides clear, AI-explained impact assessments and fix suggestions (powered by OpenAI).
- **Zero-Config**: Just enter a URL and scan. No complex setup required.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express
- **Analysis Engine**: Custom Node.js heuristic engine with ML payload generation
- **AI Integration**: OpenAI GPT-4o-mini for risk explanation
- **Development Environment**: **Trae IDE** (Pair-programmed with Trae AI)

## ⚡ Quick Start

### Prerequisites
- Node.js v16+
- OpenAI API Key (optional, for AI explanations)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Indransh-pratap/Sentrix.git
   cd Sentrix
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   # Create a .env file with your API key if needed
   npm start
   ```

3. **Setup Frontend**
   ```bash
   # Open a new terminal
   cd Client
   npm install
   npm run dev
   ```

4. **Run the Scanner**
   Open `http://localhost:5173` in your browser.

## 🤖 Developed with Trae AI

This project was built using **Trae IDE**, utilizing its adaptive AI pair-programming capabilities to:
- Architect the hybrid Web2/Web3 security model.
- Implement the ML-based XSS mutation engine.
- Design the modern, responsive UI.
- Automate git workflows and code refactoring.

> *Trae AI didn't just write code; it understood the security context.*

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.
