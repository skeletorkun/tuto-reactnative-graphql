import React from 'react';
import {FlatList, View} from 'react-native';
import {Query} from 'react-apollo'
import gql from 'graphql-tag';

const FETCH_TODOS = gql`
  query {
    todos {
      id
      text
      is_completed
    }
  }
`;

export default class TodoList extends React.Component {
    render() {
        return (
            <Query
                query={FETCH_TODOS}
            >
                {
                    ({data, error, loading}) => {
                        if (error || loading) {
                            return <View> <Text> Loading ... </Text> </View>
                        }
                        return (
                            <ScrollView style={styles.container} contentContainerStyle={styles.container}>
                                <FlatList
                                    data={data.todos}
                                    renderItem={({item}) => <TodoItem todo={item}
                                                                      keyExtractor={(item) => item.id.toString()}
                                    />
                                    }
                                />
                            </ScrollView>
                        )
                    }
                }
            </Query>)
    }
}

