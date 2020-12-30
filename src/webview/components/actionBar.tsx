import * as React from "react";
import classnames from "classnames";

import "./actionBar.css";

export default class ActionBar extends React.Component<{className?: any}> {
  render() {
    return (
      <div className={classnames("actionbar", this.props.className)}>
        {this.props.children}
      </div>
    );
  }
}
