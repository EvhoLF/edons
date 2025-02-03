'use client'
import { useEffect, useState } from 'react';
import Input from '../Input/Input';

const inputMask = (pattern = 'default', options = {}) => {
  const getMax = (e) => e ? e : e == 0 ? '0' : '';
  switch (pattern) {
    case 'hexColor': return /^#([0-9A-Fa-f]{0,6})$/;
    case 'rgbColor': return /^rgb\(\d{0,3},\d{0,3},\d{0,3}\)$/;
    case 'number': return new RegExp(`^[-]?\\d{0,${getMax(options.maxDigits)}}(${getMax(options.maxDecimals) != '0' ? '\\.' : ''}\\d{0,${getMax(options.maxDecimals)}})?$`);
    default: return /.*/;
  }
};

const maskCheck = (pattern, value) => {
  value = String(value);
  switch (pattern) {
    case 'number':
      const last = value[value?.length - 1] ?? '';
      const valid = value && last != '.' && !isNaN(value) ? true : false;
      return valid;
    default: return true
  }
}

const SmartInput = ({ pattern = 'default', options, placeholder = '', value = '', onClick = () => { }, onChange = () => { }, tooltip = '', maxlength = '', Icon = '', ...props }) => {
  const [state, setState] = useState(value);

  useEffect(() => { setState(value); }, [value]);

  const onChangeHandler = (e) => {
    const newValue = e.target.value;
    const isMaskTest = inputMask(pattern, options).test(newValue);
    if (isMaskTest) setState(newValue);
    const isValidated = isMaskTest && maskCheck(pattern, newValue);
    onChange(e, newValue, isValidated);
  }

  return (
    <Input
      type={'text'}
      placeholder={placeholder}
      value={state}
      onClick={onClick}
      onChange={onChangeHandler}
      tooltip={tooltip}
      maxlength={maxlength}
      Icon={Icon}
      {...props}
    />
  )
}

export default SmartInput