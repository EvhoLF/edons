import React from 'react';
import styles from './Icon.module.scss';

const IconGradient = () => {
  return (
    <svg className={styles.IconGradient} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" >
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate(45)">
          <stop offset="0%" />
          <stop offset="100%" />
        </linearGradient>
      </defs>
    </svg >
  )
}

export default IconGradient