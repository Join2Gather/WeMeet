/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable dot-notation */
import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getPost, getUsers} from '../store/sample';
import {useEffect} from 'react';
import {RootState} from '../store';
const Home: React.FC = () => {
  const {post, users, loadingPost, loadingUsers} = useSelector(
    ({sample, loading}: RootState) => ({
      post: sample.post,
      users: sample.users,
      loadingPost: loading['sample/GET_POST'],
      loadingUsers: loading['sample/GET_USERS'],
    }),
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getPost(1));
    dispatch(getUsers());
  }, [dispatch]);
  return (
    <SafeAreaView style={styles.flex}>
      <ImageBackground
        style={{flex: 1, opacity: 1}}
        resizeMode="cover"
        blurRadius={5}
        source={require('../assets/images/news.jpg')}>
        <View style={styles.ItemSeparator}>
          {loadingPost && <Text style={styles.title}>Loading</Text>}
          {!loadingPost && post && (
            <>
              <Text style={styles.title}>Article</Text>
              <View>
                <Text style={styles.text}>{post.title}</Text>
                <Text style={styles.text}>{post.body}</Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.ItemSeparator}>
          {loadingUsers && <Text style={styles.title}>로딩중...</Text>}
          {!loadingUsers && users && (
            <>
              <Text style={styles.title}>User List</Text>
              <Text style={styles.text}>
                {users.map(user => (
                  <Text key={user.id}>
                    {user.id} : [{user.email}]{'\n'}
                  </Text>
                ))}
              </Text>
            </>
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: {flex: 1},
  text: {fontSize: 17, color: 'black'},
  ItemSeparator: {borderBottomWidth: 4, borderColor: 'black'},
  title: {fontWeight: '800', fontSize: 25, color: 'black'},
});

export default Home;
