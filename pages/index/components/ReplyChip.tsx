import MessageIcon from '@mui/icons-material/Message';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const ReplyChip = ({ reply }: { reply: string }) => (
  <Stack alignItems="center" style={{ paddingLeft: 8 }}>
    <MessageIcon fontSize="small" color="warning" />
    <Typography variant="caption" style={{ color: 'rgba(0,0,0,0.6)' }}>
      {reply}
    </Typography>
  </Stack>
);

export default ReplyChip;
