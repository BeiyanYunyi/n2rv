import SendIcon from '@mui/icons-material/Send';
import { Container, Fab } from '@mui/material';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor, { EditorRef } from '../components/Editor';

const CreateTopicPage = () => {
  const navigate = useNavigate();
  const editorRef = useRef<EditorRef>(null);
  return (
    <Container>
      <Editor ref={editorRef} />
      <div style={{ position: 'fixed', bottom: 16, right: 16 }}>
        <Fab
          color="primary"
          onClick={() => {
            console.log(editorRef.current?.html());
            console.log(editorRef.current?.value());
            navigate('/');
          }}
        >
          <SendIcon />
        </Fab>
      </div>
    </Container>
  );
};

export default CreateTopicPage;
