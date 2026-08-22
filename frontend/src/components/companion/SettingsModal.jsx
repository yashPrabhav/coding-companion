import Icon from "./Icons";

export default function SettingsModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="cc-modal-scrim" onClick={onClose}>
      <div className="cc-settings-modal" onClick={(event) => event.stopPropagation()}>
        <div className="cc-modal-head">
          <div>
            <div className="cc-pane-title">Settings</div>
            <div className="cc-pane-subtitle">
              Essential app settings
            </div>
          </div>

          <button
            className="cc-icon-button"
            onClick={onClose}
            aria-label="Close settings"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="cc-setting-row">
          <span>Theme</span>
          <strong>Dark</strong>
        </div>

        <div className="cc-setting-row">
          <span>Account</span>
          <strong>Signed in</strong>
        </div>

        <div className="cc-setting-row">
          <span>Learning preferences</span>
          <span>Managed naturally by CC</span>
        </div>
      </div>
    </div>
  );
}
