import { useEffect, useRef } from "react";
import CodeView from "./CodeView";
import Composer from "./Composer";
import Icon from "./Icons";

export default function ConversationPane({
  conversation,
  codeOpen,
  onToggleCode,
  composer,
  setComposer,
  attachedCode,
  setAttachedCode,
  onOpenEditor,
  onSend,
  isResponding,
  thinkingLong,
  errorId,
  onRetry,
  showJump,
  setShowJump
}) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!isResponding && scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [conversation?.messages.length, isResponding]);

  function handleScroll() {
    const element = scrollRef.current;
    if (!element) return;

    setShowJump(
      element.scrollTop + element.clientHeight <
        element.scrollHeight - 260
    );
  }

  function scrollToLatest() {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth"
    });
    setShowJump(false);
  }

  return (
    <section className="cc-conversation-pane">
      <div className="cc-conversation-header">
        <div>
          <div className="cc-conversation-heading">
            {conversation.title}
          </div>
          <div className="cc-conversation-context">
            New mission · same learner
          </div>
        </div>

        <button
          className="cc-code-toggle"
          onClick={onToggleCode}
          title={codeOpen ? "Hide code stream" : "Show code stream"}
        >
          <Icon name="code" size={16} />
          <span>{codeOpen ? "Hide code" : "Code"}</span>
        </button>
      </div>

      <div
        className="cc-message-scroll"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {conversation.messages.length === 0 ? (
          <div className="cc-welcome-state">
            <div className="cc-welcome-mark">CC</div>
            <h1>What are you learning today?</h1>
            <p>
              Talk naturally. Ask a question, describe a problem, or open
              the code workspace when you want to write code.
            </p>
          </div>
        ) : (
          <div className="cc-messages">
            {conversation.messages.map((message) => (
              <div
                key={message.id}
                className={`cc-message-row ${message.role}`}
              >
                <div className={`cc-message ${message.role}`}>
                  {message.role === "cc" && (
                    <div className="cc-message-label">CC</div>
                  )}

                  <div className="cc-message-content">
                    {message.text}
                  </div>

                  {message.code && (
                    <div className="cc-attached-indicator">
                      <Icon name="code" size={14} />
                      <span>Code attached</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isResponding && (
              <div className="cc-message-row cc">
                <div className="cc-message cc">
                  <div className="cc-message-label">CC</div>
                  <div className="cc-thinking-line">
                    <span className="cc-thinking-dots">
                      <i />
                      <i />
                      <i />
                    </span>
                    <span>
                      {thinkingLong ? "Taking a little longer…" : "Thinking…"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {errorId && (
              <div className="cc-inline-error">
                <span>CC couldn't complete that response.</span>
                <button onClick={onRetry}>
                  <Icon name="refresh" size={14} />
                  Retry
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showJump && (
        <button className="cc-jump-latest" onClick={scrollToLatest}>
          <Icon name="chevron" size={15} />
          Latest
        </button>
      )}

      <Composer
        value={composer}
        onChange={setComposer}
        attachedCode={attachedCode}
        onRemoveAttachment={() => setAttachedCode("")}
        onOpenEditor={onOpenEditor}
        onSend={onSend}
        isResponding={isResponding}
      />
    </section>
  );
}
