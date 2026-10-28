
import { useEffect } from "react";
import Icon from "./Icons";

export default function UndoToast({ visible, onUndo, onDismiss }) {
  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      onDismiss();
    }, 5000);

    return () => clearTimeout(timer);
  }, [visible, onDismiss]);

  if (!visible) return null;

  return (
    <div className="cc-undo-toast">
      <span>Conversation deleted.</span>

      <button onClick={onUndo}>
        <Icon name="undo" size={15} />
        Undo
      </button>

      <button onClick={onDismiss} aria-label="Dismiss notification">
        <Icon name="close" size={15} />
      </button>
    </div>
  );
}
