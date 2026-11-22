"use client";

import React from 'react';
import { useTheme } from 'next-themes';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { oneDark } from '@codemirror/theme-one-dark';

interface CodeEditorProps {
  value: string;
  warmTheme?: boolean;
  onChange: (value: string) => void;
}

export function CodeEditor({ value, onChange, warmTheme = false }: CodeEditorProps) {
  const { resolvedTheme } = useTheme();
  const handleChange = React.useCallback((val: string) => {
    onChange(val);
  }, [onChange]);

  return (
    <div className="border rounded-md overflow-hidden flex-grow h-full min-h-0">
      <CodeMirror
        value={value}
        height="100%"
        extensions={[html()]}
        theme={warmTheme && resolvedTheme !== 'dark' ? 'light' : oneDark}
        onChange={handleChange}
        className="h-full"
        style={{ height: '100%' }}
      />
    </div>
  );
}
