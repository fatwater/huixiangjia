import * as fs from 'fs'
import * as path from 'path'
import * as yaml from 'js-yaml'

const configPath = path.join(process.cwd(), 'config.yaml')
const configFile = fs.existsSync(configPath) ? yaml.load(fs.readFileSync(configPath, 'utf8')) : {}

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
})
