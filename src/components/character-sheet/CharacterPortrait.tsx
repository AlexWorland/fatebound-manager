"use client";

interface CharacterPortraitProps {
  name: string;
  imageUrl?: string;
}

export default function CharacterPortrait({ name, imageUrl }: CharacterPortraitProps) {
  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <div className="w-[64px] h-[64px] rounded border border-border-subtle bg-bg-elevated overflow-hidden flex items-center justify-center">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-2xl font-heading text-text-muted select-none">
          {initial}
        </span>
      )}
    </div>
  );
}
