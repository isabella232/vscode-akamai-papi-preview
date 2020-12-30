import * as React from "react";
import classnames from "classnames";

import "./column.css";

interface ColumnProps {
  className: string | string[];
  title: string;
  children: any;
}

export default class Column extends React.Component<ColumnProps> {
  render() {
    return (
      <div className={classnames("column", this.props.className)}>
        <h1>{this.props.title}</h1>
        <div className="column-scroll">
          {this.props.children}
        </div>
      </div>
    );
  }
}