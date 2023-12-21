# Certeef Backend

This project is a web application built with the Rocket framework in Rust. It provides several routes for different functionalities, including certificate expiration checking and subscription management.

## Installation

Ensure you have Rust and Cargo installed. Then, clone this repository and navigate into the project directory. You can build and run the project with the following command:

```bash
cargo run
```

## Usage

The application starts a server on port 80. It provides the following routes:

    / (health check)
    /check_expiration
    /get_self_signed_certificate
    /subscribe
    /verify

Each route returns a JSON response.

## Tests

To run the tests for this project, use the following command:

```bash
cargo test
```

## Contribution

Contributions are welcome. Please submit a pull request with your changes.

## License
MIT