import React from "react";
import ReactDOM from "react-dom";

import Link from "next/link";

const ThemeLink = ({ bucket, collection, record, item, focus = false }) => (
  <Link
    href={`/bucket/[bucket]/collection/[collection]/record/[record]`}
    as={`/bucket/${bucket}/collection/${collection}/record/${item.id}`}
    passHref
    ref={node => {
      // hack
      if (focus) {
        const me = ReactDOM.findDOMNode(node);
        if (me) {
          setTimeout(() => {
            me.parentNode.parentNode.scrollTop =
              me.parentNode.offsetTop -
              me.parentNode.offsetHeight -
              me.offsetHeight -
              50;
          });
        }
      }
    }}
  >
    <a style={{ color: item.id === record ? "white" : "auto" }}>
      {item.title || "-----"}
    </a>
  </Link>
);

export default ThemeLink;
