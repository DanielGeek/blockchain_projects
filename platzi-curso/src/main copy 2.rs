fn main() {

    let number_1 = 120;
    let number_2 = 321;

    let _sum = number_1 + number_2;

    loop {
        println!("Please, writte the sum of {} and {}: ", number_1, number_2);

        let mut sum_user = String::new();
        std::io::stdin().read_line(&mut sum_user).unwrap();

        let sum_user_int : i32 = sum_user.trim().parse().unwrap();

        if sum_user_int == _sum {
            println!("You have done well, result {} is correct", _sum);
            break;
        } else {
            println!("result {} is not correct, please try again", sum_user_int);
        }
    }

}
