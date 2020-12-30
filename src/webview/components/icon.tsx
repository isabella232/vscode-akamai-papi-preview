import "vscode-codicons/dist/codicon.css";

import * as React from "react";
import classnames from "classnames";

export default function Icon(props: {icon: string, className?: any} & any) {
  let {
    className,
    icon,
    children,
    ...extraProps
  } = props;
  className = classnames("codicon", `codicon-${props.icon}`, props.className);
  return <div {...extraProps} className={className}></div>;
}
