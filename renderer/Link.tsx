/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/require-default-props */
import React from 'react';
import { usePageContext } from './usePageContext';

function Link(props: { href?: string; className?: string; children: React.ReactNode }) {
  const pageContext = usePageContext();
  const className = [props.className, pageContext.urlPathname === props.href && 'is-active'].filter(Boolean).join(' ');
  return <a {...props} className={className} />;
}

export default Link;
