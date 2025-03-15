slint::include_modules!();

fn main() -> Result<(), slint::PlatformError> {
    let ui = HelloWorld::new()?;
    
    // 버튼 클릭 이벤트 핸들러 추가
    ui.on_clicked(|| {
        println!("버튼이 클릭되었습니다!");
    });
    
    ui.run()
}
