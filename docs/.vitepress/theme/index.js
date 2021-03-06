import Theme from 'vitepress/theme'
import '../styles/styles.css'

// Components
import Collapse from '../components/Collapse.vue'
import DemoLink from '../components/DemoLink.vue'
import Emoji from '../components/Emoji.vue'
import Quote from '../components/Quote.vue'
import UnderConstruction from '../components/UnderConstruction.vue'

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
