'use client'

/**
 * Modal context — lets any descendant card open the article modal with the
 * article data. The provider holds open state and renders one Modal instance
 * at the layout root.
 */
import {createContext, useCallback, useContext, useEffect, useState} from 'react'

export type ModalArticle = {
  _id: string
  title: string
  slug: string
  category?: {title: string; slug: string} | null
  publishedAt?: string | null
  readingMinutes?: number | null
  heroImage?: any
  dek?: string | null
  modalSynopsis?: string | null
  modalTakeaways?: string[] | null
  modalPrimarySources?: string[] | null
  modalSectors?: string[] | null
}

type Ctx = {
  open: (article: ModalArticle) => void
  close: () => void
  article: ModalArticle | null
}

const ArticleModalCtx = createContext<Ctx | null>(null)

export function ArticleModalProvider({children}: {children: React.ReactNode}) {
  const [article, setArticle] = useState<ModalArticle | null>(null)

  const open = useCallback((a: ModalArticle) => setArticle(a), [])
  const close = useCallback(() => setArticle(null), [])

  // Close on Escape
  useEffect(() => {
    if (!article) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setArticle(null)
    }
    window.addEventListener('keydown', onKey)
    // Prevent body scroll while modal is open
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [article])

  return (
    <ArticleModalCtx.Provider value={{open, close, article}}>
      {children}
    </ArticleModalCtx.Provider>
  )
}

export function useArticleModal() {
  const ctx = useContext(ArticleModalCtx)
  // If no provider in tree (e.g. on /studio), return a no-op so cards still
  // work as plain links via fallback.
  return (
    ctx ?? {
      open: () => {},
      close: () => {},
      article: null,
    }
  )
}
