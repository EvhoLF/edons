import React from 'react';
import Button from '../Button/Button';
// import styles from './ButtonSwitch.module.scss'

const ButtonSwitch = ({ ItemOn = 'On', ItemOFF = 'Off', value = false, onClick = () => { }, className }) => {

  const handleSwitch = () => {
    onClick(value)
  }

  return (
    <Button className={className} onClick={handleSwitch}>
      {value ? ItemOn : ItemOFF}
    </Button>
  )
}

export default ButtonSwitch