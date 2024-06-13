import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { getAllUsers, UserListResponse } from '../api/auth';

interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const AllUsers: React.FC = () => {
  const [users, setUsers] = useState<UserListResponse[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, pageSize: 10, totalPages: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, pagination: fetchedPagination } = await getAllUsers(pagination.page, pagination.pageSize);
        setUsers(data);
        setPagination(fetchedPagination);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Initial fetch

    return () => { };
  }, [pagination.page, pagination.pageSize]);

  const handleNextPage = () => {
    setPagination(prevPagination => ({
      ...prevPagination,
      page: prevPagination.page + 1,
    }));
  };

  const handlePrevPage = () => {
    setPagination(prevPagination => ({
      ...prevPagination,
      page: prevPagination.page - 1,
    }));
  };

  return (
    <div>
      <h1>All Users</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Request</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.request_status === 'none' && (
                    <Button variant="contained" color="primary">Request</Button>
                  )}
                  {user.request_status === 'pending' && (
                    <Button variant="contained" color="warning">Pending</Button>
                  )}
                  {user.request_status === 'rejected' && (
                    <Button variant="contained" color="error">Rejected</Button>
                  )}
                  {user.request_status === 'accepted' && (
                    <Button variant="contained" color="success">Message</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div>
        <Button onClick={handlePrevPage} disabled={pagination.page === 1}>Previous Page</Button>
        <span>{pagination.page}</span>
        <Button onClick={handleNextPage} disabled={pagination.page === pagination.totalPages}>Next Page</Button>
      </div>
    </div>
  );
};

export default AllUsers;
