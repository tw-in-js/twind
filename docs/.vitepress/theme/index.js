import Theme from 'vitepress/theme'
import Quote from '../components/Quote.vue'
import UnderConstruction from '../components/UnderConstruction.vue'
import { setup } from 'twind'
import 'twind/shim'
import '../styles/styles.css'

setup({ preflight: false })

export default {
  ...Theme,
  enhanceApp({ app }) {
    app.component('Quote', Quote)
    app.component('UnderConstruction', UnderConstruction)
  },
}
