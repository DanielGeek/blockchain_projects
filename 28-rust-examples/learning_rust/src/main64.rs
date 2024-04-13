// 123. - Suggesting Items for Special Shopping Card
//          - Description
//              - Given a list of prices, return a couple of items with their sum matching the
//          - Tools
//              - HashSets, Vectors

use std::collections::HashSet;
fn product_suggestions(product_prices: Vec<i32>, amount: i32) -> Vec<Vec<i32>> {
    let mut prices_hash = HashSet::new();
    let mut offers = Vec::new();

    for i in product_prices {
        let diff = amount - i;
        if prices_hash.get(&diff).is_none() {
            prices_hash.insert(i);
        } else {
            offers.push(vec![i,diff]);
        }
    }
    offers.sort();
    offers
}
fn main() {
    let product_prices = vec![11, 30, 55, 34, 45, 10, 19, 20, 60, 5, 23];
    let shopping_card_amounts = vec![40, 70, 10, 50]; // Test with different amounts

    for amount in shopping_card_amounts {
        let suggestions = product_suggestions(product_prices.clone(), amount);
        println!("Product suggestions for amount {}: {:?}", amount, suggestions);
    }
}
