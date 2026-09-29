import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "감수분열 카드 게임",
  description: "감수 1분열과 감수 2분열의 각 시기를 카드로 익히는 중학교 과학 학습 게임",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
