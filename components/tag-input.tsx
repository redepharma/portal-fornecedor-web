"use client";

import { Input } from "@heroui/react";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

interface TagInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onInputValueChange?: (input: string) => void;
}

export function TagInput({
  label,
  placeholder,
  value,
  onChange,
  onInputValueChange,
}: TagInputProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const lista = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    setTags(lista);
  }, [value]);

  const adicionarTag = (tag: string) => {
    const nova = tag.trim();

    if (/^\d+$/.test(nova) && !tags.includes(nova)) {
      const novas = [...tags, nova];

      setTags(novas);
      onChange(novas.join(", "));
    }
    setInputValue("");
  };

  const removerTag = (tag: string) => {
    const novas = tags.filter((t) => t !== tag);

    setTags(novas);
    onChange(novas.join(","));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      adicionarTag(inputValue);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permite somente números (e limpa espaços e vírgulas)
    const apenasNumeros = value.replace(/[^\d]/g, "");

    setInputValue(apenasNumeros);
    onInputValueChange?.(apenasNumeros);
  };

  return (
    <div className="flex flex-col gap-2">
      <Input
        label={label}
        placeholder={placeholder || "Digite e pressione Enter"}
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 bg-zinc-100 px-2 py-1 rounded-full text-sm"
            >
              {tag}
              <button
                className="text-zinc-500 hover:text-zinc-800"
                type="button"
                onClick={() => removerTag(tag)}
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
