/**
 * Vite 빌드 도구 설정 파일
 *
 * 이 파일은 Vite 개발 서버 및 프로덕션 빌드의 동작을 설정합니다.
 * - React 프로젝트를 위한 플러그인 설정
 * - Tailwind CSS 통합
 * - 경로 별칭(alias)을 통한 import 경로 단축
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// Vite 공식 설정 문서: https://vite.dev/config/
export default defineConfig({
  /**
   * 플러그인 설정
   * - react(): JSX 변환 및 Fast Refresh 기능 제공
   * - tailwindcss(): Tailwind CSS를 Vite에 통합하여 사용
   */
  plugins: [react(), tailwindcss()],

  resolve: {
    /**
     * 경로 별칭(Path Alias) 설정
     *
     * 상대 경로(../../components) 대신 절대 경로(#components)를 사용할 수 있게 해줍니다.
     * 예시: import Button from '#components/Button'
     *
     * // CommonJS (구형 방식)
     * const path = require('path');
     * __dirname // 현재 디렉토리 경로
     *
     * // ES Modules (현대적 방식)
     * import { fileURLToPath } from 'url';
     * import { dirname } from 'path';
     * dirname(fileURLToPath(import.meta.url)) // 현재 디렉토리 절대 경로(ES Modules의 메타 속성)
     *
     * 경로 계산 과정:
     * 1. import.meta.url
     *    → "file:///Users/.../macos_portfolio/vite.config.ts" (현재 파일의 URL)
     * 2. fileURLToPath(import.meta.url)
     *    → "/Users/.../macos_portfolio/vite.config.ts" (URL을 파일 경로로 변환)
     * 3. dirname()
     *    → "/Users/.../macos_portfolio" (디렉토리 경로만 추출)
     * 4. resolve(dirname(...), "components")
     *    → "/Users/.../macos_portfolio/src/components" (최종 절대 경로)
     */
    alias: {
      /**
       * #components: 재사용 가능한 UI 컴포넌트들의 경로
       * 예: import { Button } from '#components/Button'
       */
      "#components": resolve(
        dirname(fileURLToPath(import.meta.url)),
        "src/components"
      ),

      /**
       * #constant: 상수 값들을 정의한 파일들의 경로
       * 예: import { API_URL } from '#constant/config'
       */
      "#constants": resolve(
        dirname(fileURLToPath(import.meta.url)),
        "src/constants"
      ),

      /**
       * #store: 전역 상태 관리 관련 파일들의 경로 (Zustand, Redux 등)
       * 예: import { useUserStore } from '#store/userStore'
       */
      "#store": resolve(dirname(fileURLToPath(import.meta.url)), "src/store"),

      /**
       * #hoc: Higher-Order Components (고차 컴포넌트)의 경로
       * 컴포넌트를 감싸서 추가 기능을 제공하는 함수들
       * 예: import { withAuth } from '#hoc/withAuth'
       */
      "#hoc": resolve(dirname(fileURLToPath(import.meta.url)), "src/hoc"),

      /**
       * #windows: 윈도우/모달 형태의 컴포넌트들의 경로
       * 예: import { SettingsWindow } from '#windows/SettingsWindow'
       */
      "#windows": resolve(
        dirname(fileURLToPath(import.meta.url)),
        "src/windows"
      )
    }
  }
});
