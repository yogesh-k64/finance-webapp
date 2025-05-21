import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

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
                            {headCell.map(item => <TableCell>{item}</TableCell>)}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.map((item, index) => (
                            <TableRow key={index} onClick={() => onClick && onClick(item)}
                                className={`handout-row  ${onClick ? "clickable-row" : ""}`} >
                                {headCell.map(key => {
                                    return <TableCell>{item[key as keyof typeof item] || "-"}</TableCell>
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    return <p>No records found.</p>
}

export default TableComponentV1