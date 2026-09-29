"use client";

import { useEffect, useMemo, useState } from "react";

type Phase =
  | "interphase"
  | "m1p" | "m1m" | "m1a" | "m1t"
  | "m2p" | "m2m" | "m2a" | "m2t";

type Card = {
  id: string;
  phase: Phase;
  kind: "image" | "text";
  text?: string;
};

type Placed = Record<Phase, Card[]>;

function emptyPlaced(): Placed {
  return {
    interphase: [],
    m1p: [],
    m1m: [],
    m1a: [],
    m1t: [],
    m2p: [],
    m2m: [],
    m2a: [],
    m2t: [],
  };
}

const PHASES: { id: Phase; label: string }[] = [
  { id: "interphase", label: "간기" },
  { id: "m1p", label: "감수 1분열 전기" },
  { id: "m1m", label: "감수 1분열 중기" },
  { id: "m1a", label: "감수 1분열 후기" },
  { id: "m1t", label: "감수 1분열 말기" },
  { id: "m2p", label: "감수 2분열 전기" },
  { id: "m2m", label: "감수 2분열 중기" },
  { id: "m2a", label: "감수 2분열 후기" },
  { id: "m2t", label: "감수 2분열 말기" },
];

const TEXTS: Record<Phase, [string, string]> = {
  interphase: ["핵막이 뚜렷하고 핵 속에 염색사의 형태로 존재", "DNA가 복제되어 DNA양이 2배가 됨"],
  m1p: ["핵막이 사라지고 상동 염색체가 접합함", "상동 염색체끼리 결합한 2가 염색체가 나타남"],
  m1m: ["2가 염색체가 세포 중앙에 나란히 배열됨", "방추사가 2가 염색체에 연결됨"],
  m1a: ["상동 염색체가 서로 분리되어 양극으로 이동함", "상동 염색체가 분리됨"],
  m1t: ["핵막이 생기고 세포질 분열이 일어남", "세포질 분열이 일어나 2개의 세포를 형성함"],
  m2p: ["유전 물질의 복제 없이 감수 2분열이 시작됨", "감수 1분열이 끝난 뒤 바로 시작됨"],
  m2m: ["각 세포에서 염색체가 세포 중앙에 배열됨", "염색체가 중앙에 배열됨"],
  m2a: ["한 염색체를 이루던 두 염색 분체가 분리됨", "분리된 염색 분체가 각각 양극으로 이동함"],
  m2t: ["염색체가 풀리고 세포질 분열이 일어남", "염색체 수가 절반인 딸세포 4개가 만들어짐"],
};

const CARDS: Card[] = PHASES.flatMap(({ id }) => [
  { id: `img-${id}`, phase: id, kind: "image" as const },
  { id: `txt-${id}-1`, phase: id, kind: "text" as const, text: TEXTS[id][0] },
  { id: `txt-${id}-2`, phase: id, kind: "text" as const, text: TEXTS[id][1] },
]);

function shuffle<T>(items: T[]) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const MEIOSIS_SPRITE = "data:image/webp;base64,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";

const INTERPHASE_IMAGE = "data:image/webp;base64,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";

const SPRITE_POS: Record<Exclude<Phase, "interphase">, string> = {
  m1p: "0% 0%",
  m1m: "33.333% 0%",
  m1a: "66.667% 0%",
  m1t: "100% 0%",
  m2p: "0% 100%",
  m2m: "33.333% 100%",
  m2a: "66.667% 100%",
  m2t: "100% 100%",
};

function PhaseArt({ phase }: { phase: Phase }) {
  if (phase === "interphase") {
    return (
      <div
        className="h-full w-full bg-white bg-contain bg-center bg-no-repeat"
        aria-label="간기"
        role="img"
        style={{ backgroundImage: `url(${INTERPHASE_IMAGE})` }}
      />
    );
  }

  return (
    <div
      className="h-full w-full bg-white bg-no-repeat"
      aria-label={PHASES.find((p) => p.id === phase)?.label}
      role="img"
      style={{
        backgroundImage: `url(${MEIOSIS_SPRITE})`,
        backgroundSize: "400% 200%",
        backgroundPosition: SPRITE_POS[phase],
      }}
    />
  );
}

function points(elapsed:number) {
  if (elapsed < 0.7) return 5;
  if (elapsed < 1.4) return 4;
  if (elapsed < 2.1) return 3;
  if (elapsed < 3) return 2;
  return 1;
}

