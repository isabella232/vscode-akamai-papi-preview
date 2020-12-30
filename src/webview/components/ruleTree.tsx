import * as React from "react";
import classnames from "classnames";
import Column from "./column";

import "./ruleTree.css";
import { DefaultRule, Rule, StandardRule } from "../model/papi";
import Icon from "./icon";

function ToggleOpen(props: {isOpen: boolean, toggleOpen: () => void} & any) {
  let {
    isOpen,
    toggleOpen,
    ...extraProps
  } = props;
  return <Icon className="toggleopen" icon={props.isOpen ? "chevron-down" : "chevron-right"} onClick={props.toggleOpen} {...extraProps} />
}

interface RuleTreeProps {
  rule: DefaultRule;
  onFocus: Function;
  selectedRule: Rule;
}

export default class RuleTree extends React.Component<RuleTreeProps> {
  render() {
    return (
      <Column title="Outline" className="ruletree">
        <StandardRuleTreeNode rule={this.props.rule} onFocus={this.props.onFocus} selectedRule={this.props.selectedRule} defaultIsOpen={true} />
        {
          this.props.rule.customOverride
            ? <AdvancedRuleNode rule={this.props.rule.customOverride} selectedRule={this.props.selectedRule} onFocus={this.props.onFocus} />
            : null
        }
        {
          this.props.rule.advancedOverride
            ? <AdvancedRuleNode rule={this.props.rule.advancedOverride} selectedRule={this.props.selectedRule} onFocus={this.props.onFocus} />
            : null
        }
      </Column>
    )
  }
}

interface StandardRuleTreeNodeProps {
  rule: StandardRule;
  defaultIsOpen: boolean;
  onFocus: Function;
  selectedRule: Rule;
}

interface RuleTreeNodeState {
  isOpen: boolean;
}

class StandardRuleTreeNode extends React.Component<StandardRuleTreeNodeProps, RuleTreeNodeState> {
  constructor(props) {
    super(props);
    this.state = {isOpen: props.defaultIsOpen};
  }

  render() {
    const classes = classnames("ruletree-node", {
      selected: this.props.rule == this.props.selectedRule,
      root: this.props.rule instanceof DefaultRule
    });
    return (
      <div className={classes}>
        <header>
          <ToggleOpen
            isOpen={this.state.isOpen}
            toggleOpen={() => this.setState({isOpen: !this.state.isOpen})}
            style={{visibility: (this.props.rule.children.length > 0 ? "visible" : "hidden")}}
          />
          <h2 onClick={() => this.props.onFocus(this.props.rule)}>
            {this.props.rule.name}
          </h2>
        </header>
        {this.props.rule.children.length > 0 && this.state.isOpen
          ? this.props.rule.children.map(childRule => (
              <StandardRuleTreeNode key={childRule.pointer}
                rule={childRule}
                onFocus={this.props.onFocus}
                selectedRule={this.props.selectedRule}
                defaultIsOpen={false}
              />
            ))
          : null
        }
      </div>
    );
  }
}

interface AdvancedRuleNodeProps {
  rule: Rule;
  onFocus: Function;
  selectedRule: Rule;
}

class AdvancedRuleNode extends React.Component<AdvancedRuleNodeProps> {
  render() {
    const classes = classnames("ruletree-node", {
      selected: this.props.rule == this.props.selectedRule
    });
    return (
      <div className={classes}>
        <header>
          <ToggleOpen
            isOpen={false}
            toggleOpen={() => null}
            style={{visibility: "hidden"}}
          />
          <h2 onClick={() => this.props.onFocus(this.props.rule)}>
            {this.props.rule.name}
          </h2>
        </header>
      </div>
    );
  }
}

