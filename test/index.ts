import {LdapUserService} from '../src'
import should = require('should')

const service = new LdapUserService(process.env['LDAP_SERVER'], {
  base: process.env['LDAP_BASE'],
  loginField: 'uid',
})

describe('ldapUserService', function () {
  it('auth', async function () {
    await service.auth(process.env['LDAP_USER'], process.env['LDAP_PASSWORD'])
  })
  it('get', async function () {
    const user = await service.get(process.env['LDAP_USER'])
    should(user).hasOwnProperty('login')
  })
  it('list', async function () {
    const users = await service.list([process.env['LDAP_USER']])
    users.length.should.eql(1)
  })
  it('search', async function () {
    const users = await service.search(process.env['LDAP_USER'], {limit: 20})
    users.length.should.eql(1)
  })
})
