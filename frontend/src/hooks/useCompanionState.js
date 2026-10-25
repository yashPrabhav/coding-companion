import { useEffect, useMemo, useRef, useState } from "react";
import { demoConversations } from "../data/demoConversations";

function extractCodeBlocks(text) {
  const codeBlocks = [];
  const pattern = /```([a-zA-Z0-9_+#.-]*)\s*\n([\s\S]*?)```/g;

  let match;
  while ((match = pattern.exec(text)) !== null) {
    const code = match[2].trim();

    if (code) {
      codeBlocks.push({
        id: `assistant-stream-${Date.now()}-${codeBlocks.length}`,
        code,
        language: match[1] || "text",
        source: "assistant"
      });
    }
  }

  return codeBlocks;
}

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
          code: "",
          codeStreamEntries: []
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

  async function sendMessage() {
    if (isResponding || (!composer.trim() && !attachedCode.trim())) return;

    const userText = composer.trim();
    const code = attachedCode.trim();
    const messageText = code
      ? `${userText || "Please help me understand this code."}\n\nAttached code:\n${code}`
      : userText;
    const conversationIdAtSend = activeId;

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
      ? { id: `stream-${Date.now()}`, code, source: "user" }
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
        { id: `stream-${Date.now()}`, code, source: "user" }
      ]);
    }

    setIsResponding(true);
    setThinkingLong(false);
    setErrorId(null);

    clearTimeout(responseTimer.current);
    responseTimer.current = setTimeout(() => setThinkingLong(true), 1200);

    try {
      const token = localStorage.getItem("cc_auth_token");
      if (!token) {
        throw new Error("You're not logged in. Please log in and try again.");
      }

      const history = [
        ...(activeConversation.messages || []).map(({ role, text }) => ({
          role: role === "cc" ? "assistant" : "user",
          text
        })),
        { role: "user", text: messageText }
      ];

      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          message: messageText,
          conversation: history
        })
      });

      const result = await response.json();
      if (!response.ok || !result.success || typeof result.reply !== "string") {
        throw new Error(result.message || "The backend could not generate a reply.");
      }

      const assistantMessage = {
        id: `cc-${Date.now()}`,
        role: "cc",
        text: result.reply
      };
      const generatedCodeEntries = extractCodeBlocks(result.reply);

      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === conversationIdAtSend
            ? {
                ...conversation,
                messages: [...conversation.messages, assistantMessage],
                codeStreamEntries: [
                  ...(conversation.codeStreamEntries || []),
                  ...generatedCodeEntries
                ],
                hasCode:
                  conversation.hasCode || generatedCodeEntries.length > 0,
                updated: "Just now"
              }
            : conversation
        )
      );
    } catch (error) {
      console.error("Coding Companion chat failed:", error);
      setErrorId(Date.now());
    } finally {
      clearTimeout(responseTimer.current);
      setIsResponding(false);
      setThinkingLong(false);
    }
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
