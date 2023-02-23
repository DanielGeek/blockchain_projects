
fn main() {

    let mut names: Vec<String> = Vec::new();

    for i in 0..3 {
        println!("Please, introduce a name: ");
        let mut name = String::new();
        std::io::stdin().read_line(&mut name).unwrap();

        names.push(name);
    }


//    println!("{:?}", names);
    for name in names {
        println!("Name is: {}", name);
    }

    let hello = ["H", "E", "L", "L", "O"];

    println!("{}", hello[0]);
    println!("{}", hello[1]);
    println!("{}", hello[2]);
    println!("{}", hello[3]);
    println!("{}", hello[4]);

}
