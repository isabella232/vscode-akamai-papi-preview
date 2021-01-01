import * as React from "react";
import Icon from "./icon";

interface ToggleButtonProps {
  value: boolean;
  onIcon: string;
  offIcon: string;
  onToggle: () => void;
}

export default function ToggleButton(props: ToggleButtonProps & any) {
  let {
    value,
    onIcon,
    offIcon,
    ...extraProps
  } = props;
  return <Icon className="togglebutton" icon={props.value ? onIcon : offIcon} onClick={props.onToggle} {...extraProps} />
}
