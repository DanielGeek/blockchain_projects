
// Web Programming Basics

use std::net::{TcpListener, TcpStream};
use std::io::{BufRead, BufReader, Write};
use std::fs;
fn main(){
    let listener = TcpListener::bind("127.0.0.1:8000").unwrap();
    // let stream = listener.accept();

    // println!("The stream {:?} \n The socket {:?}", stream.as_ref().unwrap().1, stream.as_ref().unwrap().0);
    // for i in 0..10 {
    //     match listener.accept() {
    //         Ok((socket, addr)) => println!("The client info: {:?}", addr),
    //         Err(e) => println!("Couldn't get client: {:?}", e),
    //     }
    // }

    for stream in listener.incoming() {
        let stream = stream.unwrap();
        handle_connection(stream);
    }
}

fn handle_connection(mut stream: TcpStream) {
    let buf_reader = BufReader::new(&mut stream);

    // let http_request = buf_reader
    //     .lines()
    //     .map(|result| result.expect("Failed to read a line"))
    //     .take_while(|line| !line.is_empty())
    //     .collect::<Vec<String>>();

    // println!("Request: {:#?}", http_request);

    /*
        Response Syntax

        HTTP-Version Status-Code Reason-Phrase CRLF
        headers CRLF
        message-body

        ex: HTTP/1.1 200 Ok\r\n\r\n
     */

    // let response = "HTTP/1.1 200 OK\r\n\r\n";
    // stream.write(response.as_bytes()).unwrap();
    // stream.flush().unwrap();

    // let status_line = "HTTP/1.1 200 OK\r\n";
    // let contents = match fs::read_to_string("index.html") {
    //     Ok(file) => file,
    //     Err(e) => {
    //         eprintln!("Error reading file: {}", e);
    //         let error_message = "HTTP/1.1 404 Not Found\r\n\r\n<html><body><h1>404 Not Found</h1></body></html>";
    //         stream.write_all(error_message.as_bytes()).unwrap();
    //         stream.flush().unwrap();
    //         return;
    //     }
    // };

    // let length = contents.len();
    // let response = format!(
    //     "{}Content-Length: {}\r\n\r\n{}",
    //     status_line, length, contents
    // );

    // stream.write_all(response.as_bytes()).unwrap();
    // stream.flush().unwrap();

    let mut request_line = buf_reader.lines().next();
    let (status_line, file_name) = match request_line.unwrap().unwrap().as_str() {
        "GET / HTTP/1.1" => (Some("HTTP/1.1 200 OK\r\n"), Some("index.html")),
        "GET /page1 HTTP/1.1" => (Some("HTTP/1.1 200 OK\r\n"), Some("page1.html")),
        "GET /page2 HTTP/1.1" => (Some("HTTP/1.1 200 OK\r\n"), Some("page2.html")),
        _ => (Some("HTTP/1.1 404 NOT FOUND\r\n"), Some("404.html"))
    };

    let contents = fs::read_to_string(file_name.unwrap()).unwrap();
    let response = format!("{} Content-Length: {}\r\n\r\n{}", status_line.unwrap(), contents.len(), contents);

    stream.write_all(response.as_bytes()).unwrap();
    stream.flush().unwrap();

}
