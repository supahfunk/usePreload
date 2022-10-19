import { useRef, useEffect, useState } from 'react'
import { useMedia } from 'react-use'
import usePreload from './hooks/usePreload'
import './style.css'

export default function App() {
  const [isDataReady, setDataReady] = useState(false)
  const $root = useRef()
  const [videoXHRSrc, setVideoXHRSrc] = useState(null)

  const isWide = useMedia('(min-width: 768px)')

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
        callback: (url) => {
          console.log('Url inside sources loaded ---->', url)
          setVideoXHRSrc(url)
        },
      },
      {
        src: 'https://api.codetabs.com/v1/proxy/?quest=https://filesamples.com/samples/image/hdr/sample_640%C3%97426.hdr',
        callback: (url) => {
          console.log('XHR inside sources loaded ---->', url)
        },
      },
    ],
    callback: () => {},
  })

  useEffect(() => {
    console.log('isPageReady ---->', isPageReady)
  }, [isPageReady])

  useEffect(() => {
    console.log('isWide ---->', isWide)
  }, [isWide])

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
          {isWide
          && (
          <img
            data-preload
            data-src="https://images.unsplash.com/photo-1665973250579-094c6bc6257c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=4031&q=80"
            onLoad={(e) => {
              console.log('Dom Image 1 loaded ---->', e.target)
            }}
            src=""
            alt=""
          />
          )}
        </div>
        <div className="item">
          <img
            data-preload
            data-src="https://d1dinavg5mplc3.cloudfront.net/poster_desktop_2e79e05881.jpg"
            onLoad={(e) => {
              console.log('Dom Image 2 loaded ---->', e.target)
            }}
            src=""
            alt=""
          />
        </div>
        <div className="item">
          {isWide && (
          <video
            autoPlay={true}
            muted={true}
            playsInline={true}
            loop={true}
            src={videoXHRSrc}
          />
          )}
        </div>
      </div>
    </div>
  )
}
