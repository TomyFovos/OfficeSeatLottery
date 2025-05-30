'use client'

import { useRef, useState } from 'react'
import Draggable from 'react-draggable'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import NameBoxPopOver from '@/components/seat/name-box-pop-over'

const statusStyle = {
  movable: 'border-[#1AA7FF] bg-[#FFFFFF] text-black',
  fixed: 'border-black bg-[#FFFFFF] text-black',
  unused: 'border-gray-400 bg-gray-200 text-gray-500',
  reserved: 'border-green-500 bg-green-100 text-green-600',
}

export default function NameBox({
  id,
  name,
  status,
  position,
  onDragStop,
  onUpdate,
  onDelete,
  onExit,
  move = false, 
}) {
  const nodeRef = useRef(null)
  const [open, setOpen] = useState(false)

  // moveに関係なく右クリックでPopoverを開く
  const handleContextMenu = e => {
    e.preventDefault()
    setOpen(true)
  }

  return (
    <Draggable
      nodeRef={nodeRef}
      position={{ x: 0, y: 0 }}
      onStop={(_, data) => onDragStop(id, position.x + data.x, position.y + data.y)}
      disabled={!move} 
    >
      <div
        ref={nodeRef}
        className={`w-[70px] h-[40px] flex items-center justify-center rounded-[7px] border-3 cursor-pointer select-none ${statusStyle[status]}`}
        onContextMenu={handleContextMenu}
        style={{ cursor: move ? 'pointer' : 'default' }} 
      >
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div>{name}</div>
          </PopoverTrigger>
          <PopoverContent side="right" align="center" className="p-0 bg-transparent border-0 shadow-none">
          <NameBoxPopOver
            id={id}
            name={name}
            status={status}
            x={position.x}
            y={position.y}
            onUpdate={onUpdate}
            onDelete={onDelete}
            move={move}
            onExit={onExit} // 追加
          />
          </PopoverContent>
        </Popover>
      </div>
    </Draggable>
  )
}
