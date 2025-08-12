import React from 'react';
import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import {
  BoxArrowInDownRight,
  ArrowRepeat,
  ArrowsAngleExpand,
  LayoutThreeColumns,
  LayoutSidebarInset,
  LayoutTextSidebarReverse,
  AlignTop,
  AlignMiddle,
  AlignBottom,
  AlignStart,
  AlignCenter,
  AlignEnd,
  TextLeft,
  TextCenter,
  TextRight,
} from 'react-bootstrap-icons';

// Import missing / better icons from react-icons/bs
import {
    BsArrowBarLeft,
  BsArrowBarRight,
  BsArrowsCollapseVertical,
  BsArrowsExpandVertical,
  BsArrows,
} from 'react-icons/bs';

// Icon components for justifyContent options
const JUSTIFY_ICONS = {
  'flex-start': <BsArrowBarLeft size={20} />,
  center: <BsArrowsCollapseVertical size={20} />,
  'flex-end': <BsArrowBarRight size={20} />,
  'space-between': <BsArrowsCollapseVertical size={20} />,
  'space-around': <BsArrowsExpandVertical size={20} />,
  'space-evenly': <BsArrows size={20} />,
};

// Align items icons (no react-icons needed, use bootstrap-icons)
const ALIGN_ITEMS_ICONS = {
  stretch: <ArrowRepeat size={20} />, // fallback icon for stretch
  'flex-start': <AlignStart size={20} />,
  center: <AlignCenter size={20} />,
  'flex-end': <AlignEnd size={20} />,
  baseline: <AlignBottom size={20} />, // closest approximation
};

// Flex wrap icons (no direct icons in either lib, picking closest)
const FLEX_WRAP_ICONS = {
  nowrap: <ArrowRepeat size={20} />,
  wrap: <LayoutThreeColumns size={20} />,
  'wrap-reverse': <LayoutSidebarInset size={20} />,
};

// Display options
const DISPLAY_OPTIONS = [
  { value: 'block', label: 'Block', Icon: BoxArrowInDownRight },
  { value: 'inline-block', label: 'Inline Block', Icon: ArrowRepeat },
  { value: 'flex', label: 'Flex', Icon: ArrowsAngleExpand },
  { value: 'grid', label: 'Grid', Icon: LayoutThreeColumns },
  { value: 'none', label: 'None', Icon: LayoutSidebarInset },
];

// Flex directions
const FLEX_DIRECTIONS = [
  { value: 'row', label: 'Row', Icon: AlignTop },
  { value: 'column', label: 'Column', Icon: AlignMiddle },
  { value: 'row-reverse', label: 'Row Reverse', Icon: LayoutTextSidebarReverse },
  { value: 'column-reverse', label: 'Column Reverse', Icon: LayoutSidebarInset },
];

// Horizontal text align
const HORIZONTAL_ALIGN_OPTIONS = [
  { value: 'left', label: 'Left', Icon: TextLeft },
  { value: 'center', label: 'Center', Icon: TextCenter },
  { value: 'right', label: 'Right', Icon: TextRight },
];

// Vertical align options
const VERTICAL_ALIGN_OPTIONS = [
  { value: 'start', label: 'Top', Icon: AlignStart },
  { value: 'center', label: 'Middle', Icon: AlignCenter },
  { value: 'end', label: 'Bottom', Icon: AlignEnd },
];

