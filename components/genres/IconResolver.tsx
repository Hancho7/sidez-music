// components/genres/IconResolver.tsx
// Resolves string icon names to actual Lucide components
import {
  Mic2, Music2, Headphones, Radio, Zap, Heart, Star, Cloud,
  Flame, Waves, Drum, Guitar, Volume2, AudioLines, Tag,
} from "lucide-react";
import type { LucideProps } from "lucide-react";

const ICON_MAP: Record<string, React.FC<LucideProps>> = {
  Mic2, Music2, Headphones, Radio, Zap, Heart, Star, Cloud,
  Flame, Waves, Drum, Guitar, Volume2, AudioLines, Tag,
};

interface Props {
  name: string;
  size?: number;
  color?: string;
}

export default function IconResolver({ name, size = 20, color }: Props) {
  const Icon = ICON_MAP[name] ?? Tag;
  return <Icon size={size} color={color} />;
}
