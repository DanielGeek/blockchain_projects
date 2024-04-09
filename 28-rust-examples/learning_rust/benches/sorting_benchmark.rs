// use learning_rust::{sort_algo_1, sort_algo_2};
// use criterion::{criterion_group, criterion_main, Bencher, Criterion};

// fn sort_benchmark(c: &mut Criterion) {
//     let mut numbers: Vec<i32> = vec![
//         1,2,3,6,5,4,12,2,3,4,5,6,7,8,9,1,15,55,12,22,33
//     ];

//     c.bench_function("Sorting Algorithm", |b: &mut Bencher| {
//         b.iter( || sort_algo_2(&mut numbers))
//     });
// }

// criterion_group!(benches, sort_benchmark);
// criterion_main!(benches);
