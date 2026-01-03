import { useEffect, useState } from "react";

const modes = [
  { id: "audio", label: "Audio / Screen Reader" },
  { id: "high-contrast", label: "High Contrast & Large Text" },
  { id: "keyboard", label: "Keyboard / Switch Navigation" },
  { id: "voice", label: "Voice Navigation" },
];

const ModeSelection = ({ onSelect }) => {
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowDown") {
        setFocusedIndex((prev) => Math.min(prev + 1, modes.length - 1));
      }
      if (e.key === "ArrowUp") {
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
      }
      if (e.key === "Enter") {
        onSelect(modes[focusedIndex].id);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [focusedIndex, onSelect]);

  return (
    <div className="min-h-screen flex flex-col justify-center gap-6 p-6">
      <h1 className="text-3xl font-bold text-center">
        Select Accessibility Mode
      </h1>

      <ul role="listbox" aria-label="Accessibility modes" className="space-y-4 max-w-md mx-auto">
        {modes.map((mode, index) => (
          <li
            key={mode.id}
            role="option"
            aria-selected={focusedIndex === index}
            tabIndex={focusedIndex === index ? 0 : -1}
            className={`p-5 rounded-xl border cursor-pointer text-lg text-center focus:outline-none ${
              focusedIndex === index
                ? "bg-blue-600 text-white"
                : "bg-white text-black"
            }`}
            onClick={() => onSelect(mode.id)}
          >
            {mode.label}
          </li>
        ))}
      </ul>

      <p className="text-center text-sm text-gray-500">
        Use ↑ ↓ keys to navigate, Enter to select
      </p>
    </div>
  );
};

export default ModeSelection;