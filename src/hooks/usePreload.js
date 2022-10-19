import { useState, useEffect } from 'react'
import useResize from './useResize'

const usePreload = ({
  init = false,
  selector = '[data-preload]',
  sources = [],
  callback = () => {},
}) => {
  const [ready, setReady] = useState(false)

  async function fetchData() {
    const domElements = document.querySelectorAll(selector)

    const promisesDomElements = Array.from(domElements).map((el) => {
      return new Promise((resolve, reject) => {
        const { src } = el.dataset
        if (el.tagName.toLowerCase() === 'img') {
          const img = new Image()
          img.src = src
          img.onload = () => {
            el.src = src
            el.removeAttribute('data-src')
            resolve()
          }
          img.onerror = () => {
            reject(Error(`ERROR: Could not load ${src}`))
          }
        }

        if (el.tagName.toLowerCase() === 'video') {
          const video = document.createElement('video')
          video.src = src
          video.load()
          video.setAttribute('preload', 'auto')
          video.addEventListener('canplaythrough', () => {
            el.src = src
            el.load()
            el.removeAttribute('data-src')
            resolve()
          })
          video.onerror = () => {
            reject(Error(`ERROR: Could not load ${src}`))
          }
        }
      })
    })

    const promisesSources = sources.map(({ src, callback: cb }) => {
      return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest()
        req.open('GET', src, true)
        req.responseType = 'blob'

        req.onload = () => {
          if (req.status === 200 && req.response.type !== 'text/html') {
            const blob = req.response
            const blobUrl = URL.createObjectURL(blob)
            resolve(cb(blobUrl))
          } else {
            reject(Error(`ERROR: Could not load ${src}`))
          }
        }
        req.onerror = () => {
          reject(Error(`ERROR: Could not load ${src}`))
        }
        req.send()
      })
    })

    await Promise.all([...promisesDomElements, ...promisesSources]).then(
      (res) => {
        callback(res)
        setReady(true)
      },
    )
  }

  const addSrc = () => {
    const domElements = document.querySelectorAll(selector)
    domElements.forEach((el) => {
      el.src = el.dataset.src
      el.removeAttribute('data-src')
    })
  }

  useEffect(() => {
    if (!init || typeof window === 'undefined') return
    fetchData()
    useResize(addSrc)
  }, [init])

  return ready
}

export default usePreload
