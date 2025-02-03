import { forwardRef } from "react";
import styles from "./Menu.module.scss";

const MenuButton = forwardRef(
  ({ children, updatePopper }, ref) => {
    const handleButtonClick = () => {
      updatePopper();
    };
    return (
      <div>
        <button className={styles.button} ref={ref} onClick={handleButtonClick}>
          {children}
        </button>
      </div>
    );
  }
);

MenuButton.displayName = "MenuButton";

export default MenuButton;
