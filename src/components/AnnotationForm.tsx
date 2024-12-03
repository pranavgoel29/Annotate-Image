import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { BoundingBox } from "@/types/annotation";

export const AnnotationForm = ({
  boxes,
  onSubmit,
}: {
  boxes: BoundingBox[];
  onSubmit: (labels: BoundingBox[]) => void;
}) => {
  const [labels, setLabels] = useState<BoundingBox[]>(boxes);

  useEffect(() => {
    setLabels(boxes);
  }, [boxes]);

  const handleValueChange = (
    index: number,
    key: "color" | "shape",
    value: string
  ) => {
    const updatedLabels = [...labels];
    updatedLabels[index] = { ...updatedLabels[index], [key]: value };
    setLabels(updatedLabels);
  };

  const handleSubmit = () => {
    const invalidLabels = labels.filter(
      (label) => !label.color || !label.shape
    );
    if (invalidLabels.length > 0) {
      alert("Please assign both color and shape for all boxes.");
      return;
    }
    onSubmit(labels);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold">Assign Labels</h2>
      {labels.map((_, i) => (
        <div key={i} className="flex space-x-4">
          {/* Select for Color */}
          <Select
            onValueChange={(value) => handleValueChange(i, "color", value)}
            value={labels[i]?.color || ""}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select Color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Red">Red</SelectItem>
              <SelectItem value="Blue">Blue</SelectItem>
              <SelectItem value="Green">Green</SelectItem>
              <SelectItem value="Black">Black</SelectItem>
            </SelectContent>
          </Select>

          {/* Select for Shape */}
          <Select
            onValueChange={(value) => handleValueChange(i, "shape", value)}
            value={labels[i]?.shape || ""}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select Shape" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Square">Square</SelectItem>
              <SelectItem value="Circle">Circle</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ))}
      <Button onClick={handleSubmit}>Submit Annotations</Button>
    </div>
  );
};
