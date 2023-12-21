$version: "2"
namespace fr.misfits.certeef.api

/// Provides certification information.
service CerteefApi {
    version: "2022-01-01",
    operations: [Index, CheckExpiration]
}

/// Health Check Api
operation Index {
    output: IndexOutput
}

structure IndexOutput {
    status: String
}

/// Provides number of days before certificate expiration for the given URL
operation CheckExpiration {
    input: CheckExpirationInput,
    output: CheckExpirationOutput
}

structure CheckExpirationInput {
    apiKey: String,
    url: String
}

structure CheckExpirationOutput {
    message: String
}

operation SelfSignedCertificate {
    output: SelfSignedCertificateInput
}

structure SelfSignedCertificateInput {
    message: String
}