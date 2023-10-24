import { Box, Button, Text } from '@chakra-ui/react';
import React from 'react';
import { useRouter } from 'next/router';

const Pagination = ({ pagination, endpoint, queryParams }) => {
  const router = useRouter();
  const {
    pagination: { page, pageCount }
  } = pagination;

  // remove page from query params
  delete queryParams.page;

  return (
    <>
      <Button
        size='sm'
        isDisabled={page === 1}
        onClick={() =>
          router.replace({
            pathname: `/${endpoint}`,
            query: { page: page - 1, ...queryParams }
          })
        }
      >
        {'<'}
      </Button>
      <Box
        fontSize='sm'
        fontWeight='600'
        display='flex'
        alignItems='center'
        mx='2'
      >
        <Text>
          {pageCount > 0 ? page : '0'} of {pageCount}
        </Text>
      </Box>
      <Button
        size='sm'
        isDisabled={page === pageCount}
        onClick={() =>
          router.replace({
            pathname: `/${endpoint}`,
            query: { page: page + 1, ...queryParams }
          })
        }
      >
        {'>'}
      </Button>
    </>
  );
};

export default Pagination;
