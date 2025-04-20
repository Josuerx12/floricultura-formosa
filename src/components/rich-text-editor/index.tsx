"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { useEffect } from "react";
import { Select } from "@/components/ui/select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Digite algo...",
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          HTMLAttributes: { class: "list-disc pl-2" },
        },
        orderedList: {
          HTMLAttributes: { class: "list-decimal pl-2" },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg dark:prose-invert min-h-[150px] w-full max-w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        placeholder,
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value]);

  if (!editor) return null;

  return (
    <div className="space-y-2 w-full">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

const Toolbar = ({ editor }: { editor: Editor }) => {
  if (!editor) return null;

  const iconClass = "h-4 w-4";

  const handleHeadingChange = (value: string) => {
    if (value === "paragraph") {
      editor.chain().focus().setParagraph().run();
    } else {
      editor
        .chain()
        .focus()
        .toggleHeading({ level: parseInt(value) as 1 | 2 | 3 | 4 | 5 | 6 })
        .run();
    }
  };

  const getCurrentBlock = () => {
    if (editor.isActive("heading", { level: 1 })) return "1";
    if (editor.isActive("heading", { level: 2 })) return "2";
    if (editor.isActive("heading", { level: 3 })) return "3";
    return "paragraph";
  };

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border bg-muted p-2">
      {/* Heading Select */}
      <Select value={getCurrentBlock()} onValueChange={handleHeadingChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Estilo de texto" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="paragraph">Parágrafo</SelectItem>
          <SelectItem value="1">Título grande (H1)</SelectItem>
          <SelectItem value="2">Título médio (H2)</SelectItem>
          <SelectItem value="3">Título pequeno (H3)</SelectItem>
        </SelectContent>
      </Select>

      {/* Texto básico */}
      <Button
        type="button"
        variant={editor.isActive("bold") ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleBold().run()}
        size="icon"
      >
        <Bold className={iconClass} />
      </Button>
      <Button
        type="button"
        variant={editor.isActive("italic") ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        size="icon"
      >
        <Italic className={iconClass} />
      </Button>
      <Button
        type="button"
        variant={editor.isActive("strike") ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        size="icon"
      >
        <Strikethrough className={iconClass} />
      </Button>

      {/* Listas */}
      <Button
        type="button"
        variant={editor.isActive("bulletList") ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        size="icon"
      >
        <List className={iconClass} />
      </Button>
      <Button
        type="button"
        variant={editor.isActive("orderedList") ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        size="icon"
      >
        <ListOrdered className={iconClass} />
      </Button>

      {/* Alinhamento */}
      <Button
        type="button"
        variant={editor.isActive({ textAlign: "left" }) ? "default" : "outline"}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        size="icon"
      >
        <AlignLeft className={iconClass} />
      </Button>
      <Button
        type="button"
        variant={
          editor.isActive({ textAlign: "center" }) ? "default" : "outline"
        }
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        size="icon"
      >
        <AlignCenter className={iconClass} />
      </Button>
      <Button
        type="button"
        variant={
          editor.isActive({ textAlign: "right" }) ? "default" : "outline"
        }
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        size="icon"
      >
        <AlignRight className={iconClass} />
      </Button>

      {/* Undo / Redo */}
      <Button
        type="button"
        variant="outline"
        onClick={() => editor.chain().focus().undo().run()}
        size="icon"
      >
        <Undo className={iconClass} />
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => editor.chain().focus().redo().run()}
        size="icon"
      >
        <Redo className={iconClass} />
      </Button>
    </div>
  );
};
