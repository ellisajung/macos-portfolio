import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

/**
 * 텍스트 타입별 폰트 가중치(font-weight) 설정
 * - subtitle: 100(최소) ~ 400(최대), 기본값 100
 * - title: 400(최소) ~ 900(최대), 기본값 400
 */
const FONT_WEIGHTS = {
  subtitle: { min: 100, max: 400, default: 100 },
  title: { min: 400, max: 600, default: 400 }
} as const;

type TextType = keyof typeof FONT_WEIGHTS;

/**
 * 텍스트를 개별 문자 span 요소로 렌더링
 * @param text - 렌더링할 텍스트
 * @param className - 각 span에 적용할 CSS 클래스
 * @param baseWeight - 기본 폰트 가중치 (기본값: 400)
 * @returns 각 문자를 span으로 감싼 배열 (공백은 non-breaking space로 변환)
 */
const renderText = (text: string, className = "", baseWeight = 400) => {
  return [...text].map((char, i) => (
    <span
      key={i}
      className={className}
      style={{ fontVariationSettings: `'wght' ${baseWeight}` }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));
};

/**
 * 마우스 호버 시 텍스트 폰트 가중치 애니메이션 설정
 * @param container - 이벤트를 적용할 HTML 요소
 * @param type - 텍스트 타입 ('title' 또는 'subtitle')
 * @returns 이벤트 리스너 정리 함수
 */
const setupTextHover = (container: HTMLElement | null, type: TextType) => {
  if (!container) return;

  const letters = container.querySelectorAll<HTMLSpanElement>("span");
  const { min, max, default: defaultWeight } = FONT_WEIGHTS[type];

  /**
   * 개별 문자의 폰트 가중치 애니메이션
   * @param letter - 애니메이션할 span 요소
   * @param weight - 목표 폰트 가중치
   * @param duration - 애니메이션 지속 시간 (초 단위, 기본값: 0.25)
   */
  const animateLetter = (
    letter: HTMLSpanElement,
    weight: any,
    duration = 0.25
  ) => {
    return gsap.to(letter, {
      duration,
      ease: "power2.out",
      fontVariationSettings: `'wght' ${weight}`
    });
  };

  /**
   * 마우스 움직임에 따른 문자별 폰트 가중치 조정
   * 마우스 거리에 따라 가우시안 분포로 폰트 가중치 계산
   */
  const handleMouseMove = (e: MouseEvent) => {
    const { left } = container.getBoundingClientRect();
    const mouseX = e.clientX - left;

    letters.forEach((letter) => {
      const { left: l, width: w } = letter.getBoundingClientRect();
      // 마우스와 문자 중심점 사이의 거리 계산
      const distance = Math.abs(mouseX - (l - left + w / 2));
      // 가우시안 함수를 사용한 거리 기반 강도 계산
      const intensity = Math.exp(-(distance ** 2) / 2000);

      // 강도에 따라 min과 max 사이의 폰트 가중치 적용
      animateLetter(letter, min + (max - min) * intensity);
    });
  };

  /**
   * 마우스가 컨테이너를 벗어날 때 모든 문자를 기본 가중치로 복원
   */
  const handleMouseLeave = () =>
    letters.forEach((letter) => animateLetter(letter, defaultWeight, 0.3));

  // 이벤트 리스너 등록
  container.addEventListener("mousemove", handleMouseMove);
  container.addEventListener("mouseleave", handleMouseLeave);

  // cleanup 함수: 컴포넌트 언마운트 시 이벤트 리스너 제거
  return () => {
    container.removeEventListener("mousemove", handleMouseMove);
    container.removeEventListener("mouseleave", handleMouseLeave);
  };
};

/**
 * Welcome 컴포넌트
 * 포트폴리오의 환영 메시지를 표시하며, 마우스 호버 시 텍스트 폰트 가중치가
 * 동적으로 변화하는 인터랙티브 애니메이션을 제공
 */
const Welcome = () => {
  // 제목과 부제목 요소에 대한 ref
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);

  // GSAP을 사용한 호버 애니메이션 설정
  useGSAP(() => {
    const titleCleanup = setupTextHover(titleRef.current, "title");
    const subtitleCleanup = setupTextHover(subtitleRef.current, "subtitle");

    // cleanup: 컴포넌트 언마운트 시 이벤트 리스너 정리
    return () => {
      titleCleanup?.();
      subtitleCleanup?.();
    };
  }, []);

  return (
    <section id="welcome">
      {/* 부제목: 포트폴리오 환영 메시지 */}
      <p ref={subtitleRef}>
        {renderText("Welcome to my portfolio!", "text-3xl font-georama", 100)}
      </p>

      {/* 메인 제목: "Hello" 텍스트 */}
      <h1 ref={titleRef} className="mt-4">
        {renderText("Hello", "text-9xl italic font-georama")}
      </h1>

      {/* 작은 화면 안내 메시지 */}
      <div className="small-screen">
        <p>This Portfolio is designed for desktop/tablet screens only.</p>
      </div>
    </section>
  );
};
export default Welcome;
