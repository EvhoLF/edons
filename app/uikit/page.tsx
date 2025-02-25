import Button from "@/components/UI/Button/Button";
import { Icon } from "@/components/UI/Icon/Icon";
import InputText from "@/components/UI/InputText/InputText";
import { IconName, icons_names } from "@/data/data_icons";
import { CSSProperties } from "react";

export default function Page() {

  const stylePage: CSSProperties = {
    display: 'inline-flex',
    flexDirection: 'column',
    gap: '25px',
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
        <Button variant='filled'>Filled</Button>
        <Button variant='outlined'>Outlined</Button>
        <Button variant='colorGlass'>ColorGlass</Button>
        <Button variant='text'>Text</Button>
      </div>
      <div style={line}>
        <Button square round='none' variant='filled' iconLeft="edons" />
        <Button square round='sm' variant='filled' iconLeft="edons" />
        <Button square round='md' variant='filled' iconLeft="edons" />
        <Button square round='lg' variant='filled' iconLeft="edons" />
        <Button square round='round' variant='filled' iconLeft="edons" />

        <Button square round='none' variant='colorGlass' iconLeft="edons" />
        <Button square round='sm' variant='colorGlass' iconLeft="edons" />
        <Button square round='md' variant='colorGlass' iconLeft="edons" />
        <Button square round='lg' variant='colorGlass' iconLeft="edons" />
        <Button square round='round' variant='colorGlass' iconLeft="edons" />
      </div>
      <div style={line}>
        <Button variant='filled' dimension='x' iconLeft="edons">Filled SM</Button>
        <Button variant='filled' dimension='s' iconLeft="edons">Filled MD</Button>
        <Button variant='filled' dimension='m' iconLeft="edons">Filled LG</Button>
        <Button variant='filled' square dimension='x' iconLeft="edons" />
        <Button variant='filled' square dimension='s' iconLeft="edons" />
        <Button variant='filled' square dimension='m' iconLeft="edons" />
      </div>
      <div style={line}>
        <Button variant='outlined' dimension='x' iconLeft="edons">Outlined SM</Button>
        <Button variant='outlined' dimension='s' iconLeft="edons">Outlined MD</Button>
        <Button variant='outlined' dimension='m' iconLeft="edons">Outlined LG</Button>
        <Button variant='outlined' square dimension='x' iconLeft="edons" />
        <Button variant='outlined' square dimension='s' iconLeft="edons" />
        <Button variant='outlined' square dimension='m' iconLeft="edons" />
      </div>
      <div style={line}>
        <Button variant='colorGlass' dimension='x' iconLeft="edons">ColorGlass SM</Button>
        <Button variant='colorGlass' dimension='s' iconLeft="edons">ColorGlass MD</Button>
        <Button variant='colorGlass' dimension='m' iconLeft="edons">ColorGlass LG</Button>
        <Button variant='colorGlass' square dimension='x' iconLeft="edons" />
        <Button variant='colorGlass' square dimension='s' iconLeft="edons" />
        <Button variant='colorGlass' square dimension='m' iconLeft="edons" />
      </div>
      <div style={line}>
        <Button variant='text' dimension='x' iconLeft="edons">Text SM</Button>
        <Button variant='text' dimension='s' iconLeft="edons">Text MD</Button>
        <Button variant='text' dimension='m' iconLeft="edons">Text LG</Button>
        <Button variant='text' square dimension='x' iconLeft="edons" />
        <Button variant='text' square dimension='s' iconLeft="edons" />
        <Button variant='text' square dimension='m' iconLeft="edons" />
      </div>

      <div style={{ ...line, width: '90%', margin: 'auto' }}>
        <Button variant='outlined' iconLeft="edons" fillX>fillX</Button>
      </div>

      <div style={line}>
        <InputText dimension='x' placeholder="Placeholder text" label="Input" />
        <InputText dimension='s' placeholder="Placeholder text" label="Input" />
        <InputText dimension='m' placeholder="Placeholder text" label="Input" />
      </div>

      <div style={line}>
        <Button variant='colorGlass' square dimension='x' iconLeft="edons" />
        <InputText label="Input" dimension='x' placeholder="Placeholder text" contentLeft={<Button variant='text' square dimension='x' iconLeft="edons" />} />
      </div>
      <div style={line}>
        <Button variant='colorGlass' square dimension='s' iconLeft="edons" />
        <InputText label="Input" dimension='s' placeholder="Placeholder text" contentLeft={<Button variant='text' square dimension='s' iconLeft="edons" />} />
      </div>
      <div style={line}>
        <Button variant='colorGlass' square dimension='m' iconLeft="edons" />
        <InputText label="Input" dimension='m' placeholder="Placeholder text" contentLeft={<Button variant='text' square dimension='m' iconLeft="edons" />} />
      </div>

    </div>

  );
}
