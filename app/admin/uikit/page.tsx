import { Icon } from '@/components/UI/Icon/Icon';
import InputText from '@/components/UI/MUI/InputText';
import { IconName, icons_names } from '@/data/data_icons';
import { Button } from '@mui/material';
import { CSSProperties } from 'react';

export default function Page() {

  const stylePage: CSSProperties = {
    display: 'inline-flex',
    flexDirection: 'column',
    gap: '50px',
    margin: '25px',
  }

  const line: CSSProperties = {
    display: 'flex',
    alignItems: 'end',
    flexWrap: 'wrap',
    gap: '25px',
  }

  const gridIcons: CSSProperties = {
    display: 'flex',
    gap: '25px',
    flexWrap: 'wrap',
  }

  const iconStyle: CSSProperties = {
    height: '50px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }

  return (
    <div style={stylePage}>
      <div style={gridIcons}>
        {
          icons_names.map(e => <div key={e} style={iconStyle}><Icon icon={e as IconName} /><p>{e}</p></div>)
        }
      </div>
      <div style={line}>
        <Button variant='contained'>Filled</Button>
        <Button variant='outlined'>Outlined</Button>
        <Button variant='text'>ColorGlass</Button>

        <Button variant='contained' loading loadingPosition="end">Filled</Button>
        <Button variant='outlined' loading loadingPosition="end">Outlined</Button>
        <Button variant='text' loading loadingPosition="end">ColorGlass</Button>
      </div>
      <div style={line}>
        <Button size='large' variant='contained'>Large</Button>
        <Button size='medium' variant='contained'>Medium</Button>
        <Button size='small' variant='contained'>Small</Button>
        <Button size='large' variant='outlined'>Large</Button>
        <Button size='medium' variant='outlined'>Medium</Button>
        <Button size='small' variant='outlined'>Small</Button>
        <Button size='large' variant='text'>Large</Button>
        <Button size='medium' variant='text'>Medium</Button>
        <Button size='small' variant='text'>Small</Button>
      </div>
      <div style={line}>
        <Button variant='contained' startIcon='edons'>Button</Button>
        <Button variant='contained' endIcon='edons'>Button</Button>
        <Button variant='contained' startIcon='edons' endIcon='edons'>Button</Button>

        <Button variant='outlined' startIcon='edons'>Button</Button>
        <Button variant='outlined' endIcon='edons'>Button</Button>
        <Button variant='outlined' startIcon='edons' endIcon='edons'>Button</Button>

        <Button variant='text' startIcon='edons'>Button</Button>
        <Button variant='text' endIcon='edons'>Button</Button>
        <Button variant='text' startIcon='edons' endIcon='edons'>Button</Button>
      </div>

      <div style={line}>
        <InputText variant='outlined' size='small' placeholder='Input' label='Input' />
        <InputText variant='outlined' size='medium' placeholder='Input' label='Input' />
        <InputText variant='filled' size='small' placeholder='Input' label='Input' />
        <InputText variant='filled' size='medium' placeholder='Input' label='Input' />
        <InputText variant='standard' size='small' placeholder='Input' label='Input' />
        <InputText variant='standard' size='medium' placeholder='Input' label='Input' />
      </div>
      <div style={line}>
        <InputText variant='outlined' size='small' placeholder='Placeholder' label='Input' labelActive />
        <InputText variant='outlined' size='medium' placeholder='Placeholder' label='Input' labelActive />
        <InputText variant='filled' size='small' placeholder='Placeholder' label='Input' labelActive />
        <InputText variant='filled' size='medium' placeholder='Placeholder' label='Input' labelActive />
        <InputText variant='standard' size='small' placeholder='Placeholder' label='Input' labelActive />
        <InputText variant='standard' size='medium' placeholder='Placeholder' label='Input' labelActive />
      </div>
      <div style={line}>
        <InputText placeholder='Placeholder' label='label startIcon' startIcon='search' labelActive />
        <InputText placeholder='Placeholder' label='label endIcon' endIcon='search' labelActive />
        <InputText placeholder='Placeholder' label='label startAdornment' startAdornment='RU' labelActive />
        <InputText placeholder='Placeholder' label='label endAdornment' endAdornment='EN' labelActive />
      </div>
      <div style={line}>
        <InputText size='small' placeholder='Placeholder text' label='Input' fullWidth />
        <InputText size='medium' placeholder='Placeholder text' label='Input' fullWidth />
      </div>

    </div>

  );
}
