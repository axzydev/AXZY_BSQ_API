import PDFDocument from "pdfkit";
import { Response } from "express";

/* ================= COLORS & STYLES ================= */
const COLORS = {
  primary: "#2563EB", // Blue-600
  secondary: "#1E40AF", // Blue-800
  accent: "#3B82F6", // Blue-500
  text: "#1F2937", // Gray-800
  textLight: "#6B7280", // Gray-500
  background: "#F3F4F6", // Gray-100
  white: "#FFFFFF",
  success: "#10B981", // Green-500
  warning: "#F59E0B", // Amber-500
  danger: "#EF4444", // Red-500
  border: "#E5E7EB", // Gray-200
};

const FONTS = {
  regular: "Helvetica",
  bold: "Helvetica-Bold",
};

/* ================= HELPERS ================= */

const drawSectionTitle = (doc: PDFKit.PDFDocument, text: string, y: number) => {
  doc
    .rect(50, y, 5, 20)
    .fill(COLORS.primary);
  
  doc
    .fontSize(14)
    .font(FONTS.bold)
    .fillColor(COLORS.text)
    .text(text.toUpperCase(), 65, y + 5);
    
  return y + 35;
};

const drawLabelValue = (doc: PDFKit.PDFDocument, label: string, value: string, x: number, y: number, width: number = 200) => {
  doc
    .fontSize(9)
    .font(FONTS.bold)
    .fillColor(COLORS.textLight)
    .text(label.toUpperCase(), x, y);
    
  doc
    .fontSize(11)
    .font(FONTS.regular)
    .fillColor(COLORS.text)
    .text(value, x, y + 12, { width: width, ellipsis: true });
};

const drawRating = (doc: PDFKit.PDFDocument, level: string, x: number, y: number) => {
    // Background pill
    let color = COLORS.textLight;
    if (level === "ALTO" || level === "PROGRESO" || level === "ELITE") color = COLORS.success;
    if (level === "MEDIO" || level === "ESTABLE" || level === "OPTIMO") color = COLORS.warning;
    if (level === "BAJO" || level === "ATENCION" || level === "BASE") color = COLORS.danger;

    if (level === "BAJO" || level === "ATENCION" || level === "BASE") color = COLORS.danger;
    
    doc.roundedRect(x, y, 60, 16, 8).fill(color);
    doc.fillColor(COLORS.white).fontSize(8).font(FONTS.bold).text(level, x, y + 4, { width: 60, align: 'center' });
};


const calculateAge = (birthDate: Date | string) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};

const getCategory = (age: number) => {
    if (age <= 11) return "Infantil";
    if (age <= 17) return "Juvenil";
    return "Normal";
};

/* ================= MAIN FUNCTION ================= */

