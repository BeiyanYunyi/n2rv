/* eslint-disable no-nested-ternary */
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  Chip,
  Fab,
  Grid,
  IconButton,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import format from 'date-fns/format';
import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useBlockLayout, useTable } from 'react-table';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { setPage } from '../../redux/pageSlice';
import isUUID from '../../utils/isUUID';

const TopicTablePC = () => {
  const navigate = useNavigate();

  const { topicList, loading, page, lastPage } = useAppSelector((state) => state.page);
  const dispatch = useAppDispatch();

  const processedData = React.useMemo(
    () =>
      topicList.map((ele) => ({
        ...ele,
        lastReplyTime: ele.lastReplyTime
          ? format(Number(ele.lastReplyTime) * 1000, 'yy-MM-dd HH:mm')
          : '',
        needDecreasePadding: ele.isElite || isUUID(ele.topicID),
      })),
    [topicList],
  );

  const defaultColumn = React.useMemo(
    () => ({
      width: 150,
    }),
    [],
  );
  const columns = React.useMemo(
    () => [
      {
        Header: ' ',
        columns: [
          {
            Header: '标题',
            accessor: 'title',
            width: window.screen.width / 2,
          },
          {
            Header: '作者',
            accessor: 'authorName',
          },
          {
            Header: '回应',
            accessor: 'reply',
            width: 48,
          },
          {
            Header: '最后回应',
            accessor: 'lastReplyTime',
          },
        ],
      },
    ],
    [],
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data: processedData,
      defaultColumn,
    },
    useBlockLayout,
  );

  return (
    <>
      <Table {...getTableProps()} component="div">
        <TableHead component="div">
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()} component="div">
              {headerGroup.headers.map((column) => (
                <TableCell
                  {...column.getHeaderProps({ style: { padding: 8 } })}
                  component="div"
                  padding="none"
                >
                  <Typography
                    style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center' }}
                    noWrap
                  >
                    {column.render('Header')}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()} component="div">
          {rows.map((row) => {
            prepareRow(row);
            return (
              <TableRow {...row.getRowProps()} component="div">
                {row.cells.map((cell) => (
                  <TableCell
                    component="div"
                    {...cell.getCellProps({
                      style: {
                        padding: 8,
                        paddingTop: cell.row.original.needDecreasePadding ? 6 : 8,
                        paddingBottom: cell.row.original.needDecreasePadding ? 6 : 8,
                      },
                    })}
                  >
                    <Typography
                      variant="body2"
                      component="div"
                      style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      noWrap
                    >
                      {cell.column.id === 'title' ? (
                        <Link
                          component={RouterLink}
                          to={`topic/${cell.row.original.topicID}`}
                          underline="hover"
                        >
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            {cell.row.original.isElite && (
                              <Chip label="精品" size="small" color="error" />
                            )}
                            {isUUID(cell.row.original.topicID) && (
                              <Chip label="原创" size="small" color="success" variant="outlined" />
                            )}
                            {cell.render('Cell')}
                          </Stack>
                        </Link>
                      ) : cell.column.id === 'authorName' ? (
                        <Link
                          href={`https://www.douban.com/people/${cell.row.original.authorID}`}
                          underline="hover"
                        >
                          {cell.render('Cell')}
                        </Link>
                      ) : (
                        cell.render('Cell')
                      )}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Grid container direction="row" justifyContent="center">
        <Grid item>
          <IconButton
            disabled={loading || page === 1}
            onClick={
              page !== 1
                ? () => {
                    dispatch(setPage(page - 1));
                  }
                : undefined
            }
          >
            <ArrowBackIcon />
          </IconButton>
        </Grid>
        <Grid item>
          <Typography style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
            {page} / {lastPage}
          </Typography>
        </Grid>
        <Grid item>
          <IconButton
            disabled={loading || page >= lastPage}
            onClick={
              page < lastPage
                ? () => {
                    dispatch(setPage(page + 1));
                  }
                : undefined
            }
          >
            <ArrowForwardIcon />
          </IconButton>
        </Grid>
      </Grid>
      <div style={{ position: 'fixed', bottom: 16, right: 16 }}>
        <Fab
          color="primary"
          onClick={() => {
            navigate('/createTopic');
          }}
        >
          <AddIcon />
        </Fab>
      </div>
    </>
  );
};

export default TopicTablePC;
