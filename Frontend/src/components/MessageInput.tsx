import { useState } from "react";

interface Props {
  onSend: (message: string) => void;
}

export function MessageInput({ onSend }: Props) {
  const [value, setValue] = useState("");

  const submit = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  return (
    <div className="flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 border rounded p-2"
        placeholder="Écrire un message..."
        onKeyDown={(e) => e.key === "Enter" && submit()}
      />
      <button onClick={submit} className="px-4 bg-blue-500 text-white rounded">
        Envoyer
      </button>
    </div>
  );
}
