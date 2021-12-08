/* eslint-disable react/jsx-pascal-case */
import config from '../../config/config.json';
import Storage from '../../server/storageProviders/Storage';

const renderSiteMap = async () => {
  const topics = await Storage.getAllTopics({
    skip: 0,
    limit: 1000,
    needDeleted: false,
    needElite: false,
    needOriginal: false,
  });
  const urlAry = [
    `https://${config.httpsServerConfig.servAddr}:${config.httpsServerConfig.listenPort}`,
  ].concat(
    topics.map(
      (topic) =>
        `https://${config.httpsServerConfig.servAddr}:${config.httpsServerConfig.listenPort}/topic/${topic.topicID}`,
    ),
  );
  return urlAry.join('\n');
};

export default renderSiteMap;
