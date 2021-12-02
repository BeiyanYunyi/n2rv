import { Box, Drawer } from '@mui/material';
import { forwardRef, useImperativeHandle, useState } from 'react';
import AppList from './AppList';

export interface AppMenuRef {
  closeMenu: () => void;
  openMenu: () => void;
}

const AppMenu = forwardRef((_props, ref) => {
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);
  const openMenu = () => setOpen(true);
  useImperativeHandle(ref, () => ({ closeMenu, openMenu }));

  return (
    <Drawer open={open} onClose={closeMenu}>
      <Box sx={{ minWidth: 240, maxWidth: 360, bgcolor: 'background.paper' }}>
        <AppList closeMenu={closeMenu} />
      </Box>
    </Drawer>
  );
});

export default AppMenu;
