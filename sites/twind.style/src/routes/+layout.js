import '$lib/twind'

if (import.meta.hot) {
  import.meta.hot.on('docs-update', () => {
    import('$app/navigation')
      .then(({ invalidateAll }) => invalidateAll())
      .catch((error) => console.error(error))
  })
}
