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

import { Annotation, AnnotatorState } from "@/types/annotation";
import { ColorShapeForm } from "@/components/ColorShapeForm";
import { getMockImage, submitBoundingBoxes } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

function Anotate() {
  const anno = useAnnotator<AnnotoriousImageAnnotator>();
  const [image, setImage] = useState<string | null>(null);
  const [imageId, setImageId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [annotations, setAnnotations] = useState<AnnotatorState[]>([]);
  const { toast } = useToast();

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
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch a new image",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnnotationSubmit = (data: AnnotatorState) => {
    // check if annotation already exists and update it
    const existingAnnotation = annotations.find(
      (ann) => ann.annotate_id === data.annotate_id
    );

    if (existingAnnotation) {
      const updatedAnnotations = annotations.map((ann) =>
        ann.annotate_id === data.annotate_id ? data : ann
      );
      setAnnotations(updatedAnnotations);
    } else {
      setAnnotations([...annotations, data as AnnotatorState]);
    }
  };

  const handleFinalSubmit = async () => {
    if (!imageId || annotations.length === 0) {
      toast({
        variant: "destructive",
        title: "Cannot Submit",
        description: "Please add at least one annotation",
      });
      return;
    }

    const submission: Annotation = {
      image_id: imageId,
      bboxes: annotations,
    };

    try {
      // Replace with your actual API call
      console.log("Submitting annotations:", submission);
      await submitBoundingBoxes(submission);
      toast({
        title: "Success",
        description: `Submitted annotations`,
      });
      await fetchImage(); // Fetch new image after successful submission
    } catch (error) {
      console.error("Failed to submit annotations:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit annotations",
      });
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-gray-50 p-8">
      <div className="flex flex-col max-w-4xl  ">
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

export default Anotate;
