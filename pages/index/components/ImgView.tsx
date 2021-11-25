/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/system/useTheme';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import LightGallery from 'lightgallery/react';

const ImgView = ({ src }: { src: string }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <LightGallery plugins={[lgThumbnail, lgZoom]} mode="lg-fade">
      <a className="gallery-item" data-src={src}>
        <img
          className="img-responsive"
          src={src}
          style={
            isMobile
              ? { maxHeight: window.screen.height / 1.5, maxWidth: window.screen.width / 1.5 }
              : { maxHeight: window.screen.height / 3, maxWidth: window.screen.width / 3 }
          }
        />
      </a>
    </LightGallery>
  );
};

export default ImgView;
