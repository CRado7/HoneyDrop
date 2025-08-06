// src/components/Inspector.js
import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

// Helper to safely access nested properties like "styles.fontSize"
function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

// Helper to update nested property values immutably
function updateNestedValue(obj, path, value) {
  const parts = path.split('.');
  const last = parts.pop();
  const newObj = { ...obj };
  let current = newObj;

  for (const part of parts) {
    current[part] = { ...current[part] };
    current = current[part];
  }

  current[last] = value;
  return newObj;
}

export default function Inspector({ component, onUpdate }) {
  if (!component) {
    return <p>Select an element to edit its content</p>;
  }

  const fields = component.inspectorFields || [];

  return (
    <div>
      <h5>Inspector</h5>
      <p>Editing: <strong>{component.label || component.type}</strong></p>

      {fields.map(({ key, label, type, options, config }) => {
        const currentValue = getNestedValue(component.defaults, key) ?? '';

        switch (type) {
          case 'text':
            return (
              <Form.Group key={key} className="mb-3">
                <Form.Label>{label}</Form.Label>
                <Form.Control
                  type="text"
                  value={currentValue}
                  onChange={e => {
                    const updated = updateNestedValue(component.defaults, key, e.target.value);
                    onUpdate('defaults', updated);
                  }}
                />
              </Form.Group>
            );

          case 'textarea':
            return (
              <Form.Group key={key} className="mb-3">
                <Form.Label>{label}</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={currentValue}
                  onChange={e => {
                    const updated = updateNestedValue(component.defaults, key, e.target.value);
                    onUpdate('defaults', updated);
                  }}
                />
              </Form.Group>
            );

          case 'select':
            return (
              <Form.Group key={key} className="mb-3">
                <Form.Label>{label}</Form.Label>
                <Form.Select
                  value={currentValue}
                  onChange={e => {
                    const updated = updateNestedValue(component.defaults, key, e.target.value);
                    onUpdate('defaults', updated);
                  }}
                >
                  {options?.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            );

          case 'color':
            return (
              <Form.Group key={key} className="mb-3">
                <Form.Label>{label}</Form.Label>
                <Form.Control
                  type="color"
                  value={/^#[0-9A-Fa-f]{6}$/.test(currentValue) ? currentValue : '#000000'}
                  onChange={e => {
                    const updated = updateNestedValue(component.defaults, key, e.target.value);
                    onUpdate('defaults', updated);
                  }}
                />
              </Form.Group>
            );

          case 'slider':
            const {
              min = 0,
              max = 100,
              step = 1,
              units = ['px'],
              defaultUnit = 'px',
            } = config || {};

            // Split value into number and unit (e.g., "24px")
            const match = /^(\d+(?:\.\d+)?)(\D+)?$/.exec(currentValue);
            const valueNum = match ? parseFloat(match[1]) : 0;
            const currentUnit = match?.[2] ?? defaultUnit;

            return (
              <Form.Group key={key} className="mb-3">
                <Form.Label>{label}: {valueNum}{currentUnit}</Form.Label>
                <Row>
                  <Col xs={9}>
                    <Form.Range
                      min={min}
                      max={max}
                      step={step}
                      value={valueNum}
                      onChange={e => {
                        const updated = updateNestedValue(
                          component.defaults,
                          key,
                          `${e.target.value}${currentUnit}`
                        );
                        onUpdate('defaults', updated);
                      }}
                    />
                  </Col>
                  <Col xs={3}>
                    {units.length > 1 && (
                      <Form.Select
                        size="sm"
                        value={currentUnit}
                        onChange={e => {
                          const updated = updateNestedValue(
                            component.defaults,
                            key,
                            `${valueNum}${e.target.value}`
                          );
                          onUpdate('defaults', updated);
                        }}
                      >
                        {units.map(u => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </Form.Select>
                    )}
                  </Col>
                </Row>
              </Form.Group>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
