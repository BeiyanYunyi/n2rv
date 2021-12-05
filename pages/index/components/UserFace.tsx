/* eslint-disable jsx-a11y/anchor-is-valid */
import { Avatar, Link, Skeleton } from '@mui/material';
import stringAvatar from '../../../renderer/utils/stringAvatar';

const UserFace = ({
  authorID,
  authorName,
  isOriginal = false,
}: {
  authorID: string;
  authorName: string;
  // eslint-disable-next-line react/require-default-props
  isOriginal?: boolean;
}) => {
  if (authorID) {
    return (
      <Link
        href={isOriginal ? undefined : `https://www.douban.com/people/${authorID}`}
        underline="none"
      >
        <Avatar {...stringAvatar(authorName)} />
      </Link>
    );
  }
  return <Skeleton variant="circular" width={48} height={48} />;
};

export default UserFace;
