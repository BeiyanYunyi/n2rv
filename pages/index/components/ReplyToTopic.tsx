import { Button, Stack, TextField, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import apiWrapper from '../../../renderer/wrapper/apiWrapper';
import authedApiWrapper from '../../../renderer/wrapper/authedApiWrapper';
import AppSetStateAction from '../../../types/AppSetStateAction';
import Reply from '../../../types/Reply';
import { useAuthStateValue } from '../contexts/AuthContext';
import { useReplyStateValue } from '../contexts/ReplyContext';
import Editor, { EditorRef } from './Editor';

const ReplyToTopic = ({
  setComments,
  topicID,
}: {
  setComments: AppSetStateAction<Reply[]>;
  topicID: string | undefined;
}) => {
  const [authState] = useAuthStateValue();
  const [replyState, replyDispatch] = useReplyStateValue();
  const [authorName, setAuthorName] = useState('');
  const editorRef = useRef<EditorRef>(null);
  const handleSubmit = async () => {
    const html = editorRef.current?.html();
    if ((authorName || authState.type === 'Authenticated') && html && topicID) {
      const reply =
        authState.type === 'Authenticated'
          ? await authedApiWrapper.replyTopic({
              content: html,
              topicID,
              quotingID: replyState.replyTo,
            })
          : await apiWrapper.replyAnonymousTopic({
              content: html,
              topicID,
              quotingID: replyState.replyTo,
              authorName,
            });
      editorRef.current?.clearCache();
      editorRef.current?.blur();
      replyDispatch({ type: 'Cancel' });
      setComments((state) => state.concat(reply));
    } else {
      alert('不得为空');
    }
  };
  return (
    <Stack sx={{ marginTop: 1 }} spacing={1}>
      {replyState.replyTo && (
        <>
          <Typography>回复 #{replyState.replyTo}</Typography>
          <Button
            onClick={() => {
              replyDispatch({ type: 'Cancel' });
            }}
          >
            不回复这个
          </Button>
        </>
      )}
      {authState.type === 'Unauthenticated' && (
        <TextField
          label="作者名"
          fullWidth
          value={authorName}
          onChange={(e) => {
            setAuthorName(e.target.value);
          }}
        />
      )}
      <Editor ref={editorRef} />
      <Button variant="outlined" onClick={handleSubmit}>
        回复
      </Button>
    </Stack>
  );
};

export default ReplyToTopic;
