import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus } from "lucide-react";
import { ResumeItem } from "@/types/resume";

interface AddItemFormProps {
  sectionTitle: string;
  existingItemType: "entry" | "paragraph";
  onSave: (item: ResumeItem) => void;
  onCancel: () => void;
}

export const AddItemForm = ({ sectionTitle, existingItemType, onSave, onCancel }: AddItemFormProps) => {
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
    const item: ResumeItem = existingItemType === "paragraph"
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

    onSave(item);
  };

  const isParagraphType = existingItemType === "paragraph";

  return (
    <Card className="no-print border-2 border-dashed border-primary/30 bg-card/50 animate-fade-in mt-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">
            Add Item to {sectionTitle}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isParagraphType ? (
          <div>
            <Label htmlFor="paragraph" className="text-sm font-medium">
              Paragraph
            </Label>
            <Textarea
              id="paragraph"
              value={paragraph}
              onChange={(e) => setParagraph(e.target.value)}
              placeholder="Enter paragraph content..."
              className="mt-1 min-h-[80px]"
            />
          </div>
        ) : (
          <>
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
          </>
        )}

        <Button onClick={handleSave} className="w-full">
          Save Item
        </Button>
      </CardContent>
    </Card>
  );
};
