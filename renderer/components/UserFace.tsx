import { Avatar, Link, Skeleton } from '@mui/material';
import React from 'react';
import stringAvatar from '../utils/stringAvatar';

const UserFace = ({ authorID, authorName }: { authorID: string; authorName: string }) => {
  if (authorID) {
    return (
      <Link href={`https://www.douban.com/people/${authorID}`} underline="none">
        <Avatar {...stringAvatar(authorName)} />
      </Link>
    );
  }
  return <Skeleton variant="circular" width={48} height={48} />;
};

export default UserFace;
