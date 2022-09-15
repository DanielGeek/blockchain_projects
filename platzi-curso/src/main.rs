fn main() {
    println!("Please, enter your name: ");

    let mut name : String = String::new();
    std::io::stdin().read_line(&mut name).unwrap();
    name = name.trim().to_string();

    println!("Please, enter your age: ");
    let mut age : String = String::new();
    std::io::stdin().read_line(&mut age).unwrap();

    let age_int : u8 = age.trim().parse().unwrap();

    println!("Hello, welcome {} of {} years old", name, age_int);
}
