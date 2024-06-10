"use client";
import TRANSCRIPT from "../data/trasncript.json";
import AUDIO from "../data/audio.wav";
import { useRef, useState } from "react";

export interface Message {
  content: string;
  role: "agent" | "user";
  start: number;
  end: number;
}
export default function Home() {
  const [progress, setProgress] = useState(0);
  const audio = useRef<HTMLAudioElement>(null);
  const handleCLikc = (time: number) => {
    audio.current!.currentTime = time;
    audio.current?.play();
  };
  return (
    <main className="">
      <div className="grid gap-4">
        {TRANSCRIPT.map((message) => (
          <button
            className={`p-2 max-w-[90%] text-left ${message.role === "user" ? "bg-gray-600 place-self-end" : "bg-gray-800"} rounded ${progress + 1 <= message.start ? "opacity-50" : "opacity-100"}`}
            key={message.start}
            onClick={() => handleCLikc(message.start)}
          >
            {message.content}
          </button>
        ))}
      </div>
      <audio
        ref={audio}
        className="w-full sticky bottom-2 mt-5"
        controls
        src={AUDIO}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
      ></audio>
    </main>
  );
}
