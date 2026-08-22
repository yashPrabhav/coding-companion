import {
  FiAlignJustify,
  FiChevronDown,
  FiCode,
  FiHelpCircle,
  FiMenu,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiSend,
  FiSettings,
  FiTrash2,
  FiX,
  FiPaperclip,
  FiCornerUpLeft
} from "react-icons/fi";

const icons = {
  menu: FiMenu,
  plus: FiPlus,
  search: FiSearch,
  settings: FiSettings,
  send: FiSend,
  code: FiCode,
  attach: FiPaperclip,
  close: FiX,
  undo: FiCornerUpLeft,
  refresh: FiRefreshCw,
  chevron: FiChevronDown,
  trash: FiTrash2,
  help: FiHelpCircle,
  grip: FiAlignJustify
};

export default function Icon({ name, size = 18, ...props }) {
  const Component = icons[name];
  if (!Component) return null;
  return <Component size={size} aria-hidden="true" {...props} />;
}
