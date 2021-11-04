import React from 'react';

const UserFace = ({ authorID }: { authorID: string }) => (
  <div className="user-face">
    <a className="" href={`https://www.douban.com/people/${authorID}`}>
      <svg className="pil" width="100%" height="100%" data-jdenticon-value={authorID} />
    </a>
  </div>
);

export default UserFace;
