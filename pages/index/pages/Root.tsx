import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Avatar, IconButton, Link, Toolbar, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';
import { Outlet, useNavigate, Link as BrowserLink } from 'react-router-dom';
import stringAvatar from '../../../renderer/utils/stringAvatar';
import authedApiWrapper from '../../../renderer/wrapper/authedApiWrapper';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { login } from '../redux/userAuthSlice';
import AppMenu, { AppMenuRef } from '../components/AppMenu';
import ReloadPrompt from '../components/ReloadPrompt';
import SiteIcon from '../components/SiteIcon';

const Root = () => {
  const appMenuRef = useRef<AppMenuRef>(null);
  const authState = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const apiToken = localStorage.getItem('apiToken');
    if (apiToken) {
      authedApiWrapper.getMe().then((data) => dispatch(login(data)));
    }
  }, [dispatch]);
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
          <Link component={BrowserLink} to="/" color="inherit" underline="none">
            <Typography variant="h6" sx={{ userSelect: 'none' }}>
              影之避难所
            </Typography>
          </Link>
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
