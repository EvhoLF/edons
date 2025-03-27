import { Button, Stack, Typography } from '@mui/material';

const ModalConfirm = (
  { title = 'Подтверждение действия',
    text = 'Вы уверены, что хотите продолжить? Это действие нельзя будет отменить',
    onConfirm, closeModal
  }: {
    title?: string,
    text?: string,
    onConfirm: () => void,
    closeModal: () => void
  }) => {

  return (
    <Stack p={2} spacing={3}>
      <Typography variant='h4'>{title} </Typography>
      <Typography>{text}</Typography>
      <Stack justifyContent='space-between' direction='row' spacing={2}>
        <Button onClick={closeModal} color='primary'>Отмена</Button>
        <Button onClick={onConfirm} color='primary'>Подтвердить</Button>
      </Stack>
    </Stack >
  );
};
export default ModalConfirm;
