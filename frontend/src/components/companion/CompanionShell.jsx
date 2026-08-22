import { useEffect, useState } from "react";
import { useCompanionState } from "../../hooks/useCompanionState";
import CodeStream from "./CodeStream";
import CodeWorkspace from "./CodeWorkspace";
import ConversationList from "./ConversationList";
import ConversationPane from "./ConversationPane";
import SettingsModal from "./SettingsModal";
import TopBar from "./TopBar";
import UndoToast from "./UndoToast";

export default function CompanionShell() {
  const state = useCompanionState();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [conversationsOpen, setConversationsOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [leftWidth, setLeftWidth] = useState(55);

  useEffect(() => {
    function handleMove(event) {
      if (!dragging) return;

      const workspace = document.querySelector(".cc-workspace");
      if (!workspace) return;

      const rect = workspace.getBoundingClientRect();
      const percentage =
        ((event.clientX - rect.left) / rect.width) * 100;

      setLeftWidth(Math.min(72, Math.max(38, percentage)));
    }

    function handleUp() {
      setDragging(false);
    }

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [dragging]);

  function openEditor() {
    // The editor is the source of truth for the learner's current draft.
    // Never seed it from conversation messages.
    state.setEditorCode(state.workspaceCode || "");
    state.setEditorOpen(true);
  }

  function attachCode() {
    const code = state.editorCode.trim();
    if (!code) return;

    // Attach means: send this code through the shared composer.
    // The workspace is cleared immediately after the attachment is made.
    state.setAttachedCode(code);
    state.setWorkspaceCode("");
    state.setEditorCode("");
    state.setEditorOpen(false);
  }

  function insertCodeIntoWorkspace(code) {
    const value = code?.trim();
    if (!value) return;

    // Insert is the ONLY path by which CC-generated code enters the workspace.
    state.setWorkspaceCode(value);
    state.setEditorCode(value);
    state.setCodeOpen(true);
  }

  function retry() {
    state.setErrorId(null);
    // Real retry behavior will be connected when the LLM service is wired in.
  }

  return (
    <div className="cc-app">
      <TopBar
        onNewChat={() => {
          state.newConversation();
          setMobileNavOpen(false);
        }}
        onOpenConversations={() => {
          setConversationsOpen((value) => !value);
          setMobileNavOpen(false);
        }}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenMobileNav={() => setMobileNavOpen(true)}
      />

      <div className="cc-body">
        <div className={mobileNavOpen ? "cc-drawer-scrim" : ""}>
          {mobileNavOpen && (
            <button
              className="cc-drawer-scrim"
              onClick={() => setMobileNavOpen(false)}
              aria-label="Close navigation"
            />
          )}
        </div>

        {conversationsOpen && (
          <div className={`cc-sidebar-wrapper ${mobileNavOpen ? "drawer-open" : ""}`}>
            <ConversationList
              conversations={state.filteredConversations}
              activeId={state.activeId}
              search={state.search}
              onSearchChange={state.setSearch}
              onSelect={(id) => {
                state.selectConversation(id);
                setMobileNavOpen(false);
              }}
              onDelete={state.deleteConversation}
              onNewChat={() => {
                state.newConversation();
                setMobileNavOpen(false);
              }}
              onCloseMobile={() => setMobileNavOpen(false)}
              onOpenSettings={() => setSettingsOpen(true)}
            />
          </div>
        )}

        <main
          className={`cc-workspace ${conversationsOpen ? "" : "conversations-hidden"
            } ${state.codeOpen ? "" : "code-hidden"}`}
          style={{ "--cc-left-width": `${leftWidth}%` }}
        >
          <ConversationPane
            conversation={state.activeConversation}
            codeOpen={state.codeOpen}
            onToggleCode={() => state.setCodeOpen((value) => !value)}
            composer={state.composer}
            setComposer={state.setComposer}
            attachedCode={state.attachedCode}
            setAttachedCode={state.setAttachedCode}
            onOpenEditor={openEditor}
            onSend={state.sendMessage}
            isResponding={state.isResponding}
            thinkingLong={state.thinkingLong}
            errorId={state.errorId}
            onRetry={retry}
            showJump={state.showJump}
            setShowJump={state.setShowJump}
          />

          {state.codeOpen && (
            <>
              <div
                className={`cc-splitter ${dragging ? "dragging" : ""}`}
                onMouseDown={() => setDragging(true)}
                role="separator"
                aria-label="Resize conversation and code panels"
                tabIndex="0"
              />

              <CodeStream
                codeStreamEntries={state.activeConversation?.codeStreamEntries || []}
                onClose={() => state.setCodeOpen(false)}
                onOpenEditor={openEditor}
                onInsertCode={insertCodeIntoWorkspace}
              />
            </>
          )}
        </main>
      </div>

      <CodeWorkspace
        open={state.editorOpen}
        code={state.editorCode}
        onChange={(value) => {
          state.setEditorCode(value);
          state.setWorkspaceCode(value);
        }}
        onClose={() => state.setEditorOpen(false)}
        onAttach={attachCode}
      />

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      <UndoToast
        visible={Boolean(state.undo)}
        onUndo={state.restoreDeletedConversation}
      />
    </div>
  );
}
