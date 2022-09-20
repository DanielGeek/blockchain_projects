// Indicamos que vamos a utilizar macros
#[macro_use]

// Importamos Diesel
extern crate diesel;

// Importamos la conexión con PostgreSQL
use diesel::prelude::*;
use diesel::pg::PgConnection;

// Importamos librerias para leer variables de entorno
use dotenv::dotenv;
use std::env;

// Importamos esquemas de BBDD y modelos
pub mod schema;
pub mod models;

fn main() {
    dotenv().ok();
    let db_url = env::var("DATABASE_URL").expect("La variable de entorno DATABASE_URL no existe.");

    // Conexión con la BBDD
    let conn = PgConnection::establish(&db_url).expect("No se ha podido establecer la conexión con la base de datos.");
    // Indicamos que vamos a utilizar el esquema de Posts y el modelo
    
    use self::models::{Post, NewPost, PostSimplificado};
    use self::schema::posts;
    use self::schema::posts::dsl::*;

    // let new_post = NewPost {
    //     title: "My second post",
    //     body: "2 Lorem ipsum...",
    //     slug: "second-post",
    // };

    // let post: Post = diesel::insert_into(posts::table).values(&new_post).get_result(&conn).expect("La insertada fallo");
    println!("Query sin limites");
    let posts_result = posts.load::<Post>(&conn).expect("Error en la consulta SQL.");

    // Iteramos los resultados de la consulta
    for post in posts_result {
        println!("{:?}", post);
    }

    println!("Query con limites");
    // Realizamos la consulta equivalente a: SELECT * FROM posts limit 1;
    let posts_result = posts.limit(1).load::<Post>(&conn).expect("Error en la consulta SQL.");

    // Iteramos los resultados de la consulta
    for post in posts_result {
        println!("{:?}", post);
    }

    println!("Query con limites ordernado por id");
    // Realizamos la consulta equivalente a: SELECT * FROM posts by id limit 1;
    let posts_result = posts.order(id.desc()).limit(1).load::<Post>(&conn).expect("Error en la consulta SQL.");

    // Iteramos los resultados de la consulta
    for post in posts_result {
        println!("{:?}", post);
    }

    println!("Query con columnas especificas");
    // Realizamos la consulta equivalente a: SELECT * FROM posts limit 1;
    let posts_result = posts.select((title, body)).limit(1).load::<PostSimplificado>(&conn).expect("Error en la consulta SQL.");

    // Iteramos los resultados de la consulta
    for post in posts_result {
        println!("{:?}", post);
    }

    println!("Query con where");
    // Realizamos la consulta equivalente a: SELECT * FROM posts limit 1;
    let posts_result = posts.filter(slug.eq("first-post")).limit(1).load::<Post>(&conn).expect("Error en la consulta SQL.");

    // Iteramos los resultados de la consulta
    for post in posts_result {
        println!("{:?}", post);
    }
}
