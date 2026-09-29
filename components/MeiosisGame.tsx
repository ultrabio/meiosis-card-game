"use client";

import { useEffect, useMemo, useState } from "react";

type Phase =
  | "m1p" | "m1m" | "m1a" | "m1t"
  | "m2p" | "m2m" | "m2a" | "m2t";

type Card = {
  id: string;
  phase: Phase;
  kind: "image" | "text";
  text?: string;
};

const PHASES: { id: Phase; label: string }[] = [
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

function Chromosome({ x, y, color, split = false }: { x:number; y:number; color:string; split?:boolean }) {
  if (split) {
    return (
      <g stroke={color} strokeWidth="7" strokeLinecap="round">
        <line x1={x-5} y1={y-10} x2={x-5} y2={y+10}/>
        <line x1={x+5} y1={y-10} x2={x+5} y2={y+10}/>
      </g>
    );
  }
  return (
    <g stroke={color} strokeWidth="6" strokeLinecap="round">
      <line x1={x-7} y1={y-11} x2={x+7} y2={y+11}/>
      <line x1={x+7} y1={y-11} x2={x-7} y2={y+11}/>
    </g>
  );
}

function Cell({ children, cx=70, cy=55, rx=58, ry=43 }: any) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#fff7ed" stroke="#f1c7a5" strokeWidth="3"/>
      {children}
    </g>
  );
}

