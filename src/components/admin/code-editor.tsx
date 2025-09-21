"use client";

import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { oneDark } from '@codemirror/theme-one-dark';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function CodeEditor({ value, onChange }: CodeEditorProps) {
  const handleChange = React.useCallback((val: string) => {
    onChange(val);
  }, [onChange]);

  return (
    <div className="border rounded-md overflow-hidden flex-grow h-full min-h-0">
      <CodeMirror
        value={value}
        height="100%"
        extensions={[html()]}
        theme={oneDark}
        onChange={handleChange}
        className="h-full"
        style={{ height: '100%' }}
      />
    </div>
  );
}
