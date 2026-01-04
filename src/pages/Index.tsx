import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import { ResumePaper } from "@/components/resume/ResumePaper";
import { AddSectionForm } from "@/components/resume/AddSectionForm";
import { AddItemForm } from "@/components/resume/AddItemForm";
import { ExportModal } from "@/components/resume/ExportModal";
import { ResumeData, ResumeSection, ResumeItem } from "@/types/resume";
import initialResumeData from "@/data/resumeData";
import { toast } from "sonner";

const Index = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [showAddSection, setShowAddSection] = useState(false);
  const [addingItemToSection, setAddingItemToSection] = useState<string | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  const handleAddSection = (section: ResumeSection) => {
    setResumeData((prev) => ({
      ...prev,
      sections: [...prev.sections, section],
    }));
    setShowAddSection(false);
    toast.success(`Section "${section.title}" added!`);
  };

  const handleAddItem = (sectionId: string) => {
    setAddingItemToSection(sectionId);
  };

  const handleSaveItem = (sectionId: string, item: ResumeItem) => {
    setResumeData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? { ...section, items: [...section.items, item] }
          : section
      ),
    }));
    setAddingItemToSection(null);
    toast.success("Item added!");
  };

  const getCurrentSection = (sectionId: string) => {
    return resumeData.sections.find((s) => s.id === sectionId);
  };

  return (
    <main className="min-h-screen bg-background py-6 px-4 sm:px-6 lg:px-8">
      {/* Header Actions */}
      <nav className="no-print max-w-[210mm] mx-auto mb-6 flex justify-end gap-3" aria-label="Resume actions">
        <Button
          variant="outline"
          onClick={() => setShowAddSection(true)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Add Section
        </Button>
        <Button onClick={() => setExportModalOpen(true)} className="gap-2">
          <Download className="w-4 h-4" aria-hidden="true" />
          Export
        </Button>
      </nav>

      {/* Resume Paper */}
      <article>
        <ResumePaper
          ref={resumeRef}
          data={resumeData}
          onAddItem={handleAddItem}
        />
      </article>

      {/* Add Section Form */}
      {showAddSection && (
        <aside className="max-w-[210mm] mx-auto mt-6">
          <AddSectionForm
            onSave={handleAddSection}
            onCancel={() => setShowAddSection(false)}
          />
        </aside>
      )}

      {/* Add Item Form (appears under the section) */}
      {addingItemToSection && (
        <aside className="max-w-[210mm] mx-auto mt-4">
          <AddItemForm
            sectionTitle={getCurrentSection(addingItemToSection)?.title || ""}
            existingItemType={
              getCurrentSection(addingItemToSection)?.items[0]?.type || "entry"
            }
            onSave={(item) => handleSaveItem(addingItemToSection, item)}
            onCancel={() => setAddingItemToSection(null)}
          />
        </aside>
      )}

      {/* Export Modal */}
      <ExportModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        resumeData={resumeData}
        resumeRef={resumeRef}
      />
    </main>
  );
};

export default Index;
