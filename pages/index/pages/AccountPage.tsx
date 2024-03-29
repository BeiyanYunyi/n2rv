import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authedApiWrapper from '../../../renderer/wrapper/authedApiWrapper';
import UserFace from '../components/UserFace';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { logout } from '../redux/userAuthSlice';

const AccountPage = () => {
  const authState = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  useEffect(() => {
    const apiToken = localStorage.getItem('apiToken');
    if (apiToken) setToken(apiToken);
  }, []);
  if (authState.type === 'Unauthenticated') {
    navigate('/login');
    return <div />;
  }
  return (
    <Container maxWidth="xs">
      <Card>
        <CardHeader
          title={`${authState.currentUser.username} | ${authState.currentUser.nickname}`}
          subheader={authState.currentUser.id}
          avatar={
            <UserFace
              authorID={authState.currentUser.id}
              authorName={authState.currentUser.username}
              isOriginal
            />
          }
        />
        <CardContent>
          <Typography>以下是你的凭据，可能有用</Typography>
          <Typography variant="body2" sx={{ overflowWrap: 'break-word' }}>
            {token}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              await authedApiWrapper.logout();
              navigate('/', { replace: true });
              dispatch(logout(null));
            }}
          >
            退出登录
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
};

export default AccountPage;
