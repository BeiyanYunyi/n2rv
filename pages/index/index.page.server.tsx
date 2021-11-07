/* eslint-disable import/prefer-default-export */

export const onBeforeRender = async () => {
  const documentProps = {
    // This title and description will override the defaults
    title: '影之避难所',
    description: 'Our mission is to explore the galaxy.',
  };
  return {
    pageContext: { documentProps },
  };
};
