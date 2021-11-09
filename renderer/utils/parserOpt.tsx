import { Element, HTMLReactParserOptions } from 'html-react-parser';
import React from 'react';
import SubjectCard from '../../pages/topic/components/SubjectCard';
import TopicCard from '../../pages/topic/components/TopicCard';
import ImgView from '../components/ImgView';

const parserOpt: HTMLReactParserOptions = {
  // eslint-disable-next-line consistent-return
  replace: (domNode) => {
    if (domNode instanceof Element) {
      if (domNode.attribs && domNode.name === 'img') {
        return <ImgView src={domNode.attribs.src} />;
      }
      if (domNode.attribs && domNode.attribs.class === 'topic-card ') {
        return <TopicCard domNode={domNode} />;
      }
      if (domNode.attribs && domNode.attribs.class === 'subject-container') {
        return <SubjectCard domNode={domNode} />;
      }
    }
  },
};

export default parserOpt;
