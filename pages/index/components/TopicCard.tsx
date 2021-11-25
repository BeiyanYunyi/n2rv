/* eslint-disable jsx-a11y/alt-text */
import { Avatar, Card, CardContent, CardHeader, Stack, Typography } from '@mui/material';
import { domToReact, Element } from 'html-react-parser';

interface TopicCardProp {
  domNode: Element;
}

const TopicCard = ({ domNode }: TopicCardProp) => {
  const [groupHd, topicBd] = domNode.children as Element[];
  const [groupImgDiv, groupNameStrong, groupMemberSpan] = groupHd.children as Element[];
  const topicMain = topicBd.firstChild as Element;
  let topicCover;
  let topicInfo;
  if (topicMain.children.length === 2) {
    [topicCover, topicInfo] = topicMain.children as Element[];
  } else {
    [topicInfo] = topicMain.children as Element[];
  }
  const topicCoverImg = topicCover?.firstChild as Element | undefined;
  const [groupImg] = groupImgDiv.children as Element[];
  const [groupMemberText] = groupMemberSpan.children as unknown as { data: string }[];
  const [groupNameText] = groupNameStrong.children as unknown as { data: string }[];
  const [topicTitle, topicDesc] = topicInfo.children as Element[];
  const topicTitleStr = (topicTitle.firstChild as unknown as { data: string }).data;
  const topicCoverImgSrc = topicCoverImg?.attribs.src;
  const groupLink = groupHd.attribs.href;
  const topicLink = topicMain.attribs.href;
  const groupName = groupNameText.data;
  const groupImgSrc = groupImg.attribs.src;
  const groupMember = groupMemberText.data;
  return (
    <Card style={{ margin: 8 }}>
      <CardHeader
        avatar={<Avatar src={groupImgSrc} />}
        title={topicTitleStr}
        titleTypographyProps={{
          variant: 'h6',
          component: 'a',
          href: topicLink,
          style: { textDecoration: 'none' },
        }}
        subheaderTypographyProps={{
          component: 'a',
          href: groupLink,
          style: { textDecoration: 'none' },
        }}
        style={{ paddingBottom: 0, paddingTop: 8 }}
        // eslint-disable-next-line no-irregular-whitespace
        subheader={`${groupName}　${groupMember}`}
      />
      <CardContent style={{ paddingBottom: 8 }}>
        <Stack direction="row">
          <Typography component="div" variant="body2">
            {domToReact(topicDesc.children)}
          </Typography>
          {topicCoverImgSrc && (
            <img src={topicCoverImgSrc} style={{ marginLeft: 20, maxHeight: 120, maxWidth: 120 }} />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TopicCard;
