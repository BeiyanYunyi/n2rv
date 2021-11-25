import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';
import Skeleton from '@mui/material/Skeleton';
import stringAvatar from '../../../renderer/utils/stringAvatar';

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
