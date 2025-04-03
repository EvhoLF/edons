"use client";

import { useState } from "react";
import { Box, Menu, MenuItem, MenuList, Paper, Popper, TextField } from "@mui/material";
import InputText from "./InputText";

const items = [
  "Apple",
  "Banana",
  "Cherry",
  "Date",
  "Elderberry",
  "Fig",
  "Grape",
  "Honeydew",
];

export default function DropdownSearchMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [search, setSearch] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSearch("");
    setFilteredItems(items);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    setFilteredItems(items.filter((item) => item.toLowerCase().includes(value.toLowerCase())));
  };

  return (
    <div>
      <button onClick={handleOpen}>Open Menu</button>
      <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="bottom-start">
        <Paper elevation={3} sx={{ width: 200, maxHeight: 300, overflowY: "auto" }}>
          <InputText
            size="small"
            placeholder="Search..."
            fullWidth
            value={search}
            onChange={handleSearchChange}
            sx={{ position: "sticky", top: 0, zIndex: 2, padding: 2 }}
          />
        </Paper>
        <Box>
          <MenuList>
            {filteredItems.map((item, index) => (
              <MenuItem key={index} onClick={handleClose}>
                {item}
              </MenuItem>
            ))}
          </MenuList>
        </Box>
        {/* <Paper elevation={3} sx={{ width: 200, maxHeight: 300, overflowY: "auto" }}>

        </Paper> */}
      </Popper>
    </div>
  );
}
