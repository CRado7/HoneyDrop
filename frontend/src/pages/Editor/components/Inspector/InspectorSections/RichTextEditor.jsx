import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { FontFamily } from '@tiptap/extension-font-family';
import { FontSize } from '@tiptap/extension-font-size';

import { Button, ButtonGroup, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { BsTypeBold, BsTypeItalic, BsTypeUnderline, BsFillPaletteFill } from 'react-icons/bs';

import { ChromePicker } from 'react-color';
import FontList from '../../../../../data/systemFonts';


const MENU_ITEMS = [
  { action: 'toggleBold', label: 'Bold' },
  { action: 'toggleItalic', label: 'Italic' },
  { action: 'toggleUnderline', label: 'Underline' },
  { action: 'setFontSize', label: 'Font Size', options: ['12px', '14px', '16px', '18px', '24px', '32px'] },
];

export default function RichTextEditor({ initialHtml = '', onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      FontFamily,
      FontSize.configure({ types: ['textStyle'] }),
    ],
    content: initialHtml,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [color, setColor] = useState('black');

  // Reset editor content when initialHtml changes (and editor is ready)
  useEffect(() => {
    if (editor && initialHtml !== editor.getHTML()) {
      editor.commands.setContent(initialHtml, false); // false = do not trigger onUpdate
      setColor('black'); // reset color picker state if you want
    }
  }, [initialHtml, editor]);

  if (!editor) {
    return null;
  }

  const setFontSize = (size) => editor.chain().focus().setFontSize(size).run();
  const setFontFamily = (family) => editor.chain().focus().setFontFamily(family).run();

  const applyColor = (newColor) => {
    setColor(newColor.hex);
    editor.chain().focus().setColor(newColor.hex).run();
  };

  const renderButton = (action, IconComponent, label) => (
    <OverlayTrigger
      key={action}
      placement="top"
      overlay={<Tooltip id={`tooltip-${action}`}>{label}</Tooltip>}
    >
      <Button
        variant={editor.isActive(action.replace('toggle', '').toLowerCase()) ? 'primary' : 'outline-primary'}
        onClick={() => editor.chain().focus()[action]().run()}
        disabled={!editor.can().chain().focus()[action]().run()}
        aria-label={label}
      >
        <IconComponent />
      </Button>
    </OverlayTrigger>
  );

  return (
    <div>
      <ButtonGroup className="mb-2" aria-label="Basic formatting">
        {renderButton('toggleBold', BsTypeBold, 'Bold')}
        {renderButton('toggleItalic', BsTypeItalic, 'Italic')}
        {renderButton('toggleUnderline', BsTypeUnderline, 'Underline')}

        {/* Color Picker Toggle Button */}
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="tooltip-colorpicker">Text Color</Tooltip>}
        >
          <Button
            variant={showColorPicker ? 'primary' : 'outline-primary'}
            onClick={() => setShowColorPicker(!showColorPicker)}
            aria-label="Text Color Picker"
          >
            <BsFillPaletteFill />
          </Button>
        </OverlayTrigger>
      </ButtonGroup>

      {showColorPicker && (
        <div style={{ position: 'relative', zIndex: 1000, marginBottom: 8 }}>
          <ChromePicker color={color} onChange={applyColor} disableAlpha />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowColorPicker(false)}
            className="mt-2"
          >
            Close
          </Button>
        </div>
      )}

      <Form.Select
        aria-label="Font Size"
        onChange={(e) => setFontSize(e.target.value)}
        defaultValue=""
        className="mb-2 d-inline-block"
        style={{ width: 'auto', marginRight: '8px' }}
      >
        <option value="" disabled>Font Size</option>
        {MENU_ITEMS.find(i => i.action === 'setFontSize').options.map(size => (
          <option key={size} value={size}>{size}</option>
        ))}
      </Form.Select>

      <Form.Select
        aria-label="Font Family"
        onChange={(e) => setFontFamily(e.target.value)}
        defaultValue=""
        className="mb-2 d-inline-block"
        style={{ width: 'auto' }}
      >
        <option value="" disabled>Font Family</option>
        {FontList.map((family) => (
          <option key={family} value={family}>{family}</option>
        ))}
      </Form.Select>


      <EditorContent
        editor={editor}
        style={{
          minHeight: 150,
          border: '1px solid #ddd',
          padding: 10,
          borderRadius: 4,
          outline: 'none',
          cursor: 'text',
        }}
      />
    </div>
  );
}
