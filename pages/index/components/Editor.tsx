import { Button } from '@mui/material';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import Vditor from 'vditor';
import authedApiWrapper from '../../../renderer/wrapper/authedApiWrapper';
import AppSetStateAction from '../../../types/AppSetStateAction';
import { useAppSelector } from '../redux/store';

export interface EditorRef {
  value: () => string | undefined;
  html: () => string | undefined;
  clearCache: () => void | undefined;
  focus: () => void | undefined;
  blur: () => void | undefined;
}

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

const AppVditor = ({ setVd }: { setVd: AppSetStateAction<Vditor | undefined> }) => {
  const authState = useAppSelector((state) => state.auth);

  useEffect(() => {
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
      toolbar: (() => {
        const toolbarAfter: Array<string | IMenuItem> = [
          '|',
          'undo',
          'redo',
          '|',
          'edit-mode',
          {
            name: 'delete',
            tipPosition: 'n',
            tip: '清除内容',
            click() {
              vditor.setValue('', false);
            },
            icon: '<svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>',
          },
          {
            name: 'more',
            toolbar: ['export', 'outline', 'preview', 'devtools', 'info', 'help'],
          },
        ];
        if (authState.type === 'Authenticated') {
          return toolbarBefore.concat('upload').concat(...toolbarAfter);
        }
        return toolbarBefore.concat(...toolbarAfter);
      })(),
    });
  }, [setVd, authState]);
  return <div style={{ height: window.innerHeight }} id="vditor" />;
};

const Editor = forwardRef((_props, ref) => {
  const [vd, setVd] = useState<Vditor>();
  const [open, setOpen] = useState(false);
  const authState = useAppSelector((state) => state.auth);

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
        <Button
          fullWidth
          sx={{ height: window.innerHeight / 2, textTransform: 'none' }}
          onClick={() => setOpen(true)}
        >
          {authState.type === 'Unauthenticated' ? '点击输入内容 登录后可上传图片' : '点击输入内容'}
        </Button>
      )}
    </div>
  );
});

export default Editor;
