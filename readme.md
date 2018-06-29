# cnpm.org-ldap

## usage
<https://github.com/cnpm/cnpmjs.org/wiki/Use-Your-Own-User-Authorization>

```javascript
const cnpmLdap = require('cnpm.org-ldap').LdapUserService
config.userService = new cnpmLdap('ldap://localhost', {
  base: 'dc=example,dc=com',
  loginField: 'uid', // username attributes
})
```

## options

|name|type|desc|
|----|----|----|
|loginField|string| which attribute in userObject is username|
|base|string| where to search user|
|filter|string|custom filter example `(&({{user}})(accountStatus=active))`|
|tlsOptions|object|nodejs tls options, used by underlay connection|
|dn|string| login dn, leave blank to use anonymous|
|password|string| login password|
|attributes|object|user information|

In default, this will use 'mail' field as user's email. Please use options.attributes to customize your user attribute.
```typescript
interface IAttributes {
  email: string
  name?: string
  html_url?: string
  avatar_url?: string
  im_url?: string
  site_admin?: string
  scopes?: string
}
```
