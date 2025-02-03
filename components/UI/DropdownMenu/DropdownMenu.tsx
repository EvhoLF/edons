import React, { useState, useEffect, useRef } from "react";
import "./DropdownMenu.scss";

const DropdownMenu: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef < HTMLDivElement > (null);

  // Обработчик для кликов вне меню
  const handleOutsideClick = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node)
    ) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isMenuOpen]);

  return (
    <div className="dropdown-menu-container" ref={menuRef}>
      <button
        className="menu-button"
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        Open Menu
      </button>
      {isMenuOpen && (
        <div className="menu">
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
