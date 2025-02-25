import Image from 'next/image';
import styles from './UserPanel.module.scss'
import Button from '@/components/UI/Button/Button';
import useGithub from '@/hooks/useGithub';
import Frame from '@/components/UI/Frame/Frame';

export const UserPanel = () => {
  const { session, auth } = useGithub();

  // console.log(session);


  return (
    <Frame className={styles.UserPanel_wrap}>
      {
        session
          ? (
            <div className={styles.UserPanel}>
              <div className={styles.logo}>
                <Image alt="user logo" src={session.user.image} fill />
              </div>
              <div className={styles.info}>
                <div className={styles.username}>{session.user.username}</div>
                {/* <div className={styles.name}>{session.user.name}</div> */}
              </div>
              {/* <Button onClick={auth.signOut}>LOG OUT GITHUB</Button> */}
            </div>
          )
          : (<div> <Button onClick={auth.signIn}>LOG IN GITHUB</Button> </div>)
      }

    </Frame>
  )
};