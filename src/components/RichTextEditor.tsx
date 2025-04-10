
import { useEffect, useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const [mounted, setMounted] = useState(false);
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Custom handlers for table operations
  const insertTable = () => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    // Default table format (3x3)
    const tableHTML = `
      <table style="width: 100%; border-collapse: collapse;">
        <tbody>
          ${Array(3).fill(0).map(() => `
            <tr>
              ${Array(3).fill(0).map(() => `
                <td style="border: 1px solid #ccc; padding: 8px; height: 30px;"></td>
              `).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
    const range = quill.getSelection(true);
    quill.clipboard.dangerouslyPasteHTML(range.index, tableHTML);
    quill.setSelection(range.index + 1, 0);
  };

  // Define custom toolbar handlers
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        ["link", "image"],
        ["table"],
        [{ color: [] }, { background: [] }],
        ["clean"],
      ],
      handlers: {
        table: insertTable
      }
    },
    clipboard: {
      matchVisual: false,
    }
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "align",
    "color",
    "background",
    "table",
    "width",
    "height",
    "style"
  ];

  // Register table formats to Quill if mounted on client-side
  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      // Register the Quill table module
      const Quill = (ReactQuill as any).Quill;
      const Block = Quill.import('blots/block');
      const Container = Quill.import('blots/container');

      class TableCell extends Block {
        static create(value: any) {
          const node = super.create();
          if (value) {
            const { borderWidth, borderStyle, borderColor, backgroundColor, width, height } = value;
            if (borderWidth) node.style.borderWidth = borderWidth;
            if (borderStyle) node.style.borderStyle = borderStyle;
            if (borderColor) node.style.borderColor = borderColor;
            if (backgroundColor) node.style.backgroundColor = backgroundColor;
            if (width) node.style.width = width;
            if (height) node.style.height = height;
          }
          return node;
        }
        
        static formats(node: HTMLElement) {
          const formats: any = {};
          if (node.style.borderWidth) formats.borderWidth = node.style.borderWidth;
          if (node.style.borderStyle) formats.borderStyle = node.style.borderStyle;
          if (node.style.borderColor) formats.borderColor = node.style.borderColor;
          if (node.style.backgroundColor) formats.backgroundColor = node.style.backgroundColor;
          if (node.style.width) formats.width = node.style.width;
          if (node.style.height) formats.height = node.style.height;
          return formats;
        }
      }
      
      TableCell.blotName = 'table-cell';
      TableCell.tagName = 'TD';

      class TableRow extends Container {
        static create() {
          const node = super.create();
          return node;
        }
      }
      
      TableRow.blotName = 'table-row';
      TableRow.tagName = 'TR';

      class TableBody extends Container {
        static create() {
          const node = super.create();
          return node;
        }
      }
      
      TableBody.blotName = 'table-body';
      TableBody.tagName = 'TBODY';

      class Table extends Container {
        static create(value: any) {
          const node = super.create();
          node.setAttribute('style', 'width: 100%; border-collapse: collapse;');
          if (value) {
            const { width, alignment } = value;
            if (width) node.style.width = width;
            if (alignment) {
              if (alignment === 'center') {
                node.style.marginLeft = 'auto';
                node.style.marginRight = 'auto';
              } else if (alignment === 'right') {
                node.style.marginLeft = 'auto';
                node.style.marginRight = '0';
              }
            }
          }
          return node;
        }
        
        static formats(node: HTMLElement) {
          const formats: any = {};
          if (node.style.width) formats.width = node.style.width;
          if (node.style.marginLeft === 'auto' && node.style.marginRight === 'auto') {
            formats.alignment = 'center';
          } else if (node.style.marginLeft === 'auto' && node.style.marginRight === '0') {
            formats.alignment = 'right';
          }
          return formats;
        }
      }
      
      Table.blotName = 'table';
      Table.tagName = 'TABLE';
      Table.allowedChildren = [TableBody];
      TableBody.allowedChildren = [TableRow];
      TableRow.allowedChildren = [TableCell];
      
      Quill.register(Table, true);
      Quill.register(TableBody, true);
      Quill.register(TableRow, true);
      Quill.register(TableCell, true);

      // Add toolbar button icon for table
      const icons = Quill.import('ui/icons');
      icons['table'] = `
        <svg viewbox="0 0 18 18">
          <rect width="18" height="18" fill="none" stroke="none"/>
          <rect x="2" y="3" width="14" height="12" rx="1" stroke="currentColor" stroke-width="2" fill="none"/>
          <line x1="2" y1="7" x2="16" y2="7" stroke="currentColor" stroke-width="1.5"/>
          <line x1="2" y1="11" x2="16" y2="11" stroke="currentColor" stroke-width="1.5"/>
          <line x1="6" y1="3" x2="6" y2="15" stroke="currentColor" stroke-width="1.5"/>
          <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" stroke-width="1.5"/>
        </svg>
      `;
    }
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="border min-h-[200px] rounded-md p-3 bg-white">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="rich-text-editor">
      <style jsx global>{`
        .rich-text-editor .ql-editor {
          min-height: 200px;
        }
        .rich-text-editor .ql-toolbar button[value="table"]:after {
          content: "Table";
          margin-left: 5px;
        }
        .rich-text-editor table {
          border-collapse: collapse;
        }
        .rich-text-editor td {
          border: 1px solid #ccc;
          padding: 8px;
          min-width: 30px;
          min-height: 30px;
        }
      `}</style>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder || "Write your content here..."}
        modules={modules}
        formats={formats}
        className="bg-white rounded-md"
      />
    </div>
  );
};

export default RichTextEditor;
