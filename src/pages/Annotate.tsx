import { useState } from "react";
import {
  AnnotoriousImageAnnotator,
  ImageAnnotationPopup,
  ImageAnnotator,
  useAnnotator,
} from "@annotorious/react";
import "@annotorious/react/annotorious-react.css";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import { BoundingBox, Annotation } from "@/types/annotation";
import { ColorShapeForm } from "@/components/ColorShapeForm";
import { getMockImage, submitBoundingBoxes } from "@/services/api";

function App() {
  const anno = useAnnotator<AnnotoriousImageAnnotator>();
  const [image, setImage] = useState<string | null>(null);
  const [imageId, setImageId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [annotations, setAnnotations] = useState<BoundingBox[]>([]);

  const fetchImage = async () => {
    try {
      setIsLoading(true);

      const { imageUrl, imageId } = await getMockImage();
      setImageId(imageId);
      setImage(imageUrl);
      setAnnotations([]);
    } catch (error) {
      console.error("Failed to fetch image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnnotationSubmit = (data: BoundingBox) => {
    setAnnotations((prev) => [...prev, data]);
    if (anno) {
      anno.clearAnnotations();
    }
  };

  const handleFinalSubmit = async () => {
    if (!imageId || annotations.length === 0) return;

    const submission: Annotation = {
      image_id: imageId,
      bboxes: annotations,
    };

    try {
      // Replace with your actual API call
      console.log("Submitting annotations:", submission);
      await submitBoundingBoxes(submission);
      await fetchImage(); // Fetch new image after successful submission
    } catch (error) {
      console.error("Failed to submit annotations:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Image Annotation Tool
        </h1>

        <div className="flex justify-center gap-4 mb-6">
          <Button onClick={fetchImage} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              "Fetch New Image"
            )}
          </Button>
          <Button
            onClick={handleFinalSubmit}
            disabled={!annotations.length}
            variant="outline"
          >
            Submit All Annotations
          </Button>
        </div>

        {image && (
          <div className="border rounded-lg overflow-hidden">
            <ImageAnnotator tool="rectangle">
              <img
                src={image}
                alt="Annotate this"
                className="max-w-full h-auto"
              />
            </ImageAnnotator>

            <ImageAnnotationPopup
              popup={(props) => (
                <ColorShapeForm {...props} onSubmit={handleAnnotationSubmit} />
              )}
            />
          </div>
        )}

        {annotations.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3">Current Annotations</h2>
            <div className="space-y-2">
              {annotations.map((ann, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded">
                  <p>
                    Color: <span className="font-medium">{ann.color}</span> |
                    Shape: <span className="font-medium">{ann.shape}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Coordinates: ({ann.x_min.toFixed(2)}, {ann.y_min.toFixed(2)}
                    ) to ({ann.x_max.toFixed(2)}, {ann.y_max.toFixed(2)})
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
