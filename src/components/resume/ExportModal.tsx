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
import html2canvas from "html2canvas";
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

export const ExportModal = ({ open, onOpenChange, resumeData, resumeRef }: ExportModalProps) => {
  const [exporting, setExporting] = useState<"pdf" | "docx" | null>(null);

  const exportToPDF = async () => {
    if (!resumeRef.current) return;
    
    setExporting("pdf");
    try {
      const element = resumeRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;
      
      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);
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

      // Name
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: resumeData.name,
              bold: true,
              size: 48,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
        })
      );

      // Contact
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
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 },
        })
      );

      // Sections
      for (const section of resumeData.sections) {
        children.push(
          new Paragraph({
            text: section.title,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
          })
        );

        for (const item of section.items) {
          if (item.type === "paragraph" && item.content) {
            children.push(
              new Paragraph({
                children: [new TextRun({ text: item.content, size: 22 })],
                spacing: { after: 100 },
              })
            );
          } else {
            if (item.boldTitle || item.boldDate) {
              const titleRuns: TextRun[] = [];
              if (item.boldTitle) {
                titleRuns.push(new TextRun({ text: item.boldTitle, bold: true, size: 24 }));
              }
              if (item.boldDate) {
                if (item.boldTitle) titleRuns.push(new TextRun({ text: "\t\t\t\t" }));
                titleRuns.push(new TextRun({ text: item.boldDate, bold: true, size: 24 }));
              }
              children.push(new Paragraph({ children: titleRuns, spacing: { before: 150 } }));
            }

            if (item.secondaryTitle || item.secondaryText) {
              const secondaryRuns: TextRun[] = [];
              if (item.secondaryTitle) {
                secondaryRuns.push(new TextRun({ text: item.secondaryTitle, italics: true, size: 22 }));
              }
              if (item.secondaryText) {
                if (item.secondaryTitle) secondaryRuns.push(new TextRun({ text: "\t\t\t" }));
                secondaryRuns.push(new TextRun({ text: item.secondaryText, size: 22 }));
              }
              children.push(new Paragraph({ children: secondaryRuns }));
            }

            if (item.bullets && item.bullets.length > 0) {
              for (const bullet of item.bullets) {
                children.push(
                  new Paragraph({
                    children: [new TextRun({ text: bullet, size: 22 })],
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
