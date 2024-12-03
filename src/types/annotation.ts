export interface BoundingBox {
  x_min: number;
  y_min: number;
  x_max: number;
  y_max: number;
  color: string;
  shape: string;
}

export interface Annotation {
  image_id: string;
  bboxes: BoundingBox[];
}
