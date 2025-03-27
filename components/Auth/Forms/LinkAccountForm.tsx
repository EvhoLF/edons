'use client'
import Frame from "@/components/UI/Frame/Frame";
import { UserAction } from "@/DB/actions/UserAction";
import { IUser } from "@/DB/models/User";
import { decryptDataURI, encryptData } from "@/utils/uid_crypto";
import { Avatar, Box, Button, Grid2, Stack, Typography } from "@mui/material";
import { getToken } from "next-auth/jwt";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type users = {
  mainUser: IUser | null;
  linkUser: IUser | null;
} | null

const LinkAccountForm = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [users, setUsers] = useState<users>(null);
  const { data: session, update: sessionUpdate } = useSession();
  const searchParams = useSearchParams();
  const mainUserId = searchParams.get('u') || '';


  console.log({ session, token: getToken });


  useEffect(() => {

    const getUsers = async () => {
      console.log(mainUserId);
      if (!mainUserId || !session?.user) return;
      const decrypt_data = decryptDataURI(mainUserId);
      const mainUser = await UserAction.getById(decrypt_data);
      const linkUser = session?.user;
      setUsers({ mainUser, linkUser })
    }

    getUsers();

  }, [session?.user, mainUserId]);

  // if (error) {
  //   return <div>{error}</div>;
  // }

  if (!users || !users.mainUser || !users.linkUser) {
    return <div>Loading...</div>;
  }

  const handleLinkAccount = async () => {
    try {
      if (!mainUserId || !users.linkUser?.id) return;
      const data = {
        lastProvider: session?.lastProvider,
        mainUser: mainUserId,
        linkUser: encryptData(users.linkUser?.id)
      }
      console.log(data);

      const response = await fetch("/api/auth/link-account", {
        method: "POST",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify(data),
      });
      const response_data = await response.json();
      if (response_data.userId) {
        signIn('linkAccount', { userID: response_data.userId, callbackUrl: '/profile' });
      }
      else {
        signOut();
      }
      // router.push('/profile');
    }
    catch {
    }
  };


  return (
    <Box sx={{ width: '800px' }} >
      <Frame>
        <Stack spacing={2}>
          <Grid2 container columns={2} spacing={2}>
            <Grid2 size={1}>
              <Stack alignItems='center'>
                <Avatar sx={{ width: 75, height: 75 }} alt={users.mainUser?.name || ''} src={users.mainUser?.image} />
                <Typography variant="h6" gutterBottom textAlign='center'>
                  {users.mainUser?.name}
                </Typography>
                <Typography variant='subtitle1' gutterBottom textAlign='center'>
                  {users.mainUser?.email}
                </Typography>
              </Stack>
            </Grid2>
            <Grid2 size={1} alignItems='center'>
              <Stack alignItems='center'>
                <Avatar sx={{ width: 75, height: 75 }} alt={users.linkUser?.name || ''} src={users.linkUser?.image} />
                <Typography variant='h6' gutterBottom textAlign='center'>
                  {users.linkUser?.name}
                </Typography>
                <Typography variant='subtitle1' gutterBottom textAlign='center'>
                  {users.linkUser?.email}
                </Typography>
              </Stack>
            </Grid2>
          </Grid2>
          <Stack direction='row' spacing={2}>
            <Button type='submit' variant='outlined' size='large' fullWidth>Отмена</Button>
            <Button onClick={handleLinkAccount} type='submit' variant='contained' size='large' fullWidth>Связать</Button>
          </Stack>
        </Stack>
      </Frame>
    </Box>
  );
}

export default LinkAccountForm;