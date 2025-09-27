
function History(props) {
  const history = props.history

  if (!history){
    return <></>
  }
  return (
    <>
      <ol type='A'>
      { gamestate.history.map(e =>
        <li key={e.id}>{e.id}. Player {e.player} on {e.target.row},{e.target.col}</li>) }
      </ol>
    </>
  )
}

export default History
