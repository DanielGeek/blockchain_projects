// 108. - ?Sized and Generic Parameters

// 1. Must have a single unsized field.
// 2. The unsized field must be the last field.

use std::fmt::Debug;

struct UnSizedStruct<T: ?Sized> {
    sized_field_1: i32,
    unsized_field: T,
}

// fn print_fn<T: Debug>(t: T)
fn print_fn<T: Debug + Sized>(t: T) {
    println!("{:?}", t);
}

fn main() {
    let x = UnSizedStruct {
        sized_field_1: 3,
        unsized_field: [3],
    };

    let x = "my name";
    print_fn(&x);
}
