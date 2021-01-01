import * as React from "react";
import classnames from "classnames";

import "vscode-codicons/dist/codicon.css";
import "./icon.css";

export default function Icon(props: {icon: string, className?: any} & any) {
  let {
    className,
    icon,
    children,
    ...extraProps
  } = props;
  className = classnames("icon", "codicon", `codicon-${props.icon}`, {clickable: props.hasOwnProperty("onClick")}, props.className);
  return <div {...extraProps} className={className}></div>;
}
