import { ArrowLeft } from "@phosphor-icons/react";

interface Props {
  color: string;
  onClick: () => void;
  label?: string;
}

export function BackButton({ color, onClick, label = "Wróć" }: Props) {
  return (
    <button
      className="back-button"
      style={{ color }}
      onClick={onClick}
      aria-label={label}
    >
      <ArrowLeft size={24} weight="bold" />
      <span>{label}</span>
    </button>
  );
}
