import { ResumeData } from "@/types/resume";

const resumeData: ResumeData = {
  name: "Zain Atif",
  contact: {
    email: "zainatif15403@gmail.com",
    phone: "+92 3148501486",
    location: "Gujrat, Pakistan"
  },
  sections: [
    {
      id: "summary",
      title: "SUMMARY",
      items: [
        {
          paragraph: "I am a Front-End Developer with 2+ years of experience building clean, responsive, and user-friendly web interfaces. Specializing in TypeScript, HTML5, CSS3, and Tailwind CSS with expertise in Next.js development. I have focused on creating high-performance, accessible web applications with modern UI/UX principles."
        }
      ]
    },
    {
      id: "experience",
      title: "WORK EXPERIENCE",
      items: [
        {
          paragraph: "",
          boldLeft: "TechNova Solutions Inc.",
          boldRight: "08/2023 – 02/2024",
          italicLeft: "Front-End Developer, San Francisco, CA",
          italicRight: "",
          bullets: [
            "Developed and maintained responsive web applications using Next.js and TypeScript for US-based SaaS platform",
            "Implemented custom UI components with Tailwind CSS, improving development efficiency by 30%",
            "Implemented automated testing and CI/CD pipelines using GitHub Actions for seamless deployments"
          ]
        },
        {
          paragraph: "",
          boldLeft: "DigitalFlow Agency",
          boldRight: "01/2023 – 04/2023",
          italicLeft: "Junior Front-End Developer, New York, NY",
          italicRight: "",
          bullets: [
            "Built responsive client websites using HTML5, CSS3, and JavaScript for multiple US-based clients",
            "Implemented Tailwind CSS frameworks across 15+ client projects, ensuring consistent branding",
            "Managed version control using Git/GitHub and deployed projects to Vercel hosting platform"
          ]
        }
      ]
    },
    {
      id: "education",
      title: "EDUCATION",
      items: [
        {
          paragraph: "",
          boldLeft: "FDC Faisal, Karachi",
          boldRight: "07/2025",
          italicLeft: "HSSC (Computer Science)",
          italicRight: "",
          bullets: []
        },
        {
          paragraph: "",
          boldLeft: "University of Gujrat, Gujrat",
          boldRight: "Expected: 06/2029",
          italicLeft: "BS (Software Engineering)",
          italicRight: "",
          bullets: []
        }
      ]
    },
    {
      id: "others",
      title: "OTHERS",
      items: [
        {
          paragraph: "",
          bullets: [
            "Technical Skills: TypeScript/JavaScript, HTML5, CSS3/Tailwind CSS, Next.js, Vercel, Git & GitHub",
            "Languages: English (Fluent B2), Urdu (Native C2)"
          ]
        }
      ]
    }
  ]
};

export default resumeData;
