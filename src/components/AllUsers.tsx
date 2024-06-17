import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { getAllUsers, sendFriendRequest, updateFriendRequest, UserListResponse } from '../api/users';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const AllUsers: React.FC = () => {
  const [users, setUsers] = useState<UserListResponse[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, pageSize: 10, totalPages: 0 });
  const navigate = useNavigate();

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

  const handleSendRequest = async (receiverId: number) => {
    try {
      await sendFriendRequest(receiverId);
      const { data, pagination: fetchedPagination } = await getAllUsers(pagination.page, pagination.pageSize);
      setUsers(data);
      setPagination(fetchedPagination);
    } catch (error) {
      toast.error('Error sending friend request');
      console.error('Error sending friend request:', error);
    }
  };

  const handleApproveRequest = async (requesterId: number) => {
    try {
      await updateFriendRequest(requesterId, 'accepted');
      setUsers(prevUsers => prevUsers.map(user =>
        user.id === requesterId ? { ...user, request_status: 'accepted' } : user
      ));
      toast.success('Request status updated');
    } catch (error) {
      toast.error('Error approving friend request');
      console.error('Error approving friend request:', error);
    }
  };

  const handleRejectRequest = async (requesterId: number) => {
    try {
      await updateFriendRequest(requesterId,'rejected');
      setUsers(prevUsers => prevUsers.map(user =>
        user.id === requesterId ? { ...user, request_status: 'rejected' } : user
      ));
      toast.success('Request status updated');
    } catch (error) {
      toast.error('Error rejecting friend request');
      console.error('Error rejecting friend request:', error);
    }
  };

  const handleMessageClick = (userId: number) => {
    navigate(`/dashboard/message/${userId}`);
  };

  return (
    <div>
            <ToastContainer />
      <h1>All Users</h1>
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
                  {user.request_status === 'none' && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleSendRequest(user.id)}
                      sx={{ width: '80%' }}
                    >
                      Request
                    </Button>)}
                  {user.request_status === 'pending' && (
                    <Button variant="contained" color="warning" sx={{ width: '80%' }}>Pending</Button>
                  )}
                  {user.request_status === 'sent' && (
                    <Button variant="contained" color="warning" sx={{ width: '80%' }}>Request Sent</Button>
                  )}
                {user.request_status === 'received' && (
                    <>
                      <Button 
                        variant="contained" 
                        color="success" 
                        onClick={() => handleApproveRequest(user.id)}
                        sx={{ marginRight: '8px', width: '39%' }}
                      >
                        Accept
                      </Button>
                      <Button 
                        variant="contained" 
                        color="error" 
                        onClick={() => handleRejectRequest(user.id)}
                        sx={{ marginRight: '5px' , width: '39%'}}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {user.request_status === 'rejected' && (
                    <Button variant="contained" color="error" sx={{ width: '80%' }}  >Rejected</Button>
                  )}
                  {user.request_status === 'accepted' && (
                    <Button variant="contained" color="success" sx={{ width: '80%' }} onClick={() => handleMessageClick(user.id)}>Message</Button>
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
