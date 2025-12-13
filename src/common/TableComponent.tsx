import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";

import DeleteOutlineSharpIcon from "@mui/icons-material/DeleteOutlineSharp";
import ModeEditSharpIcon from "@mui/icons-material/ModeEditSharp";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Nodata from "../components/Nodata";
import type { TableComponentProps } from "../utils/interface";
import {
  isNonEmpty,
  getValueByKey,
  copyToClipboard,
} from "../utils/utilsFunction";
import { STATUS_TYPES } from "../utils/constants";
import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useIsMobile } from "../store/AppConfigReducer";

const TableComponentV1 = (props: TableComponentProps) => {
  const { headCell, list, onClick, onEdit, onDelete, moreOptions } = props;
  const isMobile = useSelector(useIsMobile);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    item: any;
  } | null>(null);
  const [moreOptionsAnchor, setMoreOptionsAnchor] = useState<{
    anchorEl: HTMLElement;
    item: any;
  } | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const activeHeadCell = headCell;

  const handleLongPressStart = (
    event: React.TouchEvent | React.MouseEvent,
    item: any
  ) => {
    if (!isMobile || (!onEdit && !onDelete)) return;

    longPressTimer.current = setTimeout(() => {
      setContextMenu({
        mouseX: "touches" in event ? event.touches[0].clientX : event.clientX,
        mouseY: "touches" in event ? event.touches[0].clientY : event.clientY,
        item,
      });
    }, 500);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleContextMenuClose = () => {
    setContextMenu(null);
  };

  const handleEdit = () => {
    if (contextMenu && onEdit) {
      onEdit(contextMenu.item);
    }
    handleContextMenuClose();
  };

  const handleDelete = () => {
    if (contextMenu && onDelete) {
      onDelete(contextMenu.item);
    }
    handleContextMenuClose();
  };

  const handleMoreOptionsClick = (
    event: React.MouseEvent<HTMLElement>,
    item: any
  ) => {
    event.stopPropagation();
    setMoreOptionsAnchor({ anchorEl: event.currentTarget, item });
  };

  const handleMoreOptionsClose = () => {
    setMoreOptionsAnchor(null);
  };

  const handleMoreOptionSelect = (option: any) => {
    if (moreOptionsAnchor) {
      option.onClick(moreOptionsAnchor.item);
    }
    handleMoreOptionsClose();
  };

  if (isNonEmpty(list))
    return (
      <TableContainer component={Paper} className={`custom-table`}>
        <Table>
          <TableHead>
            <TableRow>
              {activeHeadCell.map((item, idx) => (
                <TableCell key={idx}>{item.label}</TableCell>
              ))}
              {(onEdit || onDelete || moreOptions) && !isMobile && (
                <TableCell>Actions</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((item, index) => {
              return (
                <TableRow
                  key={index}
                  onClick={() => onClick && onClick(item)}
                  onTouchStart={(e) => handleLongPressStart(e, item)}
                  onTouchEnd={handleLongPressEnd}
                  onTouchMove={handleLongPressEnd}
                  onMouseDown={(e) => handleLongPressStart(e, item)}
                  onMouseUp={handleLongPressEnd}
                  onMouseLeave={handleLongPressEnd}
                  className={`handout-row  ${onClick ? "clickable-row" : ""}`}
                >
                  {activeHeadCell.map((cell, cellIndex) => {
                    const dispValue =
                      getValueByKey(item, cell.renderValue || cell.label) ||
                      "-";

                    if (cell.view) {
                      return (
                        <TableCell key={cellIndex}>{cell.view(item)}</TableCell>
                      );
                    }

                    // Render status as badge
                    if (cell.label === "Status") {
                      const status = dispValue;
                      let statusClass = "status-badge";
                      if (status === STATUS_TYPES.ACTIVE) statusClass += " status-active";
                      else if (status === STATUS_TYPES.COMPLETED) statusClass += " status-completed";
                      else if (status === STATUS_TYPES.PENDING) statusClass += " status-pending";
                      else if (status === STATUS_TYPES.CANCELLED) statusClass += " status-cancelled";
                      
                      return (
                        <TableCell key={cellIndex}>
                          <span className={statusClass}>{status}</span>
                        </TableCell>
                      );
                    }

                    // Render bond as check/cross icon
                    if (cell.label === "Bond") {
                      const bondValue = getValueByKey(item, "getHandout.getBond");
                      return (
                        <TableCell key={cellIndex}>
                          {bondValue ? (
                            <span className="bond-icon bond-yes">✓</span>
                          ) : (
                            <span className="bond-icon bond-no">✕</span>
                          )}
                        </TableCell>
                      );
                    }

                    return (
                      <TableCell key={cellIndex}>
                        {dispValue}
                        {cell.copy ? (
                          <span
                            className="mobile-contact"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(dispValue);
                            }}
                          >
                            {item.getUser().getMobile()}
                            <ContentCopyIcon className="copy-icon copy-icon-small" />
                          </span>
                        ) : (
                          <></>
                        )}
                      </TableCell>
                    );
                  })}
                  {(onEdit || onDelete || moreOptions) && !isMobile && (
                    <TableCell>
                      {onEdit && (
                        <IconButton
                          onClick={(evt) => {
                            evt.stopPropagation();
                            onEdit(item);
                          }}
                          className="action-icon"
                          size="small"
                        >
                          <ModeEditSharpIcon />
                        </IconButton>
                      )}
                      {onDelete && (
                        <IconButton
                          onClick={(evt) => {
                            evt.stopPropagation();
                            onDelete(item);
                          }}
                          className="action-icon"
                          size="small"
                        >
                          <DeleteOutlineSharpIcon />
                        </IconButton>
                      )}
                      {moreOptions && moreOptions.length > 0 && (
                        <IconButton
                          onClick={(evt) => handleMoreOptionsClick(evt, item)}
                          className="action-icon"
                          size="small"
                        >
                          <MoreVertIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
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
          {moreOptions &&
            moreOptions.map((option, idx) => (
              <MenuItem
                key={idx}
                onClick={() => {
                  if (contextMenu) {
                    option.onClick(contextMenu.item);
                  }
                  handleContextMenuClose();
                }}
              >
                {option.label}
              </MenuItem>
            ))}
        </Menu>
        <Menu
          open={moreOptionsAnchor !== null}
          onClose={handleMoreOptionsClose}
          anchorEl={moreOptionsAnchor?.anchorEl}
        >
          {moreOptions &&
            moreOptions.map((option, idx) => (
              <MenuItem
                key={idx}
                onClick={() => handleMoreOptionSelect(option)}
              >
                {option.label}
              </MenuItem>
            ))}
        </Menu>
      </TableContainer>
    );
  return <Nodata />;
};

export default TableComponentV1;
