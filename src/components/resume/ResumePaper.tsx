import { forwardRef } from "react";
import { ResumeData } from "@/types/resume";
import { ResumeHeader } from "./ResumeHeader";
import { ResumeSection } from "./ResumeSection";

interface ResumePaperProps {
  data: ResumeData;
}

export const ResumePaper = forwardRef<HTMLDivElement, ResumePaperProps>(
  ({ data }, ref) => {
    return (
      <div
        ref={ref}
        className="resume-paper w-full max-w-[210mm] mx-auto aspect-[1/1.414] p-8 sm:p-10 md:p-12 rounded-sm overflow-auto font-serif"
        style={{
          minHeight: "auto",
        }}
      >
        <ResumeHeader name={data.name} contact={data.contact} />
        
        {data.sections.map((section) => (
          <ResumeSection
            key={section.id}
            section={section}
          />
        ))}
      </div>
    );
  }
);

ResumePaper.displayName = "ResumePaper";
