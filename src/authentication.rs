use rocket::serde::json::Json;
use rocket::serde::Serialize;
use rocket::Route;
use uuid::Uuid;

#[derive(Serialize)]
struct AccessTokenResponse {
    access_token: String,
}

#[post("/api-key")]
fn generate_api_key() -> Json<AccessTokenResponse> {
    let api_key = Uuid::new_v4().to_string();
    Json(AccessTokenResponse {
        access_token: api_key,
    })
}

pub fn routes() -> Vec<Route> {
    routes![generate_api_key]
}