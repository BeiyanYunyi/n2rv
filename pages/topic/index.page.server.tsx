/* eslint-disable import/prefer-default-export */
import Storage from '../../src/instances/Storage';
import Topic from '../../src/types/Topic';

export const onBeforeRender = async (pageContext: any) => {
  const topic = (await Storage.getTopic(pageContext.routeParams.topicID)) as Topic;
  const comments = await Storage.getComments(pageContext.routeParams.topicID);
  const documentProps = {
    // This title and description will override the defaults
    title: '影之避难所',
    description: 'Our mission is to explore the galaxy.',
  };
  return {
    pageContext: {
      documentProps,
      pageProps: { topic, comments },
    },
  };
};
