fn main() {
    print!("Please, enter your name: ");

    let mut name : String = String::new();
    std::io::stdin().read_line(&mut name).unwrap();
    name = name.trim().to_string();

    print!("Please, enter your age: ");
    let mut age : String = String::new();
    std::io::stdin().read_line(&mut age).unwrap();

    let age_int : u8 = age.trim().parse().unwrap();

    print!("Hello, welcome {} of {} years old", name, age_int);
}
