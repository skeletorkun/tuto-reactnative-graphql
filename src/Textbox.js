import React from 'react';
import {Text, TextInput, TouchableOpacity, View,} from 'react-native';
import gql from 'graphql-tag';
import {Mutation} from 'react-apollo';
import {FETCH_TODOS} from './TodoList';

const INSERT_TODO = gql`
  mutation ($text: String!, $userId: String!){
    insert_todos (
      objects: [{
        text: $text,
        user_id: $userId,
      }]
    ){
      returning {
        id
        text
        is_completed
      }
    }
  }
`;

export default class Textbox extends React.Component {

    state = {
        text: '',
    };

    render() {
        const {text} = this.state;
        const {userId} = this.props;
        return (
            <Mutation
                mutation={INSERT_TODO}
                variables={{
                    text,
                    userId,
                }}
                update={(cache, {data: {insert_todos}}) => {
                    const data = cache.readQuery({
                        query: FETCH_TODOS,
                    });
                    const newTodo = insert_todos.returning[0];
                    const newData = {
                        todos: [newTodo, ...data.todos]
                    }
                    cache.writeQuery({
                        query: FETCH_TODOS,
                        data: newData
                    });
                }}
            >
                {
                    (insertTodo, {loading, error}) => {
                        const submit = () => {
                            if (error) {
                                return <Text> Error </Text>;
                            }
                            if (loading || text === '') {
                                return;
                            }
                            this.setState({
                                text: ''
                            });
                            insertTodo();
                        }
                        return (
                            <View style={styles.inputContainer}>
                                <View style={styles.textboxContainer}>
                                    <TextInput
                                        style={styles.textbox}
                                        editable={true}
                                        onChangeText={this._handleTextChange}
                                        value={text}
                                    />
                                </View>
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.button} onPress={submit} disabled={text === ''}>
                                        <Text style={styles.buttonText}> Add </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    }
                }
            </Mutation>
        );
    }

    _handleTextChange = (text) => {
        this.setState({
            text
        })
    }
}