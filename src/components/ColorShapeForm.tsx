import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PopupProps } from "@annotorious/react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ColorShapeFormProps extends PopupProps {
  onSubmit: (data: {
    annotate_id: string;
    color: string;
    shape: string;
    x_min: number;
    y_min: number;
    x_max: number;
    y_max: number;
  }) => void;
  onDelete?: (id: string) => void;
}

export function ColorShapeForm({
  annotation,
  onSubmit,
  onDelete,
}: ColorShapeFormProps) {
  const [color, setColor] = useState<string>("");
  const [shape, setShape] = useState<string>("");

  const handleSubmit = () => {
    if (!color || !shape) return;

    const geometry = annotation.target.selector.geometry;

    // Update the annotation label
    if (annotation.target.selector) {
      annotation.target.selector.label = `${color} ${shape}`;
    }

    onSubmit({
      annotate_id: annotation.id,
      color,
      shape,
      x_min: geometry.x,
      y_min: geometry.y,
      x_max: geometry.x + geometry.w,
      y_max: geometry.y + geometry.h,
    });
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(annotation.id);
      toast.success("Annotation deleted");
    }
  };

  useEffect(() => {
    // Get existing values if annotation was previously labeled
    if (annotation.target.selector?.label) {
      const [existingColor, existingShape] =
        annotation.target.selector.label.split(" ");
      setColor(existingColor);
      setShape(existingShape);
    }
  }, [annotation]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg space-y-4 min-w-[200px]">
      <Select value={color} onValueChange={setColor}>
        <SelectTrigger>
          <SelectValue placeholder="Select color" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="blue">Blue</SelectItem>
          <SelectItem value="black">Black</SelectItem>
          <SelectItem value="red">Red</SelectItem>
          <SelectItem value="green">Green</SelectItem>
        </SelectContent>
      </Select>

      <Select value={shape} onValueChange={setShape}>
        <SelectTrigger>
          <SelectValue placeholder="Select shape" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="circle">Circle</SelectItem>
          <SelectItem value="square">Square</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex justify-between items-center gap-3">
        <Button
          onClick={handleSubmit}
          disabled={!color || !shape}
          className="w-full"
        >
          Submit
        </Button>
        <Button
          onClick={handleDelete}
          className="p-4"
          variant="destructive"
          size="icon"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
