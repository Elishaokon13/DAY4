'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Create a wrapper component for React-Quill to handle the compatibility issues
const QuillWrapper = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');
    // Return a wrapper function that doesn't use findDOMNode
    return function QuillWrapper({ forwardedRef, ...props }: any) {
      return <RQ ref={forwardedRef} {...props} />;
    };
  },
  { ssr: false }
);

import 'react-quill/dist/quill.snow.css';

interface BlogEditorProps {
  onChange: (content: string) => void;
  value: string;
  isReadOnly?: boolean;
}

export default function BlogEditor({ onChange, value, isReadOnly = false }: BlogEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Minimal toolbar configuration for a cleaner UI
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'blockquote'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'blockquote'
  ];

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
      <div className="min-h-[350px] bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
        <QuillWrapper
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder="Write your blog post here..."
          className="h-full blog-editor"
          readOnly={isReadOnly}
          theme="snow"
        />
      </div>
      <style jsx global>{`
        .blog-editor .ql-container {
          font-family: var(--font-inter);
          font-size: 16px;
          min-height: 250px;
        }
        .blog-editor .ql-editor {
          min-height: 250px;
          max-height: 500px;
          overflow-y: auto;
        }
        .blog-editor .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          background-color: #f9fafb;
        }
        .dark .blog-editor .ql-toolbar {
          background-color: #374151;
          color: white;
          border-color: #4b5563;
        }
        .dark .blog-editor .ql-container {
          border-color: #4b5563;
          color: white;
        }
        .dark .blog-editor .ql-editor {
          background-color: #1f2937;
        }
        .dark .blog-editor .ql-stroke {
          stroke: #d1d5db;
        }
        .dark .blog-editor .ql-fill {
          fill: #d1d5db;
        }
        .dark .blog-editor .ql-picker {
          color: #d1d5db;
        }
      `}</style>
    </motion.div>
  );
} 