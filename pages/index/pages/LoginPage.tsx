import {
  Button,
  Card,
  CardContent,
  Container,
  FormControlLabel,
  FormGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import apiWrapper from '../../../renderer/wrapper/apiWrapper';
import authedApiWrapper from '../../../renderer/wrapper/authedApiWrapper';
import ColoredSwitch from '../components/ColoredSwitch';
import { useAppDispatch } from '../redux/store';
import { login as userLogin } from '../redux/userAuthSlice';

const LoginPage = (): JSX.Element => {
  const [username, setUsername] = React.useState<string>('');
  const [nickname, setNickname] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const dispatch = useAppDispatch();
  const [islogin, setIsLogin] = React.useState<boolean>(true);
  const navigate = useNavigate();

  const login = async () => {
    const res = await authedApiWrapper.login({ username, password });
    if (!res) return alert('用户名与密码不匹配');
    authedApiWrapper.changeToken(res);
    const user = await authedApiWrapper.getMe();
    dispatch(userLogin(user));
    return navigate('/', { replace: true });
  };

  const handleLoginClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    await login();
  };

  const handleSignUpClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    try {
      await apiWrapper.signup({ username, nickname, password });
      await login();
    } catch (e) {
      alert('注册失败，很有可能是用户名冲突');
    }
  };

  return (
    <div
      style={{
        backgroundSize: 'cover',
        height: '100vh',
        width: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <Container maxWidth="xs">
        <Card style={{ marginTop: 128 }}>
          <CardContent>
            <Typography variant="h4" align="center" gutterBottom>
              {islogin ? '登录' : '注册'}
            </Typography>
            <Stack spacing={1} justifyContent="center">
              <Stack direction="row" justifyContent="center" spacing={1}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <ColoredSwitch
                        checked={islogin}
                        color="primary"
                        onChange={(event) => {
                          setIsLogin(event.target.checked);
                        }}
                      />
                    }
                    label={islogin ? '登录' : '注册'}
                  />
                </FormGroup>
              </Stack>
              <TextField
                fullWidth
                variant="outlined"
                type="username"
                label="用户名"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
              {!islogin && (
                <TextField
                  fullWidth
                  variant="outlined"
                  label="昵称（可留空）"
                  autoComplete="nickname"
                  value={nickname}
                  onChange={(event) => setNickname(event.target.value)}
                />
              )}
              <TextField
                fullWidth
                variant="outlined"
                type="password"
                label="密码"
                autoComplete={islogin ? 'current-password' : 'new-password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              {islogin ? (
                <Button color="primary" variant="contained" onClick={handleLoginClick}>
                  登录
                </Button>
              ) : (
                <Button color="secondary" variant="contained" onClick={handleSignUpClick}>
                  注册
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default LoginPage;
