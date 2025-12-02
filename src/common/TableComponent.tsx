import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Menu, MenuItem } from '@mui/material'

import DeleteOutlineSharpIcon from '@mui/icons-material/DeleteOutlineSharp';
import ModeEditSharpIcon from '@mui/icons-material/ModeEditSharp';
import Nodata from '../components/Nodata'
import type { TableComponentProps } from '../utils/interface'
import { isNonEmpty, getValueByKey } from '../utils/utilsFunction'
import { useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useIsMobile } from '../store/AppConfigReducer'

const TableComponentV1 = (props: TableComponentProps) => {
    const { headCell, list, onClick, onEdit, onDelete } = props
    const isMobile = useSelector(useIsMobile)
    const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number; item: any } | null>(null)
    const longPressTimer = useRef<NodeJS.Timeout | null>(null)
    
    const activeHeadCell = headCell

    const handleLongPressStart = (event: React.TouchEvent | React.MouseEvent, item: any) => {
        if (!isMobile || (!onEdit && !onDelete)) return
        
        longPressTimer.current = setTimeout(() => {
            setContextMenu({
                mouseX: 'touches' in event ? event.touches[0].clientX : event.clientX,
                mouseY: 'touches' in event ? event.touches[0].clientY : event.clientY,
                item
            })
        }, 500)
    }

    const handleLongPressEnd = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current)
            longPressTimer.current = null
        }
    }

    const handleContextMenuClose = () => {
        setContextMenu(null)
    }

    const handleEdit = () => {
        if (contextMenu && onEdit) {
            onEdit(contextMenu.item)
        }
        handleContextMenuClose()
    }

    const handleDelete = () => {
        if (contextMenu && onDelete) {
            onDelete(contextMenu.item)
        }
        handleContextMenuClose()
    }

    if (isNonEmpty(list))
        return (
            <TableContainer component={Paper} className={`custom-table`}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {activeHeadCell.map((item, idx) => <TableCell key={idx}>{item.label}</TableCell>)}
                            {(onEdit || onDelete) && !isMobile && <TableCell>Actions</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.map((item, index) => (
                            <TableRow 
                                key={index} 
                                onClick={() => onClick && onClick(item)}
                                onTouchStart={(e) => handleLongPressStart(e, item)}
                                onTouchEnd={handleLongPressEnd}
                                onTouchMove={handleLongPressEnd}
                                onMouseDown={(e) => handleLongPressStart(e, item)}
                                onMouseUp={handleLongPressEnd}
                                onMouseLeave={handleLongPressEnd}
                                className={`handout-row  ${onClick ? "clickable-row" : ""}`} >
                                {activeHeadCell.map((cell, cellIndex) => {
                                    if (cell.view) {
                                        return <TableCell key={cellIndex}>{cell.view(item)}</TableCell>
                                    }
                                    return <TableCell key={cellIndex}>{getValueByKey(item, cell.renderValue || cell.label) || "-"}</TableCell>
                                })}
                                {(onEdit || onDelete) && !isMobile && (
                                    <TableCell>
                                        {onEdit && <ModeEditSharpIcon onClick={(evt) => {
                                            evt.stopPropagation();
                                            onEdit(item)
                                        }}
                                            className='action-icon' />}
                                        {onDelete && <DeleteOutlineSharpIcon onClick={(evt) => {
                                            evt.stopPropagation();
                                            onDelete(item)
                                        }}
                                            className='action-icon' />}
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Menu
                    open={contextMenu !== null}
                    onClose={handleContextMenuClose}
                    anchorReference="anchorPosition"
                    anchorPosition={
                        contextMenu !== null
                            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                            : undefined
                    }
                >
                    {onEdit && (
                        <MenuItem onClick={handleEdit}>
                            <ModeEditSharpIcon style={{ marginRight: 8 }} /> Edit
                        </MenuItem>
                    )}
                    {onDelete && (
                        <MenuItem onClick={handleDelete}>
                            <DeleteOutlineSharpIcon style={{ marginRight: 8 }} /> Delete
                        </MenuItem>
                    )}
                </Menu>
            </TableContainer>
        )
    return <Nodata />
}

export default TableComponentV1