// 43. Privacy in Modules

use my_package::{Customer, Product, Order, Category};
fn main() {
    let product = Product::new(1, String::from("Laptop"), 799.99, Category::Electronics);
    let customer = Customer::new(1, String::from("Alice"), String::from("alice@example.com"));
    let order = Order::new(1, product, customer, 2);
    println!("Total cost of the order: ${}", order.total_bill());
}
