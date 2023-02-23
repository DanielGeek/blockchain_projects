fn add_one(number_to_add: i32) -> i32 {
    let final_number = number_to_add + 1;
    println!("{}", final_number);

    return final_number;
}
fn main() {

    let result = add_one(1);
    add_one(result);

}
