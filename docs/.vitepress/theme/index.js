import Theme from 'vitepress/theme'
import Quote from '../components/Quote.vue'
import UnderConstruction from '../components/UnderConstruction.vue'
import Emoji from '../components/Emoji.vue'
import DemoLink from '../components/DemoLink.vue'
import Collapse from '../components/Collapse.vue'
import { setup } from 'twind'
import 'twind/shim'
import '../styles/styles.css'

setup({ preflight: false })

export default {
  ...Theme,
  enhanceApp({ app }) {
    app.component('Quote', Quote)
    app.component('UnderConstruction', UnderConstruction)
    app.component('Emoji', Emoji)
    app.component('DemoLink', DemoLink)
    app.component('Collapse', Collapse)
  },
}
