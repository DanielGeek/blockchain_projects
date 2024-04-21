
// Passes Mutexes between Threads

// use std::sync::Mutex;
// use std::thread;
// // use std::rc::Rc;
// use std::sync::Arc;
// fn main () {
//     let counter = Arc::new(Mutex::new(0));

//     let mut handles = vec![];

//     for _ in 0..10 {
//         let counter = Arc::clone(&counter);
//         let handle = thread::spawn(move || {
//             let mut num = counter.lock().unwrap();
//             *num += 1;
//         });
//         handles.push(handle);
//     }

//     for handle in handles {
//         handle.join().unwrap();
//     }

//     println!("Result: {}", *counter.lock().unwrap());
// }

use std::thread;
use std::sync::Arc;

struct MyString(String);
impl MyString {
    fn new(s: &str) -> MyString {
        MyString(s.to_string())
    }
}
fn main() {
    let mut threads = Vec::new();
    let name = Arc::new(MyString::new("Rust"));
    for i in 0..5 {
        let some_str = name.clone();
        let t = thread::spawn(move || {
            println!("hello {} count {}", some_str.0, i);
        });
        threads.push(t);
    }

    for t in threads {
        t.join().unwrap();
    }
}
