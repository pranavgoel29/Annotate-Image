import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { AnnotatorState } from "@/types/annotation";

type AnnotationListProps = {
  annotations: AnnotatorState[];
  onDelete: (id: string) => void;
};

const AnnotationList = ({ annotations, onDelete }: AnnotationListProps) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-3">Current Annotations</h2>
      <div className="space-y-2">
        {annotations.map((ann) => (
          <div
            key={ann.annotate_id}
            className="p-3 bg-white rounded shadow-sm flex justify-between items-start"
          >
            <div>
              <p>
                Color: <span className="font-medium">{ann.color}</span> | Shape:{" "}
                <span className="font-medium">{ann.shape}</span>
              </p>
              <p className="text-sm text-gray-600">
                Coordinates: ({ann.x_min}, {ann.y_min}) to ({ann.x_max},{" "}
                {ann.y_max})
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(ann.annotate_id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnotationList;
