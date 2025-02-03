"use client"
import React, { useEffect } from "react";
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from "@codemirror/theme-one-dark";
// import { dispatchs_node } from "@/state/reducerNode";
import { codLangs } from "./codLangs";
import styles from './CodePad.module.scss';
import './CodePad_code.scss';

interface CodePad {
  type: string,
  value: string,
  isOpen: boolean,
  className?: string,
  onChange: () => void,
}

const CodePad = ({ type = 'text', value = '', isOpen = false, onChange }: CodePad) => {
  const extensions = type == 'text' ? [] : [codLangs(type)];

  useEffect(() => {
    console.log(type);
  }, [type])

  return (
    <div className={`${styles.CodePad} ${isOpen ? styles.open : ""} nodrag nowheel`}>
      <div className={styles.CodePad_body}>
        {/* onChange={onChange} value={codeData} */}
        <CodeMirror maxHeight="300px" className={styles.CodePad_code} value={value} onChange={onChange} theme={oneDark} extensions={[extensions]} />
        {/* <CodeMirror height="400px" className={styles.CodePad_code} onChange={onChange} value={codeData} theme={oneDark} extensions={[languageExtension]} /> */}
      </div>
    </div>
  );
};

export default CodePad;
