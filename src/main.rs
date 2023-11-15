#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use] extern crate rocket;

use rocket::serde::json::{Json, Value, json};
use rocket::serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
struct CheckExpirationRequest {
    url: String,
    api_key: String,
}
#[derive(Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
struct CheckExpirationResponse {
    message: String,
}

async fn async_healthcheck() -> CheckExpirationResponse {
    let res = CheckExpirationResponse {
        message: "Hello, world!".to_string(),
    };
    return res;
}

async fn async_invalid_response() -> CheckExpirationResponse {
    let res = CheckExpirationResponse {
        message: "Invalid API Key".to_string(),
    };
    return res;
}

async fn async_check(result: u32) -> CheckExpirationResponse {
    let res = CheckExpirationResponse {
        message: format!("Number of days before expiration: {:?}", result).to_string(),
    };
    return res;
}

#[get("/")]
async fn index() -> Json<CheckExpirationResponse> {
    let res = async_healthcheck().await;
    return Json(res);
}

#[post("/check_expiration", format = "application/json", data = "<check_expiration_request>")]
async fn check_expiration(check_expiration_request: Json<CheckExpirationRequest>) -> Json<CheckExpirationResponse> {

    if check_expiration_request.api_key != "valid_api_key" {
        let res = async_invalid_response().await;
        return Json(res)
    }
 
    let result = certeef::check_expiration_date_of(&check_expiration_request.url);
    let res = async_check(result).await;
    return Json(res);
}


#[launch]
fn rocket() -> _ {
    rocket::build()
    .mount("/", routes![index])
    .mount("/check_expiration", routes![check_expiration])
}
