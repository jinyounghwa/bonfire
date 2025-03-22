const packager = require('electron-packager');
const fs = require('fs');
const path = require('path');

async function bundleElectronApp() {
  const options = {
    dir: '.',
    name: 'Bonfire Media Player',
    platform: 'win32',
    arch: 'x64',
    icon: 'file/bonefire.png',
    out: 'dist-optimized',
    overwrite: true,
    asar: true,
    prune: true,
    ignore: [
      /node_modules\/electron($|\/)/, 
      /node_modules\/electron-packager($|\/)/,
      /node_modules\/electron-builder($|\/)/,
      /node_modules\/.bin($|\/)/,
      /\.git($|\/)/,
      /\.vscode($|\/)/,
      /dist($|\/)/,
      /dist-small($|\/)/,
      /dist-optimized($|\/)/,
      /package-small\.js/,
      /optimize-package\.js/
    ],
    appVersion: '1.0.0',
    appCopyright: 'Copyright © 2025',
    win32metadata: {
      CompanyName: '',
      FileDescription: '미디어 플레이어',
      OriginalFilename: 'Bonfire Media Player.exe',
      ProductName: 'Bonfire Media Player',
      InternalName: 'Bonfire'
    },
    // 필요한 로케일만 포함 (한국어, 영어)
    electronZipDir: (zipPath) => {
      console.log('Electron zip 파일 최적화 중...');
      return zipPath;
    },
    afterCopy: [(buildPath, electronVersion, platform, arch, callback) => {
      console.log('패키징 완료 후 불필요한 파일 정리 중...');
      
      // 불필요한 로케일 파일 제거 (한국어와 영어만 유지)
      const localesDir = path.join(buildPath, 'locales');
      if (fs.existsSync(localesDir)) {
        const files = fs.readdirSync(localesDir);
        files.forEach(file => {
          // ko.pak(한국어)와 en-US.pak(영어)만 유지
          if (file !== 'ko.pak' && file !== 'en-US.pak') {
            fs.unlinkSync(path.join(localesDir, file));
            console.log(`불필요한 로케일 파일 제거: ${file}`);
          }
        });
      }
      
      callback();
    }]
  };

  try {
    const appPaths = await packager(options);
    console.log(`앱이 다음 경로에 패키징되었습니다: ${appPaths.join(', ')}`);
    
    // 패키지 크기 확인
    const stats = fs.statSync(path.join(appPaths[0], 'Bonfire Media Player.exe'));
    console.log(`실행 파일 크기: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
    
    const totalSize = getTotalSize(appPaths[0]);
    console.log(`전체 패키지 크기: ${(totalSize / (1024 * 1024)).toFixed(2)} MB`);
  } catch (err) {
    console.error('패키징 중 오류 발생:', err);
  }
}

// 디렉토리 전체 크기 계산 함수
function getTotalSize(dirPath) {
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
  
  getAllFilesSize(dirPath);
  return totalSize;
}

bundleElectronApp();
