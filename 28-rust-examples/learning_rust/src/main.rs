// 112. - Zero Sized Types
//          - Unit Struct

struct Admin;
struct User;
trait Authenticate {
    fn authenticate(&self, username: &str, password: &str) -> bool;
}

impl Authenticate for Admin {
    fn authenticate(&self, username: &str, password: &str) -> bool {
        username == "admin" && password == "adminpass"
    }
}

impl Authenticate for User {
    fn authenticate(&self, username: &str, password: &str) -> bool {
        username == "user" && password == "userpass"
    }
}

fn login<T: Authenticate>(role: T, username: &str, password: &str) -> bool {
    role.authenticate(username, password)
}
fn main() {
    let admin = Admin;
    let user = User;
    let admin_login = login(admin, "admin", "adminpass");
    let user_login = login(user, "user", "userpass");

    if admin_login {
        println!("Admin login successful!");
    } else {
        println!("User login successful!");
    }

    let x = ();
    let y = x;
    let z = x;

    struct ABC;
    let x = ABC;
    let y = x;
    let z = x;
}
