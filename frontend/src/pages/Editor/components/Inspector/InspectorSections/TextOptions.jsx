import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Heading } from '@tiptap/extension-heading';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import FontSize from '@tiptap/extension-font-size';
import { BsTypeBold, BsTypeItalic, BsTypeUnderline, BsFillPaletteFill, BsTextLeft, BsTextCenter, BsTextRight } from 'react-icons/bs';
import { ChromePicker } from 'react-color';
import { Button, ButtonGroup, OverlayTrigger, Tooltip, Form, Row, Col } from 'react-bootstrap';
import FontList from '../../../../../data/systemFonts';

export default function TextOptions({ selectedBlock, updateStyle, parseValueUnit, onChange }) {
  const [color, setColor] = useState('#000000');
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Flatten the block for easy access
  const block = selectedBlock?.block || null;

  // Setup TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false }),
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      TextStyle,
      Color,
      FontFamily,
      FontSize.configure({ types: ['textStyle'] }),
    ],
    content: '',
    onUpdate({ editor }) {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  // Sync editor content when selectedBlock changes
  useEffect(() => {
    if (!editor || !block) return;

    if (block.type === 'text' || block.type === 'heading') {
      let content = block.text || '';
      if (!/<[a-z][\s\S]*>/i.test(content)) {
        const tag = block.tag || (block.type === 'heading' ? 'h1' : 'p');
        content = `<${tag}>${content}</${tag}>`;
      }
      editor.commands.setContent(content, false);
      setColor(block.styles?.color || '#000000');
    } else {
      // clear editor for non-text blocks
      editor.commands.clearContent();
    }
  }, [block, editor]);

  if (!block || block.type === 'image') return null;

  // parse font size into number and unit
  const fontSizeRaw = block.styles?.fontSize || '16px';
  const [fontSizeNum, fontSizeUnit] = parseValueUnit(fontSizeRaw);
  const alignment = block.styles?.textAlign || 'left';

  return (
    <div>
      {/* Toolbar */}
      <ButtonGroup className="mb-2">
        <OverlayTrigger placement="top" overlay={<Tooltip>Bold</Tooltip>}>
          <Button
            variant={editor?.isActive('bold') ? 'primary' : 'outline-primary'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <BsTypeBold />
          </Button>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={<Tooltip>Italic</Tooltip>}>
          <Button
            variant={editor?.isActive('italic') ? 'primary' : 'outline-primary'}
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <BsTypeItalic />
          </Button>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={<Tooltip>Underline</Tooltip>}>
          <Button
            variant={editor?.isActive('underline') ? 'primary' : 'outline-primary'}
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <BsTypeUnderline />
          </Button>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={<Tooltip>Text Color</Tooltip>}>
          <Button
            variant={showColorPicker ? 'primary' : 'outline-primary'}
            size="sm"
            onClick={() => setShowColorPicker(!showColorPicker)}
          >
            <BsFillPaletteFill />
          </Button>
        </OverlayTrigger>
      </ButtonGroup>

      {/* Color Picker */}
      {showColorPicker && (
        <div style={{ position: 'relative', zIndex: 1000, marginBottom: 8 }}>
          <ChromePicker
            color={color}
            onChange={(c) => {
              setColor(c.hex);
              editor.chain().focus().setColor(c.hex).run();
              updateStyle('color', c.hex);
            }}
            disableAlpha
          />
        </div>
      )}

      {/* Rich Text Editor */}
      <EditorContent
        editor={editor}
        style={{
          minHeight: 120,
          border: '1px solid #ddd',
          padding: 10,
          borderRadius: 4,
          marginBottom: 12,
        }}
      />

      {/* Block-level controls */}
      <Form.Group className="mb-3">
        <Form.Label>Font Size</Form.Label>
        <Row>
          <Col xs={3}>
            <Form.Control
              type="number"
              min={fontSizeUnit === '%' ? 0 : 8}
              max={fontSizeUnit === '%' ? 100 : 72}
              value={fontSizeNum}
              onChange={(e) => updateStyle('fontSize', `${e.target.value}${fontSizeUnit}`)}
            />
          </Col>
          <Col xs={3}>
            <Form.Select
              size="sm"
              value={fontSizeUnit}
              onChange={(e) => updateStyle('fontSize', `${fontSizeNum}${e.target.value}`)}
            >
              <option value="px">px</option>
              <option value="rem">rem</option>
              <option value="em">em</option>
              <option value="%">%</option>
            </Form.Select>
          </Col>
        </Row>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Font Family</Form.Label>
        <Form.Select
          value={block.styles?.fontFamily || ''}
          onChange={(e) => updateStyle('fontFamily', e.target.value)}
        >
          <option value="">Select a font</option>
          {FontList.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Text Align</Form.Label>
        <ButtonGroup>
          {[
            { value: 'left', icon: <BsTextLeft /> },
            { value: 'center', icon: <BsTextCenter /> },
            { value: 'right', icon: <BsTextRight /> },
          ].map(({ value, icon }) => (
            <Button
              key={value}
              variant={alignment === value ? 'primary' : 'outline-secondary'}
              size="sm"
              onClick={() => updateStyle('textAlign', value)}
            >
              {icon}
            </Button>
          ))}
        </ButtonGroup>
      </Form.Group>
    </div>
  );
}

