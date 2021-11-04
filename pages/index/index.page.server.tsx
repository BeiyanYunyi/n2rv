import Storage from '../../src/instances/Storage';
import Topic from '../../src/types/Topic';

/* eslint-disable import/prefer-default-export */
type TopicList = Pick<Topic, 'title' | 'topicID' | 'authorName' | 'authorID' | 'lastReplyTime' | 'reply' | 'isElite'>[];

export const onBeforeRender = async () => {
  const topicList: TopicList = await Storage.getAllTopics();
  const documentProps = {
    // This title and description will override the defaults
    title: '影之避难所',
    description: 'Our mission is to explore the galaxy.',
  };
  return {
    pageContext: {
      documentProps,
      pageProps: { topicList },
    },
  };
};
