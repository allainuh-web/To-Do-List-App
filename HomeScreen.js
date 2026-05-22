import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';

import { db } from './firebaseConfig';
import TaskItem from './TaskItem';

export default function HomeScreen() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tasksQuery = query(
      collection(db, 'tasks'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      const taskList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTasks(taskList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddTask = async () => {
    const trimmed = newTaskTitle.trim();
    if (!trimmed) return;

    try {
      await addDoc(collection(db, 'tasks'), {
        title: trimmed,
        completed: false,
        createdAt: serverTimestamp(), 
      });

      setNewTaskTitle('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleToggleComplete = async (taskId, currentStatus) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        completed: !currentStatus, 
      });
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const handleEditTask = async (taskId, newTitle) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        title: newTitle,
      });
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskRef);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.appTitle}>📝 My Tasks</Text>
        {totalTasks > 0 && (
          <Text style={styles.statsText}>
            {completedTasks} / {totalTasks} done
          </Text>
        )}
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task..."
          placeholderTextColor="#666"
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
          onSubmitEditing={handleAddTask} 
          returnKeyType="done"
          maxLength={120}
        />
        <TouchableOpacity
          style={[
            styles.addButton,
            !newTaskTitle.trim() && styles.addButtonDisabled,
          ]}
          onPress={handleAddTask}
          disabled={!newTaskTitle.trim()}
          accessibilityLabel="Add task"
        >
          <Text style={styles.addButtonText}>＋</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          style={styles.loader}
          size="large"
          color="#e94560"
        />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onToggle={handleToggleComplete}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>✅</Text>
              <Text style={styles.emptyText}>No tasks yet!</Text>
              <Text style={styles.emptySubText}>
                Add something above to get started.
              </Text>
            </View>
          }
          contentContainerStyle={
            tasks.length === 0
              ? styles.flatListEmpty
              : styles.flatListContent
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  statsText: {
    fontSize: 13,
    color: '#e94560',
    fontWeight: '600',
    backgroundColor: '#2a1a1a',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e94560',
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#16213e',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#e0e0e0',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  addButton: {
    backgroundColor: '#e94560',
    borderRadius: 12,
    width: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  addButtonDisabled: {
    backgroundColor: '#4a2a35',
    shadowOpacity: 0,
    elevation: 0,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '300',
    lineHeight: 30,
  },
  loader: {
    marginTop: 60,
  },
  flatListContent: {
    paddingBottom: 40,
  },
  flatListEmpty: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#aaa',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
});