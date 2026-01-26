/**
 * MCP Server for Neurological Symptom Analysis
 * Analyzes patient symptoms and provides diagnosis recommendations
 */

const fs = require('fs');
const path = require('path');

// Load the knowledge base
const knowledgeBase = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data/json/neurological_system.json'), 'utf-8')
);

/**
 * Tool: analyze_symptoms
 * Analyzes patient symptoms and provides diagnosis with recommendations
 */
function analyzeSymptomsFromText(symptomText) {
    // Parse symptoms from natural language text
    const detectedSymptoms = detectSymptomsFromText(symptomText);
    const detectedRiskFactors = detectRiskFactorsFromText(symptomText);

    // Match against diagnostic rules
    const possibleDiagnoses = matchDiagnosticRules(detectedSymptoms, detectedRiskFactors);

    // Get medications and recommendations
    const medications = getMedications(possibleDiagnoses);
    const recommendations = getRecommendations(possibleDiagnoses);
    const investigations = getInvestigations(possibleDiagnoses);

    // Generate summary
    const summary = generateSummary(detectedSymptoms, possibleDiagnoses);

    return {
        detectedSymptoms,
        detectedRiskFactors,
        diagnoses: possibleDiagnoses,
        medications,
        recommendations,
        investigations,
        summary
    };
}

/**
 * Detect symptoms from natural language text
 */
function detectSymptomsFromText(text) {
    const textLower = text.toLowerCase();
    const detected = [];
    const symptoms = knowledgeBase.knowledge_base.symptoms;

    for (const [key, symptom] of Object.entries(symptoms)) {
        const keywords = generateKeywords(symptom.name);
        if (keywords.some(keyword => textLower.includes(keyword))) {
            detected.push({
                id: key,
                name: symptom.name
            });
        }
    }

    return detected;
}

/**
 * Detect risk factors from natural language text
 */
function detectRiskFactorsFromText(text) {
    const textLower = text.toLowerCase();
    const detected = [];
    const riskFactors = knowledgeBase.knowledge_base.risk_factors;

    for (const [key, factor] of Object.entries(riskFactors)) {
        const keywords = generateKeywords(factor.name);
        if (keywords.some(keyword => textLower.includes(keyword))) {
            detected.push({
                id: key,
                name: factor.name
            });
        }
    }

    return detected;
}

/**
 * Generate keywords from a name for matching
 */
function generateKeywords(name) {
    const keywords = [name.toLowerCase()];

    // Add variations
    const words = name.toLowerCase().split(' ');
    keywords.push(...words);

    // Add common abbreviations and variations
    const variations = {
        'heart palpitations': ['palpitations', 'heart beat', 'palpitation'],
        'muscle tension': ['muscle', 'tension', 'tight muscles'],
        'sleep disturbances': ['sleep', 'insomnia', 'cant sleep', 'sleeping'],
        'concentration difficulties': ['concentration', 'focus', 'attention', 'concentrating'],
        'loss of interest': ['interest', 'anhedonia'],
        'appetite changes': ['appetite', 'eating', 'weight'],
        'suicidal thoughts': ['suicide', 'suicidal', 'harm myself'],
        'muscle weakness': ['weakness', 'weak', 'muscle'],
        'memory loss': ['memory', 'forget', 'remembering'],
        'time/space disorientation': ['disoriented', 'disorientation', 'confused', 'confusion'],
        'speech difficulties': ['speech', 'talking', 'language'],
        'personality changes': ['personality', 'behavior', 'mood swings'],
        'pulsating headache': ['headache', 'migraine', 'head pain'],
        'tremors': ['tremor', 'shaking', 'shakes'],
        'seizures': ['seizure', 'convulsion', 'fit'],
        'chronic migraine': ['migraine', 'headaches'],
        'advanced age': ['age', 'elderly', 'old', 'aging'],
        'alcohol consumption': ['alcohol', 'drinking', 'drink'],
        'smoking': ['smoke', 'smoking', 'cigarettes']
    };

    const lowerName = name.toLowerCase();
    if (variations[lowerName]) {
        keywords.push(...variations[lowerName]);
    }

    return keywords;
}

/**
 * Match symptoms against diagnostic rules
 */
function matchDiagnosticRules(detectedSymptoms, detectedRiskFactors) {
    const diagnoses = [];
    const rules = knowledgeBase.diagnostic_rules;
    const diseases = knowledgeBase.knowledge_base.diseases;

    for (const [ruleId, rule] of Object.entries(rules)) {
        const diseaseId = rule.disease;
        const diseaseName = diseases[diseaseId].name;

        // Check if rule matches
        const symptomsMatch = checkSymptomRequirements(
            rule.required_symptoms,
            detectedSymptoms
        );

        const riskFactorsMatch = checkRiskFactorRequirements(
            rule.required_risk_factors,
            detectedRiskFactors
        );

        if (symptomsMatch && riskFactorsMatch) {
            const confidence = calculateConfidence(
                rule.required_symptoms,
                rule.required_risk_factors,
                detectedSymptoms,
                detectedRiskFactors
            );

            const severity = calculateSeverity(detectedSymptoms.length);

            diagnoses.push({
                id: diseaseId,
                name: diseaseName,
                confidence,
                severity,
                ruleId
            });
        }
    }

    // Sort by confidence
    diagnoses.sort((a, b) => b.confidence - a.confidence);

    return diagnoses;
}

/**
 * Check if symptom requirements are met
 */
