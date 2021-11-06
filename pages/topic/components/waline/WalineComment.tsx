import Waline from '@waline/client';
import React from 'react';
import config from '../../../../config/config.json';

const WalineComment = () => {
  React.useEffect(() => {
    Waline({ el: '#waline', serverURL: config.walineURL });
  });
  return <div id="waline" />;
};

export default WalineComment;
