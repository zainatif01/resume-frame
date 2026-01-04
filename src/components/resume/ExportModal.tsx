import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, FileIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import { ResumeData } from "@/types/resume";

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeData: ResumeData;
  resumeRef: React.RefObject<HTMLDivElement>;
}

export const ExportModal = ({ open, onOpenChange, resumeData }: ExportModalProps) => {
  const [exporting, setExporting] = useState<"pdf" | "docx" | null>(null);

  const exportToPDF = async () => {
    setExporting("pdf");
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let yPosition = margin;

      // Set font
      pdf.setFont("times", "normal");

      // Name - bold, larger
      pdf.setFontSize(18);
      pdf.setFont("times", "bold");
      pdf.text(resumeData.name, margin, yPosition);
      yPosition += 8;

      // Contact info on one line with vertical bars
      pdf.setFontSize(10);
      pdf.setFont("times", "normal");
      const contactParts = [
        resumeData.contact.email,
        resumeData.contact.phone,
        resumeData.contact.location,
      ].filter(Boolean);
      pdf.text(contactParts.join(" | "), margin, yPosition);
      yPosition += 10;

      // Sections
      for (const section of resumeData.sections) {
        // Section heading - uppercase, bold, slightly larger
        pdf.setFontSize(11);
        pdf.setFont("times", "bold");
        pdf.text(section.title.toUpperCase(), margin, yPosition);
        
        // Line under heading extending to right margin
        yPosition += 1;
        pdf.setLineWidth(0.3);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 5;

        // Items
        pdf.setFontSize(10);
        for (const item of section.items) {
          if (item.type === "paragraph" && item.content) {
            pdf.setFont("times", "normal");
            const lines = pdf.splitTextToSize(item.content, contentWidth);
            pdf.text(lines, margin, yPosition);
            yPosition += lines.length * 4 + 3;
          } else {
            // Bold title and date
            if (item.boldTitle || item.boldDate) {
              pdf.setFont("times", "bold");
              if (item.boldTitle) {
                pdf.text(item.boldTitle, margin, yPosition);
              }
              if (item.boldDate) {
                const dateWidth = pdf.getTextWidth(item.boldDate);
                pdf.text(item.boldDate, pageWidth - margin - dateWidth, yPosition);
              }
              yPosition += 4;
            }

            // Secondary title and text
            if (item.secondaryTitle || item.secondaryText) {
              pdf.setFont("times", "italic");
              if (item.secondaryTitle) {
                pdf.text(item.secondaryTitle, margin, yPosition);
              }
              if (item.secondaryText) {
                pdf.setFont("times", "normal");
                const textWidth = pdf.getTextWidth(item.secondaryText);
                pdf.text(item.secondaryText, pageWidth - margin - textWidth, yPosition);
              }
              yPosition += 4;
            }

            // Bullet points
            if (item.bullets && item.bullets.length > 0) {
              pdf.setFont("times", "normal");
              for (const bullet of item.bullets) {
                const bulletText = `• ${bullet}`;
                const lines = pdf.splitTextToSize(bulletText, contentWidth - 5);
                pdf.text(lines, margin + 3, yPosition);
                yPosition += lines.length * 4;
              }
            }
            yPosition += 2;
          }

          // Check for page break
          if (yPosition > pdf.internal.pageSize.getHeight() - margin) {
            pdf.addPage();
            yPosition = margin;
          }
        }
        yPosition += 3;
      }

      pdf.save(`${resumeData.name.replace(/\s+/g, "_")}_Resume.pdf`);
      
      toast.success("PDF exported successfully!");
      onOpenChange(false);
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Failed to export PDF");
    } finally {
      setExporting(null);
    }
  };

  const exportToDocx = async () => {
    setExporting("docx");
    try {
      const children: Paragraph[] = [];

      // Name - left aligned, bold
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: resumeData.name,
              bold: true,
              size: 36,
              font: "Times New Roman",
            }),
          ],
          alignment: AlignmentType.LEFT,
          spacing: { after: 100 },
        })
      );

      // Contact on one line with vertical bars
      const contactParts = [
        resumeData.contact.email,
        resumeData.contact.phone,
        resumeData.contact.location,
      ].filter(Boolean);
      
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: contactParts.join(" | "),
              size: 20,
              font: "Times New Roman",
            }),
          ],
          alignment: AlignmentType.LEFT,
          spacing: { after: 300 },
        })
      );

      // Sections
      for (const section of resumeData.sections) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: section.title.toUpperCase(),
                bold: true,
                size: 22,
                font: "Times New Roman",
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
            border: {
              bottom: {
                color: "000000",
                size: 6,
                style: "single",
                space: 1,
              },
            },
          })
        );

        for (const item of section.items) {
          if (item.type === "paragraph" && item.content) {
            children.push(
              new Paragraph({
                children: [new TextRun({ text: item.content, size: 20, font: "Times New Roman" })],
                spacing: { after: 100 },
              })
            );
          } else {
            if (item.boldTitle || item.boldDate) {
              const titleRuns: TextRun[] = [];
              if (item.boldTitle) {
                titleRuns.push(new TextRun({ text: item.boldTitle, bold: true, size: 22, font: "Times New Roman" }));
              }
              if (item.boldDate) {
                if (item.boldTitle) titleRuns.push(new TextRun({ text: "\t\t\t\t", font: "Times New Roman" }));
                titleRuns.push(new TextRun({ text: item.boldDate, bold: true, size: 22, font: "Times New Roman" }));
              }
              children.push(new Paragraph({ children: titleRuns, spacing: { before: 150 } }));
            }

            if (item.secondaryTitle || item.secondaryText) {
              const secondaryRuns: TextRun[] = [];
              if (item.secondaryTitle) {
                secondaryRuns.push(new TextRun({ text: item.secondaryTitle, italics: true, size: 20, font: "Times New Roman" }));
              }
              if (item.secondaryText) {
                if (item.secondaryTitle) secondaryRuns.push(new TextRun({ text: "\t\t\t", font: "Times New Roman" }));
                secondaryRuns.push(new TextRun({ text: item.secondaryText, size: 20, font: "Times New Roman" }));
              }
              children.push(new Paragraph({ children: secondaryRuns }));
            }

            if (item.bullets && item.bullets.length > 0) {
              for (const bullet of item.bullets) {
                children.push(
                  new Paragraph({
                    children: [new TextRun({ text: bullet, size: 20, font: "Times New Roman" })],
                    bullet: { level: 0 },
                    spacing: { after: 50 },
                  })
                );
              }
            }
          }
        }
      }

      const doc = new Document({
        sections: [{ children }],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${resumeData.name.replace(/\s+/g, "_")}_Resume.docx`);
      
      toast.success("DOCX exported successfully!");
      onOpenChange(false);
    } catch (error) {
      console.error("DOCX export error:", error);
      toast.error("Failed to export DOCX");
    } finally {
      setExporting(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Export Resume</DialogTitle>
          <DialogDescription>
            Choose your preferred format to download your resume.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <Button
            variant="outline"
            className="h-24 flex-col gap-2 hover:border-primary hover:bg-primary/5"
            onClick={exportToPDF}
            disabled={exporting !== null}
          >
            {exporting === "pdf" ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <FileText className="w-8 h-8 text-red-500" />
            )}
            <span className="font-medium">PDF</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex-col gap-2 hover:border-primary hover:bg-primary/5"
            onClick={exportToDocx}
            disabled={exporting !== null}
          >
            {exporting === "docx" ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <FileIcon className="w-8 h-8 text-blue-500" />
            )}
            <span className="font-medium">DOCX</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
