const API_BASE_URL = import.meta.env.VITE_API_URL;

import { Annotation } from "@/types/annotation";
import axios from "axios";

export const getMockImage = async () => {
  const response = await axios.get(`${API_BASE_URL}/get-mock-image`, {
    responseType: "blob",
  });
  // Get the image ID from the response headers, check for both upper and lower case
  const imageId = response.headers["Image-Id"] ?? response.headers["image-id"];
  console.log("headers", response);
  console.log("Image ID:", imageId);
  const imageUrl = URL.createObjectURL(response.data);
  return { imageId, imageUrl };
};

export const submitBoundingBoxes = async (data: Annotation) => {
  return axios.post(`${API_BASE_URL}/submit-bbox`, data);
};
