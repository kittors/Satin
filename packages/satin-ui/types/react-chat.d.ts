// satin-ui/react/chat
import type * as React from "react";
import type { SatinInstance } from "./components";
import type { ChatOptions, ChatApi } from "./heavy";
export const Chat: React.ForwardRefExoticComponent<{ className?: string; style?: React.CSSProperties; id?: string } & ChatOptions & React.RefAttributes<SatinInstance & ChatApi>>;
