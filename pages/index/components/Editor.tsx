import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import Vditor from 'vditor';

export interface EditorRef {
  value: () => void | undefined;
  html: () => void | undefined;
  clearCache: () => void | undefined;
}

const Editor = forwardRef((_props, ref) => {
  const [vd, setVd] = useState<Vditor>();

  useImperativeHandle(ref, () => {
    const value = () => vd?.getValue();
    const html = () => vd?.getHTML();
    const clearCache = () => vd?.clearCache();
    return { value, html, clearCache };
  });

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
  }, []);
  return <div id="vditor" />;
});

export default Editor;
