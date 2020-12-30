import * as React from "react";
import * as ReactDOM from "react-dom";

import "./reset.css";
import "./previewPanel.css";

import RuleTree from "./components/ruleTree";
import RuleInspector from "./components/ruleInspector";
import VariablesInspector from "./components/variablesInspector";
import { Property, Rule } from "./model/papi";
import { DisplayMode } from "./model/displayMode";
import ActionBar from "./components/actionBar";
import ToggleDisplayMode from "./components/actions/toggleDisplayMode";

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
        <ActionBar>
          <ToggleDisplayMode displayMode={this.state.displayMode} onToggle={this.onToggleDisplayMode.bind(this)} />
        </ActionBar>
        <RuleTree rule={this.props.property.defaultRule} onFocus={this.onFocus.bind(this)} selectedRule={this.state.selectedRule} />
        <RuleInspector rule={this.state.selectedRule} displayMode={this.state.displayMode} />
        <VariablesInspector variables={this.props.property.variables} />
      </div>
    );
  }

  onToggleDisplayMode(displayMode: DisplayMode) {
    this.setState({displayMode});
  }

  onFocus(selectedRule: Rule) {
    this.setState({selectedRule});
  }
}

const vscode = window.acquireVsCodeApi();
const initialData = window.initialData;
const property = new Property(initialData);

ReactDOM.render(
  <PreviewPanel vscode={vscode} property={property} />,
  document.querySelector("body")
);