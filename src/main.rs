#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use] extern crate rocket;

use rocket::serde::json::Json;
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
    .mount("/", routes![check_expiration])
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::tests::rocket::http::Status;
    use crate::tests::rocket::local::blocking::Client;
    use crate::tests::rocket::http::ContentType;

    #[test]
    fn test_index() {
        let client = Client::tracked(rocket()).expect("valid rocket instance");
        let response = client.get("/").dispatch();
        assert_eq!(response.status(), Status::Ok);
        let body = response.into_string().expect("valid response body");
        let expected_body = r#"{"message":"Hello, world!"}"#;
        assert_eq!(body, expected_body);
    }

    #[test]
    fn test_check_expiration_valid_api_key() {
        let days_before_expiration = 49; // Replace with the number of days before expiration

        let client = Client::tracked(rocket()).expect("valid rocket instance");
        let request_body = r#"{"url":"www.google.com","api_key":"valid_api_key"}"#;
        let response = client
            .post("/check_expiration")
            .header(ContentType::JSON)
            .body(request_body)
            .dispatch();
        if response.status() != Status::Ok {
            // Gérer l'erreur ici
            println!("Erreur : {}", response.into_string().unwrap_or_default());
            return;
        }
        assert_eq!(response.status(), Status::Ok);
        let body = response.into_string().expect("valid response body");
        let var_name = format!(r#"{{"message":"Number of days before expiration: {}"}}"#, days_before_expiration);
        let expected_body = var_name;
        assert_eq!(body, expected_body);
    }

    #[test]
    fn test_check_expiration_invalid_api_key() {
        let client = Client::tracked(rocket()).expect("valid rocket instance");
        let request_body = r#"{"url":"www.google.com","api_key":"invalid_api_key"}"#;
        let response = client
            .post("/check_expiration")
            .header(ContentType::JSON)
            .body(request_body)
            .dispatch();
        assert_eq!(response.status(), Status::Ok);
        let body = response.into_string().expect("valid response body");
        let expected_body = r#"{"message":"Invalid API Key"}"#;
        assert_eq!(body, expected_body);
    }
}
