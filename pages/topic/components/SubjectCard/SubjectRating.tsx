import { Stack, Typography } from '@mui/material';
import React from 'react';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const SubjectStars = ({ stars }: { stars: number }) => {
  const [starsAry, setStarsAry] = React.useState<(0 | 1)[]>([]);
  React.useEffect(() => {
    const aryToPush: (0 | 1)[] = [];
    for (let i = 1; i <= 5; i += 1) {
      if (i <= stars) {
        aryToPush.push(1);
      } else {
        aryToPush.push(0);
      }
    }
    setStarsAry(aryToPush);
  }, [stars]);
  return (
    <>
      {starsAry.map((ele) => {
        if (ele === 1) return <StarIcon style={{ height: 14, width: 14 }} />;
        return <StarBorderIcon style={{ height: 14, width: 14 }} />;
      })}
    </>
  );
};

const SubjectRating = ({
  score,
  stars,
}: {
  score: string | undefined;
  stars: number | undefined;
}) => (
  <Stack direction="row" alignItems="center">
    {stars !== undefined && <SubjectStars stars={stars} />}
    <Typography variant="caption" marginLeft={0.5}>
      {score}
    </Typography>
  </Stack>
);

export default SubjectRating;
