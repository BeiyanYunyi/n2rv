import React from 'react';
import { format } from 'date-fns';
import Topic from '../../src/types/Topic';

type TopicList = Pick<Topic, 'title' | 'topicID' | 'authorName' | 'authorID' | 'lastReplyTime' | 'reply' | 'isElite'>[];

const Page = ({ topicList }: { topicList: TopicList }) => {
  const topicsDOM = topicList.map((topic) => (
    <tr className="" key={topic.topicID}>
      <td className="title">
        {topic.isElite ? <span className="elite_topic_lable">精华</span> : <></>}
        <a href={`/topic/${topic.topicID}`}>{topic.title}</a>
      </td>
      <td>
        <a href={`https://www.douban.com/people/${topic.authorID}`}>{topic.authorName}</a>
      </td>
      <td className="r-count">{topic.reply}</td>
      <td className="time">{format(new Date((topic.lastReplyTime as number) * 1000), 'MM-dd HH:mm')}</td>
    </tr>
  ));
  return (
    <>
      <link rel="stylesheet" href="/assets/douban.css" />
      <link rel="stylesheet" href="/assets/init.css" />
      <link rel="stylesheet" href="/assets/inline1.css" />
      <link rel="stylesheet" href="/assets/inline2.css" />
      <div id="wrapper">
        <div className="article">
          <table className="olt">
            <tbody>
              <tr className="th">
                <td>讨论</td>
                <td>作者</td>
                <td className="r-count" nowrap="nowrap">回应</td>
                <td align="right" nowrap="nowrap">最后回应</td>
              </tr>
              {topicsDOM}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Page;
