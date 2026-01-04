import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus } from "lucide-react";
import { ResumeSection, ResumeItem } from "@/types/resume";

interface AddSectionFormProps {
  onSave: (section: ResumeSection) => void;
  onCancel: () => void;
}

export const AddSectionForm = ({ onSave, onCancel }: AddSectionFormProps) => {
  const [sectionTitle, setSectionTitle] = useState("");
  const [boldTitle, setBoldTitle] = useState("");
  const [boldDate, setBoldDate] = useState("");
  const [secondaryTitle, setSecondaryTitle] = useState("");
  const [secondaryText, setSecondaryText] = useState("");
  const [bullets, setBullets] = useState<string[]>([""]);
  const [paragraph, setParagraph] = useState("");

  const handleAddBullet = () => {
    setBullets([...bullets, ""]);
  };

  const handleBulletChange = (index: number, value: string) => {
    const newBullets = [...bullets];
    newBullets[index] = value;
    setBullets(newBullets);
  };

  const handleRemoveBullet = (index: number) => {
    setBullets(bullets.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!sectionTitle.trim()) return;

    const item: ResumeItem = paragraph.trim()
      ? { type: "paragraph", content: paragraph }
      : {
          type: "entry",
          boldTitle: boldTitle.trim() || undefined,
          boldDate: boldDate.trim() || undefined,
          secondaryTitle: secondaryTitle.trim() || undefined,
          secondaryText: secondaryText.trim() || undefined,
          bullets: bullets.filter((b) => b.trim()).length > 0
            ? bullets.filter((b) => b.trim())
            : undefined,
        };

    const section: ResumeSection = {
      id: sectionTitle.toLowerCase().replace(/\s+/g, "-"),
      title: sectionTitle.toUpperCase(),
      items: [item],
    };

    onSave(section);
  };

  return (
    <Card className="no-print border-2 border-dashed border-primary/30 bg-card/50 animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Add New Section</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="sectionTitle" className="text-sm font-medium">
            Section Title *
          </Label>
          <Input
            id="sectionTitle"
            value={sectionTitle}
            onChange={(e) => setSectionTitle(e.target.value)}
            placeholder="e.g., CERTIFICATIONS"
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="boldTitle" className="text-sm font-medium">
              Bold Title (Left)
            </Label>
            <Input
              id="boldTitle"
              value={boldTitle}
              onChange={(e) => setBoldTitle(e.target.value)}
              placeholder="e.g., Company Name"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="boldDate" className="text-sm font-medium">
              Bold Date (Right)
            </Label>
            <Input
              id="boldDate"
              value={boldDate}
              onChange={(e) => setBoldDate(e.target.value)}
              placeholder="e.g., 01/2024 – Present"
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="secondaryTitle" className="text-sm font-medium">
              Secondary Title (Left)
            </Label>
            <Input
              id="secondaryTitle"
              value={secondaryTitle}
              onChange={(e) => setSecondaryTitle(e.target.value)}
              placeholder="e.g., Job Title, Location"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="secondaryText" className="text-sm font-medium">
              Secondary Text (Right)
            </Label>
            <Input
              id="secondaryText"
              value={secondaryText}
              onChange={(e) => setSecondaryText(e.target.value)}
              placeholder="e.g., Remote"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Bullet Points</Label>
          <div className="space-y-2 mt-1">
            {bullets.map((bullet, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={bullet}
                  onChange={(e) => handleBulletChange(index, e.target.value)}
                  placeholder={`Bullet point ${index + 1}`}
                />
                {bullets.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveBullet(index)}
                    className="shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddBullet}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Bullet
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor="paragraph" className="text-sm font-medium">
            Or Paragraph (replaces above fields)
          </Label>
          <Textarea
            id="paragraph"
            value={paragraph}
            onChange={(e) => setParagraph(e.target.value)}
            placeholder="Enter a paragraph instead of the fields above..."
            className="mt-1 min-h-[80px]"
          />
        </div>

        <Button onClick={handleSave} className="w-full" disabled={!sectionTitle.trim()}>
          Save Section
        </Button>
      </CardContent>
    </Card>
  );
};
