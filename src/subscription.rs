use lettre::transport::smtp::authentication::{Credentials, Mechanism};
use lettre::{Message, SmtpTransport, Transport};
use rocket::serde::json::Json;
use rocket::serde::{Deserialize, Serialize};
use uuid::Uuid;

use rocket::http::Status;

#[derive(Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct SubscriptionRequest {
    name: String,
    email: String,
}

#[derive(Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct SubscriptionResponse {
    id: String,
    name: String,
    email: String,
}

#[post("/subscribe", data = "<subscription_request>")]
pub async fn subscribe(subscription_request: Json<SubscriptionRequest>) -> Json<SubscriptionResponse> {
    let id = Uuid::new_v4().to_string();

    // Send verification email
    let noreply_email_address =
        std::env::var("NOREPLY_EMAIL_ADDRESS").expect("NOREPLY_EMAIL_ADDRESS is not set");
    let smtp_username = std::env::var("SMTP_USERNAME").expect("SMTP_USERNAME is not set");
    let smtp_password = std::env::var("SMTP_PASSWORD").expect("SMTP_PASSWORD is not set");
    let smtp_host = std::env::var("SMTP_HOST").expect("SMTP_HOST is not set");
    let smtp_port = std::env::var("SMTP_PORT").expect("SMTP_PORT is not set");
    let verify_url = std::env::var("VERIFY_URL").expect("VERIFY_URL is not set");

    let email = Message::builder()
        .from(noreply_email_address.parse().unwrap())
        .to(subscription_request.email.parse().unwrap())
        .subject("Please verify your email")
        .body(format!(
            "Please click the following link to verify your email: {}",
            verify_url
        ))
        .unwrap();

    let creds = Credentials::new(smtp_username.to_string(), smtp_password.to_string());

    let mailer = SmtpTransport::relay(&smtp_host)
        .unwrap()
        .port(smtp_port.parse::<u16>().unwrap())
        .credentials(creds)
        .authentication(vec![Mechanism::Plain])
        .build();

        mailer.send(&email).unwrap();

    Json(SubscriptionResponse {
        id,
        name: subscription_request.name.clone(),
        email: subscription_request.email.clone(),
    })
}

#[get("/verify/<id>")]
pub async fn verify(id: String) -> Status {
    // Here you would check the database to see if the id is valid and mark the email as verified if it is
    // For now we'll just return a 200 OK status
    Status::Ok
}

//test
#[cfg(test)]
mod tests {
    use rocket::{http::ContentType, local::asynchronous::Client, http::Status};
    use rocket::tokio;
    use super::*;
    use dotenv::dotenv;

    #[tokio::test]
    async fn test_subscribe() {
        dotenv::dotenv().ok();
        let rocket = rocket::build().mount("/", routes![super::subscribe]);
        let client = Client::tracked(rocket).await.expect("valid rocket instance");

        let recipient_email = std::env::var("RECIPIENT_EMAIL").expect("RECIPIENT_EMAIL is not set");

        let subscription_request = SubscriptionRequest {
            name: "John Doe".to_string(),
            email: recipient_email,
        };

        let subscription_request_json = serde_json::to_string(&subscription_request)
        .expect("Failed to serialize subscription request");

        let response = client.post("/subscribe")
            .header(ContentType::JSON)
            .body(subscription_request_json)
            .dispatch()
            .await;

        assert_eq!(response.status(), Status::Ok);

    }

    #[tokio::test]
    async fn test_verify() {
        dotenv::dotenv().ok();
        let rocket = rocket::build().mount("/", routes![super::verify]);
        let client = Client::tracked(rocket).await.expect("valid rocket instance");

        let id = "abcd1234".to_string();

        let response = 
        client.get(format!("/verify/{}", id))
            .header(ContentType::JSON)
            .dispatch()
            .await;

        assert_eq!(response.status(), Status::Ok);
    }
}