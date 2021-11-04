/* eslint-disable jsx-a11y/alt-text */
import { randomUUID } from 'crypto';
import React from 'react';
import format from 'date-fns/format';
import Reply from '../../src/types/Reply';
import UserFace from './UserFace';
import CommentQuote from './CommentQuote';

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
      <p className="reply-content">{reply.content}</p>
    </div>
  </li>
);

const Comments = ({ replies }: { replies: Reply[] }) => (
  <ul id="comments" className="topic-reply">
    {replies.map((reply) => (
      <Comment reply={reply} key={randomUUID()} />
    ))}
  </ul>
);

export default Comments;
