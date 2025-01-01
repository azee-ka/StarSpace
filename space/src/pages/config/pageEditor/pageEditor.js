import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { renderDynamicComponent } from "../dynamicRenderer";
import './pageEditor.css';

const PageEditor = ({ layout, onUpdate }) => {
  const handleUpdateWidget = (updatedWidget, index) => {
    const updatedLayout = [...layout];
    updatedLayout[index] = updatedWidget;
    onUpdate(updatedLayout);
  };

  return (
    <div className="page-editor">
      {layout?.map((widget, index) => (
        <Rnd
          key={index}
          bounds="parent"
          position={widget.position}
          size={{ width: widget.props.style.width, height: widget.props.style.height }}
          onDragStop={(e, d) => handleUpdateWidget({ ...widget, position: { x: d.x, y: d.y } }, index)}
          onResizeStop={(e, dir, ref, delta, position) =>
            handleUpdateWidget(
              {
                ...widget,
                props: {
                  ...widget.props,
                  style: { ...widget.props.style, width: ref.style.width, height: ref.style.height },
                },
                position,
              },
              index
            )
          }
        >
          {renderDynamicComponent(widget)}
        </Rnd>
      ))}
    </div>
  );
};

export default PageEditor;
