import React from 'react';
import {Text, View} from 'react-native';
import createApolloClient from './apollo';
import gql from 'graphql-tag';
import {ApolloProvider} from 'react-apollo';
import TodoList from '../TodoList';

export default class Main extends React.Component {
    state = {
        client: null
    };

    async componentDidMount() {
        const client = createApolloClient(this.props.token);
        await client.mutate({
            mutation: gql`
                mutation ($username: String, $userid: String){
                  insert_users (
                    objects: [{ name: $username, id: $userid}]
                  ) {
                    affected_rows
                  }
                }
              `,
            variables: {
                username: this.props.username,
                userid: this.props.userId
            }
        });
        this.setState({
            client
        });
        this.props.logout()
    }

    render() {
        if (!this.state.client) {
            return <View><Text>Loading...</Text></View>;
        }
        return (
            <ApolloProvider client={this.state.client}>
                <Textbox
                    userId={this.props.userId}
                    username={this.props.username}
                    logout={this.props.logout}
                />
                <TodoList
                    userId={this.props.userId}
                    username={this.props.username}
                    logout={this.props.logout}
                />
            </ApolloProvider>
        );
    }
}