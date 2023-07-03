import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useEffect, useState } from 'react';

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql', // Replace with your server's GraphQL endpoint
  cache: new InMemoryCache(),
});

function App() {
  const [personData, setPersonData] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({});
  const [cursor, setCursor] = useState(null);

  useEffect(() => {
    fetchData(cursor, null);
  }, [cursor]);

  const fetchData = async (after, before) => {
  try {
    const { data } = await client.query({
      query: gql`
        query GetPeople($first: Int, $after: String, $last: Int, $before: String) {
          people(first: $first, after: $after, last: $last, before: $before) {
            edges {
              cursor
              node {
                name
                age
              }
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
          }
        }
      `,
      variables: {
        first: 5, // Number of items per page
        after: after,
        before: before,
      },
    });

    const { edges, pageInfo } = data.people;

    setPersonData(edges.map((edge) => edge.node));
    setPaginationInfo(pageInfo);
  } catch (error) {
    console.log('Error:', error);
  }
};
  


  const handlePrevPage = () => {
    fetchData({ before: paginationInfo.startCursor, after: null });
    setCursor(paginationInfo.startCursor);
  };

  const handleNextPage = () => {
    fetchData({ after: paginationInfo.endCursor, before: null });
    setCursor(paginationInfo.endCursor);
  };


  return (
    <>
      <div className='container'>
        <table className='table'>
          <thead>
            <tr>
              <th scope='col'>#</th>
              <th scope='col'>Name</th>
              <th scope='col'>Age</th>
            </tr>
          </thead>
          <tbody>
            {personData.map((person, index) => (
              <tr key={index}>
                <th scope='row'>{index + 1}</th>
                <td>{person.name}</td>
                <td>{person.age}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handlePrevPage} disabled={paginationInfo.hasPreviousPage}>
          Prev
        </button>
        <button onClick={handleNextPage} disabled={paginationInfo.hasNextPage}>
          Next
        </button>
      </div>
    </>
  );
}

export default App;
