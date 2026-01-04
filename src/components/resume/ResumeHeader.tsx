import { ResumeContact } from "@/types/resume";

interface ResumeHeaderProps {
  name: string;
  contact: ResumeContact;
}

export const ResumeHeader = ({ name, contact }: ResumeHeaderProps) => {
  const contactParts = [
    contact.email,
    contact.phone,
    contact.location,
  ].filter(Boolean);

  return (
    <header className="pb-4 mb-6">
      <h1 className="text-2xl md:text-3xl font-serif font-bold text-resume-text mb-2">
        {name}
      </h1>
      <p className="text-sm text-resume-text">
        {contactParts.join(" | ")}
      </p>
    </header>
  );
};
