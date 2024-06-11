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
  const shouldAutoScroll = useRef(false);

  const handleCLick = (time: number) => {
    audio.current!.currentTime = time;
    audio.current?.play();
  };

  const handleTime = (time: number) => {
    const newMatch = TRANSCRIPT.findLast((message) => message.start < progress) as Message;

    setProgress(time);
    if (newMatch == null) return;

    if (!shouldAutoScroll.current) {
      shouldAutoScroll.current = true;
      document.getElementById(String(newMatch.start))?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const handleClickMessage = (value: number) => {
    const nextIndexMessage = TRANSCRIPT.findLastIndex((message) => message.start < progress) + value;
    if (nextIndexMessage < 0 || nextIndexMessage >= TRANSCRIPT.length) return;
    audio.current!.currentTime = TRANSCRIPT[nextIndexMessage].start;
    audio.current?.play();
    setProgress(TRANSCRIPT[nextIndexMessage].start);
  };

  return (
    <main>
      <div className="grid gap-4">
        {TRANSCRIPT.map((message) => (
          <button
            id={String(message.start)}
            className={`p-3 max-w-[85%] text-left ${message.role === "user" ? "bg-gray-600 place-self-end" : "bg-gray-800"} rounded ${progress + 1 <= message.start ? "opacity-50" : "opacity-100"}`}
            key={message.start}
            onClick={() => handleCLick(message.start)}
          >
            {message.content}
          </button>
        ))}
      </div>
      <div className="flex sticky gap-2 bottom-2 mt-5 bg-black-700 rounded-full">
        <button onClick={() => handleClickMessage(-1)} className="text-2xl">
          ⏮
        </button>
        <audio
          ref={audio}
          className="w-full"
          controls
          src={AUDIO}
          onTimeUpdate={(e) => handleTime(e.currentTarget.currentTime)}
        ></audio>
        <button onClick={() => handleClickMessage(1)} className="text-2xl">
          ⏯
        </button>
      </div>
    </main>
  );
}
