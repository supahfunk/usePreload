import { useRef, useEffect, useState } from 'react'
import usePreload from './hooks/usePreload'
import './style.css'

export default function App() {
  const [isDataReady, setDataReady] = useState(false)
  const $root = useRef()
  const $video = useRef()

  // Fake Data
  useEffect(() => {
    setTimeout(() => {
      setDataReady(true)
    }, 1000)
  }, [])

  const isPageReady = usePreload({
    init: isDataReady,
    selector: '[data-preload]',
    sources: [
      {
        src: 'https://api.codetabs.com/v1/proxy/?quest=https://file-examples.com/storage/fe4b4c6261634c76e91986b/2017/04/file_example_MP4_480_1_5MG.mp4',
        cb: (url) => {
          console.log('Url inside sources loaded ---->', url)
          $video.current.src = url
          $video.current.play()
        },
      },
    ],
    cb: () => {
    },
  })

  return (
    <div className="App" ref={$root}>
      <h1>{isPageReady ? 'Ready' : 'Loading...'}</h1>

      <div className="wrapper">
        <div className="item">
          <video
            data-preload
            data-src="https://file-examples.com/storage/fe4b4c6261634c76e91986b/2017/04/file_example_MP4_480_1_5MG.mp4"
            autoPlay={true}
            muted={true}
            playsInline={true}
            loop={true}
            onCanPlayThrough={(e) => {
              console.log('Dom Video loaded ---->', e.target)
            }}
          />
        </div>
        <div className="item">
          <img
            data-preload
            data-src="https://images.unsplash.com/photo-1665973250579-094c6bc6257c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=4031&q=80"
            onLoad={(e) => {
              console.log('Dom Image 1 loaded ---->', e.target)
            }}
            src=""
            alt="skate"
          />
        </div>
        <div className="item">
          <img
            data-preload
            data-src="https://d1dinavg5mplc3.cloudfront.net/poster_desktop_2e79e05881.jpg"
            onLoad={(e) => {
              console.log('Dom Image 2 loaded ---->', e.target)
            }}
            src=""
            alt="landscape"
          />
        </div>
        <div className="item">
          <video
            ref={$video}
            autoPlay={true}
            muted={true}
            playsInline={true}
            loop={true}
          />
        </div>
      </div>
    </div>
  )
}
