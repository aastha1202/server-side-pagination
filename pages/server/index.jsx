import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import styles from './styles.module.css';

const UserPage = ({ initialUsers, totalPages }) => {
  const router=useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState(initialUsers);

  useEffect(()=>{
    setUsers(initialUsers);
  })

  const handleNextPage = (e) => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      const query = { page: nextPage };
      setCurrentPage(nextPage);
      router.push({ pathname: '/server', query: { page: nextPage} });
     }

  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      router.push({ pathname: '/server', query: { page: prevPage } });
    }
  };

  return(
    <>
     <div className={styles.dataGrid}>
      <div className={styles.header}>
        <div>ID</div>
        <div>First Name</div>
        <div>Last Name</div>
        <div>Email</div>
      </div>
      {users.map((item) => (
        <div key={item.id} className={styles.row}>
          <div>{item.id}</div>
          <div>{item.firstName}</div>
          <div>{item.lastName}</div>
          <div>{item.email}</div>
        </div>
      ))}
    </div>
   

      <div className={styles.buttonDiv}>
        <button className={styles.buttons} disabled={currentPage === 1} onClick={handlePreviousPage}>
          Previous
        </button>
        <button className={styles.buttons} disabled={currentPage === totalPages} onClick={handleNextPage}>
          Next
        </button>
      </div>
    </>
  );
};

export const getServerSideProps = async ({ query }) => {
  const currentPage = parseInt(query.page) || 1;
  const pageSize = 10;
  const response = await fetch(`https://dummyjson.com/users`);
  const data = await response.json();

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const totalRecords = data.users.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  console.log(startIndex, endIndex);

  const users = data.users.slice(startIndex, endIndex);

  return {
    props: {
      initialUsers: users,
      totalPages,
    },
  };
};


export default UserPage;
