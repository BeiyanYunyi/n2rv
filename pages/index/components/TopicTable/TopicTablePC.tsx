/* eslint-disable no-nested-ternary */
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import format from 'date-fns/format';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useBlockLayout, useTable } from 'react-table';
import TopicTableProps from '../../../../src/types/TopicTableProps';

const TopicTablePC = ({
  topicList,
  loading,
  setLoading,
  page,
  setPage,
  lastPage,
}: TopicTableProps) => {
  const processedData = React.useMemo(
    () =>
      topicList.map((ele) => ({
        ...ele,
        lastReplyTime: ele.lastReplyTime
          ? format(Number(ele.lastReplyTime) * 1000, 'yy-MM-dd HH:mm')
          : '',
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
                        paddingTop: cell.row.original.isElite ? 6 : 8,
                        paddingBottom: cell.row.original.isElite ? 6 : 8,
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
                          <Stack direction="row" alignItems="center">
                            {cell.row.original.isElite && (
                              <Chip label="精品" size="small" color="error" />
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
                    setLoading(true);
                    setPage((oriPage) => oriPage - 1);
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
                    setLoading(true);
                    setPage((oriPage) => oriPage + 1);
                  }
                : undefined
            }
          >
            <ArrowForwardIcon />
          </IconButton>
        </Grid>
      </Grid>
    </>
  );
};

export default TopicTablePC;
