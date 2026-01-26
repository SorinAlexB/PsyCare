/**
 * MCP Client for Neurological Symptom Analysis
 * Calls the MCP server to analyze symptoms
 * Supports both rule-based and AI-powered analysis via Anthropic API
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { analyzeSymptomsFromText } = require('./mcp-server');

// Optional: Anthropic API client
let anthropicClient = null;
try {
    if (process.env.ANTHROPIC_API_KEY) {
        const Anthropic = require('@anthropic-ai/sdk');
        anthropicClient = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY
        });
    }
} catch (error) {
    console.warn('Anthropic SDK not available or API key not set. Using rule-based analysis only.');
}

/**
 * Analyze symptoms using Anthropic API (AI-powered)
 *
 * This function sends the complete neurological knowledge base JSON
 * along with patient symptoms to Claude for intelligent analysis.
 */
async function analyzeSymptomsWithAI(symptomsText) {
    if (!anthropicClient) {
        throw new Error('Anthropic API key not configured');
    }

    // Load the complete neurological knowledge base
    const knowledgeBase = require('./mcp-server').knowledgeBase;

    // Build comprehensive prompt with full JSON content
    const prompt = `You are an expert medical analysis assistant specializing in neurological and psychiatric conditions.
You have access to a comprehensive medical knowledge base with symptoms, diseases, diagnostic rules, treatments, and investigations.

=== COMPLETE MEDICAL KNOWLEDGE BASE (JSON) ===
${JSON.stringify(knowledgeBase, null, 2)}
=== END OF KNOWLEDGE BASE ===

=== PATIENT SYMPTOM DESCRIPTION ===
${symptomsText}
=== END OF PATIENT DESCRIPTION ===

ANALYSIS TASK:
Using the knowledge base above, analyze the patient's symptoms and provide a definitive medical diagnosis. Your analysis should be confident and decisive.

REQUIRED OUTPUT:
Please respond ONLY with valid JSON (no additional text) in this exact format:
{
  "detectedSymptoms": [
    {"id": "symptom_id", "name": "Symptom Name"}
  ],
  "detectedRiskFactors": [
    {"id": "risk_id", "name": "Risk Factor Name"}
  ],
  "diagnoses": [
    {
      "id": "disease_id",
      "name": "Disease/Condition Name",
      "confidence": 85,
      "severity": "mild|moderate|severe"
    }
  ],
  "medications": ["Medication 1", "Medication 2"],
  "recommendations": ["Treatment recommendation 1", "Treatment recommendation 2"],
  "investigations": ["Investigation 1", "Investigation 2"],
  "summary": "Comprehensive assessment summary"
}

INSTRUCTIONS:
1. Match symptoms from the patient description against the symptoms in the knowledge base - look for both exact matches and semantic equivalents
2. Identify any mentioned risk factors from the knowledge base
3. Using the diagnostic_rules in the knowledge base, determine which diseases match the symptoms. Be inclusive - if core symptoms match, the disease is a valid diagnosis
4. Assign confidence scores (60-100) based on symptom match. If key symptoms for a disease are present, give high confidence (80+). Do NOT return low confidence scores or avoid providing diagnoses
5. Determine severity level based on number of symptoms (mild: 0-3, moderate: 4-6, severe: 7+)
6. Extract appropriate medications and treatments from treatment_recommendations
7. Include investigations from investigation_recommendations
8. Write a clear, professional summary that provides definitive guidance

CRITICAL RULES:
- ALWAYS provide at least one diagnosis if any symptoms are mentioned
- When symptoms clearly match a condition (e.g., loss of appetite, fatigue, staying in bed, sadness = depression), provide that diagnosis with 80%+ confidence
- Do NOT say "no clear diagnosis pattern was identified" - instead provide the best matching diagnosis
- Be confident and decisive in your analysis
- Return diagnoses sorted by confidence level (highest first)

IMPORTANT: Return ONLY valid JSON, no markdown formatting or extra text.`;

    try {
        console.log('\n📤 Sending AI analysis request to Anthropic API...');
        console.log('📋 Knowledge Base Size:', JSON.stringify(knowledgeBase).length, 'characters');
        console.log('🧬 Patient Symptoms Length:', symptomsText.length, 'characters');

        const message = await anthropicClient.messages.create({
            model: 'claude-opus-4-5-20251101',
            max_tokens: 2000,
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ]
        });

        console.log('✅ AI response received');

        // Extract text from response
        let responseText = message.content[0].text;

        // Try to parse JSON from response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const result = JSON.parse(jsonMatch[0]);
            console.log('✅ AI Analysis Result:', {
                diagnoses: result.diagnoses?.length || 0,
                medications: result.medications?.length || 0,
                recommendations: result.recommendations?.length || 0,
                investigations: result.investigations?.length || 0
            });
            return result;
        }

        console.error('❌ Could not parse JSON from response:', responseText.substring(0, 200));
        throw new Error('Could not parse AI response as JSON');
    } catch (error) {
        console.error('❌ AI Analysis Error:', error.message);
        throw new Error(`AI Analysis Error: ${error.message}`);
    }
}