export function MeiosisGame() {
  const [deck,setDeck]=useState<Card[]>([]);
  const [index,setIndex]=useState(0);
  const [status,setStatus]=useState<"idle"|"playing"|"finished">("idle");
  const [score,setScore]=useState(0);
  const [lives,setLives]=useState(5);
  const [started,setStarted]=useState(0);
  const [flash,setFlash]=useState<Phase|null>(null);
  const [showAnswers,setShowAnswers]=useState(false);
  const [best,setBest]=useState<number|null>(null);
  const [placed,setPlaced]=useState<Placed>(emptyPlaced());

  useEffect(()=>{ const v=localStorage.getItem("meiosis-best"); if(v) setBest(Number(v)); },[]);
  const card = status==="playing" ? deck[index] : undefined;
  const progress = deck.length ? Math.min(index,deck.length) : 0;

  const start=()=>{
    setDeck(shuffle(CARDS)); setIndex(0); setScore(0); setLives(5);
    setStatus("playing"); setStarted(Date.now()); setFlash(null); setShowAnswers(false);
    setPlaced(emptyPlaced());
  };

  const choose=(phase:Phase)=>{
    if(!card || status!=="playing") return;
    if(phase!==card.phase){
      setScore(s=>Math.max(0,s-1)); setLives(l=>Math.max(0,l-1)); setFlash(card.phase);
      setTimeout(()=>setFlash(null),600);
      if(lives<=1) finish(score);
      return;
    }
    const gain=points((Date.now()-started)/1000);
    const nextScore=score+gain;
    setScore(nextScore);
    setPlaced(prev=>({...prev,[phase]:[...prev[phase],card]}));
    if(index===deck.length-1){ finish(nextScore); return; }
    setIndex(i=>i+1); setStarted(Date.now()); setFlash(null);
  };

  const finish=(finalScore:number)=>{
    setStatus("finished");
    const old=Number(localStorage.getItem("meiosis-best")||"0");
    if(finalScore>old){ localStorage.setItem("meiosis-best",String(finalScore)); setBest(finalScore); }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-bold text-zinc-900">감수분열 카드 게임</h1>
        <p className="mt-1 text-sm text-zinc-500">카드를 보고 알맞은 감수분열 시기를 선택하세요.</p>
      </div>

      <div className="mb-4 flex justify-center gap-1 text-2xl" aria-label={`남은 목숨 ${lives}`}>
        {Array.from({length:5}).map((_,i)=><span key={i} className={i<lives?"text-rose-500":"text-zinc-200"}>♥</span>)}
      </div>

      <div className="grid grid-cols-4 gap-2 md:grid-cols-9">
        {PHASES.map(p=>{
          const hasImage = placed[p.id].some(card=>card.kind==="image");
          return (
            <button key={p.id} onClick={()=>choose(p.id)}
              className={`${hasImage ? "min-h-24" : "min-h-16"} relative overflow-hidden rounded-xl border bg-white p-2 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${flash===p.id?"border-amber-400 ring-2 ring-amber-300":"border-zinc-200"}`}>
              {hasImage && (
                <div className="absolute inset-x-1 bottom-1 top-7">
                  <PhaseArt phase={p.id}/>
                </div>
              )}
              <div className={`relative z-10 text-[11px] font-semibold text-zinc-700 sm:text-xs ${hasImage ? "mx-auto w-fit rounded bg-white/90 px-1.5 py-0.5 shadow-sm" : ""}`}>
                {p.label}
              </div>
            </button>
          );
        })}
      </div>

      <div className="my-5 flex items-end justify-center gap-3">
        <span className="font-mono text-5xl font-bold">{score}</span>
        {best!==null && <span className="font-mono text-2xl text-zinc-400">({best})</span>}
      </div>

      <section className="mx-auto flex min-h-72 max-w-2xl items-center justify-center rounded-2xl border border-zinc-200 bg-white/90 p-6 shadow-sm">
        {status==="idle" && (
          <div className="text-center">
            <p className="mb-5 text-sm leading-6 text-zinc-600">그림 카드 9장과 특징 카드 18장, 총 27장이 무작위로 나옵니다.<br/>그림 카드도 문제로 등장하며, 맞힌 그림은 해당 시기 칸에 계속 남습니다.<br/>빠르게 맞힐수록 높은 점수를 얻습니다.</p>
            <button onClick={start} className="rounded-full bg-amber-600 px-7 py-3 font-semibold text-white hover:bg-amber-700">게임 시작</button>
          </div>
        )}

        {status==="playing" && card && (
          <div className="w-full text-center">
            <div className="mb-3 text-xs text-zinc-400">{progress+1} / {deck.length}</div>
            {card.kind==="image" ? (
              <div className="mx-auto h-52 max-w-sm rounded-2xl bg-orange-50 p-5"><PhaseArt phase={card.phase}/></div>
            ) : (
              <div className="mx-auto flex min-h-52 max-w-xl items-center justify-center rounded-2xl bg-amber-50 px-8 text-xl font-bold leading-8 text-zinc-800">{card.text}</div>
            )}
            <p className="mt-4 text-sm text-zinc-500">위 카드가 어느 시기에 해당하는지 위의 칸을 누르세요.</p>
          </div>
        )}

        {status==="finished" && (
          <div className="text-center">
            <p className="text-sm text-zinc-500">게임 종료</p>
            <p className="my-3 font-mono text-6xl font-bold">{score}</p>
            <button onClick={start} className="rounded-full bg-amber-600 px-7 py-3 font-semibold text-white hover:bg-amber-700">다시 하기</button>
          </div>
        )}
      </section>

      <div className="mt-5 text-center">
        <button onClick={()=>setShowAnswers(v=>!v)} className="rounded-full border border-zinc-300 bg-white px-5 py-2 text-sm text-zinc-600">
          {showAnswers?"정답 숨기기":"정답 보기"}
        </button>
      </div>

      {showAnswers && (
        <div className="mt-5 grid grid-cols-1 gap-3 rounded-2xl border border-zinc-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
          {PHASES.map(p=>(
            <div key={p.id} className="rounded-xl bg-zinc-50 p-3">
              <div className="mb-2 font-bold">{p.label}</div>
              <div className="h-24"><PhaseArt phase={p.id}/></div>
              <ul className="mt-2 space-y-1 text-xs leading-5 text-zinc-600">
                {TEXTS[p.id].map(t=><li key={t}>• {t}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
