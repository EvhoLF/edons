"use client"
import React from 'react';
import styles from './InputColor.module.scss'
import { usePickColor } from '@/hooks/usePickColor';

const InputColor = ({color, onChange, absolute=false}) => {

  const onChangeHandler = usePickColor(onChange);

  return (
    <div className={`${styles.InputColor} ${!absolute && styles.relative}`}>
      <input className={styles.InputColor_input} type="color" value={color} onChange={onChangeHandler} />
      <span className={styles.InputColor_color} style={{ backgroundColor: color }}></span>
    </div>
  );
};

export default InputColor;
