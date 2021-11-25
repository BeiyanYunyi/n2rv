/* eslint-disable jsx-a11y/alt-text */
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Element } from 'html-react-parser';
import SubjectRating from './SubjectRating';

const SubjectCard = ({ domNode }: { domNode: Element }) => {
  const [subjectWrapper, subjectCaptionWrapper] = domNode.children as [
    Element,
    Element | undefined,
  ];
  const subjectA = subjectWrapper.firstChild as Element;
  const subjectLink = subjectA.attribs.href;
  const subjectCover = (subjectA.children as Element[]).find(
    (node) => node.attribs.class === 'subject-cover',
  );
  const subjectInfo = (subjectA.children as Element[]).find(
    (node) => node.attribs.class === 'subject-info',
  );
  const subjectTitle = (subjectInfo?.children as Element[]).find(
    (node) => node.attribs.class === 'subject-title',
  );
  const subjectRating = (subjectInfo?.children as Element[]).find(
    (node) => node.attribs.class === 'subject-rating',
  );
  const subjectSummary = (
    (subjectInfo?.children as Element[]).find((node) => node.attribs.class === 'subject-summary')
      ?.firstChild as { data: string } | undefined
  )?.data;
  const subjectCoverSrc = (subjectCover?.firstChild as Element).attribs.src;
  const subjectCaption = (
    (subjectCaptionWrapper?.firstChild as Element)?.firstChild as unknown as
      | { data: string }
      | undefined
  )?.data;
  const subjectTitleText = (
    (subjectTitle?.children as Element[]).find((node) => node.attribs.class === 'title-text')
      ?.firstChild as { data: string } | undefined
  )?.data;
  const subjectTitleTail = (
    (subjectTitle?.children as Element[]).find((node) => node.attribs.class === 'title-tail')
      ?.firstChild as { data: string } | undefined
  )?.data;
  const subjectStars = (subjectRating?.children as Element[]).filter(
    (node) => node.attribs.class === 'rating-star1',
  ).length;
  const subjectScore = (
    (subjectRating?.children as Element[]).find((node) => node.attribs.class === 'rating-score')
      ?.firstChild as { data: string } | undefined
  )?.data;
  const ratingReason = (
    (subjectRating?.children as Element[]).find((node) => node.attribs.class === 'rating-reason')
      ?.firstChild as { data: string } | undefined
  )?.data;
  return (
    <>
      <Card style={{ margin: 8 }}>
        <Stack direction="row" alignItems="center">
          <img src={subjectCoverSrc} style={{ maxHeight: 150, maxWidth: 102 }} />
          <div>
            <CardHeader
              title={
                subjectTitleText && (
                  <Link href={subjectLink} underline="hover">
                    {subjectTitleText.concat(subjectTitleTail || '')}
                  </Link>
                )
              }
              subheader={
                <SubjectRating score={subjectScore || ratingReason} stars={subjectStars} />
              }
              subheaderTypographyProps={{
                style: { color: '#e09015', textAlign: 'center' },
              }}
              style={{ paddingBottom: 0, paddingTop: 0 }}
            />
            {subjectSummary && (
              <Typography variant="caption" style={{ padding: 16, paddingTop: 0 }}>
                {subjectSummary}
              </Typography>
            )}
          </div>
        </Stack>
      </Card>
      {subjectCaption && <Typography textAlign="center">{subjectCaption}</Typography>}
    </>
  );
};

export default SubjectCard;
