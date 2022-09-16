use csv::{ReaderBuilder, StringRecord};
use std::collections::{HashMap};
use std::{fs};

const FILENAME: &str = "history.csv";

#[derive(Debug)]
struct DataHistory {
    data_type: String,
    tag: String,
    text: String,
    live: i32
}

impl DataHistory {
    fn new(row: StringRecord) -> DataHistory {
        let live = row.get(3).unwrap().trim();
        let live : i32 = live.parse().unwrap_or(0);

        return DataHistory {
            data_type: row.get(0).unwrap().trim().to_string(),
            tag: row.get(1).unwrap().trim().to_string(),
            text: row.get(2).unwrap().trim().to_string(),
            live: live,
        };
    }
}

fn main() {
    let mut data_history: HashMap<String, DataHistory> = HashMap::new();

    let content = fs::read_to_string(FILENAME).unwrap();
    let mut rdr = ReaderBuilder::new().delimiter(b';').from_reader(content.as_bytes());

    for result in rdr.records() {
        let result = result.unwrap();

        let data = DataHistory::new(result);

        data_history.insert(data.tag.clone(), data);
    }

    println!("{:?}", data_history["DERECHA"]);
}
