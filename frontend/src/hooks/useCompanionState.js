import { useEffect, useMemo, useRef, useState } from "react";
import { demoConversations } from "../data/demoConversations";

export function useCompanionState() {
  const [conversations, setConversations] = useState(demoConversations);
  const [activeId, setActiveId] = useState(1);
  const [search, setSearch] = useState("");
  const [codeOpen, setCodeOpen] = useState(true);
  const [composer, setComposer] = useState("");
  const [attachedCode, setAttachedCode] = useState("");
  const [workspaceCode, setWorkspaceCode] = useState("");
  const [codeStreamEntries, setCodeStreamEntries] = useState([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorCode, setEditorCode] = useState("");
  const [isResponding, setIsResponding] = useState(false);
  const [thinkingLong, setThinkingLong] = useState(false);
  const [errorId, setErrorId] = useState(null);
  const [undo, setUndo] = useState(null);
  const [showJump, setShowJump] = useState(false);
  const responseTimer = useRef(null);

  const activeConversation =
    conversations.find((conversation) => conversation.id === activeId) ??
    conversations[0];

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return conversations;
    return conversations.filter((conversation) =>
      conversation.title.toLowerCase().includes(query)
    );
  }, [conversations, search]);

  useEffect(() => {
    // The code workspace is an independent learner workspace.
    // Switching conversations must not silently import code from messages.
    setWorkspaceCode("");
    setAttachedCode("");
  }, [activeId]);

  useEffect(() => {
    return () => clearTimeout(responseTimer.current);
  }, []);

  function updateActiveConversation(patch) {
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === activeId
          ? { ...conversation, ...patch }
          : conversation
      )
    );
  }

  function newConversation() {
    const id = Date.now();
    const conversation = {
      id,
      title: "New conversation",
      hasCode: false,
      updated: "Just now",
      messages: [],
      code: "",
      codeStreamEntries: []
    };

    setConversations((current) => [conversation, ...current]);
    setActiveId(id);
    setComposer("");
    setAttachedCode("");
    setCodeOpen(false);
    setErrorId(null);
  }

  function selectConversation(id) {
    setActiveId(id);
    setErrorId(null);
  }

  function deleteConversation(id) {
    const deleted = conversations.find((conversation) => conversation.id === id);
    if (!deleted) return;

    const remaining = conversations.filter((conversation) => conversation.id !== id);
    setConversations(remaining);

    if (activeId === id) {
      if (remaining.length > 0) {
        setActiveId(remaining[0].id);
      } else {
        const newId = Date.now();
        setConversations([{
          id: newId,
          title: "New conversation",
          hasCode: false,
          updated: "Just now",
          messages: [],
          code: ""
        }]);
        setActiveId(newId);
        setCodeOpen(false);
      }
    }

    setUndo({
      deleted,
      index: conversations.findIndex((conversation) => conversation.id === id)
    });
  }

  function restoreDeletedConversation() {
    if (!undo) return;

    setConversations((current) => {
      const next = [...current];
      next.splice(Math.min(undo.index, next.length), 0, undo.deleted);
      return next;
    });

    setActiveId(undo.deleted.id);
    setUndo(null);
  }

  function sendMessage() {
    if (isResponding || (!composer.trim() && !attachedCode.trim())) return;

    const userText = composer.trim();
    const code = attachedCode.trim();

    // Clear UI immediately.
    setComposer("");
    setAttachedCode("");

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: userText,
      code: code || null
    };

    const title =
      activeConversation.messages.length === 0 && userText
        ? userText.slice(0, 42) + (userText.length > 42 ? "…" : "")
        : activeConversation.title;

    const newStreamEntry = code
      ? {
        id: `stream-${Date.now()}`,
        code,
        source: "user"
      }
      : null;

    updateActiveConversation({
      title,
      updated: "Just now",
      hasCode: Boolean(activeConversation.hasCode || code),
      messages: [...activeConversation.messages, userMessage],
      codeStreamEntries: code
        ? [...(activeConversation.codeStreamEntries || []), newStreamEntry]
        : activeConversation.codeStreamEntries || []
    });

    if (code) {
      setCodeStreamEntries((current) => [
        ...current,
        {
          id: `stream-${Date.now()}`,
          code,
          source: "user"
        }
      ]);
    }

    setIsResponding(true);
    setThinkingLong(false);
    setErrorId(null);

    responseTimer.current = setTimeout(() => {
      setThinkingLong(true);
    }, 1200);

    setTimeout(() => {
      const response = {
        id: `cc-${Date.now()}`,
        role: "cc",
        text: code
          ? "I can work with that code. Let's look at what it is doing first, then we can decide what to improve."
          : "Let's work through that together. I'll adapt the explanation to what you already know instead of jumping straight to a solution."
      };

      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === activeId
            ? {
              ...conversation,
              messages: [...conversation.messages, response],
              updated: "Just now"
            }
            : conversation
        )
      );

      setIsResponding(false);
      setThinkingLong(false);
      clearTimeout(responseTimer.current);
    }, 2300);
  }

  return {
    conversations,
    filteredConversations,
    activeConversation,
    activeId,
    search,
    setSearch,
    codeOpen,
    setCodeOpen,
    composer,
    setComposer,
    attachedCode,
    setAttachedCode,
    workspaceCode,
    setWorkspaceCode,
    codeStreamEntries,
    editorOpen,
    setEditorOpen,
    editorCode,
    setEditorCode,
    isResponding,
    thinkingLong,
    errorId,
    setErrorId,
    undo,
    showJump,
    setShowJump,
    updateActiveConversation,
    newConversation,
    selectConversation,
    deleteConversation,
    restoreDeletedConversation,
    sendMessage
  };
}
