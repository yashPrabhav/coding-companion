import { useEffect, useRef } from "react";
import Icon from "./Icons";

export default function CodeView({
  code,
  language = "Python",
  editable = false,
  onChange,
  onInsert
}) {
  const lines = (code || "").split("\n");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!editable) return;
    textareaRef.current?.focus();
  }, [editable]);

  function handleKeyDown(event) {
    if (!editable) return;

    if (event.key === "Tab") {
      event.preventDefault();
      const textarea = event.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;

      // Four-space indentation, without destroying the selection.
      const next = value.slice(0, start) + "    " + value.slice(end);
      onChange?.(next);

      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      });
      return;
    }

    // Basic editor-like auto indentation for a new line.
    if (event.key === "Enter") {
      event.preventDefault();

      const textarea = event.currentTarget;
      const start = textarea.selectionStart;
      const value = textarea.value;
      const beforeCursor = value.slice(0, start);
      const currentLine = beforeCursor.split("\n").pop() ?? "";
      const indentation = currentLine.match(/^[ \t]*/)?.[0] ?? "";
      const extraIndent =
        /:\s*(#.*)?$/.test(currentLine.trimEnd()) ? "    " : "";

      const insertion = `\n${indentation}${extraIndent}`;
      const next = value.slice(0, start) + insertion + value.slice(start);

      onChange?.(next);

      requestAnimationFrame(() => {
        const position = start + insertion.length;
        textarea.selectionStart = textarea.selectionEnd = position;
      });
    }
  }

  if (editable) {
    return (
      <div className="cc-editor">
        <div className="cc-editor-gutter" aria-hidden="true">
          {lines.map((_, index) => (
            <span key={index}>{index + 1}</span>
          ))}
        </div>

        <textarea
          ref={textareaRef}
          className="cc-editor-textarea"
          spellCheck="false"
          value={code}
          onChange={(event) => onChange?.(event.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Code editor"
        />
      </div>
    );
  }

  return (
    <div className="cc-code-entry">
      <div className="cc-code-entry-head">
        <span className="cc-language-tag">{language}</span>

        {onInsert ? (
          <button className="cc-insert-button" onClick={() => onInsert(code)}>
            <Icon name="code" size={14} />
            Insert
          </button>
        ) : (
          <span className="cc-code-label">code</span>
        )}
      </div>

      <pre>{code || "// Code will appear here."}</pre>
    </div>
  );
}
