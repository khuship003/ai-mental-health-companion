import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';

// Use the SAME IP address as your index.tsx file
const BACKEND_URL = 'http://192.168.1.6:8000';

type MoodEntry = { mood: number; note: string; timestamp: string };

const MOOD_OPTIONS = [
  { value: 1, emoji: '😞', label: 'Rough' },
  { value: 2, emoji: '😐', label: 'Okay' },
  { value: 3, emoji: '🙂', label: 'Good' },
  { value: 4, emoji: '😄', label: 'Great' },
  { value: 5, emoji: '🤩', label: 'Amazing' },
];

export default function MoodScreen() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [history, setHistory] = useState<MoodEntry[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/mood/history`);
      setHistory(res.data.entries);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const submitMood = async () => {
    if (selectedMood === null) return;
    setSubmitting(true);
    try {
      await axios.post(`${BACKEND_URL}/mood`, {
        mood: selectedMood,
        note: note,
      });
      setSelectedMood(null);
      setNote('');
      fetchHistory();
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.header}>How are you feeling?</Text>

      <View style={styles.moodRow}>
        {MOOD_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.moodButton,
              selectedMood === option.value && styles.moodButtonSelected,
            ]}
            onPress={() => setSelectedMood(option.value)}
          >
            <Text style={styles.moodEmoji}>{option.emoji}</Text>
            <Text style={styles.moodLabel}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.noteInput}
        placeholder="Add a note (optional)"
        placeholderTextColor="#999"
        value={note}
        onChangeText={setNote}
        multiline
      />

      <TouchableOpacity
        style={[styles.submitButton, (selectedMood === null || submitting) && { opacity: 0.5 }]}
        onPress={submitMood}
        disabled={selectedMood === null || submitting}
      >
        <Text style={styles.submitButtonText}>Log Mood</Text>
      </TouchableOpacity>

      <Text style={styles.historyHeader}>Recent Check-ins</Text>
      {history.length === 0 && (
        <Text style={styles.emptyText}>No entries yet. Log your first mood above!</Text>
      )}
      {history.map((entry, index) => {
        const option = MOOD_OPTIONS.find((o) => o.value === entry.mood);
        return (
          <View key={index} style={styles.historyItem}>
            <Text style={styles.historyEmoji}>{option?.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.historyLabel}>{option?.label}</Text>
              {entry.note ? <Text style={styles.historyNote}>{entry.note}</Text> : null}
              <Text style={styles.historyDate}>
                {new Date(entry.timestamp).toLocaleString()}
              </Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0FA',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#4A3B6B',
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  moodButton: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 2,
  },
  moodButtonSelected: {
    backgroundColor: '#E8E3F5',
  },
  moodEmoji: {
    fontSize: 28,
  },
  moodLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
  noteInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    minHeight: 60,
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#6B4EFF',
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  historyHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#4A3B6B',
  },
  emptyText: {
    color: '#999',
    fontStyle: 'italic',
  },
  historyItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  historyEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  historyLabel: {
    fontWeight: '600',
    color: '#333',
  },
  historyNote: {
    color: '#555',
    marginTop: 2,
  },
  historyDate: {
    color: '#999',
    fontSize: 11,
    marginTop: 4,
  },
});