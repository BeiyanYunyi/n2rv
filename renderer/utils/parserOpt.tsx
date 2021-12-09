import parse, { Element, HTMLReactParserOptions, domToReact } from 'html-react-parser';
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
      if (domNode.attribs && domNode.attribs.class?.startsWith('topic-card')) {
        return <TopicCard domNode={domNode} />;
      }
      if (domNode.attribs && domNode.attribs.class === 'subject-container') {
        return <SubjectCard domNode={domNode} />;
      }
      if (domNode.attribs && domNode.attribs.class === 'language-math' && domNode.name === 'div') {
        return (
          <div className="language-math">
            {parse(
              (window as any).katex.renderToString(domToReact(domNode.children), {
                displayMode: true,
              }),
            )}
          </div>
        );
      }
      if (domNode.attribs && domNode.attribs.class === 'language-math' && domNode.name === 'span') {
        return (
          <span className="language-math">
            {parse((window as any).katex.renderToString(domToReact(domNode.children)))}
          </span>
        );
      }
    }
  },
};

export default parserOpt;
