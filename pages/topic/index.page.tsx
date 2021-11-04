import React from 'react';
import { format } from 'date-fns';
import parse from 'html-react-parser';
import UserFace from './UserFace';
import Topic from '../../src/types/Topic';
import Reply from '../../src/types/Reply';
import Comments from './Comments';

const Page = ({ topic, comments }: { topic: Topic; comments: Reply[] }) => (
  <>
    <script src="/assets/jdenticon.min.js" />
    <link rel="stylesheet" href="/assets/douban.css" />
    <link rel="stylesheet" href="/assets/init.css" />
    <link rel="stylesheet" href="/assets/inline1.css" />
    <link rel="stylesheet" href="/assets/inline2.css" />
    <div>
      <a href="../../">返回</a>&emsp;
      {topic.deleteTime ? (
        <>
          <a href={`https://www.douban.com/group/topic/${topic.topicID}`}>
            <del>原帖</del>
          </a>
          <span>在{format(Math.abs(topic.deleteTime) * 1000, 'yyyy-MM-dd HH:mm:ss')}前已被删除</span>
        </>
      ) : (
        <a href={`https://www.douban.com/group/topic/${topic.topicID}`}>原帖</a>
      )}
    </div>
    <div id="wrapper">
      <div id="content">
        <div className="grid-16-8 clearfix" style={{ position: 'relative' }}>
          <div className="article">
            <h1>{topic?.title}</h1>
            <div id="topic-content" className="topic-content clearfix">
              <UserFace authorID={topic.authorID} />
              <div className="topic-doc">
                <h3>
                  <span className="from">
                    来自：<a href={`https://www.douban.com/people/${topic?.authorID}`}>{topic?.authorName}</a>
                  </span>
                  {'                '}
                  <span className="create-time color-green" style={{ display: 'inline-block' }}>
                    {format(topic?.createTime! * 1000, 'yyyy-MM-dd HH:mm:ss')}
                  </span>
                </h3>
                <div className="topic-content">
                  {topic?.content && parse(topic.content.replaceAll('https://img', '/cors/https://img'))}
                </div>
              </div>
            </div>
            <Comments replies={comments} />
          </div>
        </div>
      </div>
    </div>
  </>
);

export default Page;
