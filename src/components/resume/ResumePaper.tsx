import { forwardRef } from "react";
import { ResumeData } from "@/types/resume";
import { ResumeHeader } from "./ResumeHeader";
import { ResumeSection } from "./ResumeSection";

interface ResumePaperProps {
  data: ResumeData;
  onAddItem?: (sectionId: string) => void;
}

export const ResumePaper = forwardRef<HTMLDivElement, ResumePaperProps>(
  ({ data, onAddItem }, ref) => {
    return (
      <div
        ref={ref}
        className="resume-paper w-full max-w-[210mm] mx-auto aspect-[1/1.414] p-6 sm:p-8 md:p-12 rounded-sm overflow-auto"
        style={{
          minHeight: "auto",
        }}
      >
        <ResumeHeader name={data.name} contact={data.contact} />
        
        {data.sections.map((section) => (
          <ResumeSection
            key={section.id}
            section={section}
            onAddItem={onAddItem}
          />
        ))}
      </div>
    );
  }
);

ResumePaper.displayName = "ResumePaper";
