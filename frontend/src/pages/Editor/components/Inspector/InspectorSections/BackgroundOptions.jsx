import React from 'react';
import { Form } from 'react-bootstrap';

export default function BackgroundOptions({ mergedStyles, updateStyle }) {
  const backgroundColor = /^#[0-9A-Fa-f]{6}$/.test(mergedStyles.backgroundColor)
    ? mergedStyles.backgroundColor
    : '#ffffff';

  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Background Color</Form.Label>
        <Form.Control
          type="color"
          value={backgroundColor}
          onChange={(e) => updateStyle('backgroundColor', e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Background Image URL</Form.Label>
        <Form.Control
          type="text"
          value={mergedStyles.backgroundImage || ''}
          onChange={(e) => updateStyle('backgroundImage', e.target.value)}
          placeholder="e.g. https://example.com/image.png"
        />
      </Form.Group>
    </>
  );
}
