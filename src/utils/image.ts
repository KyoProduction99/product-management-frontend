export const getImageUrl = (imageUrl?: string): string => {
  if (!imageUrl) return "/placeholder.jpg";

  if (imageUrl.startsWith("http") || imageUrl.startsWith("data:image/")) {
    return imageUrl;
  }

  const baseUrl = import.meta.env.REACT_APP_BASE_URL || "http://localhost:3001";
  return `${baseUrl}${imageUrl}`;
};
