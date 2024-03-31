// 37. Hash Maps
use std::{collections::HashMap, hash::Hash};
// fn main() {
//     // let mut person:HashMap<&str, i32> = HashMap::new();
//     // person.insert("Nouman",40);
//     // person.insert("Kamran", 44);
//     // person.insert("Shahid", 55);

//     // println!("The age is {:?}", person.get("Nouman").unwrap());

//     // if person.contains_key("Nouman") {
//     //     println!("The value exist")
//     // } else {
//     //     println!("The value does not exist");
//     // }

//     // match person.get("Nouman") {
//     //     Some(value) => println!("The value existe {}", value),
//     //     None => println!("The value does not exist"),
//     // }

//     // for (name, age) in &person{
//     //     println!("The person {} has an age of {}", name, age);
//     // }

//     let mut likes:HashMap<&str, &str> = HashMap::new();
    
//     // likes.insert("Nouman", "apple");
//     // likes.insert("Nouman", "mango");
//     // println!("The fruit which is being liked is {:?}", likes);

//     likes.entry("Nouman").or_insert("apple");
//     likes.entry("Nouman").or_insert("mango");
//     println!("The fruit which is being likes is {:?}", likes);
// }

fn main() {
    let some_vec = vec![5,5,8,8,1,0,1,5,5,5,5];
    let mut freq_vec:HashMap<i32, u32> = HashMap::new();

    for i in &some_vec {
        let freq: &mut u32 = freq_vec.entry(*i).or_insert(0);
        *freq += 1;
    }

    println!("{:?}", freq_vec);
}