function PhaseArt({ phase }: { phase: Phase }) {
  const red="#ef4444", blue="#3b82f6";
  if (phase === "m1p") return (
    <svg viewBox="0 0 140 110" className="h-full w-full">
      <Cell>
        <Chromosome x={57} y={55} color={red}/><Chromosome x={66} y={55} color={blue}/>
        <Chromosome x={83} y={55} color={red}/><Chromosome x={92} y={55} color={blue}/>
      </Cell>
    </svg>
  );
  if (phase === "m1m") return (
    <svg viewBox="0 0 140 110" className="h-full w-full">
      <Cell>
        <line x1="70" y1="17" x2="70" y2="93" stroke="#cbd5e1" strokeDasharray="4 4"/>
        <Chromosome x={61} y={55} color={red}/><Chromosome x={68} y={55} color={blue}/>
        <Chromosome x={82} y={55} color={red}/><Chromosome x={89} y={55} color={blue}/>
      </Cell>
    </svg>
  );
  if (phase === "m1a") return (
    <svg viewBox="0 0 140 110" className="h-full w-full">
      <Cell>
        <Chromosome x={42} y={55} color={red}/><Chromosome x={52} y={55} color={blue}/>
        <Chromosome x={88} y={55} color={red}/><Chromosome x={98} y={55} color={blue}/>
      </Cell>
    </svg>
  );
  if (phase === "m1t") return (
    <svg viewBox="0 0 140 110" className="h-full w-full">
      <Cell cx={42} cy={55} rx={34} ry={38}><Chromosome x={42} y={55} color={red}/><Chromosome x={52} y={55} color={blue}/></Cell>
      <Cell cx={98} cy={55} rx={34} ry={38}><Chromosome x={88} y={55} color={red}/><Chromosome x={98} y={55} color={blue}/></Cell>
    </svg>
  );
  if (phase === "m2p") return (
    <svg viewBox="0 0 140 110" className="h-full w-full">
      <Cell cx={42} cy={55} rx={33} ry={38}>
        <Chromosome x={36} y={55} color={red}/>
        <Chromosome x={48} y={55} color={red}/>
      </Cell>
      <Cell cx={98} cy={55} rx={33} ry={38}>
        <Chromosome x={92} y={55} color={blue}/>
        <Chromosome x={104} y={55} color={blue}/>
      </Cell>
    </svg>
  );
  if (phase === "m2m") return (
    <svg viewBox="0 0 140 110" className="h-full w-full">
      <Cell cx={42} cy={55} rx={33} ry={38}>
        <Chromosome x={36} y={55} color={red}/>
        <Chromosome x={48} y={55} color={red}/>
      </Cell>
      <Cell cx={98} cy={55} rx={33} ry={38}>
        <Chromosome x={92} y={55} color={blue}/>
        <Chromosome x={104} y={55} color={blue}/>
      </Cell>
      <line x1="42" y1="22" x2="42" y2="88" stroke="#cbd5e1" strokeDasharray="4 4"/>
      <line x1="98" y1="22" x2="98" y2="88" stroke="#cbd5e1" strokeDasharray="4 4"/>
    </svg>
  );
  if (phase === "m2a") return (
    <svg viewBox="0 0 140 110" className="h-full w-full">
      <Cell cx={42} cy={55} rx={33} ry={38}>
        <Chromosome x={31} y={47} color={red} split/>
        <Chromosome x={31} y={63} color={red} split/>
        <Chromosome x={53} y={47} color={red} split/>
        <Chromosome x={53} y={63} color={red} split/>
      </Cell>
      <Cell cx={98} cy={55} rx={33} ry={38}>
        <Chromosome x={87} y={47} color={blue} split/>
        <Chromosome x={87} y={63} color={blue} split/>
        <Chromosome x={109} y={47} color={blue} split/>
        <Chromosome x={109} y={63} color={blue} split/>
      </Cell>
    </svg>
  );
  return (
    <svg viewBox="0 0 140 110" className="h-full w-full">
      {[
        { x: 35, y: 32, color: red },
        { x: 95, y: 32, color: red },
        { x: 35, y: 78, color: blue },
        { x: 95, y: 78, color: blue },
      ].map((cell, i) => (
        <g key={i}>
          <circle cx={cell.x} cy={cell.y} r="20" fill="#fff7ed" stroke="#f1c7a5" strokeWidth="3"/>
          <line x1={cell.x - 4} y1={cell.y - 7} x2={cell.x - 4} y2={cell.y + 7} stroke={cell.color} strokeWidth="6" strokeLinecap="round"/>
          <line x1={cell.x + 4} y1={cell.y - 7} x2={cell.x + 4} y2={cell.y + 7} stroke={cell.color} strokeWidth="6" strokeLinecap="round"/>
        </g>
      ))}
    </svg>
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

  useEffect(()=>{ const v=localStorage.getItem("meiosis-best"); if(v) setBest(Number(v)); },[]);
  const card = status==="playing" ? deck[index] : undefined;
  const progress = deck.length ? Math.min(index,deck.length) : 0;

  const start=()=>{
    setDeck(shuffle(CARDS)); setIndex(0); setScore(0); setLives(5);
    setStatus("playing"); setStarted(Date.now()); setFlash(null); setShowAnswers(false);
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

      <div className="grid grid-cols-4 gap-2 md:grid-cols-8">
        {PHASES.map(p=>(
          <button key={p.id} onClick={()=>choose(p.id)}
            className={`${status === "idle" ? "min-h-16" : "min-h-24"} rounded-xl border bg-white p-2 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${flash===p.id?"border-amber-400 ring-2 ring-amber-300":"border-zinc-200"}`}>
            {status !== "idle" && <div className="h-16"><PhaseArt phase={p.id}/></div>}
            <div className="text-[11px] font-semibold text-zinc-700 sm:text-xs">{p.label}</div>
          </button>
        ))}
      </div>

      <div className="my-5 flex items-end justify-center gap-3">
        <span className="font-mono text-5xl font-bold">{score}</span>
        {best!==null && <span className="font-mono text-2xl text-zinc-400">({best})</span>}
      </div>

      <section className="mx-auto flex min-h-72 max-w-2xl items-center justify-center rounded-2xl border border-zinc-200 bg-white/90 p-6 shadow-sm">
        {status==="idle" && (
          <div className="text-center">
            <p className="mb-5 text-sm leading-6 text-zinc-600">그림 카드 8장과 특징 카드 16장, 총 24장이 무작위로 나옵니다.<br/>빠르게 맞힐수록 높은 점수를 얻습니다.</p>
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
