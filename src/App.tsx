import './css/styles.css'
import './css/reset.css'
import Board from './components/Board'
import { useState } from 'react'
import useLoadBoard from './components/hooks/useLoadBoard'

function App() {
    const { data, setData, error, setError } = useLoadBoard()
    const [editingBoard, setEditingBoard] = useState(false)

    const boardHandlers = {
        editing: editingBoard,
        onStartEditing: handleStartEditing,
        onTyping: handleTyping,
        onEditBoardName: handleEditBoardName,
    }

    function handleStartEditing() {
        setEditingBoard(true)
    }

    function handleTyping(e: React.ChangeEvent<HTMLInputElement>) {
        setData({ ...data, boardName: e.target.value })
    }

    async function handleEditBoardName(e: React.BaseSyntheticEvent) {
        e.preventDefault()

        const boardName = e.target['board-name'].value
        if (boardName.trim() === '') {
            alert('Board must have a name.')
        } else {
            try {
                await postBoardName(data?.id, boardName)
                setData({ ...data, boardName: boardName })
                setEditingBoard(false)
            } catch {
                console.error('Failed to update board name in DB.')
            }
        }
    }

    function postBoardName(
        boardId: string | undefined,
        boardName: string
    ): Promise<Response> {
        return new Promise(async (resolve, reject) => {
            const response = await fetch(
                `http://localhost:5000/boards/${boardId}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ boardName: boardName }),
                }
            )

            if (response.ok) {
                resolve(response)
            } else {
                reject(response)
            }
        })
    }

    if (!data) {
        return <h1>Loading...</h1>
    }
    if (error) {
        console.error('Render error')
        return <h1>Error</h1>
    }

    console.log('render board')
    return (
        <>
            <Board
                id={data.id}
                boardName={data.boardName}
                lanes={data.lanes}
                boardHandlers={boardHandlers}
            />
        </>
    )
}

export default App
