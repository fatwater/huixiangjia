import * as fs from 'fs'
import * as path from 'path'
import * as yaml from 'js-yaml'

interface ConfigFile {
  port?: number
  database?: {
    host?: string
    port?: number
    username?: string
    password?: string
    database?: string
  }
  jwt?: {
    secret?: string
    expiresIn?: string
  }
  wecom?: {
    corpId?: string
    agentId?: string
    secret?: string
  }
  wepay?: {
    appId?: string
    mchId?: string
    mchKey?: string
    notifyUrl?: string
  }
}

const configPath = path.join(process.cwd(), 'config.yaml')
const configFile: ConfigFile = fs.existsSync(configPath)
  ? (yaml.load(fs.readFileSync(configPath, 'utf8')) as ConfigFile)
  : {}

export default () => ({
  port: configFile.port || 3000,
  database: {
    host: configFile.database?.host || 'localhost',
    port: configFile.database?.port || 3306,
    username: configFile.database?.username || 'root',
    password: configFile.database?.password || '',
    database: configFile.database?.database || 'huixiangjia',
  },
  jwt: {
    secret: configFile.jwt?.secret || 'huixiangjia-secret-key',
    expiresIn: configFile.jwt?.expiresIn || '7d',
  },
  wecom: {
    corpId: configFile.wecom?.corpId || '',
    agentId: configFile.wecom?.agentId || '',
    secret: configFile.wecom?.secret || '',
  },
  wepay: {
    appId: configFile.wepay?.appId || '',
    mchId: configFile.wepay?.mchId || '',
    mchKey: configFile.wepay?.mchKey || '',
    notifyUrl: configFile.wepay?.notifyUrl || 'http://localhost:3000/api/v1/payment/notify',
  },
})