export const generateEvaluationPDF = (evaluation: any, res: Response) => {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  doc.pipe(res);

  // Calculate fields dynamically if needed
  const age = calculateAge(evaluation.child.birthDate) || evaluation.age || 0;
  const category = getCategory(age); // Always use calculated category for consistency

  try {
    /* ================= HEADER ================= */
    // Top Bar
    doc.rect(0, 0, 600, 15).fill(COLORS.primary);

    // Logo / Title Area
    doc.moveDown(2);
    const titleY = 40;
    
    // Placeholder for Logo (using text for now)
    doc
      .fontSize(24)
      .font(FONTS.bold)
      .fillColor(COLORS.primary)
      .text("TERRY BASEBALL", 50, titleY);
      
    doc
      .fontSize(10)
      .font(FONTS.regular)
      .fillColor(COLORS.textLight)
      .text("ACADEMY", 50, titleY + 28, { characterSpacing: 5 });

    // Report Type and Date
    doc.fontSize(10).font(FONTS.bold).fillColor(COLORS.textLight).text("REPORTE DE EVALUACIÓN", 350, titleY, { align: 'right', width: 200 });
    doc.fontSize(20).font(FONTS.regular).fillColor(COLORS.text).text(new Date(evaluation.createdAt).toLocaleDateString(), 350, titleY + 15, { align: 'right', width: 200 });

    doc.moveTo(50, 90).lineTo(545, 90).strokeColor(COLORS.border).stroke();

    /* ================= PROFILE CARD ================= */
    let currentY = 110;
    
    // Background for profile
    doc.roundedRect(50, currentY, 495, 80, 5).fill(COLORS.background);
    
    const profileY = currentY + 15;
    drawLabelValue(doc, "Jugador", `${evaluation.child.name} ${evaluation.child.lastName || ""}`, 70, profileY);
    drawLabelValue(doc, "Edad", `${age} años`, 250, profileY, 50);
    drawLabelValue(doc, "Categoría", category, 350, profileY);
    drawLabelValue(doc, "Entrenador", `${evaluation.coach.name} ${evaluation.coach.lastName || ""}`, 70, profileY + 35);
    
    currentY += 100;

    /* ================= SWING METRICS ================= */
    currentY = drawSectionTitle(doc, "Métricas de Velocidad (Swing)", currentY);
    
    // Grid for Swing Metrics
    const swingY = currentY;
    let colX = 50;
    
    if (evaluation.swingMetrics && evaluation.swingMetrics.length > 0) {
        evaluation.swingMetrics.forEach((metric: any) => {
            // Card for each metric
            doc.roundedRect(colX, swingY, 150, 60, 5).strokeColor(COLORS.border).stroke();
            
            // Level Label
            doc.rect(colX, swingY, 150, 20).fill(COLORS.background); // Header bg
            doc.fillColor(COLORS.text).fontSize(10).font(FONTS.bold).text(metric.level, colX + 10, swingY + 6);
            
            // Value
            doc.fillColor(COLORS.primary).fontSize(18).font(FONTS.bold).text(`${metric.speedMph}`, colX + 10, swingY + 30);
            doc.fillColor(COLORS.textLight).fontSize(10).font(FONTS.regular).text("mph", colX + 50, swingY + 36);

            colX += 165;
        });
    } else {
        doc.fontSize(10).fillColor(COLORS.textLight).text("No hay métricas registradas.", 50, swingY);
    }

    currentY += 80;

    /* ================= TECHNICAL EVALUATION ================= */
    currentY = drawSectionTitle(doc, "Evaluación Técnica", currentY);
    
    // Table Header
    const tableHeaderY = currentY;
    doc.rect(50, tableHeaderY, 495, 25).fill(COLORS.background);
    doc.fillColor(COLORS.textLight).fontSize(9).font(FONTS.bold);
    doc.text("ÁREA TÉCNICA", 60, tableHeaderY + 8);
    doc.text("NIVEL", 350, tableHeaderY + 8);
    doc.text("ESTADO", 450, tableHeaderY + 8);
    
    currentY += 25;

    // Rows
    if (evaluation.technicalRatings && evaluation.technicalRatings.length > 0) {
        evaluation.technicalRatings.forEach((rating: any, index: number) => {
            const rowY = currentY + (index * 30);
            
            // Zebra striping optional
            if (index % 2 !== 0) {
                 doc.rect(50, rowY, 495, 30).fill("#FAFAFA"); 
            }
            
            // Area Name
            doc.fillColor(COLORS.text).fontSize(10).font(FONTS.regular).text(rating.area?.name || "N/A", 60, rowY + 10);
            
            // Level Badge
            drawRating(doc, rating.level, 350, rowY + 7);
            
            // Progress Indicator Badge
            drawRating(doc, rating.indicator, 450, rowY + 7);
            
            // Bottom border
            doc.moveTo(50, rowY + 30).lineTo(545, rowY + 30).lineWidth(0.5).strokeColor(COLORS.border).stroke();
        });
        currentY += (evaluation.technicalRatings.length * 30) + 20;
    } else {
         doc.fontSize(10).fillColor(COLORS.textLight).text("No hay evaluaciones registradas.", 60, currentY + 10);
         currentY += 30;
    }

    /* ================= GENERAL INDICATOR ================= */
    // Only if not at end of page... handle pagination simply by hoping content fits or minimal check
    if (currentY > 650) { doc.addPage(); currentY = 50; }

    currentY = drawSectionTitle(doc, "Resumen del Periodo", currentY);
    
    // Large indicator card
    doc.roundedRect(50, currentY, 495, 50, 5).fill(COLORS.background);
    doc.fillColor(COLORS.text).fontSize(11).font(FONTS.bold).text("Indicador General de Progreso:", 70, currentY + 20);
    
    // Assuming first rating's indicator represents the period (as per previous logic) or maybe we need a general field.
    // Using the development log indicator if available, else first rating.
    const generalIndicator = evaluation.developmentLogs?.[0]?.indicator || evaluation.technicalRatings?.[0]?.indicator || "ESTABLE";
    
    drawRating(doc, generalIndicator, 300, currentY + 17);
    
    currentY += 70;

    /* ================= OBSERVATIONS / NOTES ================= */
    if (currentY > 600) { doc.addPage(); currentY = 50; }
    
    currentY = drawSectionTitle(doc, "Observaciones y Comentarios", currentY);
    
    const notes = evaluation.notes || "Sin observaciones adicionales.";
    const comments = evaluation.developmentLogs?.[0]?.comments || "";
    
    doc.fontSize(10).font(FONTS.regular).fillColor(COLORS.text).text(notes, 50, currentY, { width: 495, align: 'justify' });
    currentY += doc.heightOfString(notes, { width: 495 }) + 10;
    
    if (comments) {
        doc.moveDown(0.5);
        doc.fontSize(10).font(FONTS.bold).fillColor(COLORS.text).text("Comentarios de Desarrollo:", 50, doc.y);
        doc.fontSize(10).font(FONTS.regular).fillColor(COLORS.text).text(comments, 50, doc.y + 15, { width: 495, align: 'justify' });
    }

    /* ================= FOOTER ================= */
    const bottomY = doc.page.height - 50;
    doc.fontSize(8).fillColor(COLORS.textLight).text("Este documento es confidencial y para uso exclusivo de Terry Baseball Academy.", 50, bottomY, { align: 'center', width: 495 });
    doc.text("Generado auntomáticamente por AXZY System", 50, bottomY + 12, { align: 'center', width: 495 });

  } catch (error: any) {
    console.error("PDF Generation Error:", error);
    doc.addPage();
    doc.fillColor("red").fontSize(14).text("Ocurrió un error al generar el diseño del reporte.");
    doc.fontSize(10).text(error.message);
  } finally {
    doc.end();
  }
};
