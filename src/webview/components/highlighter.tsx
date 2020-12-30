//@ts-ignore
import * as React from "react";

import * as hljs from "highlightjs";
import "highlightjs/styles/monokai.css";
import "./highlighter.css";

interface HighlighterProps {
  language: string;
  code: string;
}

export default function Highlighter(props: HighlighterProps) {
  const innerHTML = {
    __html: hljs.highlight(props.language, props.code, true).value
  };
  return (
    <div className="hljs" dangerouslySetInnerHTML={innerHTML}></div>
  );
}
