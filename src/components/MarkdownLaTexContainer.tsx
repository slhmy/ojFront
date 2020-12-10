import React from 'react';
import './ExploreContainer.css';

interface ContainerProps {
  raw: string;
}

const MarkdownLaTexContainer: React.FC<ContainerProps> = ({ raw }) => {
  var md = require('markdown-it')(),
    mk = require('@iktakahiro/markdown-it-katex');
  md.use(mk);
  var result: string = md.render(raw);
  //console.log(result);
  return (
    <div>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.11.1/katex.min.css"></link>
      <div dangerouslySetInnerHTML={{__html:result}}/>
    </div>
  );
};

export default MarkdownLaTexContainer;
