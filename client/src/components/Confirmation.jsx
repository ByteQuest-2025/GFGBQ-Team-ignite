import { useEffect } from "react";

const Confirmation = ({ selectedCandidate, onConfirm, onChange }) => {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Enter") onConfirm();
      if (e.key === "Backspace" || e.key === "Escape") onChange();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onConfirm, onChange]);

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-2xl font-bold text-center">Confirm Your Selection</h2>

      <div className="p-6 rounded-xl border text-center bg-gray-50">
        <p className="text-lg">You have selected:</p>
        <p className="mt-2 text-xl font-semibold">{selectedCandidate?.name}</p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onConfirm}
          className="px-6 py-3 rounded-lg bg-green-600 text-white focus:outline-none focus:ring"
        >
          Confirm
        </button>

        <button
          onClick={onChange}
          className="px-6 py-3 rounded-lg bg-gray-300 text-black focus:outline-none focus:ring"
        >
          Change
        </button>
      </div>

      <p className="text-sm text-gray-500">
        Press Enter to confirm, Esc or Backspace to change
      </p>
    </div>
  );
};

export default Confirmation;
