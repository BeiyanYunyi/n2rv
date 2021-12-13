const contentParser = (originDomStr: string) => {
  const domParser = new DOMParser();
  const parsingDocument = domParser.parseFromString(originDomStr, 'text/html');
  const topicImgs = parsingDocument.querySelectorAll('div.image-wrapper');
  console.log(topicImgs);
};

export default contentParser;
