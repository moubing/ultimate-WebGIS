"use client";

import { memo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { ghcolors } from "react-syntax-highlighter/dist/esm/styles/prism";

const Highlighter = memo(function Highlighter({ data }: { data: object }) {
  return (
    <SyntaxHighlighter
      language="json"
      style={ghcolors}
      showLineNumbers
      lineNumberStyle={{
        minWidth: "2.5em", // 行号容器宽度
        paddingRight: "1em", // 行号右间距
        marginLeft: "-0.5em", // 负边距抵消容器padding
        color: "#666" // 行号颜色
      }}
      customStyle={{
        background: "transparent",
        border: 0,
        margin: 0,
        padding: 0
      }}
    >
      {JSON.stringify(data, null, 2)}
    </SyntaxHighlighter>
  );
});

export default Highlighter;
