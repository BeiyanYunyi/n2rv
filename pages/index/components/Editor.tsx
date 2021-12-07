import { Button } from '@mui/material';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import Vditor from 'vditor';
import AppSetStateAction from '../../../src/types/AppSetStateAction';

export interface EditorRef {
  value: () => string | undefined;
  html: () => string | undefined;
  clearCache: () => void | undefined;
  focus: () => void | undefined;
  blur: () => void | undefined;
}

const AppVditor = ({ setVd }: { setVd: AppSetStateAction<Vditor | undefined> }) => {
  useEffect(() => {
    const vditor = new Vditor('vditor', {
      after: () => {
        setVd(vditor);
      },
      height: window.innerHeight / 2,
      icon: 'material',
      toolbar: [
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
        'upload',
        '|',
        'undo',
        'redo',
        '|',
        'edit-mode',
        {
          name: 'more',
          toolbar: ['export', 'outline', 'preview', 'devtools', 'info', 'help'],
        },
      ],
    });
  }, [setVd]);
  return <div style={{ height: window.innerHeight }} id="vditor" />;
};

const Editor = forwardRef((_props, ref) => {
  const [vd, setVd] = useState<Vditor>();
  const [open, setOpen] = useState(false);

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
          点击输入内容
        </Button>
      )}
    </div>
  );
});

export default Editor;
