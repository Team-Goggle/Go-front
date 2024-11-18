import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Circle, X, Triangle, Square, Slash, ArrowRight, Text, Hash } from 'lucide-react'

const miniBoards = [
  { id: 1, name: "Game 1", date: "2023-05-01" },
  { id: 2, name: "Game 2", date: "2023-05-05" },
  { id: 3, name: "Game 3", date: "2023-05-10" },
]

type Stone = 'black' | 'white' | null
type Marker = 'triangle' | 'square' | 'cross' | 'circle' | 'letter' | 'number' | null

interface BoardState {
  stone: Stone
  marker: Marker
  label?: string
}

export default function Component() {
  const [currentTool, setCurrentTool] = useState<'black' | 'white' | Marker>('black')
  const [board, setBoard] = useState<BoardState[][]>(
    Array(19).fill(null).map(() => Array(19).fill({ stone: null, marker: null }))
  )
  const [nextLabel, setNextLabel] = useState<string>('A')

  const handleCellClick = (row: number, col: number) => {
    const newBoard = [...board]
    if (currentTool === 'black' || currentTool === 'white') {
      newBoard[row][col] = { ...newBoard[row][col], stone: currentTool }
    } else if (currentTool === 'letter' || currentTool === 'number') {
      newBoard[row][col] = { ...newBoard[row][col], marker: currentTool, label: nextLabel }
      setNextLabel(prev => {
        if (currentTool === 'letter') {
          return String.fromCharCode(prev.charCodeAt(0) + 1)
        } else {
          return (parseInt(prev) + 1).toString()
        }
      })
    } else {
      newBoard[row][col] = { ...newBoard[row][col], marker: currentTool }
    }
    setBoard(newBoard)
  }

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-secondary p-4 flex flex-col h-full">
        {/* User Profile */}
        <div className="flex items-center space-x-4 mb-8">
          <Avatar>
            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">User Name</h2>
            <p className="text-sm text-muted-foreground">Go Enthusiast</p>
          </div>
        </div>

        {/* Go History */}
        <div className="flex-grow overflow-auto">
          <h3 className="font-semibold mb-2">Go History</h3>
          <div className="space-y-2">
            {miniBoards.map((board) => (
              <Card key={board.id} className="cursor-pointer hover:bg-accent">
                <CardContent className="p-2 flex items-center space-x-2">
                  <svg width="40" height="40" viewBox="0 0 100 100" className="border border-primary">
                    <rect width="100" height="100" fill="burlywood" />
                    <g fill="none" stroke="black" strokeWidth="1">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <line key={`v${i}`} x1={20 * i + 10} y1="10" x2={20 * i + 10} y2="90" />
                      ))}
                      {[0, 1, 2, 3, 4].map((i) => (
                        <line key={`h${i}`} x1="10" y1={20 * i + 10} x2="90" y2={20 * i + 10} />
                      ))}
                    </g>
                  </svg>
                  <div>
                    <p className="text-sm font-medium">{board.name}</p>
                    <p className="text-xs text-muted-foreground">{board.date}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex-grow" />
        <div className="flex justify-center items-center space-x-4">
          {/* Left Comment Area */}
          <div className="w-64">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-semibold mb-2">Black's Commentary</h3>
              <p className="text-sm">The AI suggests that Black should focus on strengthening the bottom right corner...</p>
            </div>
          </div>

          {/* Go Board */}
          <div className="flex flex-col items-center">
            <svg width="500" height="500" viewBox="0 0 500 500" className="mb-4">
              <rect width="500" height="500" fill="burlywood" />
              <g fill="none" stroke="black" strokeWidth="0.5">
                {Array.from({ length: 19 }, (_, i) => (
                  <line key={`v${i}`} x1={26.3 * i + 13.2} y1="13.2" x2={26.3 * i + 13.2} y2="486.8" />
                ))}
                {Array.from({ length: 19 }, (_, i) => (
                  <line key={`h${i}`} x1="13.2" y1={26.3 * i + 13.2} x2="486.8" y2={26.3 * i + 13.2} />
                ))}
              </g>
              {/* Star points */}
              {[[3, 3], [3, 9], [3, 15], [9, 3], [9, 9], [9, 15], [15, 3], [15, 9], [15, 15]].map(([x, y], i) => (
                <circle key={i} cx={26.3 * x + 13.2} cy={26.3 * y + 13.2} r="3" fill="black" />
              ))}
              {/* Stones and Markers */}
              {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <g key={`${rowIndex}-${colIndex}`} onClick={() => handleCellClick(rowIndex, colIndex)}>
                    {cell.stone && (
                      <circle
                        cx={26.3 * colIndex + 13.2}
                        cy={26.3 * rowIndex + 13.2}
                        r="12"
                        fill={cell.stone === 'black' ? 'black' : 'white'}
                        stroke="black"
                        strokeWidth="0.5"
                      />
                    )}
                    {cell.marker && (
                      <text
                        x={26.3 * colIndex + 13.2}
                        y={26.3 * rowIndex + 13.2}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={cell.stone === 'black' ? 'white' : 'black'}
                        fontSize="16"
                      >
                        {cell.marker === 'cross' && '×'}
                        {cell.marker === 'triangle' && '△'}
                        {cell.marker === 'square' && '□'}
                        {cell.marker === 'circle' && '○'}
                        {(cell.marker === 'letter' || cell.marker === 'number') && cell.label}
                      </text>
                    )}
                  </g>
                ))
              )}
            </svg>

            {/* Ventilation Tools */}
            <div className="flex justify-center space-x-2">
              <Button variant="outline" size="icon" onClick={() => setCurrentTool('black')}>
                <Circle className="h-4 w-4" fill="black" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setCurrentTool('white')}>
                <Circle className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setCurrentTool('cross')}>
                <X className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setCurrentTool('triangle')}>
                <Triangle className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setCurrentTool('square')}>
                <Square className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setCurrentTool('circle')}>
                <Circle className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setCurrentTool('letter')}>
                <Text className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setCurrentTool('number')}>
                <Hash className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right Comment Area */}
          <div className="w-64">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-semibold mb-2">White's Commentary</h3>
              <p className="text-sm">The AI recommends that White consider a more aggressive approach in the top left quadrant...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}