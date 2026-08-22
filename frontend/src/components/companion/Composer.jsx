import Icon from "./Icons";

export default function Composer({
  value,
  onChange,
  attachedCode,
  onRemoveAttachment,
  onOpenEditor,
  onSend,
  isResponding
}) {
  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  }

  return (
    <div className="cc-composer-wrap">
      {attachedCode && (
        <div className="cc-attachment-chip">
          <Icon name="code" size={15} />
          <span>Attached code</span>
          <button
            onClick={onRemoveAttachment}
            aria-label="Remove attached code"
          >
            <Icon name="close" size={14} />
          </button>
        </div>
      )}

      <div className="cc-composer">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask CC anything about coding…"
          rows={1}
          aria-label="Message composer"
        />

        <div className="cc-composer-actions">
          <button
            className="cc-composer-icon"
            onClick={onOpenEditor}
            title="Open code workspace"
            aria-label="Open code workspace"
          >
            <Icon name="code" />
          </button>

          <button
            className="cc-send-button"
            disabled={
              isResponding || (!value.trim() && !attachedCode.trim())
            }
            onClick={onSend}
            aria-label="Send message"
          >
            <Icon name="send" size={17} />
          </button>
        </div>
      </div>

      <div className="cc-composer-hint">
        Enter to send · Shift + Enter for a new line
      </div>
    </div>
  );
}
