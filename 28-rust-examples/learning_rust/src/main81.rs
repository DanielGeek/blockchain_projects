
// Projet: Web Scrapping

use std::sync::{mpsc, Arc, Mutex};
use std::time::{Duration, Instant};
use std::thread;
use ureq::{Agent, AgentBuilder};
fn main() -> Result<(), ureq::Error>{
    let webpages = vec![
        "https://gist.github.com/recluze/dcaff7e60fbcac1f7425a1f8f9c69de7",
        "https://gist.github.com/recluze/04745a99c190b6d1aec9a86f977740ff",
        "https://gist.github.com/recluze/fd5bb0aa90c8fe5623c921172e83e975",
        "https://gist.github.com/recluze/a643e0ab6cccd649a96ed68d9ecacf51",
        "https://gist.github.com/recluze/1d2989c7e345c8c3c542",
        "https://gist.github.com/recluze/a98aa1804884ca3b3ad3",
        "https://gist.github.com/recluze/58deead37b93c0ad36be",
        "https://gist.github.com/recluze/5051735efe3fc189b90d"
    ];

    let agent = ureq::AgentBuilder::new().build();
    let now = Instant::now();

    for web_page in &webpages {
        let web_body = agent.get(web_page).call()?.into_string()?;
    }
    println!("Time taken without Threads: {:.2?}", now.elapsed());

    let now = Instant::now();
    let agent = Arc::new(agent);
    let mut handles : Vec<thread::JoinHandle<Result<(), ureq::Error>>> = Vec::new();

    for web_page in webpages {
        let agent_thread = agent.clone();
        let t = thread::spawn(move || {
            let web_body = agent_thread.get(web_page).call()?.into_string()?;

            Ok(())
        });
        handles.push(t);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Time taken using Threads: {:.2?}", now.elapsed());
    Ok(())
}