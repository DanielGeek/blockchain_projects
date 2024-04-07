// 80. Concrete Lifetimes

fn main() {
    // {
    //     let i = 5;
    // }
    // let j = i;
    // println!("i: {i}");

    // let str_1 = String::from("abc");
    // str_fn(str_1);
    // let str_2 = str_1;
    // println!("str_1: {str_1}");

    // let i;
    // {
    //     let j = 5;
    //     i = &j;
    //     println!("i: {i}");
    // }

    let mut vec_1 = vec![6, 5, 8, 9];
    let ref_1 = &vec_1;
    println!("ref 1: {:?}", ref_1);
    let ref_2 = &mut vec_1;
    ref_2.push(3);
    println!("ref 2: {:?}", ref_2);
}

fn str_fn(s: String) {
    println!("s: {s}");
}
