#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use] extern crate rocket;
#[macro_use] extern crate serde_derive;
extern crate serde_json;
extern crate certeef;

use rocket::http::Status;
use rocket::http::RawStr;
use rocket::request::{self, FromRequest, Request};
use rocket::Outcome;

#[derive(Serialize, Deserialize)]
struct CheckExpirationRequest {
    url: String,
    api_key: String,
}

struct CheckExpirationResponse {
    result: certeef::ExpirationStatus,
}

#[post("/check_expiration", format = "json", data = "<check_expiration_request>")]
fn check_expiration(check_expiration_request: CheckExpirationRequest) -> CheckExpirationResponse {
    if check_expiration_request.api_key != "valid_api_key" {
        return CheckExpirationResponse { result: certeef::ExpirationStatus::Error("Invalid API key".to_string()) };
    }

    let result = certeef::check_expiration_date_of(&check_expiration_request.url);
    CheckExpirationResponse { result }
}

fn main() {
    rocket::ignite().mount("/", routes![check_expiration]).launch();
}