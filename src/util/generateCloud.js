import { getRandomNumber } from './randomUtils';
import Cloud from '../components/common/CloudComponent';
import styles from '../components/intro/introComponent.module.css';
export const generateCloud = isLeft => {
  const size = getRandomNumber(10, 14); // 6rem to 10rem
  const verticalPosition = getRandomNumber(10, 40); // 10% to 40% from top
  const horizontalPosition = getRandomNumber(0, 5); // 0% to 10% from left/right edge

  const cloudStyle = {
    width: `${size}rem`,
    height: `${size}rem`,
    top: `${verticalPosition}%`,
    [isLeft ? 'left' : 'right']: `${horizontalPosition}%`,
  };

  return (
    <div
      className={styles.cloud}
      style={cloudStyle}
      data-aos={isLeft ? 'fade-right' : 'fade-left'}
      data-aos-delay="200"
    >
      <Cloud />
    </div>
  );
};
