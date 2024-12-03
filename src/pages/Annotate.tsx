import { useEffect, useState } from "react";

import {
  AnnotoriousImageAnnotator,
  ImageAnnotationPopup,
  ImageAnnotator,
  PopupProps,
  useAnnotator,
} from "@annotorious/react";
import "@annotorious/react/annotorious-react.css";
import { getMockImage } from "@/services/api";
import { Button } from "@/components/ui/Button";
import LoadingSpinner from "@/components/icons/LoadingSpinner";

const Annotate = () => {
  const anno = useAnnotator<AnnotoriousImageAnnotator>();
  const [image, setImage] = useState<string | null>(null);
  const [image_id, setImage_id] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const fetchImage = async () => {
    try {
      setIsLoading(true);
      const { imageUrl, imageId } = await getMockImage();
      setImage_id(imageId);
      setImage(imageUrl);
    } catch (error) {
      console.error("Failed to fetch image:", error);
      alert("Failed to fetch a new image.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (anno) {
      // fetch("annotations.json")
      //   .then((response) => response.json())
      //   .then((annotations) => {
      //     anno.setAnnotations(annotations);
      //   });
    }
  }, [anno]);

  // const handleSubmit = async (labels: any[]) => {
  //   await submitBoundingBoxes({ image_id: image_id, bboxes: labels });
  //   alert("Annotations submitted!");

  //   fetchImage();
  // };

  return (
    <div className="flex flex-col items-center p-11">
      <h1 className="text-3xl font-bold mb-5">Annotate Images</h1>
      <Button onClick={fetchImage} className="mb-3">
        Fetch New Image
      </Button>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        image && (
          <>
            <ImageAnnotator tool="rectangle">
              <img
                className="border-4 border-orange-200"
                src={image}
                id={image_id}
                width={500}
                height={700}
                alt="Annotated"
              />
            </ImageAnnotator>

            <ImageAnnotationPopup
              popup={(props: PopupProps) => <div>Hello World</div>}
            />
          </>
        )
      )}
    </div>
  );
};

export default Annotate;
