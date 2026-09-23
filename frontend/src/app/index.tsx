import { LinearGradient } from 'expo-linear-gradient';
import { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import { AppColors } from '@/constants/appColors';

const BACKEND_URL = 'http://192.168.1.6:8000';

type Message = { role: string; text: string; time: string };

export default function Index() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, loading]);

  const getTime = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', text: input, time: getTime() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/chat`, {
        message: input,
        history: messages,
      });
      const aiMessage: Message = { role: 'ai', text: response.data.reply, time: getTime() };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      let errorText = 'Sorry, something went wrong connecting to the server.';
      if (error.response?.status === 429) {
        errorText = "I'm getting a lot of requests right now — please wait a minute and try again.";
      }
      setMessages((prev) => [...prev, { role: 'ai', text: errorText, time: getTime() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.headerRow}>
  <LinearGradient
    colors={[AppColors.primary, AppColors.primaryDark]}
    style={styles.avatarCircle}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <Text style={styles.avatarEmoji}>💜</Text>
  </LinearGradient>
  <View>
    <Text style={styles.header}>Mental Health Companion</Text>
    <View style={styles.statusRow}>
      <View style={styles.statusDot} />
      <Text style={styles.subHeader}>Always here to listen</Text>
    </View>
  </View>
</View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.chatArea}
        contentContainerStyle={{ paddingBottom: 20, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🌱</Text>
            <Text style={styles.emptyText}>
              This is a safe space. Share how you're feeling — I'm here to listen.
            </Text>
          </View>
        )}

        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageRow,
              msg.role === 'user' ? styles.userRow : styles.aiRow,
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                msg.role === 'user' ? styles.userBubble : styles.aiBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  msg.role === 'user' && { color: AppColors.white },
                ]}
              >
                {msg.text}
              </Text>
            </View>
            <Text
              style={[
                styles.timeText,
                msg.role === 'user' ? { textAlign: 'right' } : { textAlign: 'left' },
              ]}
            >
              {msg.time}
            </Text>
          </View>
        ))}

        {loading && (
          <View style={[styles.messageRow, styles.aiRow]}>
            <View style={[styles.messageBubble, styles.aiBubble, styles.typingBubble]}>
              <Text style={styles.typingText}>● ● ●</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="How are you feeling today?"
          placeholderTextColor={AppColors.textLight}
          multiline
        />
        <TouchableOpacity
  onPress={sendMessage}
  disabled={loading || !input.trim()}
  style={styles.sendButton}
>
  <Text style={styles.sendButtonText}>➤</Text>
</TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
    paddingTop: 60,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AppColors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarEmoji: {
    fontSize: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.textDark,
  },
  subHeader: {
    fontSize: 12,
    color: AppColors.textLight,
    marginTop: 2,
  },
  chatArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: AppColors.textLight,
    fontSize: 14,
    lineHeight: 20,
  },
  messageRow: {
    marginBottom: 14,
    maxWidth: '82%',
  },
  userRow: {
    alignSelf: 'flex-end',
  },
  aiRow: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
  paddingHorizontal: 16,
  paddingVertical: 12,
  borderRadius: 20,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 6,
  elevation: 1,
},
userBubble: {
  backgroundColor: AppColors.userBubble,
  borderBottomRightRadius: 4,
  shadowColor: AppColors.primary,
  shadowOpacity: 0.25,
},
  aiBubble: {
    backgroundColor: AppColors.aiBubble,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  messageText: {
    color: AppColors.textDark,
    fontSize: 15,
    lineHeight: 21,
  },
  timeText: {
    fontSize: 10,
    color: AppColors.textLight,
    marginTop: 4,
    marginHorizontal: 6,
  },
  typingBubble: {
    paddingVertical: 14,
  },
  typingText: {
    color: AppColors.textLight,
    letterSpacing: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: AppColors.background,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
  },
  input: {
  flex: 1,
  backgroundColor: AppColors.white,
  borderRadius: 22,
  paddingHorizontal: 18,
  paddingVertical: 12,
  marginRight: 10,
  maxHeight: 100,
  fontSize: 15,
  borderWidth: 1,
  borderColor: AppColors.border,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.04,
  shadowRadius: 3,
  elevation: 1,
},
sendButton: {
  width: 44,
  height: 44,
  borderRadius: 22,
  backgroundColor: AppColors.primary,
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: AppColors.primary,
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.35,
  shadowRadius: 6,
  elevation: 3,
},
  sendButtonText: {
    color: AppColors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  statusRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 3,
},
statusDot: {
  width: 6,
  height: 6,
  borderRadius: 3,
  backgroundColor: AppColors.success,
  marginRight: 5,
},
});