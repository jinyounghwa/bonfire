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
      /dist-optimized($|\/)/
    ],
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
  } catch (err) {
    console.error('패키징 중 오류 발생:', err);
  }
}

bundleElectronApp();
