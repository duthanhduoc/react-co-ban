import { useRef } from 'react'

export default function App() {
  const ref1 = useRef<HTMLVideoElement | null>(null)

  const play = () => {
    console.log(ref1)
    ref1.current?.play()
  }

  const pause = () => {
    ref1.current?.pause()
  }
  return (
    <div>
      <video id='video1' width='420' ref={ref1}>
        <source src='/video.mp4' type='video/mp4' />
        Your browser does not support HTML video.
      </video>
      <div>
        <button onClick={play}>Play</button>
        <button onClick={pause}>Pause</button>
      </div>
    </div>
  )
}
