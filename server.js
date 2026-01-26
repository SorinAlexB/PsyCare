/**
 * Express Server for PsyCare
 * Handles HTTP requests and PDF generation
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { jsPDF } = require('jspdf');
const { analyzeSymptoms } = require('./mcp-client');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));

/**
 * Analyze symptoms endpoint
 */
app.post('/analyze', async (req, res) => {
    try {
        const { symptoms } = req.body;

        if (!symptoms || symptoms.trim().length === 0) {
            return res.status(400).json({
                error: 'Symptoms text is required'
            });
        }

        console.log(`\n🔍 Analyzing symptoms (AI-Powered)`);
        console.log(`📝 Symptoms length: ${symptoms.length} characters`);

        // Call MCP client to analyze symptoms with AI
        const analysisResult = await analyzeSymptoms(symptoms, true);

        // Format response
        const response = {
            diagnoses: analysisResult.diagnoses.map(d => ({
                name: d.name,
                confidence: d.confidence,
                severity: d.severity
            })),
            medications: analysisResult.medications,
            recommendations: analysisResult.recommendations,
            investigations: analysisResult.investigations,
            summary: analysisResult.summary,
            inputSymptoms: symptoms,
            analysisMode: 'AI-Powered (Claude Opus)'
        };

        console.log(' Analysis complete');
        res.json(response);
    } catch (error) {
        console.error(' Analysis error:', error);
        res.status(500).json({
            error: 'Analysis failed: ' + error.message
        });
    }
});

/**
 * Generate PDF endpoint
 */
