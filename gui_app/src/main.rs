#![windows_subsystem = "windows"]

extern crate native_windows_gui as nwg;
extern crate native_windows_derive as nwd;

use nwd::NwgUi;
use nwg::NativeUi;

#[derive(Default, NwgUi)]
pub struct BasicApp {
    #[nwg_control(size: (500, 800), position: (300, 300), title: "안녕하세요", flags: "WINDOW|VISIBLE")]
    #[nwg_events(OnWindowClose: [BasicApp::exit])]
    window: nwg::Window,

    #[nwg_control(text: "안녕하세요!", size: (280, 35), position: (10, 10))]
    label: nwg::Label,

    #[nwg_control(text: "이름을 입력하세요", size: (280, 35), position: (10, 50))]
    name_input: nwg::TextInput,

    #[nwg_control(text: "클릭하세요", size: (280, 70), position: (10, 100))]
    #[nwg_events(OnButtonClick: [BasicApp::say_hello])]
    button: nwg::Button,
}

impl BasicApp {
    fn exit(&self) {
        nwg::stop_thread_dispatch();
    }

    fn say_hello(&self) {
        let name = self.name_input.text();
        let greeting = if name.is_empty() {
            "안녕하세요, 진영화님!".to_string()
        } else {
            format!("안녕하세요, {}님!", name)
        };
        
        nwg::simple_message("인사", &greeting);
    }
}

fn main() {
    nwg::init().expect("NWG 초기화 실패");
    
    let _app = BasicApp::build_ui(Default::default()).expect("GUI 빌드 실패");
    
    nwg::dispatch_thread_events();
}
