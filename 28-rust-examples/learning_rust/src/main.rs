// 85. Lifetimes in Structs

struct ArrayProcessor<'a> {
    data: &'a [i32],
}

impl<'a> ArrayProcessor<'a> {
    fn update_data<'b>(&'b mut self, new_data: &'a [i32]) -> &'b [i32] {
        let previous_data = self.data;
        self.data = new_data;
        previous_data
    }
}
fn main() {
    let mut some_data = ArrayProcessor { data: &[4, 5, 6] };

    let previous_data = some_data.update_data(&[5, 8, 10]);
    println!("Previous data: {:?}", previous_data);
    println!("New Data: {:?}", some_data.data);
}
