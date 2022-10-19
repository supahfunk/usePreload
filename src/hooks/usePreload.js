import { useState, useEffect } from 'react'

const usePreload = ({
  init = false,
  selector = '[data-preload]',
  sources = [],
  cb = () => {},
}) => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!init) return

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
            // video.play()
            video.addEventListener('canplaythrough', () => {
              el.src = src
              el.load()
              resolve()
            //  video.pause()
            })
            video.onerror = () => {
              reject(Error(`ERROR: Could not load ${src}`))
            }
          }
        })
      })

      const promisesSources = sources.map(({ src, cb: callback }) => {
        return new Promise((resolve, reject) => {
          const req = new XMLHttpRequest()
          req.open('GET', src, true)
          req.responseType = 'blob'

          req.onload = () => {
            if (req.status === 200) {
              const blob = req.response
              const blobUrl = URL.createObjectURL(blob)
              resolve(callback(blobUrl))
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
          cb(res)
          setReady(true)
        },
      )
    }
    fetchData()
  }, [init])

  return ready
}

export default usePreload
