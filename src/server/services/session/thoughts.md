Encrypt cookies and create a MAC of the ciphertext.

When a cookie is received, a MAC is calculated and compared with the one provided in the cookie. If the 
MAC differs then the cookie has been tampered with and the request is dropped.

Attributes:
 
- Secure
- HTTPOnly
- Path
- Domain
- Cookie Lifetime
- Cookie Prefixes "__Secure-" and "__Host-"
- SameSite Strict|Lax

The __Secure- prefix makes a cookie accessible from HTTPS sites only. A HTTP site can not read 
or update a cookie if the name starts with __Secure-. This protects against the attack we earlier 
described, where an attacker uses a forged insecure site to overwrite a secure cookie.

The __Host- prefix does the same as the __Secure- prefix and more. A __Host--prefixed cookie is 
only accessible by the same domain it is set on. This means that a subdomain can no longer overwrite 
the cookie value.
