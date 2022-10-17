import { useEffect } from 'react'

const usePreload = ({
  init = false,
  dom = [],
  sources = [],
  cb = () => {},
}) => {
  useEffect(() => {
    if (!init) return

    async function fetchData() {
      const promisesDomElements = await Array.from(dom).map((el) => {
        return new Promise((resolve, reject) => {
          const { src } = el.dataset
          if (el.tagName.toLowerCase() === 'img') {
            const img = new Image()
            img.src = src
            img.onload = () => {
              el.src = src
              resolve()
            }
            img.onerror = reject
          }

          if (el.tagName.toLowerCase() === 'video') {
            const video = document.createElement('video')
            video.src = src
            video.setAttribute('preload', 'auto')
            video.addEventListener('canplaythrough', () => {
              el.src = src
              resolve()
            })
          }
        })
      })

      const promisesSources = await sources.map(({ src, cb: callback }) => {
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
          req.onerror = () => reject()
          req.send()
        })
      })

      await Promise.all([...promisesDomElements, ...promisesSources]).then(
        (res) => {
          cb(res)
        },
      )
    }
    fetchData()
  }, [init])

  return null
}

export default usePreload
