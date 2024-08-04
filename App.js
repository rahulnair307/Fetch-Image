import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, FlatList, Modal, Image, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

const App = () => {
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchImages = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios({
        method: 'GET',
        url: 'https://list.ly/api/v4/search/image?',
        params: { q: image, per_page: 3 },
        headers: {},
      });
      setImages(response.data.results);
    } catch (error) {
      setError('Failed to fetch images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => { setSelectedImage(item.preview_image); setModalVisible(true); }}>
      <Image source={{ uri: item.preview_image }} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text>Enter an image:</Text>
      <TextInput
        placeholder="e.g. basketball"
        value={image}
        onChangeText={(value) => setImage(value)}
        style={styles.input}
      />
      <Button title="Fetch Images" onPress={fetchImages} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(item) => item.media_id.toString()}
        style={styles.list}
      />
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Image source={{ uri: selectedImage }} style={styles.modalImage} />
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 5,
    margin: 10,
    width: '80%',
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
  list: {
    width: '100%',
  },
  error: {
    color: 'red',
    margin: 10,
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalImage: {
    width: 300,
    height: 300,
  },
});

export default App;
