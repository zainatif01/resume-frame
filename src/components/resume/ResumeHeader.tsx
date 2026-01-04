import { ResumeContact } from "@/types/resume";
import { Mail, Phone, MapPin } from "lucide-react";

interface ResumeHeaderProps {
  name: string;
  contact: ResumeContact;
}

export const ResumeHeader = ({ name, contact }: ResumeHeaderProps) => {
  return (
    <header className="text-center pb-4 border-b border-resume-border mb-6">
      <h1 className="text-3xl md:text-4xl font-serif font-bold text-resume-text tracking-wide mb-3">
        {name}
      </h1>
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-sm text-resume-text-secondary">
        {contact.email && (
          <a 
            href={`mailto:${contact.email}`}
            className="flex items-center gap-1.5 hover:text-primary transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{contact.email}</span>
          </a>
        )}
        {contact.phone && (
          <span className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5" />
            <span>{contact.phone}</span>
          </span>
        )}
        {contact.location && (
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>{contact.location}</span>
          </span>
        )}
      </div>
    </header>
  );
};
