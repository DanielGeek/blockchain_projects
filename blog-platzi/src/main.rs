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

    diesel::delete(posts.filter(slug.eq("second-blogpost"))).execute(&conn).expect("Ha fallado la eliminacion del tercer post");

    // let new_post = NewPost {
    //     title: "My second post",
    //     body: "2 Lorem ipsum...",
    //     slug: "second-post",
    // };

    // let post: Post = diesel::insert_into(posts::table).values(&new_post).get_result(&conn).expect("La insertada fallo");

    // let post_update = diesel::update(posts.filter(id.eq(2)))
    //     .set(slug.eq("second-blogpost"))
    //     .get_result::<Post>(&conn)
    //     .expect("Error updating record");

    println!("Query sin limites");
    let posts_result = posts.load::<Post>(&conn).expect("Error en la consulta SQL.");

    // Iteramos los resultados de la consulta
    for post in posts_result {
        println!("{:?}", post);
    }
}