/**
 * Analyze symptoms using AI (Claude)
 * AI-based analysis only - no rule-based fallback
 */
function analyzeSymptoms(symptomsText) {
    if (!anthropicClient) {
        throw new Error('Anthropic API key not configured. AI analysis requires a valid API key.');
    }
    return analyzeSymptomsWithAI(symptomsText);
}

/**
 * Batch analyze multiple symptom sets
 */
function batchAnalyze(symptomsList) {
    const results = [];
    for (const symptoms of symptomsList) {
        try {
            const result = analyzeSymptoms(symptoms);
            results.push({
                symptoms,
                result,
                success: true
            });
        } catch (error) {
            results.push({
                symptoms,
                error: error.message,
                success: false
            });
        }
    }
    return results;
}

/**
 * Format analysis result for display
 */
function formatAnalysisResult(result) {
    let output = '\n=== SYMPTOM ANALYSIS RESULTS ===\n';

    output += '\nDETECTED SYMPTOMS:\n';
    if (result.detectedSymptoms.length > 0) {
        result.detectedSymptoms.forEach(sym => {
            output += `  • ${sym.name}\n`;
        });
    } else {
        output += '  No symptoms detected\n';
    }

    output += '\nDETECTED RISK FACTORS:\n';
    if (result.detectedRiskFactors.length > 0) {
        result.detectedRiskFactors.forEach(rf => {
            output += `  • ${rf.name}\n`;
        });
    } else {
        output += '  No risk factors detected\n';
    }

    output += '\nPOSSIBLE DIAGNOSES:\n';
    if (result.diagnoses.length > 0) {
        result.diagnoses.forEach((diagnosis, index) => {
            output += `  ${index + 1}. ${diagnosis.name}\n`;
            output += `     Confidence: ${diagnosis.confidence}%\n`;
            output += `     Severity: ${diagnosis.severity}\n`;
        });
    } else {
        output += '  No matching diagnoses found\n';
    }

    output += '\nRECOMMENDED MEDICATIONS:\n';
    if (result.medications.length > 0) {
        result.medications.forEach(med => {
            output += `  • ${med}\n`;
        });
    } else {
        output += '  None\n';
    }

    output += '\nTREATMENT RECOMMENDATIONS:\n';
    if (result.recommendations.length > 0) {
        result.recommendations.forEach(rec => {
            output += `  • ${rec}\n`;
        });
    } else {
        output += '  None\n';
    }

    output += '\nSUGGESTED INVESTIGATIONS:\n';
    if (result.investigations.length > 0) {
        result.investigations.forEach(inv => {
            output += `  • ${inv}\n`;
        });
    } else {
        output += '  None\n';
    }

    output += '\nSUMMARY:\n';
    output += `  ${result.summary}\n`;

    return output;
}

// Example usage when run directly
if (require.main === module) {
    const exampleSymptoms = `
        I have been experiencing persistent worry and excessive nervousness for the past month.
        I have difficulty concentrating on my work and find it hard to sleep at night.
        I also feel muscle tension throughout my body, especially in my neck and shoulders.
        I've been under a lot of stress due to work deadlines.
    `;

    console.log('=== MCP CLIENT EXAMPLE ===');
    console.log('Analysis Mode: AI-Powered (Anthropic)');
    console.log(`Analyzing symptoms: "${exampleSymptoms.trim()}\n`);

    analyzeSymptoms(exampleSymptoms)
        .then((result) => {
            console.log(formatAnalysisResult(result));
        })
        .catch((error) => {
            console.error('Error:', error.message);
            process.exit(1);
        });
}

module.exports = {
    analyzeSymptoms,
    batchAnalyze,
    formatAnalysisResult
};
