'use client'

// import useWebSocket from '@/hooks/useWebSocket';
import React from 'react'
import styles from "./StatCounters.module.scss";

const StatCounters = () => {
  // const stateWS = useWebSocket();

  return (
    <div className={styles.StatCounters}>
      <div className={styles.el}>
        <div className={styles.num}>89</div>
        <div className={styles.text}>Кружек кофе</div>
      </div>
      <div className={styles.el}>
        <div className={styles.num}>235</div>
        <div className={styles.text}>Зарегистрированных пользователей</div>
      </div>
      <div className={styles.el}>
        <div className={styles.num}>101</div>
        <div className={styles.text}>Созданных схема</div>
      </div>
      <div className={styles.el}>
        <div className={styles.num}>12</div>
        <div className={styles.text}>Активных вкладок</div>
      </div>
    </div >
  )
}

export default StatCounters