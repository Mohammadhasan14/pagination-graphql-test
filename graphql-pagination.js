import { gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-apollo';

import {
    IndexTable,
    LegacyCard,
    useIndexResourceState,
    Text,
    Badge,
} from '@shopify/polaris';
import React from 'react';

function SimpleIndexTableExample() {

    const GET_Products = gql`
  query {
        products(first: 3) {
          pageInfo{
           hasNextPage
              hasPreviousPage
          }
          edges{
            cursor
            node{
              id
              title
              createdAt
            }
          }
        }
      }
  
`;

    const { loading: productLoading, data: products, error: productFetchError } = useQuery(GET_Products)
    console.log(products)

    const [productData, updateProductData] = useState([])
    const [pageInfo, updatePageInfo] = useState({hasNextPage: false, hasPreviousPage: false})

    useEffect(() => {
        if (products) {
            updateProductData(products.product.edges)
            updatePageInfo(products.product.pageInfo)
        }
    }, [products])

    const orders = [
        {
            id: '1020',
            order: '#1020',
            date: 'Jul 20 at 4:34pm',
            customer: 'Jaydon Stanton',
            total: '$969.44',
            paymentStatus: <Badge progress="complete">Paid</Badge>,
            fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
        },
        {
            id: '1019',
            order: '#1019',
            date: 'Jul 20 at 3:46pm',
            customer: 'Ruben Westerfelt',
            total: '$701.19',
            paymentStatus: <Badge progress="partiallyComplete">Partially paid</Badge>,
            fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
        },
        {
            id: '1018',
            order: '#1018',
            date: 'Jul 20 at 3.44pm',
            customer: 'Leo Carder',
            total: '$798.24',
            paymentStatus: <Badge progress="complete">Paid</Badge>,
            fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
        },
    ];
    const resourceName = {
        singular: 'order',
        plural: 'orders',
    };

    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(productData);

    const rowMarkup = productData.map(
        (
            item,
            index,
        ) => (
            <IndexTable.Row
                id={item.node.id}
                key={item.node.id}
                selected={selectedResources.includes(item.node.id)}
                position={index}
            >
                <IndexTable.Cell>
                    <Text variant="bodyMd" fontWeight="bold" as="span">
                        {item.node.title}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>{item.node.createdAt}</IndexTable.Cell>
            </IndexTable.Row>
        ),
    );

    return (
        <LegacyCard>
            <IndexTable
                resourceName={resourceName}
                itemCount={orders.length}
                selectedItemsCount={
                    allResourcesSelected ? 'All' : selectedResources.length
                }
                onSelectionChange={handleSelectionChange}
                headings={[
                    { title: 'name' },
                    { title: 'createdAt' },
                ]}
            >
                {rowMarkup}
            </IndexTable>
            <Pagination
                hasPrevious = {pageInfo.hasPreviousPage}
                onPrevious={() => {
                    console.log('Previous');
                }}
                hasNext = {pageInfo.hasNextPage}
                onNext={() => {
                    console.log('Next');
                }}
            />
        </LegacyCard>
    );
}