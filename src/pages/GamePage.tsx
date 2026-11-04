import {usePlayer} from '../context/PlayerContext'

function GamePage() {
    const {name} = usePlayer()

    return <h1>{name}</h1>
}

export default GamePage
