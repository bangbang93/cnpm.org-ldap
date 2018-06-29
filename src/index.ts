import * as ldap from 'ldapjs'
import {IOptions, IUser} from './type'

class LdapUserService {
  private client: any
  private readonly filter: string

  constructor (private url, private options: IOptions) {
    this.client = ldap.createClient({
      url,
      tlsOptions: options.tlsOptions
    })
    this.options.attributes = this.options.attributes || {email: 'mail'}
    if (options.filter) {
      this.filter = options.filter.replace('{{user}}', `${options.loginField}={{user}}`)
    } else {
      this.filter = `${options.loginField}={{user}}`
    }

    if (options.dn) {
      this.client.bind(options.dn, options.password, function (err) {
        if (err) throw err
      })
    }
  }

  async auth (login, password) {
    const user = await this.get(login)
    const client = ldap.createClient({
      url: this.url,
      tlsOptions: this.options.tlsOptions
    })
    await new Promise(((resolve, reject) => {
      client.bind(user.dn, password, function (err) {
        if (err) return reject(err)
        resolve()
      })
    }))
    return user
  }

  async get (login): Promise<IUser> {
    const filter = this.filter.replace('{{user}}', login)
    const [user] = await new Promise<any[]>(((resolve, reject) => {
      this.client.search(this.options.base, {filter, scope: 'sub'}, function (err, res) {
        if (err) return reject(res)
        res.on('error', reject)
        const entries = []
        res.on('searchEntry', (entry) => entries.push(entry.object))
        res.on('searchReference', console.log)
        res.on('end', () => resolve(entries))
      })
    }))
    if (!user) return null

    return Object.keys(this.options.attributes).reduce<IUser>((p, key) => {
      p[key] = user[this.options.attributes[key]]
      return p
    }, {
      login,
      email: user[this.options.attributes.email],
      dn: user.dn
    })
  }

  async list(logins): Promise<IUser[]> {
    return logins.map((login) => this.get(login))
  }

  async search(query, options) {
    const filter = this.filter.replace('{{user}}', `*${query}*`)
    const users = await new Promise<any[]>(((resolve, reject) => {
      this.client.search(this.options.base,
        {filter, scope: 'sub', paged: true, sizeLimit: options.limit},
        function (err, res) {
          if (err) return reject(res)
          res.on('error', reject)
          const entries = []
          res.on('searchEntry', (entry) => entries.push(entry.object))
          res.on('searchReference', console.log)
          res.on('end', () => resolve(entries))
        })
    }))
    return users.map((user) => {
      return Object.keys(this.options.attributes).reduce<IUser>((p, key) => {
        p[key] = user[this.options.attributes[key]]
        return p
      }, {
        login: user[this.options.loginField],
        email: user[this.options.attributes.email],
        dn: user.dn
      })
    })
  }
}

export default LdapUserService

export {LdapUserService}
