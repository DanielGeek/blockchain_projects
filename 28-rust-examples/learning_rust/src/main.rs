// 129. - Most Recently Used Product
//          - Description
//              - A business is interesting in knowing the products that has been
//                purchased most recently by a customer.
//              
//          - Tools
//              - Hashmaps + Double Link List

use std::{cell::RefCell, rc::Rc, collections::HashMap};

type Link<T> = Option<Rc<RefCell<Node<T>>>>;

#[derive(Debug)]
struct Node<T> {
    value: T,
    prev: Link<T>,
    next: Link<T>,
}

impl<T> Node<T> {
    fn new(value: T) -> Rc<RefCell<Self>> {
        Rc::new(RefCell::new(Node {
            value,
            prev: None,
            next: None,
        }))
    }
}

#[derive(Debug)]
struct MRUTracker<T> {
    head: Link<T>,
    tail: Link<T>,
    map: HashMap<T, Rc<RefCell<Node<T>>>>,
}

impl<T: Eq + std::hash::Hash + Clone> MRUTracker<T> {
    fn new() -> Self {
        MRUTracker {
            head: None,
            tail: None,
            map: HashMap::new(),
        }
    }

    fn touch(&mut self, value: T) {
        if let Some(node) = self.map.get(&value).cloned() {
            let mut node_borrow = node.borrow_mut();
            match node_borrow.prev.take() {
                Some(prev) => {
                    // Disconnect the node from its current position
                    prev.borrow_mut().next = node_borrow.next.take();
                    if let Some(next) = &prev.borrow().next {
                        next.borrow_mut().prev = Some(prev.clone());
                    }
                    // Move the node to the front
                    self.move_to_front(node.clone(), node_borrow);
                }
                None => {
                    // Node is already at the front
                }
            }
        } else {
            // Value not in list, so create a new node
            let new_node = Node::new(value.clone());
            // Move the new node to the front
            self.move_to_front(new_node.clone(), new_node.borrow_mut());
            // Add to hashmap
            self.map.insert(value, new_node);
        }
    }

    fn move_to_front(&mut self, new_node: Rc<RefCell<Node<T>>>, mut new_node_borrow: std::cell::RefMut<Node<T>>) {
        new_node_borrow.next = self.head.take();
        if let Some(old_head) = &new_node_borrow.next {
            old_head.borrow_mut().prev = Some(new_node.clone());
        }
        self.head = Some(new_node.clone());
        if self.tail.is_none() {
            self.tail = Some(new_node);
        }
    }

    fn get_mru(&self) -> Option<T> {
        self.head.as_ref().map(|node| node.borrow().value.clone())
    }
}

fn main() {
    let mut tracker = MRUTracker::new();
    
    tracker.touch("Product 1");
    tracker.touch("Product 2");
    tracker.touch("Product 3");
    
    println!("Most Recently Used (MRU) Product: {:?}", tracker.get_mru());
}

