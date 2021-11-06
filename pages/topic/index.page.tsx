import { format } from 'date-fns';
import parse from 'html-react-parser';
import React from 'react';
import '../../assets/douban.css';
import '../../assets/init.css';
import '../../assets/inline1.css';
import '../../assets/inline2.css';
import Reply from '../../src/types/Reply';
import Topic from '../../src/types/Topic';
import Comments from './Comments';
import UserFace from './UserFace';

const Page = ({ topic, comments }: { topic: Topic; comments: Reply[] }) => (
  <>
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
              <div style={{}}>
                <UserFace authorID={topic.authorID} />
              </div>
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
                  {topic?.content &&
                    parse(topic.content.replaceAll('https://img', '/cors/https://img').replaceAll('.webp', '.jpg'))}
                </div>
              </div>
            </div>
            <Comments replies={comments} />
          </div>
        </div>
      </div>
      <div id="walineWrapper" />
    </div>
  </>
);

export default Page;
