/* eslint-disable react/jsx-pascal-case */
import config from '../../config/config.json';
import Storage from '../../src/instances/Storage';

const renderSiteMap = async () => {
  const port = process.env.PORT || 3000;
  const topics = await Storage.getAllTopics(0, 1000, false, false);
  const urlAry = [`https://${config.address}:${port}`].concat(
    topics.map((topic) => `https://${config.address}:${port}/topic/${topic.topicID}`),
  );
  return urlAry.join('\n');
};

export default renderSiteMap;
