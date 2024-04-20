
// Sending Multiple Messages
// Multitple Producers
// Threads and Functions

// use std::{sync::mpsc, thread};
// fn main() {
//     let (tx, rx) = mpsc::channel();
//     let t = thread::spawn(move || {
//         let my_vec = vec![1,2,3,4,5];
//         for i in my_vec {
//             tx.send(i).unwrap();
//         }
//     });

//     // for recieved_vals in rx {
//     //     println!("I recieved the value of {}", recieved_vals);
//     // }

//     let recieved_vals_vec = rx.iter().collect::<Vec<i32>>();
//     println!("The recieved values are {:?}", recieved_vals_vec);
// }

// use std::{thread, sync::mpsc, time::Duration};

// fn main() {
//     let (tx, rx) = mpsc::channel();
//     let tx1 = tx.clone();
//     thread::spawn(move || {
//         let my_vec = vec![1,2,3,4,5];
//         for i in my_vec {
//             tx.send(i).unwrap();
//             thread::sleep(Duration::from_secs(1));
//         }
//     });
    
//     thread::spawn(move || {
//         let my_vec = vec![6,7,8,9,10];
//         for i in my_vec {
//             tx1.send(i).unwrap();
//             thread::sleep(Duration::from_secs(1));
//         }
//     });

//     for recieved_vals in rx {
//         println!("I recieved the value of {}", recieved_vals);
//     }
// }

use std::{thread, sync::mpsc, time::Duration};

fn timer(d: i32, tx: mpsc::Sender<i32>) {
    thread::spawn(move || {
        println!("{} send! ", d);
        tx.send(d).unwrap();
    });
}

fn main () {
    let (tx, rx) = mpsc::channel();
    for i in 0..5 {
        timer(i, tx.clone());
    }
    drop(tx);

    for recieved_val in rx {
        println!("{} recieved!", recieved_val);
    }
}