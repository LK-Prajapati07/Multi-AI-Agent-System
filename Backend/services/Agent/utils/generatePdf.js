import PDFDocument from "pdfkit";

const COLORS = {
    primary: "#4F46E5",      // indigo accent
    primaryLight: "#EEF2FF",
    heading: "#111827",
    subheading: "#6B7280",
    text: "#374151",
    badgeText: "#FFFFFF",
    footer: "#9CA3AF",
    rule: "#E5E7EB"
};

const generatePdf = async (data) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: "A4",
                margin: 0, // we manage spacing manually for full-bleed header
                bufferPages: true,
                info: {
                    Author: "Multi AI Agent",
                    Title: data.title,
                    Creator: "Multi AI Agent"
                }
            });

            const chunks = [];
            doc.on("data", (chunk) => chunks.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(chunks)));
            doc.on("error", reject);

            const pageWidth = doc.page.width;
            const contentMargin = 50;
            const contentWidth = pageWidth - contentMargin * 2;

            // =========================
            // Header band
            // =========================
            const headerHeight = data.subtitle ? 130 : 100;

            doc
                .rect(0, 0, pageWidth, headerHeight)
                .fill(COLORS.primary);

            doc
                .fillColor("#FFFFFF")
                .font("Helvetica-Bold")
                .fontSize(26)
                .text(data.title || "Untitled Document", contentMargin, 40, {
                    width: contentWidth,
                    align: "left"
                });

            if (data.subtitle) {
                doc
                    .font("Helvetica")
                    .fontSize(13)
                    .fillColor(COLORS.primaryLight)
                    .text(data.subtitle, contentMargin, 78, {
                        width: contentWidth,
                        align: "left"
                    });
            }

            doc.y = headerHeight + 35;

            // =========================
            // Sections
            // =========================
            const sections = data.section || data.sections || [];

            sections.forEach((section, index) => {
                ensureSpace(doc, 90, headerHeight === 130 ? 130 : 100);

                const badgeSize = 24;
                const badgeX = contentMargin;
                const badgeY = doc.y;

                // Numbered badge
                doc
                    .save()
                    .circle(badgeX + badgeSize / 2, badgeY + badgeSize / 2, badgeSize / 2)
                    .fill(COLORS.primary)
                    .restore();

                doc
                    .fillColor(COLORS.badgeText)
                    .font("Helvetica-Bold")
                    .fontSize(12)
                    .text(String(index + 1), badgeX, badgeY + 6, {
                        width: badgeSize,
                        align: "center"
                    });

                // Section heading, next to badge
                doc
                    .fillColor(COLORS.heading)
                    .font("Helvetica-Bold")
                    .fontSize(16)
                    .text(section.heading || "", badgeX + badgeSize + 12, badgeY + 4, {
                        width: contentWidth - badgeSize - 12
                    });

                doc.moveDown(0.8);
                doc.x = contentMargin;

                // Divider rule
                doc
                    .moveTo(contentMargin, doc.y)
                    .lineTo(contentMargin + contentWidth, doc.y)
                    .strokeColor(COLORS.rule)
                    .lineWidth(1)
                    .stroke();

                doc.moveDown(0.6);

                // Points as styled bullets
                const points = section.point || section.points || [];
                points.forEach((point) => {
                    ensureSpace(doc, 24, headerHeight === 130 ? 130 : 100);

                    const bulletY = doc.y + 5;
                    doc
                        .circle(contentMargin + 4, bulletY, 2.5)
                        .fill(COLORS.primary);

                    doc
                        .fillColor(COLORS.text)
                        .font("Helvetica")
                        .fontSize(11.5)
                        .text(point, contentMargin + 16, doc.y, {
                            width: contentWidth - 16,
                            lineGap: 2
                        });

                    doc.moveDown(0.4);
                });

                doc.moveDown(1.2);
            });

            // =========================
            // Footer: page numbers
            // =========================
            const pageRange = doc.bufferedPageRange();
            for (let i = 0; i < pageRange.count; i++) {
                doc.switchToPage(i);
                doc
                    .fontSize(9)
                    .fillColor(COLORS.footer)
                    .text(
                        `Page ${i + 1} of ${pageRange.count}`,
                        0,
                        doc.page.height - 40,
                        { align: "center", width: pageWidth }
                    );
            }

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

// Adds a new page if there isn't enough vertical room left,
// and re-draws a slim header accent on the new page.
function ensureSpace(doc, neededHeight, _unusedHeaderHeight) {
    const bottomLimit = doc.page.height - 60;
    if (doc.y + neededHeight > bottomLimit) {
        doc.addPage();
        doc.y = 50;
        doc.x = 50;
    }
}

export default generatePdf;