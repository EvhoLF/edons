import styles from "./page.module.scss";
import Head from "next/head";
import InputText from "@/components/UI/InputText/InputText";
import { Button, Container, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { Icon } from "@/components/UI/Icon/Icon";
import CardMap from "@/components/Workspace/CardMap/CardMap";

const dataEls = [
  {
    id: 'b54yo82c',
    label: 'ReactMap',
    dateCreate: '28.08.2002',
    dateUpdate: '12.02.2003',
    isFavourite: true,
    isPublicAccess: false,
    img: null,
  },
  {
    id: '91bv682ff',
    label: 'ABOA ZXC ABOA ZXC ABOA ZXC ABOA ZXC ABOA ZXC ABOA ZXC',
    dateCreate: '05.10.1999',
    dateUpdate: '28.08.2012',
    isFavourite: false,
    isPublicAccess: true,
    img: null,
  },
];

export default function Page() {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <Container maxWidth='xl'>
        <div className={styles.Worksapce}>
          <div className={styles.Worksapce_panel}>
            <InputText placeholder="Placeholder text" startIcon='search' />
            <div>
              <Button startIcon={<Icon icon='stars' />} />
            </div>
          </div>
          <Stack direction='row' spacing={2} flexWrap='wrap' alignItems='center'>
            {dataEls.map(el => <CardMap key={el.id} {...el} />)}
            <Stack width='115px' alignItems='center' justifyContent='center'>
              <Tooltip title="Новая карта">
                <IconButton color='primary' size='large' sx={{ background: '#1e101c50', width: 'fit-content', height: 'fit-content' }}>
                  <Icon icon='plus' color='ui' />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </div>
      </Container >
    </>
  );
}