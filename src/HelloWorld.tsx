import ByeBye from './ByeBye'

const HelloWorld = (props: {
  title1: string
  title2: string
  title3?: string
}) => {
  return (
    <>
      <div>
        <h1>{props.title1}</h1>
        <h2>{props.title2}</h2>
        <h3>{props.title3}</h3>
        <ByeBye
          {...props}
          // title1={props.title1}
          // title2={props.title2}
          // title3={props.title3}
        />
      </div>
    </>
  )
}

export default HelloWorld
