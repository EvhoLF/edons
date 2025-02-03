'use client'
import styles from './Input.module.scss'
import Tooltip from '../Tooltip/Tooltip';

const Input = ({
  type = "text",
  placeholder = "...",
  value = "",
  onClick = () => { },
  onChange = () => { },
  tooltip = "zxc",
  maxlength = "",
  Icon = '',
  ...props
}) => {

  return (
    <div className={styles.Input} onClick={onClick}>
      <span className={styles.Input_info}>
        {Icon}
        <Tooltip text={tooltip} />
      </span>
      <input
        className={`${styles.Input_input} ${styles.hide}`}
        type={type}
        placeholder={placeholder}
        value={value}
        maxLength={maxlength}
        onChange={onChange}
        {...props}
      />
    </div>
  )
}

export default Input