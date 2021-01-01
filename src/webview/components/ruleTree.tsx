import * as React from "react";
import Column from "./column";

import "./ruleTree.css";
import { DefaultRule, Rule, StandardRule } from "../model/papi";
import TreeView, { ChildNode, Node, RootNode } from "./treeView";
import Icon from "./icon";

interface RuleTreeProps {
  rule: DefaultRule;
  onFocus: Function;
  selectedRule: Rule;
}

interface RuleTreeState {
  rootNode: RootNode;
}

export default class RuleTree extends React.Component<RuleTreeProps, RuleTreeState> {
  expandAll = () => this.state.rootNode.expandAll();
  collapseAll = () => this.state.rootNode.collapseAll(node => node.depth > 0);
  onFocus = (node) => this.props.onFocus(node.data);

  constructor(props) {
    super(props);

    const rootNode = new RootNode(props.rule.name, props.rule);
    function build(parentNode: Node, children: Array<StandardRule>) {
      children.forEach((child: StandardRule) => {
        const childNode = new ChildNode(parentNode, child.name, child);
        parentNode.appendNode(childNode);
        build(childNode, child.children);
      });
      return parentNode;
    }
    build(rootNode, props.rule.children);
    if (this.props.rule.customOverride) {
      rootNode.appendNode(new ChildNode(
        rootNode,
        "Custom Override",
        this.props.rule.customOverride
      ));
    }
    if (this.props.rule.advancedOverride) {
      rootNode.appendNode(new ChildNode(
        rootNode,
        "Advanced Override",
        this.props.rule.advancedOverride
      ));
    }

    rootNode.isExpanded = true;

    rootNode.nodes.forEach(node => {
      if (node.data === this.props.selectedRule) {
        node.isFocused = true;
      }
    });

    this.state = { rootNode };
  }

  componentDidMount() {
    this.state.rootNode.on(RootNode.EVENT_FOCUS_CHANGE, this.onFocus);
  }

  render() {
    const title = (
      <React.Fragment>
        Outline
        <span className="toolbar" style={{textAlign: "right"}}>
          <Icon icon="expand-all" onClick={this.expandAll} />
          <Icon icon="collapse-all" onClick={this.collapseAll} />
        </span>
      </React.Fragment>
    );
    return (
      <Column title={title} className="ruletree">
        <TreeView root={this.state.rootNode} />
      </Column>
    )
  }
}
