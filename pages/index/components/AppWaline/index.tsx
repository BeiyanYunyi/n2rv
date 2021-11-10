import React from 'react';
import Waline, { WalineErrorInstance, WalineInstance } from '@waline/client';
import config from '../../../../config/config.json';

const AppWaline = React.forwardRef((_props, ref) => {
  const [walineInstance, setWalineInstance] = React.useState<WalineInstance>();
  React.useImperativeHandle(ref, () => ({ walineInstance }));
  React.useEffect(() => {
    const walineInit = Waline({ el: '#waline', serverURL: config.walineURL });
    if ((walineInit as WalineErrorInstance).errMsg) return undefined;
    return setWalineInstance(walineInit as WalineInstance);
  }, []);
  return <div id="waline" />;
});

export default AppWaline;