export default function FlexboxOptions({ mergedStyles, updateStyle }) {
  const display = mergedStyles.display || 'block';
  const flexDirection = mergedStyles.flexDirection || 'row';
  const justifyContent = mergedStyles.justifyContent || 'flex-start';
  const alignItems = mergedStyles.alignItems || 'stretch';
  const flexWrap = mergedStyles.flexWrap || 'nowrap';

  const horizontalAlign = mergedStyles.textAlign || 'left';
  const verticalAlign = mergedStyles.alignSelf || 'auto';

  return (
    <>
      {/* Display */}
      <Form.Group className="mb-3">
        <Form.Label>Display</Form.Label>
        <div className="d-flex flex-wrap gap-2">
          {DISPLAY_OPTIONS.map(({ value, label, Icon }) => (
            <OverlayTrigger key={value} placement="top" overlay={<Tooltip>{label}</Tooltip>}>
              <Form.Check
                type="radio"
                id={`display-${value}`}
                name="display"
                value={value}
                checked={display === value}
                onChange={() => updateStyle('display', value)}
                label={<Icon />}
                custom={false}
              />
            </OverlayTrigger>
          ))}
        </div>
      </Form.Group>

      {/* Flex-only controls */}
      {display === 'flex' && (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Flex Direction</Form.Label>
            <div className="d-flex flex-wrap gap-2">
              {FLEX_DIRECTIONS.map(({ value, label, Icon }) => (
                <OverlayTrigger key={value} placement="top" overlay={<Tooltip>{label}</Tooltip>}>
                  <Form.Check
                    type="radio"
                    id={`flexDirection-${value}`}
                    name="flexDirection"
                    value={value}
                    checked={flexDirection === value}
                    onChange={() => updateStyle('flexDirection', value)}
                    label={<Icon />}
                    custom={false}
                  />
                </OverlayTrigger>
              ))}
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Justify Content</Form.Label>
            <div className="d-flex flex-wrap gap-2">
              {Object.entries(JUSTIFY_ICONS).map(([value, Icon]) => (
                <OverlayTrigger key={value} placement="top" overlay={<Tooltip>{value}</Tooltip>}>
                  <Form.Check
                    type="radio"
                    id={`justifyContent-${value}`}
                    name="justifyContent"
                    value={value}
                    checked={justifyContent === value}
                    onChange={() => updateStyle('justifyContent', value)}
                    label={Icon}
                    custom={false}
                  />
                </OverlayTrigger>
              ))}
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Align Items</Form.Label>
            <div className="d-flex flex-wrap gap-2">
              {Object.entries(ALIGN_ITEMS_ICONS).map(([value, Icon]) => (
                <OverlayTrigger key={value} placement="top" overlay={<Tooltip>{value}</Tooltip>}>
                  <Form.Check
                    type="radio"
                    id={`alignItems-${value}`}
                    name="alignItems"
                    value={value}
                    checked={alignItems === value}
                    onChange={() => updateStyle('alignItems', value)}
                    label={Icon}
                    custom={false}
                  />
                </OverlayTrigger>
              ))}
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Flex Wrap</Form.Label>
            <div className="d-flex flex-wrap gap-2">
              {Object.entries(FLEX_WRAP_ICONS).map(([value, Icon]) => (
                <OverlayTrigger key={value} placement="top" overlay={<Tooltip>{value}</Tooltip>}>
                  <Form.Check
                    type="radio"
                    id={`flexWrap-${value}`}
                    name="flexWrap"
                    value={value}
                    checked={flexWrap === value}
                    onChange={() => updateStyle('flexWrap', value)}
                    label={Icon}
                    custom={false}
                  />
                </OverlayTrigger>
              ))}
            </div>
          </Form.Group>
        </>
      )}

      {/* Alignment Options */}
      <hr />
      <Form.Group className="mb-3">
        <Form.Label>Horizontal Alignment</Form.Label>
        <div className="d-flex gap-3">
          {HORIZONTAL_ALIGN_OPTIONS.map(({ value, label, Icon }) => (
            <OverlayTrigger key={value} placement="top" overlay={<Tooltip>{label}</Tooltip>}>
              <Form.Check
                type="radio"
                id={`horizontalAlign-${value}`}
                name="horizontalAlign"
                value={value}
                checked={horizontalAlign === value}
                onChange={() => updateStyle('textAlign', value)}
                label={<Icon size={20} />}
                custom={false}
              />
            </OverlayTrigger>
          ))}
        </div>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Vertical Alignment</Form.Label>
        <div className="d-flex gap-3">
          {VERTICAL_ALIGN_OPTIONS.map(({ value, label, Icon }) => (
            <OverlayTrigger key={value} placement="top" overlay={<Tooltip>{label}</Tooltip>}>
              <Form.Check
                type="radio"
                id={`verticalAlign-${value}`}
                name="verticalAlign"
                value={value}
                checked={verticalAlign === value}
                onChange={() => updateStyle('alignSelf', value)}
                label={<Icon size={20} />}
                custom={false}
              />
            </OverlayTrigger>
          ))}
        </div>
      </Form.Group>
    </>
  );
}
