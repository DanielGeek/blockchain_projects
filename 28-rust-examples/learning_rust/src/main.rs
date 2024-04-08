// 94. Link List (Part 2)

#[derive(Debug)]
struct LinkList {
    head: pointer,
}

#[derive(Debug)]
struct Node {
    element: i32,
    next: pointer,
}

type pointer = Option<Box<Node>>;

impl LinkList {
    fn new() -> LinkList {
        LinkList { head: None }
    }

    fn add(&mut self, element: i32) {
        // match self.head {
        //     None => {
        //         let new_node = Some(Box::new(Node {
        //             element: element,
        //             next: None,
        //         }));
        //         self.head = new_node;
        //     }
        //     Some(Previous_head) => {
        //         let new_node = Some(Box::new(Node {
        //             element: element,
        //             next: Some(Previous_head),
        //         }));
        //         self.head = new_node;
        //     }
        // }

        // fn take<T>(dest: &mut T) -> T
        let previous_head = self.head.take();
        let new_head = Some(Box::new(Node {
            element: element,
            next: previous_head,
        }));
        self.head = new_head;
    }

    fn remove(&mut self) -> Option<i32> {
        match self.head.take() {
            Some(previous_head) => {
                self.head = previous_head.next;
                Some(previous_head.element)
            }
            None => None,
        }
    }

    fn print(&self) {
        let mut list_traversal = &self.head;
        while !list_traversal.is_none() {
            println!("{:?}", list_traversal.as_ref().unwrap().element);
            list_traversal = &list_traversal.as_ref().unwrap().next;
        }
    }
}

fn main() {
    let mut list = LinkList::new();
    list.add(5);
    list.add(7);
    list.add(10);
    list.add(15);
    list.add(20);

    // println!("List: {:?}", list);
    list.print();
    println!("{}", list.remove().unwrap());
}
