import { Button } from '@mui/material';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import Vditor from 'vditor';
import authedApiWrapper from '../../../renderer/wrapper/authedApiWrapper';
import AppSetStateAction from '../../../types/AppSetStateAction';
import { useAuthStateValue } from '../contexts/AuthContext';

export interface EditorRef {
  value: () => string | undefined;
  html: () => string | undefined;
  clearCache: () => void | undefined;
  focus: () => void | undefined;
  blur: () => void | undefined;
}

const AppVditor = ({ setVd }: { setVd: AppSetStateAction<Vditor | undefined> }) => {
  const [authState] = useAuthStateValue();

  useEffect(() => {
    const getToolbar = () => {
      const toolbarBefore: Array<string | IMenuItem> = [
        'headings',
        'bold',
        'italic',
        'strike',
        'link',
        '|',
        'list',
        'ordered-list',
        'check',
        '|',
        'quote',
        'line',
        'code',
      ];
      const toolbarAfter = [
        '|',
        'undo',
        'redo',
        '|',
        'edit-mode',
        {
          name: 'more',
          toolbar: ['export', 'outline', 'preview', 'devtools', 'info', 'help'],
        },
      ];
      if (authState.type === 'Authenticated') {
        return toolbarBefore.concat('upload').concat(...toolbarAfter);
      }
      return toolbarBefore.concat(...toolbarAfter);
    };
    const vditor = new Vditor('vditor', {
      after: () => {
        setVd(vditor);
      },
      height: window.innerHeight / 2,
      icon: 'material',
      upload: {
        url: '/api/localUpload',
        headers: { Authorization: authedApiWrapper.token },
        fieldName: 'image',
        multiple: false,
      },
      toolbar: getToolbar(),
    });
  }, [setVd, authState]);
  return <div style={{ height: window.innerHeight }} id="vditor" />;
};

const Editor = forwardRef((_props, ref) => {
  const [vd, setVd] = useState<Vditor>();
  const [open, setOpen] = useState(false);
  const [authState] = useAuthStateValue();

  useImperativeHandle(ref, () => {
    const value = () => vd?.getValue();
    const html = () => vd?.getHTML();
    const clearCache = () => {
      vd?.setValue('');
      vd?.clearCache();
    };
    const focus = () => vd?.focus();
    const blur = () => vd?.blur();
    return { value, html, clearCache, focus, blur };
  });

  return (
    <div>
      {open ? (
        <AppVditor setVd={setVd} />
      ) : (
        <Button fullWidth sx={{ height: window.innerHeight / 2 }} onClick={() => setOpen(true)}>
          点击输入内容{authState.type === 'Unauthenticated' ? '\r\n登录后可上传图片' : ''}
        </Button>
      )}
    </div>
  );
});

export default Editor;
