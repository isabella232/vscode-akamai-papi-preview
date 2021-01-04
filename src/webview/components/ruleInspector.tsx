import * as React from "react";
import * as YAML from "js-yaml";
import { AdvancedOverrideRule, ChildRule, CustomOverrideRule, Rule, StandardRule } from "../model/papi";
import Column from "./column";
import Highlighter from "./highlighter";

import "./ruleInspector.css";
import { DisplayMode } from "../model/displayMode";
import ToggleDisplayMode from "./actions/toggleDisplayMode";

interface RuleInspectorProps {
  rule: Rule;
  displayMode: DisplayMode;
  onToggleDisplayMode: (displayMode: DisplayMode) => void;
}

export default class RuleInspector extends React.Component<RuleInspectorProps, {asJSON: boolean}> {
  constructor(props) {
    super(props);
  }

  render() {
    const title = (
      <React.Fragment>
        <span>
          {this.props.rule.name}
        </span>
        <span className="toolbar" style={{textAlign: "right"}}>
          <ToggleDisplayMode displayMode={this.props.displayMode} onToggle={this.props.onToggleDisplayMode} />
        </span>
      </React.Fragment>
    );



    return (
      <Column title={title} className="ruleinspector">
        <p>{this.props.rule.breadcrumb}</p>
        <hr />
        {this.renderRule(this.props.rule)}
      </Column>
    );
  }

  renderRule(rule: Rule) {
    if (rule instanceof StandardRule) {
      return (
        this.props.displayMode == DisplayMode.JSON
          ? <RuleInspectorJSONView {...this.props} />
          : <StandardRuleHumanReadableInspector {...this.props} rule={rule} />
      );
    } else if (rule instanceof CustomOverrideRule) {
      return (
        this.props.displayMode == DisplayMode.JSON
          ? <RuleInspectorJSONView {...this.props} />
          : <CustomOverrideHumanReadableInspector {...this.props} rule={rule} />
      );
    } else if (rule instanceof AdvancedOverrideRule) {
      return <Highlighter language="XML" code={rule.advancedOverride} />;
    }
    return null;
  }
}

interface StandardRuleHumanReadableInspectorProps {
  rule: StandardRule;
}

class StandardRuleHumanReadableInspector extends React.Component<StandardRuleHumanReadableInspectorProps> {
  render() {
    return (
      <React.Fragment>
        {this.props.rule.comments
          ? (
              <React.Fragment>
                <h2>Comments</h2>
                <blockquote className="ruleinspector-comments"><pre>{this.props.rule.comments}</pre></blockquote>
              </React.Fragment>
            )
          : null
        }
        {
          this.props.rule instanceof ChildRule && this.props.rule.criteria.length
            ? (
                <React.Fragment>
                  <h2>Criteria (match {this.props.rule.criteriaMustSatisfy})</h2>
                  <CriteriaInspector criteria={this.props.rule.criteria} />
                </React.Fragment>
              )
            : null
        }
        {
          this.props.rule.behaviors && this.props.rule.behaviors.length
            ? (
                <React.Fragment>
                  <h2>Behaviors</h2>
                  <BehaviorsInspector behaviors={this.props.rule.behaviors} />
                </React.Fragment>
              )
            : null
        }
      </React.Fragment>
    );
  }
}

interface CustomOverrideHumanReadableInspectorProps {
  rule: CustomOverrideRule;
}

class CustomOverrideHumanReadableInspector extends React.Component<CustomOverrideHumanReadableInspectorProps> {
  render() {
    return (
      <Highlighter language="YAML" code={YAML.safeDump(this.props.rule.customOverride)} />
    );
  }
}

class RuleInspectorJSONView extends React.Component<RuleInspectorProps> {
  render() {
    return <Highlighter language="JSON" code={JSON.stringify(this.props.rule, null, "  ")} />
  }
}

class CriteriaInspector extends React.Component<{ criteria: any[]}> {
  render() {
    return (
      <div className="criteriainspector">
        {this.props.criteria.map(criterion => (
          <AtomInspector key={criterion.pointer} atom={criterion} />
        ))}
      </div>
    );
  }
}

class BehaviorsInspector extends React.Component<{ behaviors: any[]}> {
  render() {
    return (
      <div className="behaviorsinspector">
        {this.props.behaviors.map(behavior => (
          <AtomInspector key={behavior.pointer} atom={behavior} />
        ))}
      </div>
    );
  }
}

class AtomInspector extends React.Component<{ atom: {name: string, options: any} }> {
  render() {
    return (
      <div className="atominspector">
        <h3 className="atominspector-name">{this.props.atom.name}</h3>
        {this.renderOptions()}
      </div>
    );
  }

  renderOptions() {
    switch (this.props.atom.name) {
      case "advanced":
        const {description, xml} = this.props.atom.options;
        return (
          <div className="hljs">
            <span className="hljs-attr">description:</span> <span className="hljs-string">{description}</span>{"\n"}
            <span className="hljs-attr">xml:</span> <Highlighter language="XML" code={xml} />{"\n"}
          </div>
        );
      default:
        return (
          <Highlighter language="YAML" code={YAML.safeDump(this.props.atom.options)} />
        );
    }
  }
}

// class OptionValueInspector extends  React.Component<{ name: string, value: any }> {
//   render() {
//     const {name, value} = this.props;
//     name;
//     if (value instanceof Array) {
//       return (
//         <React.Fragment>
//           {value.map(item => <span style={{marginRight: "0.5em"}}><OptionValueInspector name="item" value={item} /></span>)}
//         </React.Fragment>
//       )
//     } else if (typeof value == "object" && value !== null) {
//       return (
//         <React.Fragment>
//           {Object.entries(value).map(([k, v]) => <span style={{marginRight: "0.5em"}}>{String(k)}: <OptionValueInspector name={k} value={v} /></span>)}
//         </React.Fragment>
//       )
//     } else if (name == "xml") {
//       return <XMLView xml={value} />;
//     }
//     return String(value);
//   }
// }

// class XMLView extends React.Component<{xml: string}> {
//   render() {
//     return <Highlighter language="XML" code={this.props.xml} />;
//   }
// }
