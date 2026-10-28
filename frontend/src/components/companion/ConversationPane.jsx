import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import Composer from "./Composer";
import Icon from "./Icons";

// Hide fenced code blocks from the chat display.
// The existing code extraction pipeline remains responsible
// for sending generated code to Code Stream.
function removeFencedCodeBlocks(text = "") {
  return text
    .replace(/```[^\n]*\n[\s\S]*?```/g, "")
    .replace(/^\s*\n/, "")
    .replace(/\n\s*$/, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Render readable Markdown while keeping code out of chat.
// Code remains the responsibility of Code Stream.
function MessageContent({ text }) {
  const visibleText = removeFencedCodeBlocks(text);

  if (!visibleText) return null;

  return (
    <div className="cc-message-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}


        components={{
          pre: ({ children }) => {
            const child = React.Children.toArray(children).find(
              (child) => React.isValidElement(child)
            );

            if (!child) return null;

            const className = child.props?.className ?? "";
            const language = className
              .replace("language-", "")
              .toLowerCase();

            const outputLanguages = new Set([
              "text",
              "output",
              "console",
              "terminal",
              "plaintext",
              "plain"
            ]);

            if (!outputLanguages.has(language)) {
              return null;
            }

            return (
              <pre className="cc-output-block">
                {children}
              </pre>
            );
          },

          code: ({ className, children, ...props }) => {
            if (className) {
              const language = className
                .replace("language-", "")
                .toLowerCase();

              const outputLanguages = new Set([
                "text",
                "output",
                "console",
                "terminal",
                "plaintext",
                "plain"
              ]);

              if (!outputLanguages.has(language)) {
                return null;
              }

              return (
                <code className="cc-output-code" {...props}>
                  {children}
                </code>
              );
            }

            return (
              <code className="cc-inline-code" {...props}>
                {children}
              </code>
            );
          },

          a: ({ href, children, ...props }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </a>
          ),
        }}


      >
        {visibleText}
      </ReactMarkdown>
    </div>
  );
}

export default function ConversationPane({
  conversation,
  onNewConversation,
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
  errorMessage,
  errorRetryable,
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

  if (!conversation) {
    return (
      <section className="cc-conversation-pane">
        <div className="cc-welcome-state">
          <div className="cc-welcome-mark">CC</div>
          <h1>Ready when you are.</h1>
          <p>
            Start a conversation to learn something, solve a problem,
            or work through some code.
          </p>
          <button
            className="cc-start-conversation"
            onClick={onNewConversation}
          >
            Start a conversation
          </button>
        </div>

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

                  {message.role === "cc" ? (
                    <MessageContent text={message.text} />
                  ) : (
                    <div className="cc-message-content">
                      {message.role === "user" && message.code
                        ? message.text.replace(message.code, "").trim()
                        : message.text}
                    </div>
                  )}

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
                      {thinkingLong
                        ? "Taking a little longer…"
                        : "Thinking…"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {errorId && (
              <div className="cc-inline-error">
                <div className="cc-inline-error-copy">
                  <strong>Couldn't get a response</strong>
                  <span>
                    {errorMessage ||
                      "Something went wrong. Please try again."}
                  </span>
                </div>

                {errorRetryable && (
                  <button onClick={onRetry}>
                    <Icon name="refresh" size={14} />
                    Retry
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {showJump && (
        <button
          className="cc-jump-latest"
          onClick={scrollToLatest}
        >
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
