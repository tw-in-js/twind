// for the side effect of creating the global twind instance
import './twind'

import { hydrate } from 'react-dom'
import { RemixBrowser } from '@remix-run/react'

hydrate(<RemixBrowser />, document)
