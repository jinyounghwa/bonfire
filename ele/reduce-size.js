const fs = require('fs');
const path = require('path');

// 최적화할 앱 디렉토리 경로
const appDir = path.join(__dirname, 'dist-optimized', 'Bonfire Media Player-win32-x64');

// 불필요한 로케일 파일 제거 (한국어와 영어만 유지)
function removeUnnecessaryLocales() {
  const localesDir = path.join(appDir, 'locales');
  if (fs.existsSync(localesDir)) {
    console.log('불필요한 로케일 파일 제거 중...');
    const files = fs.readdirSync(localesDir);
    let removedSize = 0;
    
    files.forEach(file => {
      // ko.pak(한국어)와 en-US.pak(영어)만 유지
      if (file !== 'ko.pak' && file !== 'en-US.pak') {
        const filePath = path.join(localesDir, file);
        const stats = fs.statSync(filePath);
        removedSize += stats.size;
        fs.unlinkSync(filePath);
        console.log(`제거됨: ${file} (${Math.round(stats.size / 1024)} KB)`);
      }
    });
    
    console.log(`총 ${Math.round(removedSize / (1024 * 1024))} MB 크기의 불필요한 로케일 파일이 제거되었습니다.`);
  }
}

// 불필요한 라이선스 및 문서 파일 제거
function removeUnnecessaryFiles() {
  const filesToRemove = [
    'LICENSE',
    'LICENSES.chromium.html'
  ];
  
  console.log('불필요한 문서 파일 제거 중...');
  let removedSize = 0;
  
  filesToRemove.forEach(file => {
    const filePath = path.join(appDir, file);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      removedSize += stats.size;
      fs.unlinkSync(filePath);
      console.log(`제거됨: ${file} (${Math.round(stats.size / 1024)} KB)`);
    }
  });
  
  console.log(`총 ${Math.round(removedSize / (1024 * 1024))} MB 크기의 불필요한 파일이 제거되었습니다.`);
}

// 앱 크기 계산
function calculateAppSize() {
  let totalSize = 0;
  
  function getAllFilesSize(dirPath) {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        getAllFilesSize(itemPath);
      } else {
        totalSize += stats.size;
      }
    }
  }
  
  getAllFilesSize(appDir);
  console.log(`최적화 후 앱 크기: ${Math.round(totalSize / (1024 * 1024))} MB`);
}

// 실행
try {
  removeUnnecessaryLocales();
  removeUnnecessaryFiles();
  calculateAppSize();
  console.log('앱 용량 최적화가 완료되었습니다!');
} catch (err) {
  console.error('앱 최적화 중 오류 발생:', err);
}
