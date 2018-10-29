import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'react-emotion';

import LaunchTile from '../components/launch-tile';

export const LAUNCH_TILE_DATA = gql`
  fragment LaunchTile on Launch {
    id
    isBooked
    rocket {
      id
      name
    }
    mission {
      name
      missionPatch
    }
  }
`;

const GET_LAUNCHES = gql`
  query launchList($after: String) {
    isLoggedIn @client
    launches(after: $after) {
      cursor
      hasMore
      launches {
        isInCart @client
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;

const Launches = () => (
  <Query query={GET_LAUNCHES}>
    {({ data, loading, error, fetchMore }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>ERROR</p>;

      return (
        <Container>
          {data.launches && data.launches.launches
            ? data.launches.launches.map(l => (
                <LaunchTile
                  key={l.id}
                  launch={l}
                  isLoggedIn={data.isLoggedIn}
                />
              ))
            : null}
          {data.launches && data.launches.hasMore ? (
            <LoadMoreButton
              onClick={() =>
                fetchMore({
                  variables: {
                    after: data.launches.cursor,
                  },
                  updateQuery: (prev, { fetchMoreResult, ...rest }) => {
                    if (!fetchMoreResult) return prev;
                    return {
                      ...fetchMoreResult,
                      launches: {
                        ...fetchMoreResult.launches,
                        launches: [
                          ...prev.launches.launches,
                          ...fetchMoreResult.launches.launches,
                        ],
                      },
                    };
                  },
                })
              }
            >
              Load More
            </LoadMoreButton>
          ) : null}
        </Container>
      );
    }}
  </Query>
);

/**
 * STYLED COMPONENTS USED IN THIS FILE ARE BELOW HERE
 */

const Container = styled('div')({
  marginBottom: '16px',
  width: '100%',
});

const LoadMoreButton = styled('button')({
  backgroundColor: '#00194b',
  border: 'none',
  color: 'white',
  padding: '15px 32px',
  textAlign: 'center',
  textDecoration: 'none',
  display: 'inline-block',
  fontSize: '16px',
});

export default Launches;