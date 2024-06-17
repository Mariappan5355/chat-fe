import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-bootstrap';
import { UserListResponse, getFriends } from '../api/users';
import { useNavigate } from 'react-router-dom';


interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const Friends: React.FC = () => {

  const [users, setUsers] = useState<UserListResponse[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, pageSize: 10, totalPages: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, pagination: fetchedPagination } = await getFriends(pagination.page, pagination.pageSize);
        setUsers(data);
        setPagination(fetchedPagination);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();


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

  const handleMessageClick = (userId: number) => {
    navigate(`/dashboard/message/${userId}`);
  };

  return (
    <div>
      <ToastContainer />
      <h1>Friends</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Button variant="contained" color="success" sx={{ width: '80%' }} onClick={() => handleMessageClick(user.id)}
                  >Message</Button>
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

export default Friends;
