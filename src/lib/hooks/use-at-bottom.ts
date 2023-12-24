import * as React from 'react'

export function useAtBottom(area, offset = 0) {
  const [isAtBottom, setIsAtBottom] = React.useState(false)

  React.useEffect(() => {
    const doc = area?.current

    if (!doc) return

    const handleScroll = () => {
      const innerHeight = doc?.scrollHeight
      const scrollY = doc?.scrollTop
      const offsetHeight = doc?.offsetHeight

      setIsAtBottom(innerHeight - scrollY <= offsetHeight + 300)
    }

    doc.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      doc.removeEventListener('scroll', handleScroll)
    }
  }, [offset, area?.current])

  return isAtBottom
}
