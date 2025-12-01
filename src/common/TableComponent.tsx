import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

import DeleteOutlineSharpIcon from '@mui/icons-material/DeleteOutlineSharp';
import ModeEditSharpIcon from '@mui/icons-material/ModeEditSharp';
import Nodata from '../components/Nodata'
import type { TableComponentProps } from '../utils/interface'
import { isNonEmpty, getValueByKey } from '../utils/utilsFunction'

const TableComponentV1 = (props: TableComponentProps) => {
    const { headCell, list, onClick, onEdit, onDelete } = props

    if (isNonEmpty(list))
        return (
            <TableContainer component={Paper} className={`custom-table`}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {headCell.map((item, idx) => <TableCell key={idx}>{item.label}</TableCell>)}
                            {(onEdit || onDelete) && <TableCell>Actions</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.map((item, index) => (
                            <TableRow key={index} onClick={() => onClick && onClick(item)}
                                className={`handout-row  ${onClick ? "clickable-row" : ""}`} >
                                {headCell.map((cell, cellIndex) => {
                                    if (cell.view) {
                                        return <TableCell key={cellIndex}>{cell.view(item)}</TableCell>
                                    }
                                    return <TableCell key={cellIndex}>{getValueByKey(item, cell.renderValue || cell.label) || "-"}</TableCell>
                                })}
                                {(onEdit || onDelete) && (
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
            </TableContainer>
        )
    return <Nodata />
}

export default TableComponentV1