const Spinner = ({ stroke }: { stroke: string }) => {
  return (
    <>
      <svg width="50px" height="50px" viewBox="-16 -16 32 32" xmlns="http://www.w3.org/2000/svg" className="m-5 mx-auto">
        <circle className={`animate-spinner ${stroke}`} r={15} fill='none' strokeWidth={2} />
      </svg>
    </>
  )
}

export default Spinner
