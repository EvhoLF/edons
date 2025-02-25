import React, { FC, HTMLAttributes, ReactNode } from 'react'
import styles from './Container.module.scss'
import clsx from 'clsx'

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: ReactNode
}

const Container: FC<ContainerProps> = ({ className, children, ...props }) => {
  return (
    <div className={clsx(styles.Container, className)} {...props}>
      {children}
    </div>
  )
}

export default Container
