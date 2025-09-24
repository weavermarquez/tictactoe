export function Square(props) {
    return (
        <div
            className='square w-33 h-13 p-10'
            onClick={props.onSquareClick}>
            {props.value}
        </div>
    );
}

export default Square
