/* eslint-disable react/jsx-pascal-case */
import { format } from 'date-fns';
import React from 'react';
import renderXML, { XML } from 'react-xml-renderer';
import config from '../../config/config.json';
import Storage from '../../src/instances/Storage';

const Url = ({ url, lastmod }: { url: string; lastmod: string }) => (
  <XML.url>
    <XML.loc>{url}</XML.loc>
    <XML.lastmod>{lastmod}</XML.lastmod>
    <XML.changefreq>always</XML.changefreq>
  </XML.url>
);

const SiteMap = async () => {
  const port = process.env.PORT || 3000;
  const topics = await Storage.getAllTopics(0, 1000, false, false);
  return (
    <XML.urlset>
      <Url url={`https://${config.address}:${port}`} lastmod={format(new Date(), 'yyyy-MM-dd')} />
      {topics.map((topic) => (
        <Url
          key={topic.topicID}
          url={`https://${config.address}:${port}/topic/${topic.topicID}`}
          lastmod={format(Number(topic.lastReplyTime) * 1000, 'yyyy-MM-dd')}
        />
      ))}
    </XML.urlset>
  );
};

const renderSiteMap = async () => {
  const sitemap = await SiteMap();
  return renderXML(sitemap).replace(
    '<urlset>',
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  );
};

export default renderSiteMap;
