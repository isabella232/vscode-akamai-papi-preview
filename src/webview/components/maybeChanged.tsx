import * as React from "react";
import classnames from "classnames";
import { MaybeChanged } from "../model/compare";

import "./maybeChanged.css";
import { Added, Removed, Replaced } from "../diff/types";

export function MaybeChangedInline<T>(props: {value: MaybeChanged<T>}) {
  const maybeChanged = props.value;
  if (maybeChanged instanceof Added || maybeChanged instanceof Removed) {
    return <span className={maybeChanged.constructor.name}>{maybeChanged.value}</span>;
  } else if (maybeChanged instanceof Replaced) {
    return (
      <span className={classnames(maybeChanged.constructor.name, "inline")}>
        <span className="left">{maybeChanged.left}</span>
        <span className="right">{maybeChanged.right}</span>
      </span>
    );
  } else {
    return <React.Fragment>{maybeChanged}</React.Fragment>;
  }
}

export function MaybeChangedBlock<T, P>(props: {value: MaybeChanged<T>, renderer}) {
  const maybeChanged = props.value;
  if (maybeChanged instanceof Added || maybeChanged instanceof Removed) {
    return <props.renderer className={maybeChanged.constructor.name} value={maybeChanged.value} />;
  } else if (maybeChanged instanceof Replaced) {
    return (
      <React.Fragment>
        <props.renderer className="Deleted" value={maybeChanged.left} />
        <props.renderer className="Added" value={maybeChanged.right} />
      </React.Fragment>
    );
  } else {
    return <props.renderer value={maybeChanged} />;
  }
}
