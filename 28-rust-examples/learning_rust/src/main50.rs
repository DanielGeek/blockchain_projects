// 109. - Unsized Coercion

fn str_slice_fn(s: &str) {}

fn array_slice_fn<T>(s: &[T]) {}

trait Some_Trait {
    fn method(&self);
}

impl<T> Some_Trait for [T] {
    fn method(&self) {}
    // can now call "method" on
    // 1) any &[T]
    // 2) Vec<T>
    // 3) [T; N]
}
fn main() {
    let some_string = String::from("String");
    str_slice_fn(&some_string);

    let slice: &[i32] = &[1];
    let vec = vec![1];
    let array = [1, 2, 3];

    array_slice_fn(slice);
    array_slice_fn(&vec); // deref coercion
    array_slice_fn(&array); // Unsized coercion

    slice.method();
    vec.method(); // deref coercion
    array.method() // Unsized coercion
}
