'use client'
import { signIn, signOut, useSession } from 'next-auth/react'
import React from 'react'
import Button from '../UI/Button/Button';
import Image from 'next/image';

const Profile = () => {
  const { data: session } = useSession();
  console.log(session);

  return (
    <div>
      <h1>Profile</h1>
      <div>
        {
          session ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                <div style={{ position: 'relative', width: '50px', height: '50px', borderRadius: '100%', overflow: 'hidden' }} >
                  <Image alt="logo-user" src={session.user.image} fill={true} sizes='100% 100%' />
                </div>
                <div> {session.user.name} </div>
                <div> {session.user.email} </div>
              </div>
              <Button onClick={() => signOut()}>LOG OUT GITHUB</Button>
            </div>
          ) : (
            <div>
              <Button onClick={() => signIn('github')}>LOG OUT GITHUB</Button>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Profile