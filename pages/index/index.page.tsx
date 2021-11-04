import { format } from 'date-fns';
import React from 'react';
import '../../assets/douban.css';
import '../../assets/init.css';
import '../../assets/inline1.css';
import '../../assets/inline2.css';
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
      <td className="r-count" style={{ whiteSpace: 'nowrap' }}>
        {topic.reply}
      </td>
      <td className="time" style={{ whiteSpace: 'nowrap' }}>
        {format(new Date((topic.lastReplyTime as number) * 1000), 'MM-dd HH:mm')}
      </td>
    </tr>
  ));
  return (
    <>
      <div id="wrapper">
        <div className="article">
          <table className="olt">
            <tbody>
              <tr className="th">
                <td>讨论</td>
                <td>作者</td>
                <td className="r-count" style={{ whiteSpace: 'nowrap' }}>
                  回应
                </td>
                <td align="right" style={{ whiteSpace: 'nowrap' }}>
                  最后回应
                </td>
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
