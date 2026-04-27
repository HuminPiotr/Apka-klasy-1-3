import {
  Lightning,
  MagnifyingGlass,
  Leaf,
  Cube,
  TextAa,
  Cloud,
  Question,
  Wind,
  ArrowLeft,
} from "@phosphor-icons/react";

const ICONS: Record<string, React.ComponentType<{ size?: number; color?: string; weight?: "fill" | "regular" | "bold" | "duotone" | "light" | "thin" }>> = {
  Lightning,
  MagnifyingGlass,
  Leaf,
  Cube,
  TextAa,
  Cloud,
  Question,
  Wind,
  ArrowLeft,
};

interface Props {
  name: string;
  size?: number;
  color?: string;
}

export function WorldIcon({ name, size = 40, color }: Props) {
  const Icon = ICONS[name];
  if (!Icon) return null;
  return <Icon size={size} color={color} weight="fill" />;
}
