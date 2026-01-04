import { ResumeSection as ResumeSectionType, ResumeItem } from "@/types/resume";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResumeSectionProps {
  section: ResumeSectionType;
  onAddItem?: (sectionId: string) => void;
}

const ResumeItemEntry = ({ item }: { item: ResumeItem }) => {
  if (item.type === "paragraph") {
    return (
      <p className="text-sm leading-relaxed text-resume-text">
        {item.content}
      </p>
    );
  }

  const hasBoldLine = item.boldTitle || item.boldDate;
  const hasSecondaryLine = item.secondaryTitle || item.secondaryText;
  const hasBullets = item.bullets && item.bullets.length > 0;

  return (
    <div className="space-y-1">
      {hasBoldLine && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-0.5">
          {item.boldTitle && (
            <h4 className="font-semibold text-resume-text">{item.boldTitle}</h4>
          )}
          {item.boldDate && (
            <span className="font-semibold text-sm text-resume-text whitespace-nowrap">
              {item.boldDate}
            </span>
          )}
        </div>
      )}
      {hasSecondaryLine && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-0.5">
          {item.secondaryTitle && (
            <span className="text-sm text-resume-text-secondary italic">
              {item.secondaryTitle}
            </span>
          )}
          {item.secondaryText && (
            <span className="text-sm text-resume-text-secondary">
              {item.secondaryText}
            </span>
          )}
        </div>
      )}
      {hasBullets && (
        <ul className="list-disc list-outside ml-5 mt-2 space-y-1">
          {item.bullets?.map((bullet, idx) => (
            <li key={idx} className="text-sm text-resume-text leading-relaxed">
              {bullet}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const ResumeSection = ({ section, onAddItem }: ResumeSectionProps) => {
  return (
    <section className="mb-5 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="resume-section-title text-sm font-bold border-b-2 border-resume-section-title pb-1">
          {section.title}
        </h3>
        {onAddItem && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddItem(section.id)}
            className="no-print h-7 px-2 text-muted-foreground hover:text-primary"
          >
            <Plus className="w-4 h-4" />
          </Button>
        )}
      </div>
      <div className="space-y-4">
        {section.items.map((item, index) => (
          <ResumeItemEntry key={index} item={item} />
        ))}
      </div>
    </section>
  );
};
