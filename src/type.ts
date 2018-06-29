import * as tls from 'tls'

export interface IOptions {
  loginField: string
  filter?: string
  attributes?: {
    email: string
    name?: string
    html_url?: string
    avatar_url?: string
    im_url?: string
    site_admin?: string
    scopes?: string[]
  }
  tlsOptions?: tls.TlsOptions
  base?: string
  dn?: string
  password?: string
}

export interface IUser {
  dn: string,
  login: string
  email: string
  name?: string
  html_url?: string
  avatar_url?: string
  im_url?: string
  site_admin?: boolean
  scopes?: string[]
}
