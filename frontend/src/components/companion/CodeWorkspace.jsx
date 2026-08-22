import CodeView from "./CodeView";
import Icon from "./Icons";

export default function CodeWorkspace({
  open,
  code,
  onChange,
  onClose,
  onAttach
}) {
  if (!open) return null;

  return (
    <div className="cc-editor-overlay">
      <div className="cc-editor-modal">
        <div className="cc-editor-head">
          <div>
            <div className="cc-pane-title">Code Workspace</div>
            <div className="cc-pane-subtitle">
              Write / edit → Attach to the shared composer
            </div>
          </div>

          <div className="cc-editor-head-actions">
            <span className="cc-language-tag">Python</span>
            <button
              className="cc-icon-button"
              onClick={onClose}
              aria-label="Close code workspace"
            >
              <Icon name="close" />
            </button>
          </div>
        </div>

        <CodeView
          code={code}
          editable
          onChange={onChange}
        />

        <div className="cc-editor-footer">
          <span className="cc-editor-note">
            Focused editor · no run/IDE controls in MVP
          </span>

          <div className="cc-editor-actions">
            <button className="cc-secondary-button" onClick={onClose}>
              Close
            </button>
            <button className="cc-primary-button" onClick={onAttach}>
              <Icon name="attach" size={16} />
              Attach
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
