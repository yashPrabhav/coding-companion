import CodeView from "./CodeView";
import Icon from "./Icons";

export default function CodeStream({
  codeStreamEntries,
  onClose,
  onOpenEditor,
  onInsertCode
}) {
  const blocks = codeStreamEntries || [];

  return (
    <aside className="cc-code-pane">
      <div className="cc-code-header">
        <div>
          <div className="cc-pane-title">Code Stream</div>
          <div className="cc-pane-subtitle">
            {blocks.length
              ? `${blocks.length} code ${blocks.length === 1 ? "entry" : "entries"
              }`
              : "Your code work lives here"}
          </div>
        </div>

        <button
          className="cc-icon-button"
          onClick={onClose}
          aria-label="Close code stream"
        >
          <Icon name="close" />
        </button>
      </div>

      <div className="cc-code-scroll">
        {blocks.length ? (
          blocks.map((entry, index) => (
            <CodeView
              key={entry.id || `${index}-${entry.code.slice(0, 20)}`}
              code={entry.code}
              onInsert={onInsertCode}
            />
          ))
        ) : (
          <div className="cc-code-empty">
            <Icon name="code" size={26} />
            <h2>Your code stream</h2>
            <p>
              Code from the conversation will appear here.
            </p>
          </div>
        )}
      </div>

      <div className="cc-code-footer">
        <button className="cc-secondary-button" onClick={onOpenEditor}>
          <Icon name="code" size={16} />
          Open workspace
        </button>
      </div>
    </aside>
  );
}