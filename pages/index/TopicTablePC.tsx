import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Grid, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { format } from 'date-fns';
import React from 'react';
import { useBlockLayout, useTable } from 'react-table';
import apiWrapper from '../../renderer/wrapper/apiWrapper';
import { TopicWhileGetAll } from '../../src/types/Topic';

type TopicList = TopicWhileGetAll[];

const TopicTablePC = () => {
  const [topicList, setTopicList] = React.useState<TopicList>([]);
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [lastPage, setLastPage] = React.useState(1);

  React.useEffect(() => {
    apiWrapper.getPages().then((res) => setLastPage(res));
  }, []);

  React.useEffect(() => {
    apiWrapper.getAllTopics(page).then((res) => {
      setTopicList(res);
      setLoading(false);
    });
  }, [page]);

  const processedData = React.useMemo(
    () =>
      topicList.map((ele) => ({
        ...ele,
        lastReplyTime: ele.lastReplyTime ? format(Number(ele.lastReplyTime) * 1000, 'yy-MM-dd HH:mm') : '',
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
                <TableCell {...column.getHeaderProps({ style: { padding: 8 } })} component="div" padding="none">
                  <Typography style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center' }} noWrap>
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
                  <TableCell component="div" {...cell.getCellProps({ style: { padding: 8 } })}>
                    <Typography
                      variant="body2"
                      style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center' }}
                      noWrap
                    >
                      {cell.column.id === 'title' ? (
                        <a href={`topic/${cell.row.original.topicID}`}>{cell.render('Cell')}</a>
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
