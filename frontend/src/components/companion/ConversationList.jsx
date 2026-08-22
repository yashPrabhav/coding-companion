import Icon from "./Icons";

export default function ConversationList({
  conversations,
  activeId,
  search,
  onSearchChange,
  onSelect,
  onDelete,
  onNewChat,
  onCloseMobile,
  onOpenSettings
}) {
  return (
    <aside className="cc-sidebar">
      <div className="cc-sidebar-head">
        <div>
          <div className="cc-sidebar-title">Conversations</div>
          <div className="cc-sidebar-subtitle">Your learning history</div>
        </div>

        <button
          className="cc-icon-button cc-mobile-only"
          onClick={onCloseMobile}
          aria-label="Close navigation"
        >
          <Icon name="close" />
        </button>
      </div>

      <label className="cc-search">
        <Icon name="search" size={17} />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search conversations"
          aria-label="Search conversations"
        />
      </label>

      <div className="cc-conversation-list">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`cc-conversation-item ${
              conversation.id === activeId ? "active" : ""
            }`}
            onClick={() => onSelect(conversation.id)}
          >
            <div className="cc-conversation-main">
              <span className="cc-conversation-title">
                {conversation.title}
              </span>

              {conversation.hasCode && (
                <span
                  className="cc-code-indicator"
                  title="Contains code"
                >
                  <Icon name="code" size={14} />
                </span>
              )}
            </div>

            <button
              className="cc-delete-button"
              onClick={(event) => {
                event.stopPropagation();
                onDelete(conversation.id);
              }}
              aria-label={`Delete ${conversation.title}`}
            >
              <Icon name="trash" size={15} />
            </button>
          </div>
        ))}

        {conversations.length === 0 && (
          <div className="cc-empty-list">No conversations found.</div>
        )}
      </div>

      <div className="cc-sidebar-footer">
        <button className="cc-footer-action" onClick={onOpenSettings}>
          <Icon name="settings" size={16} />
          Settings
        </button>
        <button className="cc-footer-action">
          <Icon name="help" size={16} />
          Help
        </button>
        <button className="cc-footer-action" onClick={onNewChat}>
          <Icon name="plus" size={16} />
          New
        </button>
      </div>
    </aside>
  );
}
