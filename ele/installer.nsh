!macro customHeader
  !system "echo '' > ${BUILD_RESOURCES_DIR}/customHeader"
!macroend

!macro customInstall
  ; 불필요한 로케일 파일 제거 (한국어와 영어만 유지)
  !define ELECTRON_LOCALES "$INSTDIR\locales"
  
  ; 모든 로케일 파일 제거 (영어와 한국어는 나중에 제외)
  RMDir /r "${ELECTRON_LOCALES}"
  
  ; locales 디렉토리 다시 생성
  CreateDirectory "${ELECTRON_LOCALES}"
  
  ; 필요한 로케일 파일 복사 (영어와 한국어)
  CopyFiles "$PLUGINSDIR\app\locales\en-US.pak" "${ELECTRON_LOCALES}\en-US.pak"
  CopyFiles "$PLUGINSDIR\app\locales\ko.pak" "${ELECTRON_LOCALES}\ko.pak"
!macroend

!macro customUnInstall
  ; 제거 시 특별한 작업이 필요하면 여기에 추가
!macroend
