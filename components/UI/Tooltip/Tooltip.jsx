import React from 'react';
import styles from './Tooltip.module.scss';

const Tooltip = ({ text }) => {
  return (
    <div className={styles.Tooltip}>
      {text}
    </div>
  )
}

export default Tooltip