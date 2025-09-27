export function Celebration(props) {
    const status = props.status;
    const winner = props.winner;
    const currentPlayer = props.currentPlayer;
    return(
        <>
            <div id="status">{(() => {
                switch (status) {
                    case 'ongoing':
                        return `Your move, player ${currentPlayer}`;
                        break;
                    case 'draw':
                        return "Hey, a draw! Let's say you both won. 🤗";
                        break;
                    case 'winner':
                        return `🎉 Congratulations, player ${winner}! 🎉`;
                }
            })()}
            </div>
        </>
    );
}

export default Celebration
