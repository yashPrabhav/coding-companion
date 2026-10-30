import { useEffect, useMemo, useRef, useState } from "react";


function extractCodeBlocks(text) {
  const codeBlocks = [];

  const supportedLanguages = new Set([
    "python", "py",
    "javascript", "js", "jsx",
    "typescript", "ts", "tsx",
    "java", "cpp", "c++", "c",
    "csharp", "cs", "c#",
    "go", "rust", "ruby", "php",
    "swift", "kotlin", "sql",
    "html", "css", "bash", "sh"
  ]);

  const pattern = /```([a-zA-Z0-9_+#.-]*)[ \t]*\n([\s\S]*?)```/g;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    const language = match[1].trim().toLowerCase();
    const code = match[2].trim();

    // Ignore unlabeled blocks and non-programming formats,
    // such as text, output, console, and terminal.
    if (!supportedLanguages.has(language) || !code) {
      continue;
    }

    codeBlocks.push({
      id: `assistant-stream-${Date.now()}-${codeBlocks.length}`,
      code,
      language,
      source: "assistant"
    });
  }

  return codeBlocks;
}

function removeCodeBlocks(text) {
  return text
    .replace(/```[a-zA-Z0-9_+#.-]*\s*\n[\s\S]*?```/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function useCompanionState() {

  function loadSavedChatState() {
    try {
      const saved = localStorage.getItem("cc_chat_state");
      if (!saved) return { conversations: [], activeId: null };

      const parsed = JSON.parse(saved);

      if (!Array.isArray(parsed.conversations)) {
        return { conversations: [], activeId: null };
      }

      const activeExists = parsed.conversations.some(
        (conversation) => conversation.id === parsed.activeId
      );

      return {
        conversations: parsed.conversations,
        activeId: activeExists ? parsed.activeId : null
      };
    } catch {
      return { conversations: [], activeId: null };
    }
  }

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
  const [errorMessage, setErrorMessage] = useState("");
  const [errorRetryable, setErrorRetryable] = useState(true);
  const pendingRequestRef = useRef(null);
  const [undo, setUndo] = useState(null);
  const [conversations, setConversations] = useState(
    () => loadSavedChatState().conversations
  );

  const [activeId, setActiveId] = useState(
    () => loadSavedChatState().activeId
  );
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
    try {
      localStorage.setItem(
        "cc_chat_state",
        JSON.stringify({
          conversations,
          activeId
        })
      );
    } catch (error) {
      console.error("Could not save chat state:", error);
    }
  }, [conversations, activeId]);

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
    setErrorMessage("");
    pendingRequestRef.current = null;
  }

  function selectConversation(id) {
    setActiveId(id);
    setErrorId(null);
    setErrorMessage("");
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

  function dismissUndo() {
    setUndo(null);
  }

  async function sendMessage(isRetry = false) {
    if (isResponding) return;

    const pendingRequest = isRetry ? pendingRequestRef.current : null;
    if (isRetry && !pendingRequest) return;
    if (!isRetry && (!composer.trim() && !attachedCode.trim())) return;

    const conversationIdAtSend = isRetry ? pendingRequest.conversationId : activeId;
    const conversationAtSend = conversations.find(
      (conversation) => conversation.id === conversationIdAtSend
    );
    if (!conversationAtSend) return;

    const userText = isRetry ? pendingRequest.userText : composer.trim();
    const code = isRetry ? pendingRequest.code : attachedCode.trim();
    const messageText = isRetry
      ? pendingRequest.messageText
      : code
        ? `${userText || "Please help me understand this code."}\n\nAttached code:\n${code}`
        : userText;

    if (!isRetry) {
      const userMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        text: userText,
        code: code || null
      };

      const title =
        conversationAtSend.messages.length === 0 && userText
          ? userText.slice(0, 42) + (userText.length > 42 ? "…" : "")
          : conversationAtSend.title;

      const newStreamEntry = code
        ? { id: `stream-${Date.now()}`, code, source: "user" }
        : null;

      pendingRequestRef.current = {
        conversationId: conversationIdAtSend,
        userMessageId: userMessage.id,
        userText,
        code,
        messageText
      };

      setComposer("");
      setAttachedCode("");

      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === conversationIdAtSend
            ? {
              ...conversation,
              title,
              updated: "Just now",
              hasCode: Boolean(conversation.hasCode || code),
              messages: [...conversation.messages, userMessage],
              codeStreamEntries: code
                ? [...(conversation.codeStreamEntries || []), newStreamEntry]
                : conversation.codeStreamEntries || []
            }
            : conversation
        )
      );

      if (code) {
        setCodeStreamEntries((current) => [
          ...current,
          { id: `stream-${Date.now()}`, code, source: "user" }
        ]);
      }
    }

    setIsResponding(true);
    setThinkingLong(false);
    setErrorId(null);
    setErrorMessage("");

    clearTimeout(responseTimer.current);
    responseTimer.current = setTimeout(() => setThinkingLong(true), 1200);

    let requestTimeout;
    const controller = new AbortController();

    try {

      const history = [
        ...(conversationAtSend.messages || [])
          .filter((message) => message.id !== pendingRequestRef.current?.userMessageId)
          .map(({ role, text }) => ({
            role: role === "cc" ? "assistant" : "user",
            text
          })),
        { role: "user", text: messageText }
      ];

      requestTimeout = setTimeout(() => controller.abort(), 45000);

      const response = await fetch("https://coding-companion-5b9t.onrender.com", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: messageText,
          conversation: history,
          conversationId: String(conversationIdAtSend)
        }),
        signal: controller.signal
      });

      let result = {};
      try {
        result = await response.json();
      } catch {
        result = {};
      }

      if (!response.ok || !result.success || typeof result.reply !== "string") {
        const code = result.code || (response.status === 401 ? "UNAUTHORIZED" : "");
        const error = new Error(result.message || "Coding Companion couldn't complete the request.");
        error.code = code;
        error.retryable = typeof result.retryable === "boolean"
          ? result.retryable
          : response.status === 408 || response.status === 429 || response.status >= 500;
        throw error;
      }

      const generatedCodeEntries = extractCodeBlocks(result.reply);


      const assistantMessage = {
        id: `cc-${Date.now()}`,
        role: "cc",
        text: removeCodeBlocks(result.reply),
        code: generatedCodeEntries.length > 0
          ? generatedCodeEntries.map((entry) => entry.code).join("\n\n")
          : ""
      };

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

      pendingRequestRef.current = null;
      setErrorRetryable(false);
    } catch (error) {

      let friendlyMessage = "Something went wrong while getting a response. Please try again.";
      let retryable = true;

      if (error.name === "AbortError") {
        friendlyMessage = "The request took too long. Your message is still here; try again.";
      } else if (error.code === "RATE_LIMITED") {
        friendlyMessage = error.message || "The chat limit has been reached. Please wait before trying again.";
      } else if (error.code === "AI_UNAVAILABLE") {
        friendlyMessage = "The AI service is temporarily unavailable. Please try again shortly.";
      } else if (error.code === "UNAUTHORIZED") {
        friendlyMessage = "Your session has expired. Please sign in again.";
        retryable = false;
      } else if (error.code === "BAD_REQUEST") {
        friendlyMessage = error.message || "Please check your message and try again.";
        retryable = false;
      } else if (error instanceof TypeError) {
        friendlyMessage = "Couldn't connect to Coding Companion. Check your internet connection and try again.";
      } else if (error.message && error.message !== "Failed to fetch") {
        friendlyMessage = error.message;
      }

      retryable = error.retryable ?? retryable;
      setErrorMessage(friendlyMessage);
      setErrorRetryable(retryable);
      setErrorId(Date.now());
    } finally {
      clearTimeout(requestTimeout);
      clearTimeout(responseTimer.current);
      setIsResponding(false);
      setThinkingLong(false);
    }
  }

  function retryMessage() {
    if (errorRetryable && pendingRequestRef.current) {
      sendMessage(true);
    }
  }


  function loadSavedChatState() {
    try {
      const saved = localStorage.getItem("cc_chat_state");
      if (!saved) return { conversations: [], activeId: null };

      const parsed = JSON.parse(saved);

      if (!Array.isArray(parsed.conversations)) {
        return { conversations: [], activeId: null };
      }

      const activeExists = parsed.conversations.some(
        (conversation) => conversation.id === parsed.activeId
      );

      return {
        conversations: parsed.conversations,
        activeId: activeExists ? parsed.activeId : null
      };
    } catch {
      return { conversations: [], activeId: null };
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
    errorMessage,
    errorRetryable,
    setErrorId,
    undo,
    showJump,
    setShowJump,
    updateActiveConversation,
    newConversation,
    selectConversation,
    deleteConversation,
    restoreDeletedConversation,
    dismissUndo,
    sendMessage,
    retryMessage
  };
}
