import { cloneElement, useState } from "react";
// import { usePopper } from "react-popper";

const Menu = ({
  children,
  menuPlacement = "bottom-start", // popper input for menu position
  offset = [0, 15]
}) => {
  const [menuState, setMenuState] = useState(false);
  const [menuButtonElement, setMenuButtonElement] = useState(null);
  const [menuListElement, setMenuListElement] = useState(null);
  const { styles: { popper: popperStyles }, attributes: { popper: popperAttributes }, update } = usePopper(menuButtonElement, menuListElement, {
    placement: menuPlacement,
    modifiers: [{ name: "offset", options: { offset } }]
  });

  console.log(popperStyles);
  
  return (
    <div
      tabIndex={0}
      onFocus={(e) => {
        console.log('focus');
        setMenuState(true)
      }}
      onBlur={(e) => {
        console.log('blur');
        setMenuState(false)
      }}
    >
      {children.map((child, i) => {
        const displayName = child.type.displayName;

        if (displayName === "MenuButton") {
          return cloneElement(child, {
            menuState,
            menuToggle: () => setMenuState((prev) => !prev),
            updatePopper: async () => await update(),
            ref: setMenuButtonElement,
            key: i
          });
        } else if (displayName === "MenuDropList") {
          return cloneElement(child, {
            menuState,
            closeMenu: () => setMenuState(false),
            ref: setMenuListElement,
            popperStyles,
            popperAttributes,
            key: i
          });
        } else {
          return null;
        }
      })}
    </div>
  );
};

Menu.displayName = "Menu";

export default Menu;
