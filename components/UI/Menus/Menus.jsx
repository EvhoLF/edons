import React, { useState, cloneElement, Children, forwardRef } from 'react'
import { flip, offset, useFloating } from '@floating-ui/react';


export const MenusButton = ({ children, ref },) => {
  return <div ref={ref} style={{ position: 'relative' }}>{children}</div>;
};

export const MenusMenu = ({ floatingStyles, children, isOpen, ref }) => {
  return isOpen ? <div ref={ref} style={floatingStyles}>{children}</div> : '';
};

const Menus = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles } = useFloating({
    placement: 'right-start',
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [flip(), offset(10)]
  });

  return (
    <div
      style={{ position: 'relative' }}
      tabIndex={0}
      onFocus={() => { setIsOpen(true) }}
      onBlur={() => { setIsOpen(false) }}
    >
      {
        Children.map(children, child => {
          if (child?.type === MenusButton) return cloneElement(child, { ref: refs.setReference });
          if (child?.type === MenusMenu) return cloneElement(child, { ref: refs.setFloating, floatingStyles, isOpen })
          else return ''
        })
      }
    </div>
  )
}

export default Menus


