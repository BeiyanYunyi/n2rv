/* eslint-disable import/prefer-default-export */
import { PageContextBuiltIn } from 'vite-plugin-ssr';
import Storage from '../../src/instances/Storage';
import Topic from '../../src/types/Topic';

const onBeforeRender = async (pageContext: PageContextBuiltIn) => {
  const topic = (await Storage.getTopic(pageContext.routeParams.topicID)) as Topic;
  const comments = await Storage.getComments(pageContext.routeParams.topicID);
  const documentProps = {
    // This title and description will override the defaults
    title: topic.title,
    description: 'Our mission is to explore the galaxy.',
  };
  return {
    pageContext: {
      documentProps,
      pageProps: { topic, comments },
    },
  };
};

const prerender = async () => {
  const topicList = await Storage.getAllTopics(0, 100);
  const urls = topicList.map((topic) => `/topic/${topic.topicID}`);
  return urls;
};

export { onBeforeRender, prerender };