app.post('/generate-pdf', (req, res) => {
    try {
        const {
            diagnoses,
            medications,
            recommendations,
            investigations,
            summary,
            inputSymptoms
        } = req.body;

        // Create PDF
        const pdf = new jsPDF();
        let yPosition = 20;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 15;
        const maxWidth = pageWidth - 2 * margin;

        // Helper function to add text with wrapping
        const addWrappedText = (text, x, y, options = {}) => {
            const fontSize = options.fontSize || 10;
            const color = options.color || [0, 0, 0];
            const isBold = options.bold || false;

            pdf.setFontSize(fontSize);
            pdf.setTextColor(...color);
            if (isBold) pdf.setFont(undefined, 'bold');
            else pdf.setFont(undefined, 'normal');

            const lines = pdf.splitTextToSize(text, maxWidth - 10);
            const lineHeight = fontSize * 0.5;

            if (y + lines.length * lineHeight > pageHeight - margin) {
                pdf.addPage();
                return addWrappedText(text, x, margin, options);
            }

            pdf.text(lines, x, y);
            return y + lines.length * lineHeight + 5;
        };

        // Header
        pdf.setFontSize(24);
        pdf.setTextColor(102, 126, 234);
        pdf.setFont(undefined, 'bold');
        pdf.text('PsyCare', margin, yPosition);
        yPosition += 15;

        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.setFont(undefined, 'normal');
        pdf.text('Neurological Symptom Analysis & Diagnosis Report', margin, yPosition);
        yPosition += 10;

        // Date
        const date = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        pdf.setFontSize(9);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`Report Generated: ${date}`, margin, yPosition);
        yPosition += 15;

        // Divider line
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;

        // Patient Input Section
        yPosition = addWrappedText('Patient Symptoms Description', margin, yPosition, {
            fontSize: 12,
            bold: true,
            color: [118, 75, 162]
        });

        yPosition = addWrappedText(inputSymptoms, margin + 5, yPosition, {
            fontSize: 9,
            color: [80, 80, 80]
        });

        yPosition += 8;
        pdf.setDrawColor(230, 230, 230);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;

        // Possible Diagnoses Section
        if (diagnoses && diagnoses.length > 0) {
            yPosition = addWrappedText('Possible Diagnoses', margin, yPosition, {
                fontSize: 12,
                bold: true,
                color: [102, 126, 234]
            });

            diagnoses.forEach((diagnosis, index) => {
                const diagnosisText = `${index + 1}. ${diagnosis.name}`;
                yPosition = addWrappedText(diagnosisText, margin + 5, yPosition, {
                    fontSize: 10,
                    bold: true,
                    color: [50, 50, 50]
                });

                const detailsText = `Confidence Level: ${diagnosis.confidence}% | Severity: ${diagnosis.severity.toUpperCase()}`;
                yPosition = addWrappedText(detailsText, margin + 10, yPosition, {
                    fontSize: 9,
                    color: [120, 120, 120]
                });
                yPosition += 3;
            });

            yPosition += 5;
            pdf.setDrawColor(230, 230, 230);
            pdf.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 10;
        }

        // Recommended Medications Section
        if (medications && medications.length > 0) {
            yPosition = addWrappedText('Recommended Medications', margin, yPosition, {
                fontSize: 12,
                bold: true,
                color: [102, 126, 234]
            });

            medications.forEach(medication => {
                yPosition = addWrappedText(`• ${medication}`, margin + 5, yPosition, {
                    fontSize: 9,
                    color: [50, 50, 50]
                });
            });

            yPosition += 5;
            pdf.setDrawColor(230, 230, 230);
            pdf.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 10;
        }

        // Treatment Recommendations Section
        if (recommendations && recommendations.length > 0) {
            yPosition = addWrappedText('Treatment Recommendations', margin, yPosition, {
                fontSize: 12,
                bold: true,
                color: [102, 126, 234]
            });

            recommendations.forEach(recommendation => {
                yPosition = addWrappedText(`• ${recommendation}`, margin + 5, yPosition, {
                    fontSize: 9,
                    color: [50, 50, 50]
                });
            });

            yPosition += 5;
            pdf.setDrawColor(230, 230, 230);
            pdf.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 10;
        }

        // Suggested Investigations Section
        if (investigations && investigations.length > 0) {
            yPosition = addWrappedText('Suggested Investigations', margin, yPosition, {
                fontSize: 12,
                bold: true,
                color: [102, 126, 234]
            });

            investigations.forEach(investigation => {
                yPosition = addWrappedText(`• ${investigation}`, margin + 5, yPosition, {
                    fontSize: 9,
                    color: [50, 50, 50]
                });
            });

            yPosition += 5;
            pdf.setDrawColor(230, 230, 230);
            pdf.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 10;
        }

        // Overall Assessment Section
        if (summary) {
            yPosition = addWrappedText('Overall Assessment', margin, yPosition, {
                fontSize: 12,
                bold: true,
                color: [102, 126, 234]
            });

            yPosition = addWrappedText(summary, margin + 5, yPosition, {
                fontSize: 9,
                color: [80, 80, 80]
            });

            yPosition += 10;
        }

        // Footer
        const totalPages = pdf.internal.pages.length - 1;
        for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            pdf.setFontSize(8);
            pdf.setTextColor(180, 180, 180);
            pdf.text(
                `Page ${i} of ${totalPages}`,
                pageWidth / 2,
                pageHeight - 10,
                { align: 'center' }
            );
        }

        // Add disclaimer on last page
        pdf.addPage();
        yPosition = 30;
        yPosition = addWrappedText(' IMPORTANT DISCLAIMER', margin, yPosition, {
            fontSize: 12,
            bold: true,
            color: [220, 100, 100]
        });

        const disclaimer = `This report is generated by the PsyCare system for educational and informational purposes only.

The analysis is based on symptom patterns and may not provide a complete or accurate diagnosis. This system does NOT replace professional medical advice, diagnosis, or treatment from qualified healthcare providers.

If you are experiencing severe symptoms, experiencing thoughts of self-harm, or have any medical concerns, please seek immediate medical attention or contact emergency services.

Always consult with a licensed physician, psychiatrist, or other qualified healthcare professional for proper diagnosis, treatment planning, and medical advice.`;

        yPosition = addWrappedText(disclaimer, margin, yPosition, {
            fontSize: 8,
            color: [100, 100, 100]
        });

        // Generate PDF buffer
        const pdfBuffer = pdf.output('arraybuffer');

        // Send response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=psycare-report-${Date.now()}.pdf`
        );
        res.send(Buffer.from(pdfBuffer));
    } catch (error) {
        console.error('PDF generation error:', error);
        res.status(500).json({
            error: 'PDF generation failed: ' + error.message
        });
    }
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'PsyCare server is running' });
});

/**
 * Root endpoint - serve the HTML page
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'psycare.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`\n✅ PsyCare server is running!`);
    console.log(`📍 Local:   http://localhost:${PORT}`);
    console.log(`🌐 Open your browser and navigate to http://localhost:${PORT}`);
    console.log(`\nPress Ctrl+C to stop the server\n`);
});

// Error handling
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
