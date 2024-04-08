// 91. RefCell Smart Pointer

use std::{cell::RefCell, rc::Rc};

fn main() {
    // let mut x = 50;
    // let x1 = &x;
    // let x2 = &x;
    // let x3 = &mut x;

    // println!("{} {}", x1, x2);

    // let a = RefCell::new(10);
    // {
    //     let b = a.borrow();
    //     let c = a.borrow();
    // }
    // // drop(b);
    // // drop(c);
    // let d = a.borrow_mut();
    // drop(d);
    // // println!("{} {}", b, c);
    // println!("a: {:?}", a);

    // let x = 32;
    // let x1 = &mut x;

    // let a = RefCell::new(10);
    // // let c = *a;
    // let mut b = a.borrow_mut();
    // *b = 15;
    // drop(b);
    // println!("{:?}", a);

    let a = Rc::new(RefCell::new(String::from("C++")));
    let b = Rc::clone(&a);

    *b.borrow_mut() = String::from("Rust");
    println!("{:?}", a);
}