fn main() {
    // Definition
    let x: i16 = 10;
    println!("x is: {x}");

    // Mutability
    let mut y = 5;
    y = 10;

    // Scope
    {
        let z = 50;
    }
    // let s = z;

    // Shadowing
    let t = 10;
    let t = t + 10;
    println!("t is {t}");

    let u = 3;
    let u = 3.0;

    let v = 30;
    {
        let v = 40;
        println!("Inner v is: {v}");
    }
    println!("v is : {v}");

}
