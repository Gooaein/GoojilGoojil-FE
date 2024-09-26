export const createCompositeImage = async (character) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.crossOrigin = "Anonymous"; // CORS 이슈 방지
      img.src = src;
    });
  };

  try {
    // 바디 이미지 로드
    const bodyImg = await loadImage(character.body);

    // 캔버스 크기를 바디 이미지 크기에 맞춤
    canvas.width = bodyImg.width;
    canvas.height = bodyImg.height;

    // 바디 이미지 그리기
    ctx.drawImage(bodyImg, 0, 0);

    // 눈 그리기
    if (character.eyes) {
      const eyesImg = await loadImage(character.eyes);
      const eyesWidth = bodyImg.width * 0.7; // 바디 너비의 50%
      const eyesHeight = eyesWidth * (eyesImg.height / eyesImg.width); // 비율 유지
      const eyesX = (bodyImg.width - eyesWidth) / 2; // 중앙 정렬
      const eyesY = bodyImg.height * 0.3; // 상단에서 30% 위치
      ctx.drawImage(eyesImg, eyesX, eyesY, eyesWidth, eyesHeight);
    }

    // 입 그리기
    if (character.mouth) {
      const mouthImg = await loadImage(character.mouth);
      const mouthWidth = bodyImg.width * 0.3; // 바디 너비의 30%
      const mouthHeight = mouthWidth * (mouthImg.height / mouthImg.width); // 비율 유지
      const mouthX = (bodyImg.width - mouthWidth) / 2; // 중앙 정렬
      const mouthY = bodyImg.height * 0.6; // 상단에서 60% 위치
      ctx.drawImage(mouthImg, mouthX, mouthY, mouthWidth, mouthHeight);
    }

    return canvas.toDataURL("image/png");
  } catch (error) {
    console.error("이미지 합성 중 오류 발생:", error);
    throw error;
  }
};
