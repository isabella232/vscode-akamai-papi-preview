//@ts-ignore
import * as React from "react";
import { DisplayMode } from "../../model/displayMode";
import Icon from "../icon";

interface ToggleDisplayModeProps {
  displayMode: DisplayMode;
  onToggle: (displayMode: DisplayMode) => void;
}

export default class ToggleDisplayMode extends React.Component<ToggleDisplayModeProps & any> {
  render() {
    let nextDisplayMode: DisplayMode,
      icon: string,
      label: string;
    switch (this.props.displayMode) {
      case DisplayMode.HUMAN:
        nextDisplayMode = DisplayMode.JSON;
        icon = "json";
        label = "Show as JSON";
        break;
      case DisplayMode.JSON:
        nextDisplayMode = DisplayMode.HUMAN;
        icon = "list-flat";
        label = "Human Readable";
        break;
    }
    return (
      <button className="actionbutton toggledisplaymode" onClick={() => this.props.onToggle(nextDisplayMode)}>
        <Icon icon={icon} />
        {label}
      </button>
    );
  }
}