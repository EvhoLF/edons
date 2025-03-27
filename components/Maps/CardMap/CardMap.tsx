import React from 'react'
import Frame from '../../UI/Frame/Frame'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import { Icon } from '../../UI/Icon/Icon'
import clsx from 'clsx'
import styles from "./CardMap.module.scss";
import { IMap } from '@/DB/models/Map'
import InputText from '@/components/UI/MUI/InputText'
import InputLink from '@/components/UI/MUI/InputLink'

interface ICardMap extends Partial<IMap> {
  updateMapProperty: (id: string, updateData: Partial<IMap>) => void;
  showModalFormMapOptions: (id: string) => void;
}

const CardMap: React.FC<ICardMap> = ({ id, label = '', image = null, isFavourite = false, isPublicAccess = false, updateMapProperty, showModalFormMapOptions }) => {
  return (
    <Frame
      sx={{ backgroundImage: image ? `url(${image})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}
      className={styles.cardMap}>
      <Box className={clsx(styles.isPublicAccess, isPublicAccess && styles.active)} >
        {isPublicAccess && <InputText value={`http://localhost:3000/maps/${id}`} label='Ссылка на карту' size='small' endAdornment={<IconButton><Icon icon='copy' /></IconButton>} />}
      </Box>
      <div className={styles.cardMap_content}>
        <InputLink href={`/maps/${id}`} sx={{ zIndex: '999' }} color='ui'><Typography variant='body1' overflow='hidden' textOverflow='ellipsis'>{label}</Typography></InputLink>
      </div>
      <div className={styles.options}>
        <div className={clsx(styles.options_item, isFavourite && styles.active)}>
          <Tooltip title={isPublicAccess ? "Избранная карта" : "Не избранная карта"}>
            <IconButton onClick={() => updateMapProperty(id as string, { isFavourite: !isFavourite })} size='small' aria-label="stars" sx={{ color: isFavourite ? '#ffee00' : 'ui.dark' }}>
              <Icon fontSize='small' icon='stars' />
            </IconButton>
          </Tooltip>
        </div>
        <div className={clsx(styles.options_item, isPublicAccess && styles.active)}>
          <Tooltip title={isPublicAccess ? "Доступно по ссылке" : "Не доступно по ссылке"}>
            <IconButton onClick={() => updateMapProperty(id as string, { isPublicAccess: !isPublicAccess })} size='small' aria-label="link" sx={{ color: isPublicAccess ? '#00eeff' : 'ui.dark' }}>
              <Icon fontSize='small' icon='link' />
            </IconButton>
          </Tooltip>
        </div>
        <div className={clsx(styles.options_item)}>
          <Tooltip title='Настройки карты'>
            <IconButton size='small' aria-label="option" onClick={() => showModalFormMapOptions(id as string)}>
              <Icon fontSize='small' icon='option' />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </Frame >
  )
}

export default CardMap