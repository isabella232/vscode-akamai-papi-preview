import * as React from "react";
import * as ReactDOM from "react-dom";

import "./reset.css";
import "./previewPanel.css";

import {MaybeChanged, MaybeChangedArray} from "./model/compare";

import RuleTree from "./components/ruleTree";
import RuleInspector from "./components/ruleInspector";
// import VariablesInspector from "./components/variablesInspector";
import { DefaultRule, Entity, Property, Rule } from "./model/papi";
import { DisplayMode } from "./model/displayMode";
import { ChildNode, Node, RootNode } from "./components/treeView";
import { Added, Removed, Replaced } from "./diff/types";
import { diff } from "./diff";

declare global {
  interface Window {
    acquireVsCodeApi(): any;
    initialData: any;
  }
}


function buildTree(defaultRule: MaybeChanged<DefaultRule>): RootNode {
  function walk(parentNode: Node, children: MaybeChangedArray<Rule>) {
    if (children instanceof Added || children instanceof Removed) {
      children.value.forEach(child => {
        let childNode = new ChildNode(parentNode, child.displayName, children.constructor.name, child);
        parentNode.appendNode(childNode);
        walk(childNode, child.children);
      });
    } else if (children instanceof Replaced) {
      walk(parentNode, new Removed(children.left));
      walk(parentNode, new Added(children.right));
    } else if (Array.isArray(children)) {
      children.forEach(child => {
        if (child instanceof Added || child instanceof Removed) {
          let childNode = new ChildNode(parentNode, child.value.displayName, child.constructor.name, child.value);
          parentNode.appendNode(childNode);
          walk(childNode, child.value.children);
        } else if (child instanceof Replaced) {
          let leftChildNode = new ChildNode(parentNode, child.left.displayName, [child.constructor.name, "left"], child.left);
          parentNode.appendNode(leftChildNode);
          walk(leftChildNode, child.left.children);
          let rightChildNode = new ChildNode(parentNode, child.right.displayName, [child.constructor.name, "right"], child.right);
          parentNode.appendNode(rightChildNode);
          walk(rightChildNode, child.right.children);
        } else {
          let childNode = new ChildNode(parentNode, child.displayName, null, child);
          parentNode.appendNode(childNode);
          walk(childNode, child.children);
        }
      });
    }
  }

  function createEntityNode(rootNode: RootNode, entity: MaybeChanged<Entity>) {
    if (entity) {
      if (entity instanceof Added || entity instanceof Removed) {
        let node = new ChildNode(rootNode, entity.value.displayName, entity.constructor.name, entity.value);
        rootNode.appendNode(node);
      } else if (entity instanceof Replaced) {
        let leftNode = new ChildNode(rootNode, entity.left.displayName, [entity.constructor.name, "left"], entity.left);
        rootNode.appendNode(leftNode);
        let rightNode = new ChildNode(rootNode, entity.right.displayName, [entity.constructor.name, "right"], entity.right);
        rootNode.appendNode(rightNode);
      } else {
        let node = new ChildNode(rootNode, entity.displayName, entity.constructor.name, entity);
        rootNode.appendNode(node);
      }
    }
  }

  var rootNode: RootNode;
  if (defaultRule instanceof Added || defaultRule instanceof Removed) {
    rootNode = new RootNode(defaultRule.value.displayName, defaultRule.constructor.name);
    walk(rootNode, defaultRule.value.children);
    createEntityNode(rootNode, defaultRule.value.customOverride);
    createEntityNode(rootNode, defaultRule.value.advancedOverride);
  } else if (defaultRule instanceof Replaced) {
    throw new Error("panic: default rule should never be replaced");
  } else {
    rootNode = new RootNode(defaultRule.name, null, defaultRule);
    walk(rootNode, defaultRule.children);
    createEntityNode(rootNode, defaultRule.customOverride);
    createEntityNode(rootNode, defaultRule.advancedOverride);
  }

  return rootNode;
}

interface PreviewPanelProps {
  vscode: any;
  property: Property;
}

interface PreviewPanelState {
  rootNode: RootNode;
  selectedNode: Node;
  displayMode: DisplayMode;
}

class PreviewPanel extends React.Component<PreviewPanelProps, PreviewPanelState> {
  constructor(props) {
    super(props);

    const rootNode = buildTree(this.props.property.defaultRule);

    rootNode.isExpanded = true;
    rootNode.isFocused =  true;
  
    this.state = {
      rootNode,
      selectedNode: rootNode,
      displayMode: DisplayMode.HUMAN
    };
  }

  render() {
    return (
      <div className="previewpanel">
        <RuleTree rootNode={this.state.rootNode} onFocus={this.onFocus} selectedNode={this.state.selectedNode} />
        <RuleInspector node={this.state.selectedNode} displayMode={this.state.displayMode} onToggleDisplayMode={this.onToggleDisplayMode} />
        {/* <VariablesInspector variables={this.props.property.variables} /> */}
      </div>
    );
  }

  onToggleDisplayMode = (displayMode: DisplayMode) => {
    this.setState({displayMode});
  }

  onFocus = (selectedNode: Node) => {
    this.setState({selectedNode});
  }
}

const vscode = window.acquireVsCodeApi();

try {
  const initialData = JSON.parse(unescape(window.initialData));
  
  const result = diff(initialData.left, initialData.right);

  const property = new Property(result);

  ReactDOM.render(
    <PreviewPanel vscode={vscode} property={property} />,
    document.querySelector("body")
  );
} catch (e) {
  throw e;
  ReactDOM.render(
    <pre className="error" style={{whiteSpace: "pre"}}>
      {e.name}: {e.message}
    </pre>,
    document.querySelector("body")
  );
}

