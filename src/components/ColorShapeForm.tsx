import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PopupProps } from "@annotorious/react";

interface ColorShapeFormProps extends PopupProps {
  onSubmit: (data: {
    color: string;
    shape: string;
    x_min: number;
    y_min: number;
    x_max: number;
    y_max: number;
  }) => void;
}

export function ColorShapeForm({ annotation, onSubmit }: ColorShapeFormProps) {
  const [color, setColor] = useState<string>("");
  const [shape, setShape] = useState<string>("");

  const handleSubmit = () => {
    if (!color || !shape) return;

    const geometry = annotation.target.selector.geometry;

    onSubmit({
      color,
      shape,
      x_min: geometry.x,
      y_min: geometry.y,
      x_max: geometry.x + geometry.w,
      y_max: geometry.y + geometry.h,
    });
  };

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

      <Button
        onClick={handleSubmit}
        disabled={!color || !shape}
        className="w-full"
      >
        Submit
      </Button>
    </div>
  );
}
