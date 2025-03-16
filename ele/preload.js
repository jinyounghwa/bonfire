// preload.js
// 렌더러 프로세스와 메인 프로세스 간의 통신을 위한 브릿지 역할

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  // Electron 버전 정보 표시
  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});
