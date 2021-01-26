import * as React from "react";
import Column from "./column";

import "./ruleTree.css";
import TreeView, { Node, RootNode } from "./treeView";
import Icon from "./icon";

interface RuleTreeProps {
  rootNode: RootNode;
  onFocus: Function;
  selectedNode: Node;
}

export default class RuleTree extends React.Component<RuleTreeProps> {
  expandAll = () => this.props.rootNode.expandAll();
  collapseAll = () => this.props.rootNode.collapseAll(node => node.depth > 0);
  onFocus = (node) => this.props.onFocus(node);

  componentDidMount() {
    this.props.rootNode.on(RootNode.EVENT_FOCUS_CHANGE, this.onFocus);
  }

  render() {
    const title = (
      <React.Fragment>
        <span>
          <Icon icon="list-tree" />
          &nbsp;
          Outline
        </span>
        <span className="toolbar" style={{textAlign: "right"}}>
          <Icon icon="expand-all" title="Expand all" onClick={this.expandAll} />
          <Icon icon="collapse-all" title="Collapse all" onClick={this.collapseAll} />
        </span>
      </React.Fragment>
    );
    return (
      <Column title={title} className="ruletree">
        <TreeView root={this.props.rootNode} />
      </Column>
    )
  }
}
