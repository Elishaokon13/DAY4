'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface BlogEditorProps {
  onChange: (content: string) => void;
  value: string;
  isReadOnly?: boolean;
}

export default function BlogEditor({ onChange, value, isReadOnly = false }: BlogEditorProps) {
  const [mounted, setMounted] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editable: !isReadOnly,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!mounted) {
    return (
      <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="min-h-[350px] bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md p-4 blog-editor">
        <div className="toolbar mb-4 p-2 bg-gray-100 dark:bg-gray-700 rounded flex flex-wrap gap-2">
          <button
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={`px-2 py-1 rounded ${editor?.isActive('bold') ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}
            type="button"
          >
            Bold
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={`px-2 py-1 rounded ${editor?.isActive('italic') ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}
            type="button"
          >
            Italic
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-2 py-1 rounded ${editor?.isActive('heading', { level: 1 }) ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}
            type="button"
          >
            H1
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-2 py-1 rounded ${editor?.isActive('heading', { level: 2 }) ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}
            type="button"
          >
            H2
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={`px-2 py-1 rounded ${editor?.isActive('bulletList') ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}
            type="button"
          >
            Bullet List
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={`px-2 py-1 rounded ${editor?.isActive('orderedList') ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}
            type="button"
          >
            Ordered List
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            className={`px-2 py-1 rounded ${editor?.isActive('blockquote') ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}
            type="button"
          >
            Quote
          </button>
        </div>
        <EditorContent editor={editor} className="prose dark:prose-invert max-w-none min-h-[250px] focus:outline-none" />
      </div>
      <style jsx global>{`
        .blog-editor {
          font-family: var(--font-inter);
          font-size: 16px;
        }
        .blog-editor .ProseMirror {
          min-height: 250px;
          max-height: 500px;
          overflow-y: auto;
          padding: 1rem;
          outline: none;
        }
        .dark .blog-editor {
          color: white;
        }
        .dark .blog-editor .ProseMirror {
          background-color: #1f2937;
        }
      `}</style>
    </motion.div>
  );
} 