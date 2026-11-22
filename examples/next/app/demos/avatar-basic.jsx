"use client";
import { Avatar } from "satin-ui/react";

export default function AvatarSizes() {
  return (
    <div className="sn-row">
      {[16, 20, 24, 32, 40, 64].map((size) => <Avatar key={size} name="张伟" size={size} />)}
    </div>
  );
}
