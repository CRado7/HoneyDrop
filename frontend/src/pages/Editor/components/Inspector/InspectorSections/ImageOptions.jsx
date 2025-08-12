import React from 'react';
import { Form } from 'react-bootstrap';

export default function ImageOptions({ component, updateStyle }) {
  const defaults = component.defaults || {};
  const src = defaults.src?.trim() || '';
  const tag = defaults.tag || component.type || '';

  const placeholderUrl = 'https://via.placeholder.com/600x400';
  const isPlaceholderOrEmpty = !src || src === '' || src === placeholderUrl;

  if (!((component.type === 'image' || tag === 'img') && isPlaceholderOrEmpty)) {
    return null;
  }

  const styles = defaults.styles || {};

  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Aspect Ratio</Form.Label>
        <Form.Select
          value={styles.aspectRatio || '16/9'}
          onChange={(e) => updateStyle('styles.aspectRatio', e.target.value)}
        >
          <option value="1/1">1 / 1</option>
          <option value="4/3">4 / 3</option>
          <option value="16/9">16 / 9</option>
          <option value="21/9">21 / 9</option>
          <option value="auto">auto</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Border Radius</Form.Label>
        <Form.Range
          min={0}
          max={50}
          step={1}
          value={styles.borderRadius?.value ?? 0}
          onChange={(e) => updateStyle('styles.borderRadius.value', Number(e.target.value))}
        />
        <div>{styles.borderRadius?.value ?? 0}px</div>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Object Fit</Form.Label>
        <Form.Select
          value={styles.objectFit || 'cover'}
          onChange={(e) => updateStyle('styles.objectFit', e.target.value)}
        >
          <option value="cover">cover</option>
          <option value="contain">contain</option>
          <option value="fill">fill</option>
          <option value="none">none</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Width (%)</Form.Label>
        <Form.Range
          min={10}
          max={100}
          step={1}
          value={styles.width?.value ?? 100}
          onChange={(e) => updateStyle('styles.width.value', Number(e.target.value))}
        />
        <div>{styles.width?.value ?? 100}%</div>
      </Form.Group>
    </>
  );
}
