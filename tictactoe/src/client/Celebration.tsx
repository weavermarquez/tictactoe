export function Celebration(props) {
    const status = props.status;
    const currentPlayer = props.currentPlayer;
    return(
        <>
            <div id="status">{(() => {
                switch (status.type) {
                    case 'ongoing':
                        return `Your move, player ${currentPlayer}`;
                        break;
                    case 'draw':
                        return "Hey, a draw! Let's say you both won. 🤗";
                        break;
                    case 'winner':
                        return `🎉 Congratulations, player ${status.player}! 🎉`;
                }
            })()}
            </div>
        </>
    );
}

export default Celebration
