import * as React from "react";
import * as YAML from "js-yaml";
import { Variable } from "../model/papi";
import Column from "./column";
import Highlighter from "./highlighter";

import "./variablesInspector.css";

export default class VariablesInspector extends React.Component<{variables: Variable[]}> {
  render() {
    return (
      <Column title="Variables" className="variablesinspector">
        <Highlighter language="YAML" code={YAML.safeDump(this.props.variables)} />
      </Column>
    );
  }
}
