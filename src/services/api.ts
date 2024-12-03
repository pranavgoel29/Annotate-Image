const API_BASE_URL = import.meta.env.VITE_API_URL;

import { Annotation } from "@/types/annotation";
import axios from "axios";

export const getMockImage = async () => {
  const response = await axios.get(`${API_BASE_URL}/get-mock-image`, {
    responseType: "blob",
  });
  const imageId = response.headers["image-id"];
  const imageUrl = URL.createObjectURL(response.data);
  return { imageId, imageUrl };
};

export const submitBoundingBoxes = async (data: Annotation) => {
  return axios.post(`${API_BASE_URL}/submit-bbox`, data);
};
