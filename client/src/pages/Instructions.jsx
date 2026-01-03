import { useEffect } from "react";

const Instructions = ({ onContinue }) => {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Enter") onContinue();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onContinue]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center p-6">
      <h1 className="text-3xl font-bold">How to Use</h1>

      <ul className="space-y-3 text-lg max-w-xl">
        <li>Use arrow keys or voice commands to navigate.</li>
        <li>Press Enter or say "select" to choose a candidate.</li>
        <li>You can confirm or change your choice.</li>
        <li>Finally, press the button on the official voting machine.</li>
      </ul>

      <button
        onClick={onContinue}
        className="px-8 py-4 bg-blue-600 text-white rounded-xl text-lg focus:outline-none focus:ring"
      >
        Continue
      </button>

      <p className="text-sm text-gray-500">Press Enter to continue</p>
    </div>
  );
};

export default Instructions;