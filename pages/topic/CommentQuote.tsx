/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import Reply from '../../src/types/Reply';

const CommentQuote = ({ reply }: { reply: Reply }) => (
  <div className="reply-quote">
    <div className="reply-quote-content">
      <span className="all" style={{ display: 'inline' }}>
        {reply.quotingImage ? (
          <div className="quote-img">
            <div className="comment-photos">
              <div className="cmt-img-wrapper">
                <div className="cmt-img cmt-img-large">
                  <img data-orig={reply.quotingImage} src={`/cors/${reply.quotingImage}`} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          reply.quotingText
        )}
      </span>
      <span className="pubdate">
        <a href={`https://www.douban.com/people/${reply.quotingAuthorID}`}>{reply.quotingAuthorName}</a>
      </span>
    </div>
  </div>
);

export default CommentQuote;
