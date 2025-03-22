const { app, BrowserWindow } = require('electron');
const path = require('path');

// 개발 환경에서 개발자 도구를 사용할지 여부
const isDev = process.argv.includes('--debug');

// 메인 윈도우 객체를 전역 변수로 선언
let mainWindow;

// 메인 윈도우 생성 함수
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    },
    autoHideMenuBar: true,  // 메뉴바 자동 숨김
    frame: false,           // 프레임 제거
    titleBarStyle: 'hidden', // 타이틀바 숨김
    icon: path.join(__dirname, 'file/bonefire.png') // 앱 아이콘 설정
  });

  // index.html 파일 로드
  mainWindow.loadFile('index.html');

  // 개발 모드에서는 개발자 도구 열기
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // 윈도우가 닫힐 때 이벤트
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// Electron이 준비되면 윈도우 생성
app.whenReady().then(() => {
  createWindow();

  // macOS에서 모든 창이 닫혀도 앱을 종료하지 않음
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 모든 창이 닫히면 앱 종료 (Windows, Linux)
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
