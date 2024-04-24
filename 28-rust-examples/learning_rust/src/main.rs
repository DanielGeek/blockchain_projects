// Directory and Path Related Functions

use std::env;
use std::fs;
use std::path::{Path, PathBuf};

fn main(){
    let path = Path::new(r"/Users/danielgeek/Documents/GitHub/blockchain_projects/28-rust-examples/learning_rust/my_text.txt");
    println!("Folder containing the file: {:?}", path.parent().unwrap());

    println!("Name of the hte file is {:?}", path.file_stem().unwrap());
    println!("Extention of the file is {:?}", path.extension().unwrap());

    let mut path = PathBuf::from(r"/Users/");
    path.push(r"danielgeek");
    path.push(r"Documents");
    path.push(r"GitHub");
    path.push(r"blockchain_projects");
    path.push(r"28-rust-examples");
    path.push(r"learning_rust");
    path.push(r"my_text");

    path.set_extension("txt");
    println!("The path is {:?}", path);
}