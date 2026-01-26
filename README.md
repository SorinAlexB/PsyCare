# PsyCare

A neurological symptom analysis tool that provides AI-powered diagnostic recommendations and generates PDF reports.

## Features

- Analyze symptoms using natural language descriptions
- AI-powered analysis (Claude) or rule-based matching
- Confidence levels and severity ratings for diagnoses
- Treatment and medication recommendations
- PDF report generation

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file:
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   PORT=3000
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open http://localhost:3000 in your browser

## Tech Stack

- **Backend:** Node.js, Express
- **AI:** Anthropic Claude API
- **Frontend:** HTML, CSS, JavaScript
- **PDF:** jsPDF
