// 123. - Longest Non-Stop Work
//          - Description
//              - Given time slots numbers, we want to determine the longest consecutive
//                time slots.
//          - Tools
//              - HashSet Vectors, Loops

use std::collections::HashSet;

fn longest_consecutive(working_slots: &[u8]) -> u8 {
    let mut slot_set: HashSet<u8> = HashSet::new();
    let mut longest = 0;

    for &slot in working_slots {
        slot_set.insert(slot);
    }

    for &slot in &slot_set {
        if !slot_set.contains(&(slot - 1)) {
            let mut current_slot = slot;
            let mut current_streak = 1;

            while slot_set.contains(&(current_slot + 1)) {
                current_slot += 1;
                current_streak += 1;
            }

            longest = longest.max(current_streak);
        }
    }

    longest
}

fn longest_busy_time(working_slots: Vec<Vec<u8>>) -> usize {
    let mut employee_longest_nonstop_work: Vec<u8> = Vec::new();

    for employee_slots in working_slots {
        employee_longest_nonstop_work.push(longest_consecutive(&employee_slots));
    }

    for (i, &work) in employee_longest_nonstop_work.iter().enumerate() {
        println!("Employee Number {} has worked nonstop for {} slots", i + 1, work);
    }

    employee_longest_nonstop_work
        .iter()
        .enumerate()
        .max_by_key(|&(_i, &work)| work)
        .map(|(i, _)| i)
        .unwrap_or_default() + 1
}

fn main() {
    let schedules = vec![
        vec![4, 1, 2, 5, 6, 8, 10, 11],
        vec![3, 1, 2, 5, 7, 10, 11, 14],
        vec![3, 1, 15, 5, 13, 12, 10, 14, 15, 16, 17, 18, 8, 9],
    ];

    println!(
        "Employee Number {} has the highest number of nonstop working slots",
        longest_busy_time(schedules)
    );
}
