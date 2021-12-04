import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import { useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AppMenu, { AppMenuRef } from './AppMenu';
import ReloadPrompt from './ReloadPrompt';
import SiteIcon from './SiteIcon';

const Root = () => {
  const appMenuRef = useRef<AppMenuRef>(null);
  const navigate = useNavigate();
  return (
    <>
      <AppBar position="sticky" sx={{ marginBottom: 1 }}>
        <Toolbar style={{ paddingLeft: 0 }}>
          <AppMenu ref={appMenuRef} />
          <IconButton
            color="inherit"
            sx={{ marginLeft: 1 }}
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
        </Toolbar>
      </AppBar>
      <Outlet />
      <ReloadPrompt />
    </>
  );
};

export default Root;
