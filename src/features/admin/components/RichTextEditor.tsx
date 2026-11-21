'use client';

import type { ReactNode } from 'react';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { marked } from 'marked';
import { DOMParser as ProseMirrorParser } from '@tiptap/pm/model';
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  RemoveFormatting,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
  Unlink2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { estimateReadTime } from '@/utils/blog-content';

interface Props {
  /** The starting content (HTML). Changing it later does not reset the editor; remount it with a new `key`. */
  initialHtml: string;
  onChange: (html: string, plainText: string) => void;
  placeholder?: string;
  invalid?: boolean;
}

/** Plain text that is clearly Markdown (what AI tools produce when copied as text) rather than ordinary prose. */
function looksLikeMarkdown(text: string): boolean {
  return (
    /^\s{0,3}#{1,6}\s+\S/m.test(text) ||
    /^\s*[-*+]\s+\S/m.test(text) ||
    /^\s*\d+[.)]\s+\S/m.test(text) ||
    /^\s*>\s+\S/m.test(text) ||
    /\*\*[^*\n]+\*\*/.test(text) ||
    /\[[^\]\n]+\]\(https?:\/\/[^)\s]+\)/.test(text)
  );
}

/** Body headings start at H2 (the article title is the page's H1), so pasted H1/H5/H6 are mapped. */
function normalizePastedHtml(html: string): string {
  return html
    .replace(/<(\/?)h1(\s|>)/gi, '<$1h2$2')
    .replace(/<(\/?)h[56](\s|>)/gi, '<$1h4$2');
}

function ToolbarButton({
  label,
  onClick,
  active = false,
  disabled = false,
  children,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      // mousedown (not click) keeps the text selection inside the editor while a button is pressed
      onMouseDown={(e) => {
        e.preventDefault();
        if (!disabled) onClick();
      }}
      className={cn(
        'flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md border border-transparent text-[#6B4F3A] transition-colors',
        'hover:bg-[#F3EDE3] hover:text-[#2E221C] disabled:cursor-not-allowed disabled:opacity-35',
        active && 'border-[#C9A86A]/50 bg-[#C9A86A]/15 text-[#2E221C]'
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 hidden h-5 w-px bg-[#DDD2C5] sm:block" aria-hidden="true" />;
}

function setLink(editor: Editor) {
  const previous = editor.getAttributes('link').href as string | undefined;
  const entered = window.prompt('Link address (for example https://aafreencouture.com):', previous ?? 'https://');
  if (entered === null) return;
  const url = entered.trim();
  if (!url || url === 'https://') {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    return;
  }
  const href = /^(https?:|mailto:)/i.test(url) ? url : `https://${url}`;
  editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
}

export function RichTextEditor({ initialHtml, onChange, placeholder = 'Write the article here, or paste it from ChatGPT…', invalid = false }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' } },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: initialHtml,
    // Rendered in the browser only (the admin form is a client-side modal), which avoids a server/browser mismatch.
    immediatelyRender: false,
    // Lets the toolbar highlight the formatting at the cursor as it moves.
    shouldRerenderOnTransaction: true,
    editorProps: {
      attributes: {
        class: 'blog-prose min-h-[14rem] max-h-[26rem] overflow-y-auto px-4 py-3 outline-none',
        'aria-label': 'Article content',
      },
      transformPastedHTML: normalizePastedHtml,
      // Copied from a web page or chat window: the browser supplies HTML and the editor keeps only the formatting it
      // supports. Copied as plain text: if it is Markdown (## headings, **bold**, - lists) turn it into formatting.
      handlePaste: (view, event) => {
        const data = event.clipboardData;
        if (!data || data.getData('text/html')) return false;
        const text = data.getData('text/plain');
        if (!text || !looksLikeMarkdown(text)) return false;
        const html = normalizePastedHtml(marked.parse(text, { async: false, gfm: true }) as string);
        // Insert the converted content directly. (Asking the view to paste it would run this handler again, forever.)
        const dom = new window.DOMParser().parseFromString(html, 'text/html').body;
        const slice = ProseMirrorParser.fromSchema(view.state.schema).parseSlice(dom);
        view.dispatch(view.state.tr.replaceSelection(slice).scrollIntoView());
        return true;
      },
    },
    onUpdate: ({ editor: ed }) => onChange(ed.getHTML(), ed.getText({ blockSeparator: '\n\n' })),
  });

  if (!editor) {
    return <div className="h-64 animate-pulse rounded-lg border border-[#DDD2C5] bg-[#FAF7F2]" aria-hidden="true" />;
  }

  const words = editor.getText().trim().split(/\s+/).filter(Boolean).length;

  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border bg-[#FAF7F2] transition-colors focus-within:border-[#C9A86A] focus-within:ring-1 focus-within:ring-[#C9A86A]',
        invalid ? 'border-red-400' : 'border-[#DDD2C5]'
      )}
    >
      <div role="toolbar" aria-label="Formatting" className="flex flex-wrap items-center gap-0.5 border-b border-[#DDD2C5] bg-white px-2 py-1.5">
        <ToolbarButton label="Bold (Ctrl+B)" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size="0.9375rem" />
        </ToolbarButton>
        <ToolbarButton label="Italic (Ctrl+I)" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size="0.9375rem" />
        </ToolbarButton>
        <ToolbarButton label="Underline (Ctrl+U)" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon size="0.9375rem" />
        </ToolbarButton>
        <ToolbarButton label="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough size="0.9375rem" />
        </ToolbarButton>
        <Divider />
        <ToolbarButton label="Heading" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 size="1rem" />
        </ToolbarButton>
        <ToolbarButton label="Sub-heading" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 size="1rem" />
        </ToolbarButton>
        <Divider />
        <ToolbarButton label="Bulleted list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size="1rem" />
        </ToolbarButton>
        <ToolbarButton label="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size="1rem" />
        </ToolbarButton>
        <ToolbarButton label="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote size="0.9375rem" />
        </ToolbarButton>
        <Divider />
        <ToolbarButton label="Add or edit link" active={editor.isActive('link')} onClick={() => setLink(editor)}>
          <Link2 size="1rem" />
        </ToolbarButton>
        <ToolbarButton label="Remove link" disabled={!editor.isActive('link')} onClick={() => editor.chain().focus().extendMarkRange('link').unsetLink().run()}>
          <Unlink2 size="1rem" />
        </ToolbarButton>
        <ToolbarButton label="Divider line" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus size="1rem" />
        </ToolbarButton>
        <Divider />
        <ToolbarButton label="Clear formatting" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
          <RemoveFormatting size="0.9375rem" />
        </ToolbarButton>
        <ToolbarButton label="Undo (Ctrl+Z)" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 size="0.9375rem" />
        </ToolbarButton>
        <ToolbarButton label="Redo (Ctrl+Y)" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 size="0.9375rem" />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-[#DDD2C5] bg-white px-3.5 py-1.5 text-[0.6875rem] text-[#8A6A55]">
        <span>Paste from ChatGPT or any website: headings, bold, lists and links are kept; colours, images and scripts are removed.</span>
        <span className="font-medium">
          {words} word{words === 1 ? '' : 's'}
          {words > 0 && ` · ${estimateReadTime(editor.getText())}`}
        </span>
      </div>
    </div>
  );
}
