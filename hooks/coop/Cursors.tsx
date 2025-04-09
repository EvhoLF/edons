import { Icon } from '@/components/UI/Icon/Icon';
import { Avatar, Typography } from '@mui/material';
import { EdgeLabelRenderer } from '@xyflow/react';

interface SyncUsers {
  id: string,
  name: string,
  image: string,
  cursor: [number, number]
}

function Cursors({ syncUsers, thisUserId }: { syncUsers: SyncUsers[], thisUserId: string | undefined }) {
  const syncUsers_otherUsers = thisUserId ? syncUsers.filter(e => e.id != thisUserId) : syncUsers
  return (
    <EdgeLabelRenderer>
      {syncUsers_otherUsers && syncUsers_otherUsers?.length && syncUsers_otherUsers?.map(({ id, name, image, position: [x, y] }) => {
        const translate = `translate(${x}px, ${y}px)`;
        const scale = ``;
        return (
          <div key={id} style={{ transform: translate, zIndex: '999' }}>
            <Icon sx={{ transform: scale, zIndex: '9999' }} icon='cursor' color='primary' />
            {image && <Avatar sx={{ margin: '5px', width: '32px', height: '32px', zIndex: '999' }} src={image} />}
            <Typography>{name}</Typography>
          </div>
        );
      })}
    </EdgeLabelRenderer>
  );
}

export default Cursors;
