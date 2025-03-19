import React from 'react'
import Frame from '../../UI/Frame/Frame'
import { IconButton, Typography } from '@mui/material'
import { Icon } from '../../UI/Icon/Icon'
import clsx from 'clsx'
import styles from "./CardMap.module.scss";

const CardMap = ({ label = '', isFavourite = false, isPublicAccess = false }) => {
  return (
    <Frame className={styles.cardMap}>
      <div className={styles.cardMap_content}>
        <Typography variant='body1' overflow='hidden' textOverflow='ellipsis'>{label}</Typography>
      </div>
      <div className={styles.options}>
        <div className={clsx(styles.options_item, isFavourite && styles.active)}>
          <IconButton size='small' aria-label="delete" sx={{ color: isFavourite ? '#ffee00' : 'ui.dark' }}>
            <Icon fontSize='small' icon='stars' />
          </IconButton>
        </div>
        <div className={clsx(styles.options_item, isPublicAccess && styles.active)}>
          <IconButton size='small' aria-label="delete" sx={{ color: isPublicAccess ? '#00eeff' : 'ui.dark' }}>
            <Icon fontSize='small' icon='link' />
          </IconButton>
        </div>
        <div className={clsx(styles.options_item)}>
          <IconButton size='small' aria-label="delete" >
            <Icon fontSize='small' icon='option' />
          </IconButton>
        </div>
      </div>
    </Frame>
  )
}

export default CardMap