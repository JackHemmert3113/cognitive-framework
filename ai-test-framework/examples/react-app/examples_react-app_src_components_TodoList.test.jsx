import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoList from './TodoList';

describe('TodoList', () => {
  test('renders with initial todos', () => {
    const initialTodos = [
      { id: 1, text: 'Test todo 1', completed: false },
      { id: 2, text: 'Test todo 2', completed: true }
    ];

    render(<TodoList initialTodos={initialTodos} />);
    
    expect(screen.getByText('Test todo 1')).toBeInTheDocument();
    expect(screen.getByText('Test todo 2')).toBeInTheDocument();
    expect(screen.getByText('Completed: 0 / 2')).toBeInTheDocument();
  });

  test('adds new todo', async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const input = screen.getByPlaceholderText('Add new todo...');
    const addButton = screen.getByText('Add');

    await user.type(input, 'New todo item');
    await user.click(addButton);

    expect(screen.getByText('New todo item')).toBeInTheDocument();
    expect(input.value).toBe('');
  });

  test('toggles todo completion', async () => {
    const user = userEvent.setup();
    const initialTodos = [
      { id: 1, text: 'Toggle me', completed: false }
    ];

    render(<TodoList initialTodos={initialTodos} />);

    const checkbox = screen.getByRole('checkbox');
    expect(screen.getByText('Completed: 0 / 1')).toBeInTheDocument();

    await user.click(checkbox);
    
    expect(checkbox).toBeChecked();
    expect(screen.getByText('Completed: 1 / 1')).toBeInTheDocument();
  });

  test('deletes todo', async () => {
    const user = userEvent.setup();
    const initialTodos = [
      { id: 1, text: 'Delete me', completed: false }
    ];

    render(<TodoList initialTodos={initialTodos} />);

    const deleteButton = screen.getByLabelText('Delete Delete me');
    await user.click(deleteButton);

    expect(screen.queryByText('Delete me')).not.toBeInTheDocument();
  });

  test('prevents empty todos', async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const addButton = screen.getByText('Add');
    const initialCount = screen.getAllByRole('listitem').length;

    await user.click(addButton);

    expect(screen.getAllByRole('listitem')).toHaveLength(initialCount);
  });
});