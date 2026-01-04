export interface ResumeContact {
  email: string;
  phone: string;
  location: string;
}

export interface ResumeItem {
  type: 'entry' | 'paragraph';
  content?: string;
  boldTitle?: string;
  boldDate?: string;
  secondaryTitle?: string;
  secondaryText?: string;
  bullets?: string[];
}

export interface ResumeSection {
  id: string;
  title: string;
  items: ResumeItem[];
}

export interface ResumeData {
  name: string;
  contact: ResumeContact;
  sections: ResumeSection[];
}
