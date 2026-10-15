import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform, 
  SafeAreaView 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { database } from './firebaseConfig';
import { ref, push, onValue } from 'firebase/database';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const messagesRef = ref(database, 'messages');
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedMessages = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setMessages(formattedMessages.reverse());
      }
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = () => {
    if (text.trim().length === 0) return;
    const messagesRef = ref(database, 'messages');
    push(messagesRef, {
      text: text,
      timestamp: Date.now(),
      sender: 'أدهم'
    });
    setText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>👑 عالمنا الخاص 👑</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        inverted
        renderItem={({ item }) => (
          <View style={styles.messageBubble}>
            <Text style={styles.messageSender}>{item.sender}</Text>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        keyboardVerticalOffset={10}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="اكتب رسالتك الملكية هنا..."
            placeholderTextColor="#888"
            value={text}
            onChangeText={setText}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>إرسال</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 15,
    backgroundColor: '#1f1f1f',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: '#ffd700',
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  messageBubble: {
    backgroundColor: '#2a2a2a',
    padding: 12,
    borderRadius: 12,
    marginVertical: 5,
    alignSelf: 'flex-start',
    maxWidth: '80%',
    borderLeftWidth: 3,
    borderLeftColor: '#ffd700',
  },
  messageSender: {
    color: '#ffd700',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 3,
  },
  messageText: {
    color: '#ffffff',
    fontSize: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#1f1f1f',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    color: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 15,
    textAlign: 'right',
  },
  sendButton: {
    backgroundColor: '#ffd700',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 8,
  },
  sendButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});
