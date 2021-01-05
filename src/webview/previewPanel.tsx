import * as React from "react";
import * as ReactDOM from "react-dom";

import "./reset.css";
import "./previewPanel.css";

import RuleTree from "./components/ruleTree";
import RuleInspector from "./components/ruleInspector";
import VariablesInspector from "./components/variablesInspector";
import { Property, Rule } from "./model/papi";
import { DisplayMode } from "./model/displayMode";

declare global {
  interface Window {
    acquireVsCodeApi(): any;
    initialData: any;
  }
}

interface PreviewPanelProps {
  vscode: any;
  property: Property;
}

interface PreviewPanelState {
  selectedRule: any;
  displayMode: DisplayMode;
}

class PreviewPanel extends React.Component<PreviewPanelProps, PreviewPanelState> {
  constructor(props) {
    super(props);
    this.state = {
      selectedRule: this.props.property.defaultRule,
      displayMode: DisplayMode.HUMAN
    };
  }

  render() {
    return (
      <div className="previewpanel">
        <RuleTree rule={this.props.property.defaultRule} onFocus={this.onFocus} selectedRule={this.state.selectedRule} />
        <RuleInspector rule={this.state.selectedRule} displayMode={this.state.displayMode} onToggleDisplayMode={this.onToggleDisplayMode} />
        <VariablesInspector variables={this.props.property.variables} />
      </div>
    );
  }

  onToggleDisplayMode = (displayMode: DisplayMode) => {
    this.setState({displayMode});
  }

  onFocus = (selectedRule: Rule) => {
    this.setState({selectedRule});
  }
}

const vscode = window.acquireVsCodeApi();

try {
  const initialData = JSON.parse(unescape(window.initialData));
  const property = new Property(initialData);

  ReactDOM.render(
    <PreviewPanel vscode={vscode} property={property} />,
    document.querySelector("body")
  );
} catch (e) {
  console.log(window.initialData);
  // ReactDOM.render(
  //   <pre className="error" style={{whiteSpace: "pre"}}>
  //     {e.name}: {e.message}
  //   </pre>,
  //   document.querySelector("body")
  // );
}