import { Element, HTMLReactParserOptions } from 'html-react-parser';
import ImgView from '../../pages/index/components/ImgView';
import SubjectCard from '../../pages/index/components/SubjectCard';
import TopicCard from '../../pages/index/components/TopicCard';

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
