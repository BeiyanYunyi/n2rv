import React from 'react';
import Jdenticon from 'react-jdenticon';

const UserFace = ({ authorID }: { authorID: string }) => (
  <div className="user-face">
    <a className="" href={`https://www.douban.com/people/${authorID}`}>
      <Jdenticon className="pil" size="48" value={authorID} />
    </a>
  </div>
);

export default UserFace;
