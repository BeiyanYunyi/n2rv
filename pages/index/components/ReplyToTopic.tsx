import { Button } from '@mui/material';
import { useRef } from 'react';
import Editor, { EditorRef } from './Editor';

const ReplyToTopic = () => {
  const editorRef = useRef<EditorRef>(null);
  return (
    <>
      <Editor ref={editorRef} />
      <Button sx={{ marginTop: 1 }} variant="outlined">
        回复
      </Button>
    </>
  );
};

export default ReplyToTopic;
