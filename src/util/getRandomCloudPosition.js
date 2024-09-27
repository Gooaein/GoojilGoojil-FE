const CLOUD_WIDTH = 200; // Adjust based on your QuestionCloud's width
const CLOUD_HEIGHT = 100; // Adjust based on your QuestionCloud's height
const PADDING = 20; // Padding between clouds

export const getRandomCloudPosition = (
  containerWidth,
  containerHeight,
  existingPositions
) => {
  let attempts = 0;
  while (attempts < 100) {
    const x =
      Math.random() * (containerWidth - CLOUD_WIDTH - PADDING * 2) + PADDING;
    const y =
      Math.random() * (containerHeight - CLOUD_HEIGHT - PADDING * 2) + PADDING;

    if (isPositionValid(x, y, existingPositions)) {
      return { x, y };
    }
    attempts++;
  }
  return null; // If we can't find a valid position after 100 attempts
};

export const isPositionValid = (x, y, existingPositions) => {
  for (let pos of existingPositions) {
    if (
      x < pos.x + CLOUD_WIDTH + PADDING &&
      x + CLOUD_WIDTH + PADDING > pos.x &&
      y < pos.y + CLOUD_HEIGHT + PADDING &&
      y + CLOUD_HEIGHT + PADDING > pos.y
    ) {
      return false;
    }
  }
  return true;
};
