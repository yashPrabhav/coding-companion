import Icon from "./Icons";

export default function UndoToast({ visible, onUndo }) {
  if (!visible) return null;

  return (
    <div className="cc-undo-toast">
      <span>Conversation deleted.</span>
      <button onClick={onUndo}>
        <Icon name="undo" size={15} />
        Undo
      </button>
    </div>
  );
}
