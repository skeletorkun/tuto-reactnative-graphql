import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import View from "react-native-web/src/exports/View";
import Text from "react-native-web/dist/exports/Text";

export default class App extends Component {

    state = {
        isLoggedIn: true,
        userId: null,
        username: null,
        jwt: null,
        loading: false
    };

    login = (userId, username, token) => {
        this.setState({
            isLoggedIn: true,
            userId,
            username,
            jwt: token,
            loading: false
        });
    };

    logout = () => {
        this.setState({
            isLoggedIn: false,
            loading: false
        });
    };

    async componentDidMount() {
        AsyncStorage.getItem('@todo-graphql:auth0').then((session) => {
            if (session) {
                const obj = JSON.parse(session);
                if (obj.exp > Math.floor(new Date().getTime() / 1000)) {
                    this.login(obj.id, obj.name, obj.token)
                } else {
                    this.logout();
                }
            } else {
                this.logout()
            }
        })
    }

    render() {
        const {isLoggedIn, userId, username, loading} = this.state;
        if (loading) {
            return <View><Text> Loading... </Text></View>
        }
        if (isLoggedIn) {
            return (
                <Main
                    userId={userId}
                    username={username}
                    token={jwt}
                    logout={this.logout}
                />)
        } else {
            return (<Auth login={this.login}/>)
        }
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