function checkSymptomRequirements(requirements, detectedSymptoms) {
    if (!requirements) return true;

    const symptomIds = detectedSymptoms.map(s => s.id);

    // Check individual required symptoms
    if (requirements.symptoms) {
        for (const sym of requirements.symptoms) {
            if (sym.required && !symptomIds.includes(sym.ref)) {
                return false;
            }
        }
    }

    // Check symptom groups
    if (requirements.symptom_groups) {
        for (const group of requirements.symptom_groups) {
            if (group.required) {
                const groupMatch = group.symptoms.some(s => symptomIds.includes(s));
                if (!groupMatch) {
                    return false;
                }
            }
        }
    }

    // Check minimum count
    if (requirements.minimum_count && detectedSymptoms.length < requirements.minimum_count) {
        return false;
    }

    return true;
}

/**
 * Check if risk factor requirements are met
 */
function checkRiskFactorRequirements(requirements, detectedRiskFactors) {
    if (!requirements) return true;

    const riskFactorIds = detectedRiskFactors.map(r => r.id);

    // Check individual required risk factors
    if (requirements.risk_factors) {
        for (const rf of requirements.risk_factors) {
            if (rf.required && !riskFactorIds.includes(rf.ref)) {
                return false;
            }
        }
    }

    // Check risk factor groups
    if (requirements.risk_factor_groups) {
        for (const group of requirements.risk_factor_groups) {
            if (group.required) {
                const groupMatch = group.risk_factors.some(r => riskFactorIds.includes(r));
                if (!groupMatch) {
                    return false;
                }
            }
        }
    }

    return true;
}

/**
 * Calculate confidence score
 */
function calculateConfidence(symptoms, riskFactors, detected, detectedRiskFactors) {
    let matchedSymptoms = 0;
    let totalSymptoms = 0;

    if (symptoms && symptoms.symptoms) {
        totalSymptoms = symptoms.symptoms.filter(s => s.required).length;
        const detectedIds = detected.map(d => d.id);
        matchedSymptoms = symptoms.symptoms.filter(
            s => s.required && detectedIds.includes(s.ref)
        ).length;
    }

    const baseConfidence = totalSymptoms > 0 ? (matchedSymptoms / totalSymptoms) * 100 : 50;
    const adjustedConfidence = Math.min(Math.max(baseConfidence, 30), 95);

    return Math.round(adjustedConfidence);
}

/**
 * Calculate severity level
 */
function calculateSeverity(symptomCount) {
    const levels = knowledgeBase.severity_levels;
    for (const level of levels) {
        if (symptomCount >= level.min_symptoms && symptomCount <= level.max_symptoms) {
            return level.name;
        }
    }
    return 'moderate';
}

/**
 * Get medications for diagnoses
 */
function getMedications(diagnoses) {
    const medications = new Set();
    const treatments = knowledgeBase.treatment_recommendations;

    for (const diagnosis of diagnoses) {
        if (treatments[diagnosis.id]) {
            const treatmentIds = treatments[diagnosis.id];
            const allTreatments = knowledgeBase.knowledge_base.treatments;

            for (const treatmentId of treatmentIds) {
                if (allTreatments[treatmentId]) {
                    medications.add(allTreatments[treatmentId].name);
                }
            }
        }
    }

    return Array.from(medications);
}

/**
 * Get recommendations for diagnoses
 */
function getRecommendations(diagnoses) {
    const recommendations = new Set();
    const treatments = knowledgeBase.treatment_recommendations;

    for (const diagnosis of diagnoses) {
        if (treatments[diagnosis.id]) {
            const treatmentIds = treatments[diagnosis.id];
            const allTreatments = knowledgeBase.knowledge_base.treatments;

            for (const treatmentId of treatmentIds) {
                if (allTreatments[treatmentId]) {
                    const name = allTreatments[treatmentId].name;
                    // Separate medications from therapy recommendations
                    if (!name.includes('Medication')) {
                        recommendations.add(name);
                    }
                }
            }
        }
    }

    return Array.from(recommendations);
}

/**
 * Get investigations for diagnoses
 */
function getInvestigations(diagnoses) {
    const investigations = new Set();
    const investigationRecs = knowledgeBase.investigation_recommendations;
    const allInvestigations = knowledgeBase.knowledge_base.investigations;

    for (const diagnosis of diagnoses) {
        if (investigationRecs[diagnosis.id]) {
            const invIds = investigationRecs[diagnosis.id];
            for (const invId of invIds) {
                if (allInvestigations[invId]) {
                    investigations.add(allInvestigations[invId].name);
                }
            }
        }
    }

    return Array.from(investigations);
}

/**
 * Generate summary text
 */
function generateSummary(detectedSymptoms, diagnoses) {
    if (diagnoses.length === 0) {
        return 'Based on the symptoms described, no clear diagnosis pattern was identified. Please consult with a healthcare professional for a proper evaluation.';
    }

    const topDiagnosis = diagnoses[0];
    const symptomList = detectedSymptoms.slice(0, 3).map(s => s.name).join(', ');

    return `Based on the symptoms described (${symptomList}), the most likely condition is ${topDiagnosis.name} with a confidence level of ${topDiagnosis.confidence}%. This is a ${topDiagnosis.severity}-level condition. However, please note that this analysis is for educational purposes only and should not replace professional medical diagnosis. A qualified healthcare provider should conduct a thorough evaluation.`;
}

/**
 * Tool handler
 */
function handleToolCall(toolName, toolInput) {
    if (toolName === 'analyze_symptoms') {
        return analyzeSymptomsFromText(toolInput.symptoms_text);
    }
    throw new Error(`Unknown tool: ${toolName}`);
}

// Export for use in main server
module.exports = {
    analyzeSymptomsFromText,
    handleToolCall,
    knowledgeBase
};
