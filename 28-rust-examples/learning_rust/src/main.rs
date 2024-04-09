// 101. Initializing Struct Instance

use learning_rust::Student;

fn main() {
    let std_1 = Student::new("joseph".to_string()).unwrap_or_default();
    println!("{:?}", std_1);

    let std_2 = Student::default();
    println!("{:?}", std_2);

    let std_3 = Student {
        age: 12,
        ..Default::default()
    };
}
