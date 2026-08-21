"use client";

import { useRef, type PointerEvent } from "react";
import Image from "next/image";
import "./ProfileCard.css";

type ProfileCardProps = {
  avatarUrl: string;
  name?: string;
  title?: string;
  handle: string;
  status: string;
  contactText?: string;
};

export default function ProfileCard({
  avatarUrl,
  name,
  title,
  handle,
  status,
  contactText = "Contact",
}: ProfileCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card || event.pointerType === "touch") return;
    const bounds = card.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    card.style.setProperty("--pointer-x", `${x}%`);
    card.style.setProperty("--pointer-y", `${y}%`);
    card.style.setProperty("--rotate-x", `${(50 - y) / 7}deg`);
    card.style.setProperty("--rotate-y", `${(x - 50) / 7}deg`);
  };

  const resetPointer = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--pointer-x", "50%");
    card.style.setProperty("--pointer-y", "50%");
    card.style.setProperty("--rotate-x", "0deg");
    card.style.setProperty("--rotate-y", "0deg");
  };

  return (
    <div className="profile-card-wrap">
      <div ref={cardRef} className="profile-card" onPointerMove={handlePointerMove} onPointerLeave={resetPointer}>
        <div className="profile-card__shine" />
        <Image className="profile-card__avatar" src={avatarUrl} alt={`${name || "Profile"} image`} fill sizes="(max-width: 1024px) 100vw, 40vw" />
        {(name || title) && (
          <div className="profile-card__details">
            {name && <p className="profile-card__name">{name}</p>}
            {title && <p className="profile-card__title">{title}</p>}
          </div>
        )}
        <div className="profile-card__user-info">
          <div>
            <p className="profile-card__handle">@{handle}</p>
            <p className="profile-card__status"><span />{status}</p>
          </div>
          <button type="button" onClick={() => { window.location.hash = "contact"; }} className="profile-card__contact">{contactText}</button>
        </div>
      </div>
    </div>
  );
}
