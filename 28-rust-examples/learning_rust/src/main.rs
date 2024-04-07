// 79. Iterating Through Options

fn main() {
    let some_product = Some("laptop");
    let mut products = vec!["cellphone", "battery", "charger"];

    // match some_product {
    //     Some(product) => products.push(product),
    //     _ => {}
    // };

    // if let Some(product) = some_product {
    //     products.push(product);
    // }

    // products.extend(some_product);
    // println!("{:?}", products);

    // let products_iter = products.iter().chain(some_product.iter());

    // for prod in products_iter {
    //     println!("{:?}", prod);
    // }

    let products = vec![Some("charger"), Some("battery"), None, Some("cellphone")];

    // let mut prod_without_none = Vec::new();
    // for p in products {
    //     if p.is_some() {
    //         prod_without_none.push(p.unwrap());
    //     }
    // }

    // let prod_without_none = products
    //     .into_iter()
    //     .filter(|x | x.is_some())
    //     .map(|x | x.unwrap())
    //     .collect::<Vec<&str>>();

    let prod_without_none = products.into_iter().flatten().collect::<Vec<&str>>();
    println!("{:?}", prod_without_none);
}

