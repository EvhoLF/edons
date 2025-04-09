import React, { useState } from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  SvgIcon,
  InputAdornment,
} from "@mui/material";
import { Icon } from "../Icon/Icon"; // Твой кастомный компонент
import InputText from "./InputText";
import InputButton from "./InputButton";

export default function DropdownSearchMenu({
  isInputText = false,
  value,
  onChange,
  data = [],
  getLabel = (item) => item.name || item.id,
  getIcon = (item) => item.icon,
  getColor = (item) => "#eef",
  children,
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => { setAnchorEl(event.currentTarget); setMenuOpen(true); };
  const handleClose = () => { setMenuOpen(false); setAnchorEl(null); };
  const handleSelect = (id: string) => () => { onChange(id); handleClose(); };
  const filteredItems = data.filter((item) => getLabel(item).toLowerCase().includes(searchQuery.toLowerCase()));
  const currentItem = data.find((item) => item.id === value);

  return (
    <>
      {
        isInputText
          ? (
            <InputText
              value={value}
              onClick={handleOpen}
              startIcon='code'
              endAdornment={<Icon icon='arrow_down_alt' sx={{ translate: '.2s', rotate: menuOpen ? '180deg' : '' }} />}
              sx={{ caretColor: 'transparent', maxHeight: '40px', '&.MuiInputBase-inputSizeSmall.MuiInputBase-input': { padding: '2.5px 8px 2.5px 4px !important' } }}
              size='small'
            />
          )
          : (
            <IconButton
              onClick={handleOpen}
              color="primary"
              sx={{ background: menuOpen ? "#de216320" : "" }}
            >
              {
                children
                  ? children
                  : currentItem && (<Icon icon={getIcon(currentItem)} color='ui' />)
              }
            </IconButton>
          )
      }

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{ sx: { mt: 1, maxHeight: 300, maxWidth: '250px' }, }}
      >
        <Box sx={{ p: 2 }}>
          <TextField
            label="Поиск"
            variant="outlined"
            size="small"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Box>

        {filteredItems.length === 0 && (
          <MenuItem disabled>Ничего не найдено</MenuItem>
        )}

        <Box sx={{ overflowY: 'auto' }} maxHeight='200px'>
          {filteredItems.map((item) => (
            <MenuItem key={item.id} onClick={handleSelect(item.id)}>
              <SvgIcon sx={{ mr: 1, color: getColor(item) }}>
                <Icon icon={getIcon(item)} />
              </SvgIcon>
              {getLabel(item)}
            </MenuItem>
          ))}
        </Box>
      </Menu>
    </>
  );
}
