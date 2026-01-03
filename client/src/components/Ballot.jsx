import { useEffect, useState } from "react";

const Ballot = ({ candidates, onSelect }) => {
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowDown") {
        setFocusedIndex((prev) => Math.min(prev + 1, candidates.length - 1));
      }
      if (e.key === "ArrowUp") {
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
      }
      if (e.key === "Enter") {
        onSelect(candidates[focusedIndex]);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [focusedIndex, candidates, onSelect]);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-center">Select a Candidate</h2>

      <ul role="listbox" aria-label="Candidate list" className="space-y-3">
        {candidates.map((candidate, index) => (
          <li
            key={index}
            role="option"
            aria-selected={focusedIndex === index}
            tabIndex={focusedIndex === index ? 0 : -1}
            className={`p-4 rounded-lg border cursor-pointer focus:outline-none ${
              focusedIndex === index
                ? "bg-blue-600 text-white"
                : "bg-white text-black"
            }`}
            onClick={() => onSelect(candidate)}
          >
            {candidate.name}
          </li>
        ))}
      </ul>

      <p className="text-center text-sm text-gray-500">
        Use ↑ ↓ keys to navigate, Enter to select
      </p>
    </div>
  );
};

export default Ballot;
