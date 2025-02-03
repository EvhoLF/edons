"use client"
import React, { useState } from 'react';
import style from './InputDrop.module.scss';
import Input from '../Input/Input';
import { Icon } from '../Icon/Icon';
import Tooltip from '../Tooltip/Tooltip';


const props = {
  listData: [],
  listDisplay: (e) => (<div>{e}</div>),
  sort: (e) => e,
  clickItem: () => { }
}

const InputDrop = ({ className, children, id = "",
  listData = props.listData, clickItem = props.clickItem, listDisplay = props.listDisplay,
  sort = props.sort, cols = 2, tooltip = '', relative = false
}) => {
  const [search, setSearch] = useState("");

  const filteredList = listData.filter((e) => sort(e).toLowerCase().includes(search.toLowerCase()));

  const handleFocus = (e) => { if (!e.currentTarget.contains(e.relatedTarget)) { setSearch(""); } };

  return (
    <div className={`${style.InputDrop} ${relative ? style.relative : ''} ${className}`} onFocus={handleFocus} tabIndex={-1}>
      <div className={style.InputDrop_head}>
        <Tooltip text={tooltip} />
        {children}
      </div>
      <div className={style.InputDrop_menu}>
        <Input value={search} onChange={(e) => { setSearch(e.target.value) }} placeholder='Search' Icon={<Icon icon='search' />} />
        <div className={style.InputDrop_content} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {filteredList.map((el, i) => (
            <button key={`${id}_${i}`} className={style.InputDrop_item} onClick={() => clickItem(el)}>
              {listDisplay(el)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InputDrop;