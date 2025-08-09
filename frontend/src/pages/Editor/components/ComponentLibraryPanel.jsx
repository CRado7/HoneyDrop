// src/components/ComponentLibraryPanel.js
import React from 'react';
import { Accordion, Button, Spinner } from 'react-bootstrap';
import { useComponentLibrary } from '../../../hooks/useComponents';
import { useDrag } from 'react-dnd';


function DraggableComponent({ component, onAddComponent }) {
  const [, drag] = useDrag(() => ({
    type: 'component',
    item: {
      defaults: { ...component.defaults },  // wrap defaults here
      tag: component.tag,
      label: component.label,
      type: component.type,
      inspectorFields: component.inspectorFields,
    },
  }));

  return (
    <Button
      ref={drag}
      className="mb-2 w-100 text-start"
      variant="outline-primary"
      onClick={() => onAddComponent({
        ...component.defaults,
        tag: component.tag,
        label: component.label,
        type: component.type,
        inspectorFields: component.inspectorFields,
      })}
    >
      {component.label}
    </Button>
  );
}

export default function ComponentLibraryPanel({ onAddComponent }) {
  const { data, loading, error } = useComponentLibrary();

  if (loading) return <Spinner animation="border" />;
  if (error) return <p>Error loading components</p>;

  // 🧠 Group components by category
  const componentsByCategory = data.getComponentLibrary.reduce((acc, component) => {
    const { category } = component;
    if (!acc[category]) acc[category] = [];
    acc[category].push(component);
    return acc;
  }, {});

  return (
    <Accordion alwaysOpen>
      {Object.entries(componentsByCategory).map(([category, components], idx) => (
        <Accordion.Item eventKey={idx.toString()} key={category}>
          <Accordion.Header>{category}</Accordion.Header>
          <Accordion.Body>
            {components.map((component) => (
              <DraggableComponent
                key={component._id}
                component={component}
                onAddComponent={onAddComponent}
              />
            ))}
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
