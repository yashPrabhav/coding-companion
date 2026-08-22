export const demoConversations = [
  {
    id: 1,
    title: "Learning Python loops",
    hasCode: true,
    updated: "Just now",
    messages: [
      { id: "m1", role: "cc", text: "Welcome to Coding Companion. What would you like to learn today?" },
      { id: "m2", role: "user", text: "Teach me Python loops. I know variables and lists." },
      {
        id: "m3",
        role: "cc",
        text: "Good starting point. Let's build from what you already know. A loop lets you repeat work without writing the same instruction again and again.",
        code: "for number in numbers:\\n    print(number)"
      }
    ],
    code: "",
    codeStreamEntries: []
  },
  {
    id: 2,
    title: "Build a calculator",
    hasCode: false,
    updated: "Yesterday",
    messages: [
      { id: "m1", role: "user", text: "I want to build a calculator in Python." },
      { id: "m2", role: "cc", text: "Let's build it step by step. First, decide what operations your calculator should support." }
    ],
    code: "",
    codeStreamEntries: []
  },
  {
    id: 3,
    title: "Two pointers practice",
    hasCode: true,
    updated: "2 days ago",
    messages: [
      {
        id: "m1",
        role: "cc",
        text: "Try describing the problem in your own words before we write code.",
        code: "left = 0\\nright = len(values) - 1"
      }
    ],
    code: "",
    codeStreamEntries: []
  }
];
