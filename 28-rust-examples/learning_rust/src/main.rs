// 118. Question Mark Operator

// use std::num::ParseIntError;

// fn parse_str(input: &str) -> Result<i32, ParseIntError> {
//     let integer = input.parse::<i32>()?;

//     println!("the value is {:?} is integer {:?}", input, integer);
//     Ok(integer)
// }
// fn main() {
//     let some_values = vec!["123", "some1", "some(123)", "abc", "53"];
//     for value in some_values {
//         println!("{:?}", parse_str(value));
//     }
// }

// fn divisor(divident: f64, divisor: f64) -> Option<f64> {

//     let answer = match divisor {
//         0.0 => None,
//         _ => Some(divident / divisor),
//     };

//     let correct = answer?;
//     // println!("{:?}", answer);
//     println!("This line will not print in case of error {:?}", correct);
//     Some(correct)
// }
// fn main() {
//     println!("Call from main with result equals to {:?}", divisor(9.0, 3.0));
//     println!("Call from main with result equals to {:?}", divisor(4.0, 0.0));
//     println!("Call from main with result equals to {:?}", divisor(0.0, 2.0));
// }

#[derive(Debug)]
enum MathError {
    DivisionError_DivisionByZero,
    LogError_NonPositiveLogrithm,
    SqrtError_NegativeSquareRoot,
}

type MathResult = Result<(), MathError>;

fn division(x: f64, y:f64) -> MathResult {
    if y == 0.0 {
        Err(MathError::DivisionError_DivisionByZero)
    } else {
        println!("The division is successful and has a result of {}" , x/y);
        Ok(())
    }
}

fn sqrt(x:f64) -> MathResult {
    if x < 0.0 {
        Err(MathError::SqrtError_NegativeSquareRoot)
    } else {
        println!("The square root is successful and has a result of {}", x.sqrt());
        Ok(())
    }
}

fn ln(x:f64) -> MathResult {
    if x <= 0.0 {
        Err(MathError::LogError_NonPositiveLogrithm)
    } else {
        println!("The log was successful and has a result of {}", x.ln());
        Ok(())
    }
}

fn operations(x:f64, y:f64) -> MathResult {
    division(x, y)?;
    sqrt(x)?;
    ln(x)?;
    Ok(())
}

fn main() {
    let result = operations(0.0, 10.0);
    if result.is_ok() {
        println!("all the functions executed successfully");
    } else {
        println!("{:?}", result);
    }
}
