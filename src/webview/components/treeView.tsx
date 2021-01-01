import * as React from "react";
import * as events from "events";
import classnames from "classnames";

import ToggleButton from "./toggleButton";

import "./treeView.css";
import Icon from "./icon";

export abstract class Node extends events.EventEmitter {
  static get EVENT_EXPANDED_CHANGE(): string { return "expanded-change"; }
  static get EVENT_FOCUSED_CHANGE(): string { return "focused-change"; }

  readonly label: string;
  readonly data: any;
  readonly children: Array<Node> = [];

  private _isExpanded: boolean = false;
  private _isFocused: boolean = false;

  protected constructor(label: string, data: any) {
    super();
    this.label = label;
    this.data = data;
  }

  get isRoot(): boolean { return false; }

  appendNode(node: Node) {
    this.children.push(node);
  }

  get isLeaf(): boolean {
    return this.children.length === 0;
  }

  get isExpanded(): boolean {
    return this._isExpanded;
  }
  set isExpanded(v: boolean) {
    if (this._isExpanded !== v) {
      this._isExpanded = v;
      this.emit(Node.EVENT_EXPANDED_CHANGE, v);
    }
  }

  get isFocused(): boolean {
    return this._isFocused;
  }
  set isFocused(v: boolean) {
    if (this._isFocused !== v) {
      this._isFocused = v;
      this.emit(Node.EVENT_FOCUSED_CHANGE, v);
    }
  }

  abstract get root(): RootNode;
  abstract get depth(): number;
}

export class RootNode extends Node {
  static get EVENT_FOCUS_CHANGE(): string { return "focus-change"; }

  readonly nodes: Array<Node> = [];
  private _focusedNode: Node;

  constructor(label: string, data: any = null) {
    super(label, data);
    this._focusedNode = null;
    this.register(this);
  }

  get root(): RootNode {
    return this;
  }
  get depth(): number {
    return 0;
  }

  get isRoot(): boolean { return true; }

  get focusedNode(): Node {
    return this._focusedNode;
  }
  set focusedNode(node: Node) {
    if (this._focusedNode !== node) {
      this._focusedNode = node;
      this.emit(RootNode.EVENT_FOCUS_CHANGE, node);
    }
  }

  register(node: Node): void {
    this.nodes.push(node);
    node.on(Node.EVENT_FOCUSED_CHANGE, isFocused => {
      this.onFocusChange(node, isFocused);
    });
  }

  expandAll(pred = (node: Node) => true) {
    this.nodes.filter(pred).forEach(node => node.isExpanded = true);
  }

  collapseAll(pred = (node: Node) => true) {
    this.nodes.filter(pred).forEach(node => node.isExpanded = false);
  }

  private onFocusChange(node, isFocused) {
    if (isFocused) {
      if (this.focusedNode) {
        this.focusedNode.isFocused = false;
      }
      this.focusedNode = node;
    }
  }
}

export class ChildNode extends Node {
  readonly parent: Node;

  constructor(parent: Node, label: string, data: any = null) {
    super(label, data);
    this.parent = parent;
    this.root.register(this);
  }

  get root(): RootNode | null {
    return this.parent?.root;
  }
  get depth(): number {
    return this.parent.depth + 1;
  }
}

export class TreeViewProps {
  root: RootNode;
  className?: any;
}

export default class TreeView extends React.Component<TreeViewProps> {
  render() {
    return <NodeView className={classnames("treeview", this.props.className)} node={this.props.root} />;
  }
}

interface NodeViewProps {
  node: Node;
  className?: any;
}
interface NodeViewState {
  isExpanded: boolean;
  isFocused: boolean;
}

class NodeView extends React.Component<NodeViewProps, NodeViewState> {
  onExpandedChange = isExpanded => this.setState({isExpanded});
  onFocusedChange = isFocused => this.setState({isFocused});

  constructor(props) {
    super(props);
    this.state = {
      isExpanded: this.props.node.isExpanded,
      isFocused: this.props.node.isFocused,
    }
  }

  componentDidMount() {
    this.props.node.on(Node.EVENT_EXPANDED_CHANGE, this.onExpandedChange);
    this.props.node.on(Node.EVENT_FOCUSED_CHANGE, this.onFocusedChange);
  }

  componentWillUnmount() {
    this.props.node.off(Node.EVENT_EXPANDED_CHANGE, this.onExpandedChange)
    this.props.node.off(Node.EVENT_FOCUSED_CHANGE, this.onFocusedChange);
  }

  render() {
    const classes = classnames("treeview-node", {
      expanded: this.props.node.isExpanded,
      focused: this.props.node.isFocused,
      root: this.props.node.isRoot,
      leaf: this.props.node.isLeaf,
    }, this.props.className);
    return (
      <div className={classes}>
        {this.renderLabel()}
        {this.renderChildren()}
      </div>
    );
  }

  renderLabel() {
    return (
      <header className="treeview-header">
        {this.renderIcon()}
        <h2 className="treeview-label" onClick={() => this.props.node.isFocused = true}>
          {this.props.node.label}
        </h2>
      </header>
    );
  }

  renderIcon() {
    if (this.props.node.isRoot) {
      return <span />;
    } else if (this.props.node.isLeaf) {
      return <Icon icon="dash" />;
    } else {
      return (
        <ToggleButton
          value={this.props.node.isExpanded}
          onIcon="chevron-down"
          offIcon="chevron-right"
          onToggle={() => this.props.node.isExpanded = !this.props.node.isExpanded}
          className="treeview-expandbutton"
        />
      );
    }
  }

  renderChildren() {
    if (this.props.node.isLeaf || !this.props.node.isExpanded) {
      return null;
    }
    return this.props.node.children.map(node => {
      return <NodeView node={node} />;
    });
  }
}
