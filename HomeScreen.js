// src/screens/HomeScreen.js
// Main screen of the To-Do app.
// Handles all Firestore CRUD operations and renders the task list.

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

// Firestore functions for CRUD operations
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

// Our Firebase Firestore instance
import { db } from '../firebase/firebaseConfig';

// Reusable task row component
import TaskItem from '../components/TaskItem';

export default function HomeScreen() {
  // Holds the list of tasks fetched from Firestore
  const [tasks, setTasks] = useState([]);

  // Holds the current text in the "Add Task" input field
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Shows a loading spinner while the initial data loads
  const [loading, setLoading] = useState(true);

  // ─── Real-time Listener (onSnapshot) ───────────────────────────────────────
  useEffect(() => {
    // Create a query that orders tasks by creation time (newest last)
    const tasksQuery = query(
      collection(db, 'tasks'),
      orderBy('createdAt', 'asc')
    );

    // onSnapshot subscribes to real-time updates.
    // It fires immediately with the current data, then again on every change.
    const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      const taskList = snapshot.docs.map((doc) => ({
        id: doc.id,       // Firestore document ID
        ...doc.data(),    // Spread all document fields (title, completed, createdAt)
      }));

      setTasks(taskList);
      setLoading(false);
    });

    // Cleanup: unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // ─── Add Task ───────────────────────────────────────────────────────────────
  const handleAddTask = async () => {
    const trimmed = newTaskTitle.trim();

    // Prevent adding a task with an empty title
    if (!trimmed) return;

    try {
      // addDoc creates a new document in the "tasks" collection with an auto-generated ID
      await addDoc(collection(db, 'tasks'), {
        title: trimmed,
        completed: false,
        createdAt: serverTimestamp(), // Firestore server timestamp for accurate ordering
      });

      // Clear the input field after successful addition
      setNewTaskTitle('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // ─── Toggle Completed ───────────────────────────────────────────────────────
  const handleToggleComplete = async (taskId, currentStatus) => {
    try {
      // doc() creates a reference to a specific document by its ID
      const taskRef = doc(db, 'tasks', taskId);

      // updateDoc updates only the specified fields without overwriting the whole document
      await updateDoc(taskRef, {
        completed: !currentStatus, // Flip the boolean value
      });
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  // ─── Edit Task Title ────────────────────────────────────────────────────────
  const handleEditTask = async (taskId, newTitle) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);

      // Update only the title field
      await updateDoc(taskRef, {
        title: newTitle,
      });
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  // ─── Delete Task ────────────────────────────────────────────────────────────
  const handleDeleteTask = async (taskId) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);

      // deleteDoc removes the document permanently from Firestore
      await deleteDoc(taskRef);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // ─── Derived Stats ──────────────────────────────────────────────────────────
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    // KeyboardAvoidingView pushes content up when the keyboard opens
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>📝 My Tasks</Text>
        {totalTasks > 0 && (
          <Text style={styles.statsText}>
            {completedTasks} / {totalTasks} done
          </Text>
        )}
      </View>

      {/* ── Add Task Input Row ── */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task..."
          placeholderTextColor="#666"
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
          onSubmitEditing={handleAddTask} // Allow pressing Enter/Return to add
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

      {/* ── Task List ── */}
      {loading ? (
        // Show spinner while Firestore loads data for the first time
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
            // Render each task using the TaskItem component,
            // passing the task data and all handler functions as props
            <TaskItem
              task={item}
              onToggle={handleToggleComplete}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          )}
          ListEmptyComponent={
            // Shown when the tasks array is empty
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

  // ── Header ──
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

  // ── Input Row ──
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

  // ── Loading Spinner ──
  loader: {
    marginTop: 60,
  },

  // ── FlatList layout ──
  flatListContent: {
    paddingBottom: 40,
  },

  flatListEmpty: {
    flex: 1,
    justifyContent: 'center',
  },

  // ── Empty State ──
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
