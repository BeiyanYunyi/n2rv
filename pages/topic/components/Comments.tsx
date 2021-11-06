/* eslint-disable jsx-a11y/alt-text */
import format from 'date-fns/format';
import parse from 'html-react-parser';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import Reply from '../../../src/types/Reply';
import CommentQuote from './CommentQuote';
import UserFace from './UserFace';

const Comment = ({ reply }: { reply: Reply }) => (
  <li id={reply.replyID.toString()} className="clearfix comment-item reply-item">
    <UserFace authorID={reply.authorID} />
    <div className="reply-doc content" style={{ paddingLeft: 0 }}>
      <div className="bg-img-green">
        <h4>
          <a className="" href={`https://www.douban.com/people/${reply.authorID}`}>
            {reply.authorName}
          </a>
          {'              '}
          {reply.isPoster ? <span className="topic-author-icon">楼主</span> : <></>}
          <span className="pubtime">{format(reply.replyTime * 1000, 'yyyy-MM-dd HH:mm:ss')}</span>
        </h4>
      </div>
      {reply.quoting ? <CommentQuote reply={reply} /> : <></>}
      {reply.image ? (
        <div className="comment-photos" style={{}}>
          <div className="cmt-img-wrapper">
            <div className="cmt-img cmt-img-large">
              <img data-orig={reply.image} src={`/cors/${reply.image}`} />
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      <p className=" reply-content" style={{ fontSize: '14px', paddingBottom: '10px', whiteSpace: 'pre-line' }}>
        {parse(reply.content)}
      </p>
    </div>
  </li>
);

const Comments = ({ replies }: { replies: Reply[] }) => (
  <ul id="comments" className="topic-reply">
    {replies.map((reply) => (
      <Comment reply={reply} key={uuidv4()} />
    ))}
  </ul>
);

export default Comments;
