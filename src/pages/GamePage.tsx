import {Navigate} from 'react-router-dom';
import {usePlayer} from '../context/PlayerContext'

function GamePage() {
    const {name} = usePlayer()

    if (!name) {
        return <Navigate to="/" replace/>
    }

    return <h1>{name}</h1>
}

export default GamePage
