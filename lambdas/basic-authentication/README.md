# basic-authentication

This lambda checks the `authorization` header value which should match then expected value.
If the value is either missing or invalid then it responds with a 401 status and a `WWW-Authenticate` header.
In this case, the browser should prompt the user for a login and a password.

## Configuration

To configure this lambda, a `config.json` file is expected next to the `index.js` file.


Here is its structure:
```json
{
  "authenticationRealm": "www.foo.com",
  "authorization": "dGVzdDp0ZXN0Cg=="
}
```
The `authenticationRealm` is a value that some browsers would display to the user while asking them to enter their credentials. Usually, it's the website's domain.

The `authorization` is the Base64 encoded credentials as the basic authentication standard expects it: `<login>:<password>`. This value stands for `test:test` which isn't secure at all and should be redefined.
