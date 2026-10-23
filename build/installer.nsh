; Mevcut electron-builder akışını koruyan küçük arayüz özelleştirmeleri.
!macro customHeader
  ; Uygulamayı hemen açmak kullanıcı tercihidir.
  !define MUI_FINISHPAGE_RUN_NOTCHECKED
!macroend

!macro customWelcomePage
  !insertmacro MUI_PAGE_WELCOME
!macroend

!macro customInstallMode
  ; Kullanıcı/tüm kullanıcılar seçimini atla; varsayılan kullanıcı konumunu kullan.
  StrCpy $isForceCurrentInstall "1"
!macroend
