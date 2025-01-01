import React from "react";
import { componentLibrary } from "./componentLibrary";

export const renderDynamicComponent = (componentConfig) => {
  const { name, props } = componentConfig;
  const ComponentEntry = componentLibrary[name];
  if (!ComponentEntry) return <div>Unknown component: {name}</div>;

  const { Component, defaultProps } = ComponentEntry;
  return <Component {...{ ...defaultProps, ...props }} />;
};
