import SendIcon from '@mui/icons-material/Send';
import { Container, Fab, TextField } from '@mui/material';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiWrapper from '../../../renderer/wrapper/apiWrapper';
import authedApiWrapper from '../../../renderer/wrapper/authedApiWrapper';
import Editor, { EditorRef } from '../components/Editor';
import { useAuthStateValue } from '../contexts/AuthContext';

const CreateTopicPage = () => {
  const navigate = useNavigate();
  const editorRef = useRef<EditorRef>(null);
  const [title, setTitle] = useState('');
  const [authState] = useAuthStateValue();
  const [authorName, setAuthorName] = useState('');

  const handleSubmit = async () => {
    const html = editorRef.current?.html();
    if ((!authorName && authState.type === 'Unauthenticated') || !title || !html) {
      // eslint-disable-next-line no-alert
      return alert('不得为空');
    }
    const res =
      authState.type === 'Unauthenticated'
        ? await apiWrapper.postAnonymousTopic({
            authorName,
            content: html,
            title,
          })
        : await authedApiWrapper.postTopic({ content: html, title });
    console.log(res);
    editorRef.current?.clearCache();
    return navigate('/');
  };

  return (
    <Container>
      <TextField
        label="标题"
        fullWidth
        sx={{ marginBottom: 1, marginTop: 1 }}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        value={title}
      />
      {authState.type === 'Unauthenticated' && (
        <TextField
          label="作者名"
          fullWidth
          sx={{ marginBottom: 1, marginTop: 1 }}
          onChange={(e) => {
            setAuthorName(e.target.value);
          }}
          value={authorName}
        />
      )}
      <Editor ref={editorRef} />
      <div style={{ position: 'fixed', bottom: 16, right: 16 }}>
        <Fab color="primary" onClick={handleSubmit}>
          <SendIcon />
        </Fab>
      </div>
    </Container>
  );
};

export default CreateTopicPage;
