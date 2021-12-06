import { Button } from '@mui/material';
import { useRef } from 'react';
import authedApiWrapper from '../../../renderer/wrapper/authedApiWrapper';
import AppSetStateAction from '../../../src/types/AppSetStateAction';
import Reply from '../../../src/types/Reply';
import Editor, { EditorRef } from './Editor';

const ReplyToTopic = ({
  setComments,
  topicID,
}: {
  setComments: AppSetStateAction<Reply[]>;
  topicID: string | undefined;
}) => {
  const editorRef = useRef<EditorRef>(null);
  return (
    <div style={{ marginTop: 8 }}>
      <Editor ref={editorRef} />
      <Button
        sx={{ marginTop: 1 }}
        variant="outlined"
        onClick={async () => {
          const html = editorRef.current?.html();
          if (html && topicID) {
            const reply = await authedApiWrapper.replyTopic({
              content: html,
              topicID,
              quotingID: undefined,
            });
            editorRef.current?.clearCache();
            return setComments((state) => state.concat(reply));
          }
          return alert('不得为空');
        }}
      >
        回复
      </Button>
    </div>
  );
};

export default ReplyToTopic;
