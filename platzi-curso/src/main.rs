fn main() {

    println!("Please, enter your age: ");
    let mut age : String = String::new();
    std::io::stdin().read_line(&mut age).unwrap();

    let age_int : u8 = age.trim().parse().unwrap();

    if age_int >= 18 {
        println!("You can enter");
    } else {
        println!("you are underage");
    }

    println!("You have {} years old", age_int);
}
