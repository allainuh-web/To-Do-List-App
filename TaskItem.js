// src/components/TaskItem.js
// Renders a single task row with toggle, edit, and delete controls.
// Receives task data and handler functions as props from HomeScreen.

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  // Local state to control whether this task is in edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Local state to hold the edited title text
  const [editedTitle, setEditedTitle] = useState(task.title);

  // Called when the user presses "Save" while editing
  const handleSave = () => {
    const trimmed = editedTitle.trim();

    // Prevent saving an empty title
    if (!trimmed) {
      Alert.alert('Validation', 'Task title cannot be empty.');
      return;
    }

    // Pass the new title up to the parent handler
    onEdit(task.id, trimmed);

    // Exit edit mode
    setIsEditing(false);
  };

  // Called when the user presses "Cancel" while editing
  const handleCancel = () => {
    // Restore the original title and exit edit mode
    setEditedTitle(task.title);
    setIsEditing(false);
  };

  // Called when the user presses the Delete button
  const handleDelete = () => {
    // Show a confirmation dialog before actually deleting
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${task.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(task.id),
        },
      ]
    );
  };

  return (
    <View style={[styles.card, task.completed && styles.cardCompleted]}>
      {/* Left section: Checkbox toggle + task title or edit input */}
      <View style={styles.leftSection}>
        {/* Checkbox / Toggle button */}
        <TouchableOpacity
          style={[styles.checkbox, task.completed && styles.checkboxChecked]}
          onPress={() => onToggle(task.id, task.completed)}
          accessibilityLabel={task.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.completed && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>

        {/* Show TextInput if editing, otherwise show Text */}
        {isEditing ? (
          <TextInput
            style={styles.editInput}
            value={editedTitle}
            onChangeText={setEditedTitle}
            autoFocus
            placeholder="Edit task..."
            placeholderTextColor="#888"
          />
        ) : (
          <Text
            style={[
              styles.taskTitle,
              task.completed && styles.taskTitleCompleted,
            ]}
            numberOfLines={2}
          >
            {task.title}
          </Text>
        )}
      </View>

      {/* Right section: Action buttons (Edit/Save/Cancel + Delete) */}
      <View style={styles.actions}>
        {isEditing ? (
          // Show Save and Cancel buttons when in edit mode
          <>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <Text style={styles.cancelBtnText}>✕</Text>
            </TouchableOpacity>
          </>
        ) : (
          // Show Edit and Delete buttons in view mode
          <>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => setIsEditing(true)}
              accessibilityLabel="Edit task"
            >
              <Text style={styles.editBtnText}>✎</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={handleDelete}
              accessibilityLabel="Delete task"
            >
              <Text style={styles.deleteBtnText}>🗑</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Main card container
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#0f3460',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  // Slightly dimmed card for completed tasks
  cardCompleted: {
    opacity: 0.65,
    borderColor: '#2a4a6e',
  },

  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  // Unchecked checkbox style
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#e94560',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    flexShrink: 0,
  },

  // Filled checkbox for completed tasks
  checkboxChecked: {
    backgroundColor: '#e94560',
    borderColor: '#e94560',
  },

  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  taskTitle: {
    color: '#e0e0e0',
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
    lineHeight: 22,
  },

  // Line-through style for completed tasks
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#888',
  },

  editInput: {
    flex: 1,
    color: '#e0e0e0',
    fontSize: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e94560',
    paddingVertical: 2,
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 10,
  },

  editBtn: {
    backgroundColor: '#0f3460',
    borderRadius: 8,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },

  editBtnText: {
    color: '#a0c4ff',
    fontSize: 16,
  },

  deleteBtn: {
    backgroundColor: '#3a1a1a',
    borderRadius: 8,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteBtnText: {
    fontSize: 16,
  },

  saveBtn: {
    backgroundColor: '#e94560',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },

  cancelBtn: {
    backgroundColor: '#0f3460',
    borderRadius: 8,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelBtnText: {
    color: '#aaa',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
