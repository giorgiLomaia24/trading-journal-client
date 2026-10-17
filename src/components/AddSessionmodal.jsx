// ==================== ADD TRADING SESSION MODAL ====================
import React, { useState, useEffect } from "react";
import InputField from "./InputField";
import Button from "./Button";
import { useSessionStore } from "../store/useSessionStore";
import useScrollLock from "../hooks/useScrollLock";

const MAX_NAME_LENGTH = 30;

export default function AddSessionModal({ isOpen, onClose, onSaved }) {
  const createSession = useSessionStore((s) => s.createSession);

  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useScrollLock(isOpen);

  // ყოველ გახსნაზე სუფთა ფორმა
  useEffect(() => {
    if (isOpen) {
      setName("");
      setError("");
      setSaving(false);
    }
  }, [isOpen]);

  // Escape ხურავს მხოლოდ ამ პატარა მოდალს
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    const trimmed = name.trim().replace(/\s+/g, " ");
    if (!trimmed) {
      setError("Session name is required");
      return;
    }
    if (trimmed.length > MAX_NAME_LENGTH) {
      setError(`Max ${MAX_NAME_LENGTH} characters`);
      return;
    }

    setSaving(true);
    setError("");
    const result = await createSession(trimmed);
    setSaving(false);

    if (result.success) {
      if (onSaved) onSaved(result.session);
    } else {
      setError(result.message);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto overscroll-contain cursor-zoom-out animate-in fade-in duration-150"
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-[#09090b] border border-[#1f2023] rounded-xl p-5 shadow-2xl relative my-auto cursor-default space-y-4 animate-in zoom-in-95 duration-150 text-left font-sans"
      >
        <div className="border-b border-[#1f2023]/60 pb-3 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-0 right-0 text-[#4b5563] hover:text-[#0ecb81] transition-colors cursor-pointer text-sm font-bold"
          >
            ✕
          </button>
          <h2 className="text-md font-black tracking-tight text-[#f3f4f6] flex items-center gap-2">
            <span className="text-[#0ecb81]">🕒</span> Add Trading Session
          </h2>
          <p className="text-[11px] text-[#6b7280] font-semibold mt-0.5">
            Name a session you trade in, e.g. London Open.
          </p>
        </div>

        {error && (
          <div className="p-2.5 bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg text-xs text-[#ef4444] font-medium text-center">
            {error}
          </div>
        )}

        <InputField
          label="Session Name *"
          type="text"
          placeholder="e.g., London Open, NY PM, Asia"
          value={name}
          onChange={(v) => { setName(v.slice(0, MAX_NAME_LENGTH)); if (error) setError(""); }}
        />

        <div className="pt-1 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="!text-xs !py-2.5 px-5">
            Cancel
          </Button>
          <Button
            variant="solid"
            type="submit"
            disabled={saving || !name.trim()}
            className="!bg-[#0ecb81] !text-[#040405] font-black hover:!bg-[#0bb572] !text-xs !py-2.5 px-6 shadow-lg disabled:opacity-40 disabled:pointer-events-none"
          >
            {saving ? "Saving..." : "+ Add Session"}
          </Button>
        </div>
      </form>
    </div>
  );
}