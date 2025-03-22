const packager = require('electron-packager');

async function bundleElectronApp() {
  const options = {
    dir: '.',
    name: 'Bonfire Media Player',
    platform: 'win32',
    arch: 'x64',
    icon: 'file/bonefire.png',
    out: 'dist-small',
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
      /dist-small($|\/)/
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
    afterCopy: [(buildPath, electronVersion, platform, arch, callback) => {
      console.log('패키징 완료 후 불필요한 파일 정리 중...');
      callback();
    }],
    afterExtract: [(extractPath, electronVersion, platform, arch, callback) => {
      console.log('Electron 압축 해제 후 불필요한 로케일 파일 정리 중...');
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
