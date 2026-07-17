'use client';

import { useEffect, useRef } from 'react';
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote } from 'lucide-react';

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || '';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function emit() {
    if (ref.current) onChange(ref.current.innerHTML);
  }

  function run(command: string, value?: string) {
    document.execCommand(command, false, value);
    ref.current?.focus();
    emit();
  }

  const tools = [
    { icon: Bold, cmd: 'bold', label: 'Bold' },
    { icon: Italic, cmd: 'italic', label: 'Italic' },
    { icon: Heading2, cmd: 'formatBlock', value: 'h2', label: 'Heading' },
    { icon: Heading3, cmd: 'formatBlock', value: 'h3', label: 'Subheading' },
    { icon: List, cmd: 'insertUnorderedList', label: 'Bullet list' },
    { icon: ListOrdered, cmd: 'insertOrderedList', label: 'Numbered list' },
    { icon: Quote, cmd: 'formatBlock', value: 'blockquote', label: 'Quote' },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-accent">
      <div className="flex flex-wrap items-center gap-1 border-b border-accent bg-surface px-2 py-1.5">
        {tools.map((t, i) => {
          const Icon = t.icon;
          return (
            <button
              key={i}
              type="button"
              title={t.label}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => run(t.cmd, t.value)}
              className="flex h-8 w-8 items-center justify-center rounded text-text-dark transition-colors hover:bg-accent"
            >
              <Icon size={16} />
            </button>
          );
        })}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={emit}
        onBlur={emit}
        className="rte-content min-h-[220px] px-4 py-3 text-body-sm text-text-dark outline-none focus:ring-1 focus:ring-primary/40"
        style={{ direction: 'ltr', textAlign: 'left' }}
      />
    </div>
  );
}
