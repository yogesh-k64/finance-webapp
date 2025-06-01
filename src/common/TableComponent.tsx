import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

import DeleteOutlineSharpIcon from '@mui/icons-material/DeleteOutlineSharp';
import { HEAD_CELL_ACTION } from '../utils/constants'
import ModeEditSharpIcon from '@mui/icons-material/ModeEditSharp';
import Nodata from '../components/Nodata'
import type { TableComponentProps } from '../utils/interface'
import { isNonEmpty } from '../utils/utilsFunction'

const TableComponentV1 = (props: TableComponentProps) => {
    const { headCell, list, onClick } = props

    if (isNonEmpty(list))
        return (
            <TableContainer component={Paper} className={`custom-table`}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {headCell.map(item => <TableCell>{item.label}</TableCell>)}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.map((item, index) => (
                            <TableRow key={index} onClick={() => onClick && onClick(item)}
                                className={`handout-row  ${onClick ? "clickable-row" : ""}`} >
                                {headCell.map(cell => {
                                    if (cell.label === HEAD_CELL_ACTION) {
                                        return <TableCell  >
                                            <ModeEditSharpIcon onClick={(evt) => {
                                                evt.stopPropagation();
                                                if (cell.onEdit)
                                                    cell.onEdit(item)
                                            }}
                                                className='action-icon' />
                                            <DeleteOutlineSharpIcon onClick={(evt) => {
                                                evt.stopPropagation();
                                                if (cell.onDelete)
                                                    cell.onDelete(item)
                                            }}
                                                className='action-icon' />
                                        </TableCell>
                                    }
                                    return <TableCell>{item[cell.label as keyof typeof item] || "-"}</TableCell>
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    return <Nodata />
}

export default TableComponentV1