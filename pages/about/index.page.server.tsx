/* eslint-disable import/prefer-default-export */

export const onBeforeRender = async () => {
  const documentProps = {
    // This title and description will override the defaults
    title: '影之避难所',
    description: '永不陷落的波派',
  };
  return {
    pageContext: { documentProps },
  };
};
