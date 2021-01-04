import * as React from "react";
import * as YAML from "js-yaml";
import { Variable } from "../model/papi";
import Column from "./column";
import Highlighter from "./highlighter";
import classnames from "classnames";

import "./variablesInspector.css";
import Icon from "./icon";

interface VariablesInspectorProps {
  variables: Variable[];
}
interface VariablesInspectorState {
  isOpen:  boolean;
}

export default class VariablesInspector extends React.Component<VariablesInspectorProps, VariablesInspectorState> {
  toggleOpen = () => this.setState({isOpen: !this.state.isOpen})

  constructor(props) {
    super(props);
    this.state = {
      isOpen: this.props.variables.length > 0
    };
  }

  render() {
    const title = this.state.isOpen
      ? (
          <React.Fragment>
            <span>
              <Icon icon="variable" />
              &nbsp;
              Variables
            </span>
            <span className="toolbar">
              <Icon icon="chevron-right" onClick={this.toggleOpen} title="Collapse variables panel" />
            </span>
          </React.Fragment>
        )
      : (
        <React.Fragment>
          <span className="toolbar">
            <Icon icon="variable" onClick={this.toggleOpen} title="Expand variables panel" />
          </span>
        </React.Fragment>
      );
    return (
      <Column title={title} className={classnames("variablesinspector", {open: this.state.isOpen})}>
        {this.state.isOpen
          ? <Highlighter language="YAML" code={YAML.safeDump(this.props.variables)} />
          : null
        }
        
      </Column>
    );
  }
}
