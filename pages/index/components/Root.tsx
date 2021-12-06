import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Avatar, IconButton, Toolbar, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import stringAvatar from '../../../renderer/utils/stringAvatar';
import authedApiWrapper from '../../../renderer/wrapper/authedApiWrapper';
import { useAuthStateValue } from '../contexts/AuthContext';
import AppMenu, { AppMenuRef } from './AppMenu';
import ReloadPrompt from './ReloadPrompt';
import SiteIcon from './SiteIcon';

const Root = () => {
  const appMenuRef = useRef<AppMenuRef>(null);
  const [authState, authStateDispatch] = useAuthStateValue();
  useEffect(() => {
    const apiToken = localStorage.getItem('apiToken');
    if (apiToken) {
      authedApiWrapper.getMe().then((data) => authStateDispatch({ type: 'Login', payload: data }));
    }
  }, [authStateDispatch]);
  const navigate = useNavigate();
  return (
    <>
      <AppBar position="sticky" sx={{ marginBottom: 1 }}>
        <Toolbar>
          <AppMenu ref={appMenuRef} />
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => {
              appMenuRef.current?.openMenu();
            }}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            color="inherit"
            sx={{ marginRight: 1 }}
            onClick={() => {
              navigate('/');
            }}
          >
            <SiteIcon />
          </IconButton>
          <Typography
            onClick={() => {
              navigate('/');
            }}
            variant="h6"
            sx={{ userSelect: 'none' }}
          >
            影之避难所
          </Typography>
          <div style={{ flexGrow: 1 }} />
          <div style={{ display: 'flex' }}>
            {authState.type === 'Authenticated' ? (
              <IconButton
                color="inherit"
                onClick={() => {
                  navigate('/account');
                }}
              >
                <Avatar {...stringAvatar(authState.currentUser.username)} />
              </IconButton>
            ) : (
              <IconButton
                color="inherit"
                onClick={() => {
                  navigate('/login');
                }}
              >
                <AccountCircleOutlinedIcon />
              </IconButton>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <Outlet />
      <ReloadPrompt />
    </>
  );
};

export default Root;
