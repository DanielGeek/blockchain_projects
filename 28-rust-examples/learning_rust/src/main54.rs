// 114. - Declarative Macros
//          - Basic Syntax

/*
    macro_rules! macro_name {
        (...) => {...};
        (...) => {...};
        (...) => {...};
    }
*/

macro_rules! our_macro {
    () => { 1+1;};
    (something 4 u dear u32 @_@) => {
        println!("You found nonsense here");
    };

    ($e1: expr, $e2: expr) => {
        $e1 + $e2
    };
    ($a: expr, $b: expr; $c: expr) => {
        $a * ($b + $c)
    };
}

fn main() {
    our_macro!();
    println!("{}", our_macro!());
    our_macro!(something 4 u dear u32 @_@);

    println!("{}", our_macro!(2,2));

    // println!("{}", our_macro!(5,6;3));
    // // println!("{}", our_macro!("something",2;"nothing"));

    // our_macro!();
    // our_macro!{};
    our_macro![];
}
