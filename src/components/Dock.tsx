import { useRef } from "react";
import { Tooltip } from "react-tooltip";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { dockApps } from "#constants";
import useWindowStore from "#store/window";
import type { WindowKey } from "#store/window";

/**
 * Dock 컴포넌트
 * macOS 스타일의 Dock을 구현한 컴포넌트
 * 마우스 호버 시 아이콘이 확대되고 위로 올라가는 애니메이션 효과를 제공
 */
const Dock = () => {
  const openWindow = useWindowStore((s) => s.openWindow);
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const windows = useWindowStore((s) => s.windows);

  // Dock 컨테이너 DOM 요소에 대한 참조
  const dockRef = useRef<HTMLDivElement | null>(null);

  // GSAP 애니메이션 설정 및 이벤트 리스너 등록
  useGSAP(() => {
    const dock = dockRef.current;
    if (!dock) return;

    // Dock 내의 모든 아이콘 요소를 선택
    const icons = dock.querySelectorAll<HTMLElement>(".dock-icon");

    /**
     * 마우스 위치에 따라 아이콘 애니메이션을 적용하는 함수
     * @param mouseX - Dock 컨테이너 내에서의 마우스 X 좌표
     */
    const animateIcons = (mouseX: number) => {
      const { left } = dock.getBoundingClientRect();

      icons.forEach((icon) => {
        const { left: iconLeft, width } = icon.getBoundingClientRect();
        // 아이콘의 중심점 계산
        const center = iconLeft - left + width / 2;
        // 마우스와 아이콘 중심 사이의 거리 계산
        const distance = Math.abs(mouseX - center);

        // 거리 기반 애니메이션 강도 계산 (가우시안 분포 사용)
        const intensity = Math.exp(-(distance ** 2.5) / 2000);

        // GSAP을 사용한 아이콘 애니메이션
        gsap.to(icon, {
          scale: 1 + 0.25 * intensity, // 최대 1.25배까지 확대
          y: -15 * intensity, // 최대 15px 위로 이동
          duration: 0.2,
          ease: "power1.out"
        });
      });
    };

    /**
     * 마우스 이동 이벤트 핸들러
     * Dock 내에서 마우스가 움직일 때 아이콘 애니메이션 실행
     */
    const handleMouseMove = (e: MouseEvent) => {
      const { left } = dock.getBoundingClientRect();
      // Dock 컨테이너 기준 상대 좌표로 변환하여 애니메이션 적용
      animateIcons(e.clientX - left);
    };

    /**
     * 모든 아이콘을 기본 상태로 되돌리는 함수
     * 마우스가 Dock 영역을 벗어날 때 호출됨
     */
    const resetIcons = () =>
      icons.forEach((icon) =>
        gsap.to(icon, {
          scale: 1, // 원래 크기로 복원
          y: 0, // 원래 위치로 복원
          duration: 0.3,
          ease: "power1.out"
        })
      );

    // 이벤트 리스너 등록
    dock.addEventListener("mousemove", handleMouseMove);
    dock.addEventListener("mouseleave", resetIcons);

    // 컴포넌트 언마운트 시 이벤트 리스너 정리
    return () => {
      dock.removeEventListener("mousemove", handleMouseMove);
      dock.removeEventListener("mouseleave", resetIcons);
    };
  }, []);

  /**
   * 앱 토글 함수
   * @param app - 앱 정보 객체 (id, canOpen 포함)
   * 현재는 canOpen이 true인 경우에만 동작하도록 제한
   */
  const toggleApp = (app: { id: string; canOpen: boolean }) => {
    if (!app.canOpen) return;

    // app.id가 유효한 WindowKey인지 확인
    const windowKey = app.id as WindowKey;

    const window = windows[windowKey];

    if (window.isOpen) {
      closeWindow(windowKey);
    } else {
      openWindow(windowKey);
    }

    // console.log(windows);
  };

  return (
    <section id="dock">
      {/* Dock 컨테이너 - 마우스 이벤트 감지 영역 */}
      <div ref={dockRef} className="dock-container">
        {/* dockApps 배열을 순회하며 각 앱 아이콘 렌더링 */}
        {dockApps.map(({ id, name, icon, canOpen }) => (
          <div key={id} className="relative flex justify-center">
            <button
              type="button"
              className="dock-icon"
              aria-label={name}
              data-tooltip-id="dock-tooltip"
              data-tooltip-content={name}
              data-tooltip-delay-show={150}
              disabled={!canOpen} // 열 수 없는 앱은 비활성화
              onClick={() => toggleApp({ id, canOpen })}
            >
              <img
                src={`/images/${icon}`}
                alt={name}
                loading="lazy"
                className={canOpen ? "" : "opacity-60"} // 비활성 앱은 반투명 처리
              />
            </button>
          </div>
        ))}
        {/* 앱 이름을 표시하는 툴팁 컴포넌트 */}
        <Tooltip id="dock-tooltip" place="top" className="tooltip" />
      </div>
    </section>
  );
};
export default Dock;
