import Icon from "./Icons";

export default function TopBar({
  onNewChat,
  onOpenConversations,
  onOpenSettings,
  onOpenMobileNav
}) {
  return (
    <header className="cc-topbar">
      <button
        className="cc-icon-button cc-mobile-only"
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
      >
        <Icon name="menu" />
      </button>

      <div className="cc-brand" aria-label="Coding Companion">
        <span className="cc-brand-mark">CC</span>
        <span className="cc-brand-name">Coding Companion</span>
      </div>

      <div className="cc-top-actions">
        <button className="cc-top-action" onClick={onNewChat}>
          <Icon name="plus" size={17} />
          <span>New Chat</span>
        </button>

        <button className="cc-top-action" onClick={onOpenConversations}>
          <span>Conversations</span>
        </button>

        <button
          className="cc-icon-button"
          onClick={onOpenSettings}
          aria-label="Settings"
        >
          <Icon name="settings" />
        </button>
      </div>
    </header>
  );
}
