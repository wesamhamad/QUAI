<?php

// MyQU Test IdP Configuration (for staging/test environment)
// IDP Host: https://myqu-test.qu.edu.sa
$this_idp_env_id = 'MYQUTEST';
$idp_host = env('SAML2_'.$this_idp_env_id.'_IDP_HOST', 'https://myqu-test.qu.edu.sa');

return $settings = [
    'strict' => false,
    'debug' => env('SAML2_DEBUG', false),

    'sp' => [
        'NameIDFormat' => 'urn:oasis:names:tc:SAML:2.0:nameid-format:persistent',
        'x509cert' => env('SAML2_'.$this_idp_env_id.'_SP_x509', env('SAML2_SP_CERT_x509', '')),
        'privateKey' => env('SAML2_'.$this_idp_env_id.'_SP_PRIVATEKEY', env('SAML2_SP_CERT_PRIVATEKEY', '')),
        'entityId' => env('SAML2_'.$this_idp_env_id.'_SP_ENTITYID', ''),
        'assertionConsumerService' => [
            'url' => env('SAML2_'.$this_idp_env_id.'_SP_ACS_URL', ''),
        ],
        'singleLogoutService' => [
            'url' => '',
        ],
    ],

    'idp' => [
        'entityId' => env('SAML2_'.$this_idp_env_id.'_IDP_ENTITYID', $idp_host . '/saml/metadata'),
        'singleSignOnService' => [
            'url' => env('SAML2_'.$this_idp_env_id.'_IDP_SSO_URL', $idp_host . '/login'),
        ],
        'singleLogoutService' => [
            'url' => env('SAML2_'.$this_idp_env_id.'_IDP_SLO_URL', $idp_host . '/saml/logout'),
        ],
        'x509cert' => env('SAML2_'.$this_idp_env_id.'_IDP_x509', 'MIIEITCCAwmgAwIBAgIUSmvzRy+MJA71izDVa8SZYWUgtrowDQYJKoZIhvcNAQELBQAwgZ8xCzAJBgNVBAYTAlNBMQ8wDQYDVQQIDAZRYXNzaW0xDzANBgNVBAcMBm1vbGlkYTEaMBgGA1UECgwRUWFzc2ltIFVuaXZlcnNpdHkxGTAXBgNVBAsMEFByb2dyYW1taW5nIFRlYW0xFjAUBgNVBAMMDURlYW5zaGlwIERlcHQxHzAdBgkqhkiG9w0BCQEWEHBvcnRhbEBxdS5lZHUuc2EwHhcNMjEwNDEzMTE1MzUzWhcNNDEwNDA4MTE1MzUzWjCBnzELMAkGA1UEBhMCU0ExDzANBgNVBAgMBlFhc3NpbTEPMA0GA1UEBwwGbW9saWRhMRowGAYDVQQKDBFRYXNzaW0gVW5pdmVyc2l0eTEZMBcGA1UECwwQUHJvZ3JhbW1pbmcgVGVhbTEWMBQGA1UEAwwNRGVhbnNoaXAgRGVwdDEfMB0GCSqGSIb3DQEJARYQcG9ydGFsQHF1LmVkdS5zYTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBANnBZK4z9ulSYPCWp72KHHInDb8qFnlDcQiijHOBgcM5Ic8n/TLs+GVJB1egojS6bttWUCqoJlhE5KqGIKGC7PwhlNgcyCHwi5eojGzeGQL5TP53CVl6ISDcxa4Bt/7XKfVaJHtXg+AePfzpXLqziFAvEj4an0KvHmy9k+RYRp2wss8jVsS1w0WqaYDRT34iQR7BVJP4hbVm2nTEUGI9QtVQSLZej6J694gRIVf3xGASXguowNt3YMgQ6HN8+F110lSCj4sOCppJNc3mmG4IiuTMxfHZTaClVPHwyEitaFVLkz9esHSdElBMZmrlSv3RXQ1aq9p9y/qjcGg1IAfPZPcCAwEAAaNTMFEwHQYDVR0OBBYEFAcxqkIAYB7HbbWJS1CP/JBy4hb/MB8GA1UdIwQYMBaAFAcxqkIAYB7HbbWJS1CP/JBy4hb/MA8GA1UdEwEB/wQFMAMBAf8wDQYJKoZIhvcNAQELBQADggEBAArP4jFbLxNf07xl1WsCX5PtoKFb4dRu/TaI95fyCNM+zD0pYVB+qW+a2GvsoP6YjqxWmTboSy+cW65e4YDPFl514/zky46VAIa6a5nHIWVI+ZAklPX6WvbDpQVAMZ2axKBdIp3MwI5d99X3k0BgYPfwEDxNHgVEDXEG51vQZfQirYl5HTJ1RUKjviabY/t/eodvZ+ySzvlz98HCKNag0Ti0xUpWcMqnoX5LhgnWNrlpGjxq1acZ0FIehXhVDeyCsGp7iJy+d5I4XX7VxMOHJ2IYoNV2qZW0mSSrPrH5CBrHyptFCM/MBfdYhXG6+5O+FyHN4Gf+GsWr8r6cKsEY18M='),
    ],

    'security' => [
        'nameIdEncrypted' => false,
        'authnRequestsSigned' => false,
        'logoutRequestSigned' => false,
        'logoutResponseSigned' => false,
        'signMetadata' => false,
        'wantMessagesSigned' => false,
        'wantAssertionsSigned' => false,
        'wantNameIdEncrypted' => false,
        'requestedAuthnContext' => false,
    ],

    'contactPerson' => [
        'technical' => [
            'givenName' => env('SAML2_CONTACT_TECHNICAL_NAME', 'Technical Support'),
            'emailAddress' => env('SAML2_CONTACT_TECHNICAL_EMAIL', 'support@qu.edu.sa')
        ],
        'support' => [
            'givenName' => env('SAML2_CONTACT_SUPPORT_NAME', 'Support'),
            'emailAddress' => env('SAML2_CONTACT_SUPPORT_EMAIL', 'support@qu.edu.sa')
        ],
    ],

    'organization' => [
        'en-US' => [
            'name' => env('SAML2_ORGANIZATION_NAME', 'Qassim University'),
            'displayname' => env('SAML2_ORGANIZATION_NAME', 'Qassim University'),
            'url' => env('SAML2_ORGANIZATION_URL', 'https://qu.edu.sa')
        ],
    ],
];

