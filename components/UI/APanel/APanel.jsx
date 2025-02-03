import React from 'react';
import clsx from 'clsx';
import styles from './APanel.module.scss';

const APanel = ({ children, className }) => {
  return (
    <div className={clsx([styles.APanel, className])}> {children}</ div>
  )
}

export default APanel