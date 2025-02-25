import clsx from "clsx";
import styles from "./page.module.scss";
import Head from "next/head";
import Container from "@/components/UI/Container/Container";
import Frame from "@/components/UI/Frame/Frame";
import Button from "@/components/UI/Button/Button";
import { Icon } from "@/components/UI/Icon/Icon";
import InputText from "@/components/UI/InputText/InputText";

const dataEls = [
  {
    id: 'b54yo82c',
    label: 'ReactMap',
    dateCreate: '28.08.2002',
    dateUpdate: '12.02.2003',
    favourite: true,
    publicAccess: false,
    img: null,
  },
  {
    id: '91bv682ff',
    label: 'ABOA ZXC ABOA ZXC ABOA ZXC ABOA ZXC ABOA ZXC ABOA ZXC',
    dateCreate: '05.10.1999',
    dateUpdate: '28.08.2012',
    favourite: false,
    publicAccess: true,
    img: null,
  },
];

export default function Page() {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <Container>
        <div className={styles.Worksapce}>
          <div className={styles.Worksapce_panel}>
            <InputText placeholder="Placeholder text" iconLeft='search' />
            <div>
              <Button dimension='md' iconLeft="stars" square />
            </div>
          </div>
          <div className={styles.Worksapce_grid}>
            {dataEls.map(el => (
              <Frame key={el.id} className={styles.cardMap}>
                <div className={styles.cardMap_}>
                </div>
                <div className={styles.cardMap_content}>
                  <h4 className={styles.cardMap_label} >{el.label}</h4>
                </div>
                <div className={styles.options}>
                  <div className={clsx(styles.options_item, el.favourite && styles.active)}>
                    <Button className={styles.btnStar} variant='text' dimension='sm' square iconLeft="stars" />
                  </div>
                  <div className={clsx(styles.options_item, el.publicAccess && styles.active)}>
                    <Button className={styles.btnLink} variant='text' dimension='sm' square iconLeft="link" />
                  </div>
                  <div className={clsx(styles.options_item)}>
                    <Button className={styles.btnOption} variant='text' dimension='sm' square iconLeft="option" />
                  </div>
                </div>
              </Frame>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}