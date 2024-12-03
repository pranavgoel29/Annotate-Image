import { useState } from "react";
import { AnnotationCanvas } from "../components/AnnotationCanvas";
import { AnnotationForm } from "../components/AnnotationForm";
import { getMockImage, submitBoundingBoxes } from "../services/api";

export default function Annotate() {
  const [image, setImage] = useState<string | null>(null);
  const [boxes, setBoxes] = useState<any[]>([]);
  const [image_id, setImage_id] = useState<string | null>(null);

  const fetchImage = async () => {
    try {
      const { imageUrl, imageId } = await getMockImage();
      setImage_id(imageId);
      setImage(imageUrl);
    } catch (error) {
      console.error("Failed to fetch image:", error);
      alert("Failed to fetch a new image.");
    }
  };

  const handleSubmit = async (labels: any[]) => {
    await submitBoundingBoxes({ image_id: image_id, bboxes: labels });
    alert("Annotations submitted!");
    setBoxes([]);
    fetchImage();
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={fetchImage}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        Fetch New Image
      </button>

      {image && (
        <>
          <AnnotationCanvas
            imageUrl={image}
            boxes={boxes}
            setBoxes={setBoxes}
          />
          <AnnotationForm boxes={boxes} onSubmit={handleSubmit} />
        </>
      )}
    </div>
  );
}
