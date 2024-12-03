import { useEffect, useState } from "react";
import {
  AnnotoriousImageAnnotator,
  ImageAnnotationPopup,
  ImageAnnotator,
  useAnnotator,
} from "@annotorious/react";
import "@annotorious/react/annotorious-react.css";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import { Annotation, AnnotatorState } from "@/types/annotation";
import { ColorShapeForm } from "@/components/ColorShapeForm";
import { getMockImage, submitBoundingBoxes } from "@/services/api";
import { toast } from "sonner";
import AnnotationList from "@/components/AnnotationList";

function Anotate() {
  const anno = useAnnotator<AnnotoriousImageAnnotator>();
  const [image, setImage] = useState<string | null>(null);
  const [imageId, setImageId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [annotations, setAnnotations] = useState<AnnotatorState[]>([]);

  const fetchImage = async () => {
    try {
      if (anno) {
        anno.clearAnnotations();
      }
      setIsLoading(true);
      const { imageUrl, imageId } = await getMockImage();
      setImageId(imageId);
      setImage(imageUrl);
      setAnnotations([]);
    } catch (error) {
      console.error("Failed to fetch image:", error);
      toast.error("Failed to fetch a new image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnnotationSubmit = (data: AnnotatorState) => {
    // Round the coordinates to ensure they are integers
    const roundedData = {
      ...data,
      x_min: Math.round(data.x_min),
      y_min: Math.round(data.y_min),
      x_max: Math.round(data.x_max),
      y_max: Math.round(data.y_max),
    };

    // Check if the annotation already exists in the annotations state
    const existingAnnotation = annotations.find(
      (ann) => ann.annotate_id === data.annotate_id
    );

    if (existingAnnotation) {
      // If annotation exists, update it with the rounded values
      const updatedAnnotations = annotations.map((ann) =>
        ann.annotate_id === data.annotate_id ? roundedData : ann
      );
      setAnnotations(updatedAnnotations);
    } else {
      // If annotation does not exist, add the new rounded annotation to the list
      setAnnotations([...annotations, roundedData]);
    }
  };

  const handleAnnotationDelete = (id: string) => {
    if (anno) {
      anno.removeAnnotation(id);
      setAnnotations((prev) => prev.filter((ann) => ann.annotate_id !== id));
    }
  };

  const handleFinalSubmit = async () => {
    console.log("Submitting annotations:", annotations);
    console.log("Image ID:", imageId);
    if (annotations.length === 0) {
      toast.info("Please add at least one annotation");
      return;
    } else if (annotations.length > 3) {
      toast.error("Please add at most 3 annotations");
      return;
    } else if (!imageId) {
      toast.error("Failed to submit annotations: Image ID not found");
      return;
    }

    const submission: Annotation = {
      image_id: imageId,
      bboxes: annotations,
    };

    try {
      await submitBoundingBoxes(submission);
      toast.success("Submitted annotations");
      await fetchImage(); // Fetch new image after successful submission
    } catch (error) {
      console.error("Failed to submit annotations:", error);
      toast.error("Failed to submit annotations");
    }
  };

  useEffect(() => {
    if (anno) {
      // Configure annotation style
      anno.setDrawingTool("rectangle");
      anno.setStyle({
        fill: "#503f3f00",
        stroke: "#ff0000",
        strokeWidth: 2,
      });
    }
  }, [anno]);

  return (
    <div className="min-h-screen flex justify-center bg-gray-50 p-8">
      <div className="flex flex-col max-w-4xl  ">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Image Annotation Tool
        </h1>

        <div className="flex justify-center gap-4 mb-6">
          <Button onClick={fetchImage} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Fetch New Image"
            )}
          </Button>
          <Button
            onClick={handleFinalSubmit}
            disabled={!annotations.length}
            variant="outline"
          >
            Submit All Annotations ({annotations.length})
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
                <ColorShapeForm
                  {...props}
                  onSubmit={handleAnnotationSubmit}
                  onDelete={handleAnnotationDelete}
                />
              )}
            />
          </div>
        )}

        {annotations.length > 0 && (
          <AnnotationList
            annotations={annotations}
            onDelete={handleAnnotationDelete}
          />
        )}
      </div>
    </div>
  );
}

export default Anotate;
