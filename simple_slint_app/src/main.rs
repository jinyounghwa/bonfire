slint::include_modules!();

fn main() -> Result<(), slint::PlatformError> {
    let ui = HelloWorld::new()?;
    
    // 윈도우 객체의 약한 참조를 가져옵니다
    let ui_weak = ui.as_weak();
    
    // 버튼 클릭 이벤트 핸들러 추가
    ui.on_clicked(move |name| {
        let ui = ui_weak.unwrap();
        
        let greeting = if name.is_empty() {
            "안녕하세요, 사용자님!".into()
        } else {
            format!("안녕하세요, {}님!", name)
        };
        
        // 메시지 표시 (String을 SharedString으로 변환)
        ui.invoke_show_message(greeting.into());
        println!("버튼이 클릭되었습니다! 이름: {}", name);
    });
    
    ui.run()
}
