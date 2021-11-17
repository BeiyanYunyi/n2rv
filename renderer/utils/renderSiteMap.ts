/* eslint-disable react/jsx-pascal-case */
import config from '../../config/config.json';
import Storage from '../../src/instances/Storage';

const renderSiteMap = async () => {
  const topics = await Storage.getAllTopics(0, 1000, false, false);
  const urlAry = [`https://${config.servAddr}:${config.listenPort}`].concat(
    topics.map((topic) => `https://${config.servAddr}:${config.listenPort}/topic/${topic.topicID}`),
  );
  return urlAry.join('\n');
};

export default renderSiteMap;
