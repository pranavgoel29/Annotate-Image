import React, { useEffect, useState } from "react";
import { Stage, Layer, Rect, Image as KonvaImage } from "react-konva";

export interface Box {
  x_min: number;
  y_min: number;
  x_max: number;
  y_max: number;
  color: string;
  shape: string;
}

export const AnnotationCanvas = ({
  imageUrl,
  boxes,
  setBoxes,
}: {
  imageUrl: string;
  boxes: Box[];
  setBoxes: React.Dispatch<React.SetStateAction<Box[]>>;
}) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [newBox, setNewBox] = useState<Box | null>(null);

  // Load image without `use-image`
  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => setImage(img);
  }, [imageUrl]);

  const handleMouseDown = (e: any) => {
    const { x, y } = e.target.getStage().getPointerPosition();
    setNewBox({ x_max: x, y_max: y, x_min: 0, y_min: 0, color: "", shape: "" });
  };

  const handleMouseMove = (e: any) => {
    if (!newBox) return;
    const { x, y } = e.target.getStage().getPointerPosition();
    setNewBox({
      ...newBox,
      x_min: x - newBox.x_max,
      y_min: y - newBox.y_max,
    });
  };

  const handleMouseUp = () => {
    if (newBox) setBoxes([...boxes, newBox]);
    setNewBox(null);
  };

  return (
    <Stage
      width={800}
      height={600}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Layer>
        {/* Render the loaded image */}
        {image && <KonvaImage width={600} height={600} image={image} />}
        {/* Render existing boxes */}
        {boxes.map((box, i) => (
          <Rect key={i} {...box} stroke="blue" strokeWidth={2} draggable />
        ))}
        {/* Render the new box being drawn */}
        {newBox && <Rect {...newBox} stroke="red" strokeWidth={2} />}
      </Layer>
    </Stage>
  );
};
