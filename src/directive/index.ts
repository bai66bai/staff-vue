import type { App } from 'vue'
import hasPermi from './hasPermi'
import hasRole from './hasRole'

export default function directive(app: App) {
  app.directive('hasRole', hasRole)
  app.directive('hasPermi', hasPermi)
}
