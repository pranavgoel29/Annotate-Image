export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  shape?: string;
}

export interface Annotation {
  imageId: string;
  boxes: BoundingBox[];
}