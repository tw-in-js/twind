import Theme from 'vitepress/theme'
import { setup } from 'twind'
import '../styles/styles.css'
import 'twind/shim'

// Components
import Collapse from '../components/Collapse.vue'
import DemoLink from '../components/DemoLink.vue'
import Emoji from '../components/Emoji.vue'
import Quote from '../components/Quote.vue'
import UnderConstruction from '../components/UnderConstruction.vue'

setup({ preflight: false })

export default {
  ...Theme,
  enhanceApp({ app }) {
    app.component('Collapse', Collapse)
    app.component('DemoLink', DemoLink)
    app.component('Emoji', Emoji)
    app.component('Quote', Quote)
    app.component('UnderConstruction', UnderConstruction)
  },
}
