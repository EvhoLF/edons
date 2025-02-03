const MenuListItem = ({ onClick, closeMenu, className, children }) => {
  const handleListItemClick = () => { onClick && onClick(); closeMenu(); };
  return (
    <li className={className} onClick={handleListItemClick}>
      {children}
    </li>
  );
};
MenuListItem.displayName = "MenuListItem";

export default MenuListItem;
