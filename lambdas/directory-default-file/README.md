# directory-default-file

This lambda rewrite the request URL to default any URL ending with `/` or not having an extension to an `index.html`.

Examples of redirections:

| Request's URI | Destination         |
| ------------- | ------------------- |
| /             | /index.html         |
| /foo/bar      | /foo/bar/index.html |
| /foo.bar      | /foo.bar            |
