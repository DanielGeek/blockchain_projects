// 17 Conditionals if, else, etc...

fn main() {
    let num = 40;
    if num < 50 {
        println!("The number is less than 50");
    } else {
        println!("The number is greater than or equal to 50");
    }

    let marks = 95;
    let mut grade = 'N';

    // if marks >= 90 {
    //     grade = 'A';
    // } else if marks >= 80 {
    //     grade = 'B';
    // } else if marks >= 70 {
    //     grade = 'C';
    // } else {
    //     grade = 'F';
    // }

    let grade = if marks >= 90 {
        'A'
    } else if marks >= 80 {
        'B'
    } else if marks >= 70 {
        'C'
    } else {
        'F'
    };

    let marks = 95;
    // let mut grade = 'N';

    let grade = match marks {
        90..=100 => 'A',
        80..=90 => 'B',
        70..=79 => 'C',
        _ => 'F',
    };
}
