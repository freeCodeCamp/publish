export default function UsersList({ allUsersData }) {
  console.log(allUsersData);
  return (
    <>
      <ul>
        {allUsersData.map(user => {
          console.log(user);
          return (
            <li key={user.id} className='mb-5'>
              <strong>{user.username}</strong>
              <br />
              <span>email: {user.email}</span>
            </li>
          );
        })}
      </ul>
    </>
  );
}
