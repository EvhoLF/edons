import { cloneElement, forwardRef, useRef, useEffect } from "react";
import styles from "./Menu.module.scss";

const MenuDropList = forwardRef(({ className, children, menuState, closeMenu, popperStyles, popperAttributes }, ref) => {
  const setMenuListElement = ref;
  const menuListRef = useRef();

  useEffect(() => {
    setMenuListElement(menuListRef.current);
  }, [menuListRef.current, setMenuListElement]);

  const classNames = `${className} ${styles.container} ${menuState ? [styles.open] : ''}`;

  return (
    <div ref={menuListRef} className={classNames} style={popperStyles} {...popperAttributes}>
      <ul>
        {children.map((child, i) => {
          if (child.type.displayName === "MenuListItem")
            return cloneElement(child, { closeMenu, key: i });
        })}
      </ul>
    </div>
  );
}
);

MenuDropList.displayName = "MenuDropList";

export default MenuDropList;
