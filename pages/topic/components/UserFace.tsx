import { Avatar, Link } from '@mui/material';
import React from 'react';
import stringAvatar from '../utils/stringAvatar';

const UserFace = ({ authorID, authorName }: { authorID: string; authorName: string }) => (
  <Link href={`https://www.douban.com/people/${authorID}`} underline="none">
    <Avatar {...stringAvatar(authorName)} />
  </Link>
);

export default UserFace;
